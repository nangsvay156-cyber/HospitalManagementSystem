import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Modal from './Modal';
import './ResourcePage.css';

/**
 * Config-driven CRUD page.
 *
 * columns: [{ key, label, render?(row) }]
 * formFields: [{ name, label, type, options?, required?, placeholder? }]
 * canWrite: roles allowed to create/edit/delete (defaults to admin only)
 * rowActions(row): optional extra buttons per row, returns JSX
 * transformSubmit(values): optional, shape form values before POST/PUT
 */
export default function ResourcePage({
  title,
  subtitle,
  resource,
  columns,
  formFields = [],
  canWrite = ['admin'],
  canCreate,
  rowActions,
  transformSubmit,
  defaultValues = {},
}) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const writable = canWrite.includes(user.role);
  const creatable = (canCreate || canWrite).includes(user.role);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get(resource);
      setItems(data.items || data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  }, [resource]);

  useEffect(() => { load(); }, [load]);

  function openCreate() {
    setEditingRow(null);
    setForm({ ...defaultValues });
    setFormError('');
    setModalOpen(true);
  }

  function openEdit(row) {
    setEditingRow(row);
    setForm({ ...row });
    setFormError('');
    setModalOpen(true);
  }

  async function handleDelete(row) {
    if (!confirm(`Delete this record? This can't be undone.`)) return;
    try {
      await api.delete(`${resource}/${row.id}`);
      setItems((prev) => prev.filter((i) => i.id !== row.id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed.');
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setFormError('');
    const payload = transformSubmit ? transformSubmit(form) : form;
    try {
      if (editingRow) {
        const { data } = await api.put(`${resource}/${editingRow.id}`, payload);
        setItems((prev) => prev.map((i) => (i.id === editingRow.id ? data : i)));
      } else {
        const { data } = await api.post(resource, payload);
        setItems((prev) => [data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setFormError(err.response?.data?.error || 'Save failed. Check the fields and try again.');
    } finally {
      setSaving(false);
    }
  }

  function updateField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>{title}</h1>
          {subtitle && <p className="subtitle">{subtitle}</p>}
        </div>
        {creatable && (
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add {title.replace(/s$/, '')}
          </button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div className="state-row"><Loader2 className="spin" size={18} /> Loading…</div>
        ) : error ? (
          <div className="state-row error">{error}</div>
        ) : items.length === 0 ? (
          <div className="state-row">No records yet.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  {columns.map((col) => <th key={col.key}>{col.label}</th>)}
                  {(writable || creatable || rowActions) && <th style={{ textAlign: 'right' }}>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {items.map((row) => (
                  <tr key={row.id}>
                    {columns.map((col) => (
                      <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                    ))}
                    {(writable || creatable || rowActions) && (
                      <td>
                        <div className="row-actions">
                          {rowActions && rowActions(row, load)}
                          {writable && (
                            <>
                              <button className="icon-btn" onClick={() => openEdit(row)} aria-label="Edit">
                                <Pencil size={15} />
                              </button>
                              <button className="icon-btn" onClick={() => handleDelete(row)} aria-label="Delete">
                                <Trash2 size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editingRow ? `Edit ${title.replace(/s$/, '')}` : `Add ${title.replace(/s$/, '')}`} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            {formFields.map((f) => (
              <div className="field" key={f.name}>
                <label htmlFor={f.name}>{f.label}{f.required && ' *'}</label>
                {f.type === 'select' ? (
                  <select
                    id={f.name}
                    required={f.required}
                    value={form[f.name] ?? ''}
                    onChange={(e) => updateField(f.name, e.target.value)}
                  >
                    <option value="" disabled>Select…</option>
                    {f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : f.type === 'textarea' ? (
                  <textarea
                    id={f.name}
                    rows={3}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={form[f.name] ?? ''}
                    onChange={(e) => updateField(f.name, e.target.value)}
                  />
                ) : (
                  <input
                    id={f.name}
                    type={f.type || 'text'}
                    step={f.type === 'number' ? '0.01' : undefined}
                    required={f.required}
                    placeholder={f.placeholder}
                    value={form[f.name] ?? ''}
                    onChange={(e) => updateField(f.name, e.target.value)}
                  />
                )}
              </div>
            ))}
            {formError && <p style={{ color: 'var(--danger)', fontSize: 13, marginBottom: 12 }}>{formError}</p>}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 6 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving…' : 'Save'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
