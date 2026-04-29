
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { crudOf } from '../utils/api';

const useCrud = (endpoint) => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const crud = crudOf(endpoint);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await crud.list({ page, limit: perPage, ...(search ? { q: search } : {}), ...(sortBy ? { sortBy, sortOrder } : {}) });
      setData(r.data || []);
      setTotal(r.total || 0);
      setPages(r.pages || 1);
    } catch (e) { toast.error(e.message || 'Load failed'); }
    finally { setLoading(false); }
  }, [endpoint, page, perPage, search, sortBy, sortOrder]);

  useEffect(() => { load(); }, [load]);

  const handleSort = col => {
    if (sortBy === col) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortOrder('asc'); }
  };

  const destroy = async id => {
    if (!window.confirm('Delete this record?')) return;
    setLoading(true);
    try { await crud.remove(id); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e.message || 'Delete failed'); }
    finally { setLoading(false); }
  };

  const toggleStatus = async (id, isActive) => {
    if (isActive) {
      if (!window.confirm('Are you sure you want to deactivate this record?')) return;
    }
    try { await crud.toggle(id); toast.success('Status updated'); load(); }
    catch (e) { toast.error(e.message || 'Toggle failed'); }
  };

  return {
    data, total, page, pages, perPage, loading, modal, editing, viewing, search, sortBy, sortOrder,
    setPage, setPerPage, setSearch, load, handleSort,
    openCreate: () => { setEditing(null); setModal(true); },
    openEdit: r => { setEditing(r); setModal(true); },
    openView: r => setViewing(r),
    closeModal: () => { setModal(false); setEditing(null); },
    closeView: () => setViewing(null),
    save: async (body, isUpdate) => {
      if (isUpdate && !window.confirm(`Are you sure you want to update this record?`)) return false;
      setLoading(true);
      try {
        if (editing) { await crud.update(editing.id, body); toast.success('Record updated!'); }
        else { await crud.create(body); toast.success('Record created!'); }
        return true;
      } catch (e) { toast.error(e.message || 'Save failed'); return false; }
      finally { setLoading(false); }
    },
    destroy,
    toggleStatus,
  };
};

export default useCrud;
