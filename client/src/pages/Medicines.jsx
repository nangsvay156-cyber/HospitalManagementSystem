import ResourcePage from '../components/ResourcePage';

export default function Medicines() {
  return (
    <ResourcePage
      title="Medicines"
      subtitle="Pharmacy inventory, pricing, and expiry tracking."
      resource="/medicines"
      canWrite={['admin', 'pharmacist']}
      columns={[
        { key: 'name', label: 'Name' },
        { key: 'category', label: 'Category' },
        { key: 'price', label: 'Price', render: (row) => `$${Number(row.price).toFixed(2)}` },
        {
          key: 'stock_quantity',
          label: 'Stock',
          render: (row) => (
            <span className={`badge ${row.stock_quantity <= row.low_stock_threshold ? 'badge-danger' : 'badge-neutral'}`}>
              <span className="badge-dot" />{row.stock_quantity}
            </span>
          ),
        },
        { key: 'expiry_date', label: 'Expiry' },
        { key: 'supplier', label: 'Supplier' },
      ]}
      formFields={[
        { name: 'name', label: 'Medicine name', required: true },
        { name: 'category', label: 'Category' },
        { name: 'price', label: 'Price', type: 'number', required: true },
        { name: 'stock_quantity', label: 'Stock quantity', type: 'number', required: true },
        { name: 'low_stock_threshold', label: 'Low-stock threshold', type: 'number' },
        { name: 'expiry_date', label: 'Expiry date', type: 'date' },
        { name: 'supplier', label: 'Supplier' },
      ]}
      transformSubmit={(f) => ({
        ...f,
        price: parseFloat(f.price) || 0,
        stock_quantity: parseInt(f.stock_quantity, 10) || 0,
        low_stock_threshold: parseInt(f.low_stock_threshold, 10) || 10,
      })}
      defaultValues={{ low_stock_threshold: 10 }}
    />
  );
}
