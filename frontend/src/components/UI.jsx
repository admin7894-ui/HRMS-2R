import React, { useState, useRef, useEffect } from 'react';

// ── Spinner ─────────────────────────────────────────────────────────────────
export const Spin = ({ size = 4 }) => (
  <svg className={`inline w-${size} h-${size} animate-spin text-primary-600`} viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
  </svg>
);

// ── Badge ────────────────────────────────────────────────────────────────────
const BADGE_MAP = {
  Y:'badge-green',N:'badge-red',ACTIVE:'badge-green',INACTIVE:'badge-gray',
  YES:'badge-green',NO:'badge-red',TERMINATED:'badge-red',OPEN:'badge-blue',
  CLOSED:'badge-gray',APPROVED:'badge-green',REJECTED:'badge-red',PENDING:'badge-yellow',
  COMPLETED:'badge-green',IN_PROGRESS:'badge-blue',DRAFT:'badge-gray',SUBMITTED:'badge-purple',
  JOINED:'badge-green',NOT_JOINED:'badge-red',HIGH:'badge-red',MEDIUM:'badge-yellow',
  LOW:'badge-green',URGENT:'badge-orange',PERMANENT:'badge-blue',CONTRACT:'badge-purple',
  PAID:'badge-green',PRESENT:'badge-green',ABSENT:'badge-red',NATIONAL:'badge-blue',
  RELIGIOUS:'badge-purple',ONLINE:'badge-blue',OFFLINE:'badge-gray',SCHEDULED:'badge-blue',
  CANCELLED:'badge-red',RESIGNATION:'badge-yellow',TERMINATION:'badge-red',
};
export const Badge = ({ value }) => {
  const display = value === 'Y' ? 'Active' : value === 'N' ? 'Inactive' : value;
  return <span className={BADGE_MAP[String(value ?? '').toUpperCase()] || 'badge-gray'}>{display != null ? String(display) : '—'}</span>;
};

// ── Status Toggle (Active/Inactive visual switch) ────────────────────────────
export const StatusToggle = ({ active, onToggle }) => (
  <div className="flex items-center gap-1.5">
    <button type="button" onClick={onToggle}
      className={`relative inline-flex h-5 w-11 items-center rounded-full transition-colors flex-shrink-0 ${active ? 'bg-emerald-500' : 'bg-gray-300'}`}>
      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`}/>
    </button>
    <span className={`text-xs font-medium ${active ? 'text-emerald-600' : 'text-gray-400'}`}>{active ? 'Active' : 'Inactive'}</span>
  </div>
);

// ── Tooltip ──────────────────────────────────────────────────────────────────
export const Tooltip = ({ text, children }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      {show && text && (
        <div className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap shadow-lg">
          {text}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"/>
        </div>
      )}
    </div>
  );
};

// ── Field wrapper ────────────────────────────────────────────────────────────
export const Field = ({ label, error, required, help, tooltip, children, className = '' }) => (
  <div className={className}>
    {label && (
      <div className="flex items-center gap-1 mb-1">
        <label className={`label ${required ? 'label-req' : ''}`}>{label}</label>
        {tooltip && <Tooltip text={tooltip}><span className="text-gray-400 cursor-help text-xs">ⓘ</span></Tooltip>}
      </div>
    )}
    {children}
    {error && <p className="err-msg"><span>⚠</span> {error}</p>}
    {help && !error && <p className="hint">{help}</p>}
  </div>
);

// ── Input ────────────────────────────────────────────────────────────────────
export const Input = React.forwardRef(({ error, className = '', ...p }, ref) => (
  <input ref={ref} className={`input ${error ? 'input-err' : ''} ${className}`} {...p}/>
));
Input.displayName = 'Input';

// ── Select ───────────────────────────────────────────────────────────────────
export const Select = React.forwardRef(({ error, children, className = '', ...p }, ref) => (
  <select ref={ref} className={`input ${error ? 'input-err' : ''} ${className}`} {...p}>
    {children}
  </select>
));
Select.displayName = 'Select';

// ── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = React.forwardRef(({ error, rows = 3, maxLength = 200, className = '', value = '', ...p }, ref) => (
  <div>
    <textarea ref={ref} rows={rows} maxLength={maxLength} value={value}
      className={`input resize-none ${error ? 'input-err' : ''} ${className}`} {...p}/>
    <p className="hint text-right">{String(value || '').length}/{maxLength}</p>
  </div>
));
Textarea.displayName = 'Textarea';

// ── LOV Dropdown (active records only, ID-Name format, NO raw GUIDs) ─────────
export const LOV = ({ label, name, value, onChange, error, required, options = [], valueKey = 'id', labelFn, disabled, tooltip }) => {
  const getLabel = o => {
    if (labelFn) return labelFn(o);
    const did = o._displayId;
    for (const k of ['Module_Name','BG_Name','Business_Type_Name','Company_Name','Department_Name',
      'Role_Name','Designation_Name','Grade_Name','Job_Name','Position_Name','Status_Name',
      'absence_name','Program_Name','cycle_name','competence_name','benefit_plan_name',
      'Template_Name','Work_Schedule_Name','key_area_name','holiday_name','Posting_Title',
      'Grade_Code','Job_Code','Work_Schedule_Code']) {
      if (o[k]) return did ? `${did} - ${o[k]}` : o[k];
    }
    if (o.First_Name) return did ? `${did} - ${o.First_Name} ${o.Last_Name || ''}`.trim() : `${o.First_Name} ${o.Last_Name || ''}`.trim();
    const nameKey = Object.keys(o).find(k => k.toLowerCase().includes('name'));
    if (nameKey && o[nameKey]) return did ? `${did} - ${o[nameKey]}` : o[nameKey];
    return did || String(o[valueKey]);
  };
  // Only show active records in LOVs
  const active = options.filter(o => o.active_flag !== 'N' && o.ACTIVE_FLAG !== 'N');
  return (
    <Field label={label} error={error} required={required} tooltip={tooltip}>
      <select className={`input ${error ? 'input-err' : ''}`} name={name} value={value || ''} onChange={onChange} disabled={disabled}>
        <option value="">{label ? `Select ${label}` : 'Select'}</option>
        {active.map(o => <option key={o[valueKey]} value={o[valueKey]}>{getLabel(o)}</option>)}
      </select>
    </Field>
  );
};

// ── Searchable LOV (for Headcount 0-100 etc.) ────────────────────────────────
export const SearchableLOV = ({ label, name, value, onChange, error, required, options = [], placeholder }) => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const filtered = options.filter(o => String(o.label ?? o).toLowerCase().includes(q.toLowerCase()));
  const selected = options.find(o => String(o.value ?? o) === String(value));
  return (
    <Field label={label} error={error} required={required}>
      <div className="relative" ref={ref}>
        <input className={`input ${error ? 'input-err' : ''}`}
          placeholder={placeholder || (label ? `Select ${label}` : 'Select')}
          value={open ? q : (selected ? String(selected.label ?? selected) : '')}
          onClick={() => { setOpen(true); setQ(''); }}
          onChange={e => setQ(e.target.value)}
          readOnly={!open}
        />
        {open && (
          <div className="absolute z-30 w-full bg-white border border-gray-200 rounded-lg shadow-xl mt-1 max-h-52 overflow-y-auto">
            {filtered.length === 0 ? <div className="p-3 text-gray-400 text-sm">No results</div>
              : filtered.map(o => {
                const v = o.value ?? o, l = o.label ?? o;
                return (
                  <div key={v} className={`px-3 py-2 hover:bg-primary-50 cursor-pointer text-sm ${String(value) === String(v) ? 'bg-primary-100 font-medium' : ''}`}
                    onMouseDown={() => { onChange({ target: { name, value: v } }); setOpen(false); }}>
                    {l}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </Field>
  );
};

// ── MultiCheck ───────────────────────────────────────────────────────────────
export const MultiCheck = ({ label, name, value = '', onChange, options }) => {
  const vals = value ? String(value).split(',').map(v => v.trim()).filter(Boolean) : [];
  const toggle = v => {
    const next = vals.includes(v) ? vals.filter(x => x !== v) : [...vals, v];
    onChange({ target: { name, value: next.join(',') } });
  };
  return (
    <div>
      {label && <label className="label">{label}</label>}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 p-3 bg-gray-50 rounded-lg border border-gray-200">
        {options.map(o => (
          <label key={o.v ?? o} className="flex items-center gap-1.5 cursor-pointer text-sm text-gray-700">
            <input type="checkbox" checked={vals.includes(String(o.v ?? o))} onChange={() => toggle(String(o.v ?? o))} className="w-4 h-4 text-primary-600 rounded border-gray-300"/>
            {o.l ?? o}
          </label>
        ))}
      </div>
    </div>
  );
};

// ── Modal ────────────────────────────────────────────────────────────────────
export const Modal = ({ open, onClose, title, children, footer, size = 'xl' }) => {
  if (!open) return null;
  const sz = { sm:'max-w-md', md:'max-w-xl', lg:'max-w-3xl', xl:'max-w-4xl', '2xl':'max-w-6xl' };
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal w-full ${sz[size] || sz.xl}`}>
        <div className="modal-hdr">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="btn-ghost btn p-1.5 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="modal-bdy">{children}</div>
        {footer && <div className="modal-ftr">{footer}</div>}
      </div>
    </div>
  );
};

// ── View Modal — all fields, LOV values resolved ─────────────────────────────
export const ViewModal = ({ open, onClose, title, record, cols, sections, fields, lovData }) => {
  if (!open || !record) return null;

  // Resolve a LOV field value (UUID) to its display name
  const resolveLov = (f, val) => {
    if (!val || !f.lovEndpoint || !lovData) return val;
    const opts = lovData[f.lovEndpoint] || [];
    const found = opts.find(o => String(o[f.valueKey || 'id']) === String(val));
    if (!found) return val;
    if (f.labelFn) return f.labelFn(found);
    const did = found._displayId;
    for (const k of ['Module_Name','BG_Name','Business_Type_Name','Company_Name','Department_Name',
      'Role_Name','Designation_Name','Grade_Name','Job_Name','Position_Name','Status_Name',
      'absence_name','Program_Name','cycle_name','competence_name','benefit_plan_name',
      'Template_Name','Work_Schedule_Name','key_area_name','holiday_name','Posting_Title',
      'Grade_Code','Job_Code','Work_Schedule_Code']) {
      if (found[k]) return did ? `${did} - ${found[k]}` : found[k];
    }
    if (found.First_Name) return `${found.First_Name} ${found.Last_Name || ''}`.trim();
    const nk = Object.keys(found).find(k => k.toLowerCase().includes('name'));
    if (nk && found[nk]) return found[nk];
    return did || String(val);
  };

  const fmt = (val, type, f) => {
    if (val == null || val === '') return <span className="text-gray-400 italic text-xs">—</span>;
    if (f?.type === 'lov' || f?.type === 'searchable-lov') return resolveLov(f, val) || val;
    if (f?.type === 'select') {
      const opt = (f.options || []).find(o => String(o.v ?? o) === String(val));
      return opt ? String(opt.l ?? opt) : String(val);
    }
    if (f?.type === 'multicheck') {
      const vals = String(val).split(',').map(v => v.trim()).filter(Boolean);
      const labels = vals.map(v => {
        const opt = (f.options || []).find(o => String(o.v ?? o) === v);
        return opt ? String(opt.l ?? opt) : v;
      });
      return labels.join(', ') || val;
    }
    if (type === 'date' || f?.type === 'date') {
      try {
        const d = new Date(val);
        return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
      } catch { return String(val); }
    }
    if (type === 'currency') return '₹' + Number(val).toLocaleString('en-IN');
    if (type === 'badge') return <Badge value={val}/>;
    if (val === 'Y') return 'Yes'; if (val === 'N') return 'No';
    return String(val);
  };

  const renderSection = (sectionName, fieldList) => (
    <div key={sectionName} className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700">{sectionName}</h4>
        <div className="flex-1 h-px bg-primary-100"/>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {fieldList.map(c => (
          <div key={c.key} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{c.label}</p>
            <div className="text-sm font-medium text-gray-800 break-words">{fmt(record[c.key], c.type, c)}</div>
          </div>
        ))}
      </div>
    </div>
  );

  // Build sections from fields config if available, else fall back to cols
  const buildSectionsFromFields = () => {
    if (!fields || fields.length === 0) return null;
    const grouped = {};
    const noSection = [];
    fields.filter(f => !f.hidden).forEach(f => {
      if (f.section) { if (!grouped[f.section]) grouped[f.section] = []; grouped[f.section].push(f); }
      else noSection.push(f);
    });
    return { grouped, noSection };
  };

  const fieldSections = buildSectionsFromFields();

  // Resolve org context fields from lovData
  const resolveOrg = (list, idVal, nameKey) => {
    if (!list || !idVal) return null;
    const found = list.find(o => String(o.id) === String(idVal));
    if (!found) return idVal;
    return found._displayId ? `${found._displayId} - ${found[nameKey]}` : found[nameKey];
  };
  const companyVal  = resolveOrg(lovData?.['companies'],      record.company_id,        'Company_Name');
  const btVal       = resolveOrg(lovData?.['business-types'], record.Business_Type_ID || record.business_type_id, 'Business_Type_Name');
  const bgVal       = resolveOrg(lovData?.['business-groups'],record.business_group_id,  'BG_Name');
  const modVal      = resolveOrg(lovData?.['modules'],        record.module_id || record.Module_ID, 'Module_Name');
  const orgFields   = [
    { key: '_company',  label: 'Company',        val: companyVal },
    { key: '_bt',       label: 'Business type',  val: btVal },
    { key: '_bg',       label: 'Business group', val: bgVal },
    { key: '_mod',      label: 'Module',         val: modVal },
  ].filter(f => f.val);

  const renderOrgSection = () => (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-primary-700">Organisation context</h4>
        <div className="flex-1 h-px bg-primary-100"/>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {orgFields.map(f => (
          <div key={f.key} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{f.label}</p>
            <div className="text-sm font-medium text-gray-800 break-words">{f.val || <span className="text-gray-400 italic text-xs">—</span>}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={`View: ${title}`} size="2xl">
      {record._displayId && (
        <div className="mb-4 p-3 bg-primary-50 rounded-lg border border-primary-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">{record._displayId?.slice(0,2)}</div>
          <div>
            <p className="text-xs text-primary-500 font-semibold uppercase">System ID</p>
            <p className="text-lg font-extrabold text-primary-800 font-mono">{record._displayId}</p>
          </div>
        </div>
      )}
      {orgFields.length > 0 && renderOrgSection()}
      {fieldSections
        ? (
          <>
            {fieldSections.noSection.length > 0 && renderSection('Details', fieldSections.noSection)}
            {Object.entries(fieldSections.grouped).map(([sec, flds]) => renderSection(sec, flds))}
          </>
        )
        : sections
          ? Object.entries(sections).map(([sec, flds]) => renderSection(sec, flds))
          : renderSection('Details', cols)
      }
      {renderSection('System fields', [
        { key: 'effective_from', label: 'Effective from', type: 'date' },
        { key: 'effective_to', label: 'Effective to', type: 'date' },
        { key: 'created_by', label: 'Created by' },
        { key: 'updated_by', label: 'Updated by' },
        { key: 'active_flag', label: 'Status', type: 'badge' },
      ])}
    </Modal>
  );
};

// ── DataTable — shows ALL records (active + inactive) ────────────────────────
export const DataTable = ({ cols, data, loading, onEdit, onDelete, onView, onToggleStatus, sortBy, sortOrder, onSort }) => {
  const fmtDate = v => {
    if (!v) return '—';
    try {
      const d = new Date(v);
      return `${String(d.getDate()).padStart(2,'0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
    } catch { return String(v); }
  };
  return (
    <div className="overflow-x-auto">
      <table className="tbl">
        <thead className="thead">
          <tr>
            <th className="th w-8">#</th>
            <th className="th">ID</th>
            {cols.map(c => (
              <th key={c.key + c.label} className="th" onClick={() => onSort?.(c.key)}>
                <span className="flex items-center gap-1">
                  {c.label}
                  {sortBy === c.key ? <span className="text-primary-500 text-xs">{sortOrder === 'asc' ? '↑' : '↓'}</span> : <span className="text-gray-300 text-xs">↕</span>}
                </span>
              </th>
            ))}
            <th className="th w-24">Status</th>
            <th className="th text-center w-28">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? <tr><td colSpan={cols.length + 4} className="td text-center py-12 text-gray-400"><Spin/> Loading…</td></tr>
            : data.length === 0
            ? <tr><td colSpan={cols.length + 4} className="td text-center py-14 text-gray-400"><div className="text-4xl mb-2">📭</div>No records found</td></tr>
            : data.map((row, i) => (
              <tr key={row.id || i} className={`tr ${row.active_flag === 'N' ? 'opacity-60 bg-gray-50/50' : ''}`}>
                <td className="td text-gray-400 text-xs font-mono">{i + 1}</td>
                <td className="td font-mono text-xs text-primary-700 font-bold whitespace-nowrap">{row._displayId || '—'}</td>
                {cols.map(c => (
                  <td key={c.key + i} className="td">
                    {c.render ? c.render(row[c.key], row)
                     : c.type === 'badge' ? <Badge value={row[c.key]}/>
                     : c.type === 'currency' ? (row[c.key] != null && !isNaN(parseFloat(row[c.key])) ? '₹' + Number(parseFloat(row[c.key])).toLocaleString('en-IN') : '—')
                     : c.type === 'date' ? fmtDate(row[c.key])
                     : c.type === 'yesno' ? (row[c.key] === 'Y' ? 'Yes' : row[c.key] === 'N' ? 'No' : row[c.key] || '—')
                     : row[c.key] != null ? String(row[c.key]) : '—'}
                  </td>
                ))}
                <td className="td">
                  <StatusToggle active={row.active_flag !== 'N'} onToggle={() => onToggleStatus?.(row.id, row.active_flag !== 'N')}/>
                </td>
                <td className="td">
                  <div className="flex gap-1 justify-center">
                    {onView && <button className="btn btn-ghost btn-xs text-blue-500 hover:bg-blue-50 px-1.5" onClick={() => onView(row)} title="View">👁</button>}
                    {onEdit && <button className="btn btn-ghost btn-xs text-amber-500 hover:bg-amber-50 px-1.5" onClick={() => onEdit(row)} title="Edit">✏️</button>}
                    {onDelete && <button className="btn btn-ghost btn-xs text-red-500 hover:bg-red-50 px-1.5" onClick={() => onDelete(row.id)} title="Delete">🗑</button>}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Pagination ────────────────────────────────────────────────────────────────
export const Pagination = ({ page, pages, total, perPage, setPage, setPerPage }) => {
  const opts = [{ label: '10 per page', value: 10 }, { label: '20 per page', value: 20 }, { label: '30 per page', value: 30 }, { label: '50 per page', value: 50 }];
  const from = (page - 1) * perPage + 1, to = Math.min(page * perPage, total);
  const nums = [];
  if (pages <= 7) { for (let i = 1; i <= pages; i++) nums.push(i); }
  else {
    nums.push(1);
    if (page > 3) nums.push('...');
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) nums.push(i);
    if (page < pages - 2) nums.push('...');
    nums.push(pages);
  }
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 flex-wrap gap-3 text-xs text-gray-500">
      <div className="flex items-center gap-2">
        <span>Showing {from}–{to} of {total} records</span>
        <select className="input w-32 py-1 text-xs" value={perPage} onChange={e => { setPerPage(+e.target.value); setPage(1); }}>
          {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <div className="flex gap-1 flex-wrap">
        <button onClick={() => setPage(1)} disabled={page <= 1} className="btn btn-outline btn-xs">«</button>
        <button onClick={() => setPage(p => p - 1)} disabled={page <= 1} className="btn btn-outline btn-xs">‹ Prev</button>
        {nums.map((p, i) =>
          p === '...' ? <span key={'el'+i} className="px-2 py-1 text-gray-400">…</span>
          : <button key={p} onClick={() => setPage(p)} className={`btn btn-xs ${p === page ? 'btn-primary' : 'btn-outline'}`}>{p}</button>
        )}
        <button onClick={() => setPage(p => p + 1)} disabled={page >= pages} className="btn btn-outline btn-xs">Next ›</button>
        <button onClick={() => setPage(pages)} disabled={page >= pages} className="btn btn-outline btn-xs">»</button>
      </div>
    </div>
  );
};

// ── Table Header ─────────────────────────────────────────────────────────────
export const TblHeader = ({ title, search, onSearch, onAdd, addLabel = 'Add new', filterCols = [], data = [] }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [localF, setLocalF] = useState({});
  const [applied, setApplied] = useState({});
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (!ref.current?.contains(e.target)) setFilterOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const toggle = (col, val) => setLocalF(p => { const ex = p[col] || []; return { ...p, [col]: ex.includes(val) ? ex.filter(x => x !== val) : [...ex, val] }; });
  const apply = () => { setApplied(localF); setFilterOpen(false); };
  const cancel = () => { setLocalF(applied); setFilterOpen(false); };
  const cnt = Object.values(applied).filter(v => v.length > 0).length;
  return (
    <div className="card-hdr">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-gray-800 text-base">{title}</h3>
        {cnt > 0 && <span className="badge-blue text-xs">{cnt} filter{cnt > 1 ? 's' : ''}</span>}
      </div>
      <div className="flex items-center gap-2 flex-wrap ml-auto">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0"/></svg>
          <input className="input pl-8 py-1.5 w-52 text-xs" placeholder="Search…" value={search || ''} onChange={e => onSearch(e.target.value)}/>
        </div>
        {filterCols.length > 0 && (
          <div className="relative" ref={ref}>
            <button onClick={() => setFilterOpen(p => !p)} className={`btn btn-sm ${cnt > 0 ? 'btn-primary' : 'btn-outline'}`}>
              🔽 Filter{cnt > 0 ? ` (${cnt})` : ''}
            </button>
            {filterOpen && (
              <div className="filter-panel">
                {filterCols.map(col => {
                  const uniq = [...new Set(data.map(r => r[col.key]).filter(Boolean))];
                  return (
                    <div key={col.key} className="mb-3">
                      <p className="label mb-1">{col.label}</p>
                      {uniq.map(v => (
                        <label key={v} className="flex items-center gap-2 text-sm py-0.5 cursor-pointer hover:text-primary-600">
                          <input type="checkbox" checked={(localF[col.key] || []).includes(String(v))} onChange={() => toggle(col.key, String(v))} className="w-3.5 h-3.5 text-primary-600 rounded"/>
                          {v === 'Y' ? 'Active' : v === 'N' ? 'Inactive' : v}
                        </label>
                      ))}
                    </div>
                  );
                })}
                <div className="flex gap-2 pt-2 border-t mt-2">
                  <button onClick={apply} className="btn-primary btn-xs btn flex-1">Apply filter</button>
                  <button onClick={cancel} className="btn-outline btn-xs btn flex-1">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}
        {onAdd && <button className="btn-primary btn-sm btn whitespace-nowrap" onClick={onAdd}>+ {addLabel}</button>}
      </div>
    </div>
  );
};

// ── Audit Section ─────────────────────────────────────────────────────────────
export const AuditSection = ({ form, onChange, user }) => (
  <div className="fsec">
    <p className="fsec-title">🔒 Audit & validity</p>
    <div className="fgrid">
      <Field label="Effective from" required tooltip="The date from which this record is effective">
        <input type="date" name="effective_from" value={form.effective_from || ''} onChange={onChange}
          className={`input ${!form.effective_from ? 'input-err' : ''}`}/>
        {!form.effective_from && <p className="err-msg"><span>⚠</span> Effective from is required</p>}
      </Field>
      <Field label="Effective to" tooltip="Leave blank for open-ended records">
        <input type="date" name="effective_to" value={form.effective_to || ''} onChange={onChange}
          min={form.effective_from || undefined} className="input"/>
      </Field>
      <Field label="Created by" help="Auto filled from logged in user">
        <input value={user?.username || user?.name || ''} readOnly className="input bg-gray-50 cursor-not-allowed text-gray-400"/>
      </Field>
      <Field label="Updated by" help="Auto filled from logged in user">
        <input value={user?.username || user?.name || ''} readOnly className="input bg-gray-50 cursor-not-allowed text-gray-400"/>
      </Field>
    </div>
  </div>
);

export const ContextSection = ({ form, onChange, companies = [], businessTypes = [], businessGroups = [], modules = [], errors = {} }) => {
  // Auto-select Core HR module when modules load
  useEffect(() => {
    if (!form.module_id && !form.Module_ID && modules.length > 0) {
      const coreHR = modules.find(m => m.Module_Name?.toLowerCase().includes('core hr') && m.active_flag !== 'N');
      if (coreHR) onChange({ target: { name: 'module_id', value: coreHR.id } });
    }
  }, [modules.length, form.module_id, form.Module_ID]);

  const handleCompany = async (e) => {
    const cid = e.target.value;
    onChange({ target: { name: 'company_id', value: cid } });
    onChange({ target: { name: 'Business_Type_ID', value: '' } });
    onChange({ target: { name: 'business_type_id', value: '' } });
    onChange({ target: { name: 'business_group_id', value: '' } });
    if (!cid) return;
    try {
      const { default: api } = await import('../utils/api');
      const r = await api.get(`/companies/${cid}/context`);
      if (r.data) {
        if (r.data.business_type_id) {
          onChange({ target: { name: 'Business_Type_ID', value: r.data.business_type_id } });
          onChange({ target: { name: 'business_type_id', value: r.data.business_type_id } });
        }
        if (r.data.business_group_id) onChange({ target: { name: 'business_group_id', value: r.data.business_group_id } });
      }
    } catch {}
  };

  const btVal = form.Business_Type_ID || form.business_type_id || '';
  const bgVal = form.business_group_id || '';
  const companySelected = !!form.company_id;
  const moduleVal = form.module_id || form.Module_ID || '';
  const coreHR = modules.find(m => m.Module_Name?.toLowerCase().includes('core hr') && m.active_flag !== 'N');
  const moduleLabel = coreHR ? coreHR.Module_Name : (moduleVal ? 'Core HR' : 'Loading…');

  return (
    <div className="fsec">
      <p className="fsec-title">🏢 Organisation context</p>
      <div className="fgrid">
        <Field label="Company" required error={errors.company_id} tooltip="Select the company this record belongs to">
          <select name="company_id" value={form.company_id || ''} onChange={handleCompany}
            className={`input ${errors.company_id ? 'input-err' : ''}`}>
            <option value="">Select Company</option>
            {companies.filter(c => c.active_flag !== 'N').map(c => <option key={c.id} value={c.id}>{c._displayId ? `${c._displayId} - ` : ''}{c.Company_Name}</option>)}
          </select>
        </Field>
        <Field label="Business type" required error={errors.Business_Type_ID || errors.business_type_id}
          help={!companySelected ? 'Will auto fill based on the Company' : undefined}
          tooltip="Auto-filled from the selected Company">
          <select name="Business_Type_ID" value={btVal} onChange={onChange}
            className={`input ${errors.Business_Type_ID ? 'input-err' : ''} ${!companySelected ? 'bg-gray-50' : ''}`}
            disabled>
            <option value="">Select Business type</option>
            {businessTypes.filter(x => x.active_flag !== 'N').map(bt => <option key={bt.id} value={bt.id}>{bt.Business_Type_Name}</option>)}
          </select>
          {!companySelected && <p className="hint">Will auto fill based on the Company</p>}
        </Field>
        <Field label="Business group" required error={errors.business_group_id}
          tooltip="Auto-filled from the selected Company">
          <select name="business_group_id" value={bgVal} onChange={onChange}
            className={`input ${errors.business_group_id ? 'input-err' : ''} ${!companySelected ? 'bg-gray-50' : ''}`}
            disabled>
            <option value="">Select Business group</option>
            {businessGroups.filter(x => x.active_flag !== 'N').map(bg => <option key={bg.id} value={bg.id}>{bg.BG_Name}</option>)}
          </select>
          {!companySelected && <p className="hint">Will auto fill based on the Company</p>}
        </Field>
        <Field label="Module" required error={errors.module_id} tooltip="Auto-set to Core HR">
          <input
            value={moduleLabel}
            readOnly
            className="input bg-gray-50 text-gray-500 cursor-not-allowed"
          />
          <input type="hidden" name="module_id" value={moduleVal}/>
        </Field>
      </div>
    </div>
  );
};


// ── StatCard ──────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, icon, color = 'blue' }) => {
  const c = { blue:'bg-blue-50 text-blue-600', green:'bg-emerald-50 text-emerald-600', yellow:'bg-amber-50 text-amber-700', purple:'bg-purple-50 text-purple-600', red:'bg-red-50 text-red-600', orange:'bg-orange-50 text-orange-600', indigo:'bg-indigo-50 text-indigo-600', teal:'bg-teal-50 text-teal-600' };
  return (
    <div className="card p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${c[color] || c.blue}`}>{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 leading-tight">{value ?? '—'}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
};
