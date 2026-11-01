import { useEffect, useState } from 'react';
import api from '../api/client';

// Fetches a resource list and maps it to { value, label } options for <select> fields.
export default function useOptions(resource, labelFn, deps = []) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api.get(resource, { params: { limit: 200 } })
      .then(({ data }) => {
        if (cancelled) return;
        const items = data.items || data;
        setOptions(items.map((item) => ({ value: item.id, label: labelFn(item) })));
      })
      .catch(() => { if (!cancelled) setOptions([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { options, loading };
}
