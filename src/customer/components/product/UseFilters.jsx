import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function UseFilters() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  // Read current filters from URL
  const [filters, setFilters] = useState(() => {
    const color = params.get('color')?.split(',') || [];
    return { color };
  });

  const toggleFilter = (key, value) => {
    setFilters((prev) => {
      const current = prev[key] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];

      // Update URL
      const newParams = new URLSearchParams(location.search);
      if (updated.length > 0) newParams.set(key, updated.join(','));
      else newParams.delete(key);

      navigate({ search: newParams.toString() }, { replace: true });

      return { ...prev, [key]: updated };
    });
  };

  const isChecked = (key, value) => filters[key]?.includes(value);

  // Sync state with URL when user navigates
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const color = params.get('color')?.split(',') || [];
    setFilters({ color });
  }, [location.search]);

  return { toggleFilter, isChecked };
}
