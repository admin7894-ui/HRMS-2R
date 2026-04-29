import React, { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import api, { crudOf } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  Modal, Field, Input, Select, Textarea, LOV, SearchableLOV, MultiCheck, Tooltip,
  StatusToggle, DataTable, Pagination, TblHeader, ViewModal,
  AuditSection, ContextSection, Spin
} from '../components/UI';

const GenericModule = ({
  title, endpoint, columns, fields,
  defaultForm = {}, filterCols = [],
  extraForm,
}) => {
  const { user } = useAuth();
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
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [lovData, setLovData] = useState({});
  const formRef = useRef();
  const crud = crudOf(endpoint);

  useEffect(() => {
    const lovFields = fields.filter(f => f.lovEndpoint);
    const masters = ['companies', 'business-types', 'business-groups', 'modules'];
    const all = [...new Set([...masters, ...lovFields.map(f => f.lovEndpoint).filter(Boolean)])];
    Promise.all(all.map(ep =>
      api.get('/' + ep, { params: { limit: 500 } })
        .then(r => ({ ep, data: r.data || [] }))
        .catch(() => ({ ep, data: [] }))
    )).then(results => {
      const map = {};
      results.forEach(r => { map[r.ep] = r.data; });
      setLovData(map);
    });
  }, [JSON.stringify(fields.map(f => f.lovEndpoint))]);

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

  const getCoreHR = () => {
    const mods = lovData['modules'] || [];
    return mods.find(m => m.Module_Name?.toLowerCase().includes('core hr') && m.active_flag !== 'N');
  };

  const initForm = (rec = null) => {
    const today = new Date().toISOString().split('T')[0];
    const coreHR = getCoreHR();
    setForm({
      company_id: '', Business_Type_ID: '', business_type_id: '', business_group_id: '',
      module_id: coreHR?.id || '',
      active_flag: 'Y', effective_from: today, effective_to: '',
      created_by: user?.username || '', updated_by: user?.username || '',
      ...defaultForm, ...(rec || {})
    });
    setErrors({});
  };

  const openCreate = () => { initForm(); setEditing(null); setModal(true); };
  const openEdit = rec => { initForm(rec); setEditing(rec); setModal(true); };
  const openView = rec => setViewing(rec);
  const closeModal = () => { setModal(false); setEditing(null); setErrors({}); };
  const closeView = () => setViewing(null);

  // If lovData loads after modal opens (create mode), auto-set Core HR
  useEffect(() => {
    if (modal && !editing) {
      const coreHR = getCoreHR();
      if (coreHR) setForm(p => ({ ...p, module_id: p.module_id || coreHR.id }));
    }
  }, [lovData, modal]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleNameForCode = (e, codeKey) => {
    handleChange(e);
    if (codeKey && !editing && e.target.value) {
      api.get('/code-preview', { params: { name: e.target.value } })
        .then(r => setForm(p => ({ ...p, [codeKey]: r.data?.code || '' })))
        .catch(() => {});
    } else if (codeKey && !e.target.value) {
      setForm(p => ({ ...p, [codeKey]: '' }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.company_id) errs.company_id = 'Please select the Company';
    if (!form.Business_Type_ID && !form.business_type_id) errs.Business_Type_ID = 'Business type is required';
    if (!form.business_group_id) errs.business_group_id = 'Business group is required';
    if (!form.module_id && !form.Module_ID) errs.module_id = 'Please select Module';
    if (!form.effective_from) errs.effective_from = 'Effective from is required';

    fields.forEach(f => {
      if (f.hidden || f.key === 'module_id' || f.key === 'Module_ID') return;
      const val = form[f.key];
      if (f.required && (val === undefined || val === null || val === ''))
        errs[f.key] = `${f.label} is required`;
      if (val != null && val !== '') {
        if (f.minLen && String(val).length < f.minLen) errs[f.key] = `Minimum ${f.minLen} characters required`;
        if (f.maxLen && String(val).length > f.maxLen) errs[f.key] = `Maximum ${f.maxLen} characters allowed`;
        if ((f.type === 'alpha' || f.alphaOnly) && /[^a-zA-Z\s]/.test(String(val)))
          errs[f.key] = `${f.label} must contain alphabets only`;
        if (f.type === 'phone' && !/^[6-9][0-9]{9}$/.test(String(val)))
          errs[f.key] = 'Must be 10 digits starting with 6–9';
        if (f.type === 'email' && !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(String(val)))
          errs[f.key] = 'Please enter valid Email ID';
        if ((f.type === 'number' || f.numeric) && (isNaN(parseFloat(val)) || /[eE]/.test(String(val))))
          errs[f.key] = 'Please enter valid numeric value';
        if ((f.type === 'number' || f.numeric) && !isNaN(parseFloat(val))) {
          const n = parseFloat(val);
          if (f.min !== undefined && n < f.min) errs[f.key] = `Minimum value is ${f.min}`;
          if (f.max !== undefined && n > f.max) errs[f.key] = `Maximum value is ${f.max}`;
        }
        if (f.regex && !f.regex.test(String(val)))
          errs[f.key] = f.regexMsg || 'Invalid format';
        if (f.key === 'IFSC_Code' && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(String(val)))
          errs[f.key] = 'IFSC: 4 alphabets + 0 + 6 alphanumeric (11 chars)';
        if (f.key === 'Aadhar_Card_Number' && !/^[0-9]{12}$/.test(String(val)))
          errs[f.key] = 'Aadhaar must be exactly 12 digits';
        if (f.key === 'PAN_Card_Number' && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(String(val)))
          errs[f.key] = 'PAN format: AAAAA0000A';
        if (f.key === 'Account_Number' && (String(val).length < 10 || String(val).length > 18))
          errs[f.key] = 'Account number must be 10–18 digits';
      }
    });
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setTimeout(() => {
        const el = formRef.current?.querySelector('.input-err');
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    return Object.keys(errs).length === 0;
  };

  const save = async e => {
    if (e?.preventDefault) e.preventDefault();
    if (!validate()) { toast.error('Please fix the validation errors'); return; }
    if (editing && !window.confirm(`Are you sure you want to update this ${title} record?`)) return;
    setLoading(true);
    try {
      const body = { ...form, updated_by: user?.username || '' };
      if (editing) { await crud.update(editing.id, body); toast.success(`${title} updated!`); }
      else { await crud.create(body); toast.success(`${title} created!`); }
      closeModal(); load();
    } catch (err) { toast.error(err.message || 'Save failed'); }
    finally { setLoading(false); }
  };

  const destroy = async id => {
    if (!window.confirm('Delete this record?')) return;
    setLoading(true);
    try { await crud.remove(id); toast.success('Deleted'); load(); }
    catch (e) { toast.error(e.message || 'Delete failed'); }
    finally { setLoading(false); }
  };

  const toggleStatus = async (id, isActive) => {
    if (isActive && !window.confirm('Are you sure you want to deactivate this record?')) return;
    try { await crud.toggle(id); load(); }
    catch (e) { toast.error(e.message || 'Toggle failed'); }
  };

  const renderField = f => {
    if (f.hidden || f.key === 'module_id' || f.key === 'Module_ID') return null;
    const val = form[f.key] ?? '';
    const er = errors[f.key];
    const common = { name: f.key, value: val, onChange: handleChange, disabled: f.readOnly };

    if (f.type === 'textarea') return (
      <div key={f.key} className="col-span-full">
        <Field label={f.label} error={er} required={f.required} tooltip={f.tooltip}>
          <Textarea {...common} maxLength={f.maxLen || 200} placeholder={f.label}/>
        </Field>
      </div>
    );
    if (f.type === 'multicheck') return (
      <div key={f.key} className="col-span-full">
        <MultiCheck label={f.label} name={f.key} value={String(val)} onChange={handleChange} options={f.options || []}/>
        {er && <p className="err-msg">⚠ {er}</p>}
      </div>
    );
    if (f.type === 'select') return (
      <Field key={f.key} label={f.label} error={er} required={f.required} tooltip={f.tooltip}>
        <select className={`input ${er ? 'input-err' : ''}`} name={f.key} value={val} onChange={handleChange} disabled={f.readOnly}>
          <option value="">{`Select ${f.label}`}</option>
          {(f.options || []).map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
        </select>
      </Field>
    );
    if (f.type === 'lov') return (
      <LOV key={f.key} label={f.label} name={f.key} value={val} onChange={handleChange}
        error={er} required={f.required} tooltip={f.tooltip}
        options={lovData[f.lovEndpoint] || []} valueKey={f.valueKey || 'id'} labelFn={f.labelFn}/>
    );
    if (f.type === 'searchable-lov') return (
      <SearchableLOV key={f.key} label={f.label} name={f.key} value={val} onChange={handleChange}
        error={er} required={f.required}
        options={f.options || (f.lovEndpoint ? (lovData[f.lovEndpoint] || []).map(o => ({
          value: o.id,
          label: f.labelFn ? f.labelFn(o) : (o.Work_Schedule_Name || o.Position_Name || o.id)
        })) : [])}/>
    );
    if (f.type === 'date') return (
      <Field key={f.key} label={f.label} error={er} required={f.required} tooltip={f.tooltip}>
        <input type="date" {...common} min={f.minDate} max={f.maxDate}
          className={`input ${er ? 'input-err' : ''}`}/>
      </Field>
    );
    if (f.type === 'datetime-local') return (
      <Field key={f.key} label={f.label} error={er} required={f.required} tooltip="Date and time combined">
        <input type="datetime-local" {...common} className={`input ${er ? 'input-err' : ''}`}/>
        <p className="hint">Format: dd-mm-yyyy --:-- (time defaults to 00:00)</p>
      </Field>
    );
    if (f.type === 'time') return (
      <Field key={f.key} label={f.label} error={er} required={f.required}>
        <input type="time" {...common} placeholder="hh:mm" className={`input ${er ? 'input-err' : ''}`}/>
      </Field>
    );
    if (f.type === 'number' || f.numeric) return (
      <Field key={f.key} label={f.label} error={er} required={f.required} help={f.help} tooltip={f.tooltip}>
        <input type="text" inputMode="numeric" {...common} placeholder={f.label}
          onChange={e => {
            const v = e.target.value;
            if (v === '' || v === '-' || /^-?\d*\.?\d*$/.test(v)) handleChange(e);
            else setErrors(p => ({ ...p, [f.key]: 'Please enter valid numeric value' }));
          }}
          className={`input ${er ? 'input-err' : ''}`}/>
      </Field>
    );
    if (f.type === 'phone') return (
      <Field key={f.key} label={f.label} error={er} required={f.required} tooltip="10-digit mobile number without country code">
        <div className="flex gap-2">
          <span className="flex items-center px-3 bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium text-gray-600">+91</span>
          <input type="tel" {...common} maxLength={10} placeholder={f.label}
            className={`input ${er ? 'input-err' : ''}`}/>
        </div>
        <p className="hint">Format: abc@gmail.com is for email; this is 10-digit mobile</p>
      </Field>
    );
    if (f.type === 'email') return (
      <Field key={f.key} label={f.label} error={er} required={f.required} tooltip="Format: abc@gmail.com">
        <input type="email" {...common} placeholder={f.label} className={`input ${er ? 'input-err' : ''}`}/>
        <p className="hint">Format: abc@gmail.com</p>
      </Field>
    );
    if (f.type === 'file') return (
      <Field key={f.key} label={f.label} error={er} required={f.required} tooltip={f.tooltip}>
        <input type="file" name={f.key}
          onChange={e => handleChange({ target: { name: f.key, value: e.target.files[0]?.name || '' } })}
          className="input py-1.5" accept={f.accept || '*'}/>
        {val && <p className="hint">📎 {val}</p>}
      </Field>
    );
    if (f.type === 'readonly' || f.type === 'code') return (
      <Field key={f.key} label={f.label} help={f.help || 'Auto-generated'} tooltip="This field is auto-generated">
        <input type="text" value={val || '—'} readOnly
          className="input bg-primary-50 text-primary-700 font-mono font-semibold cursor-not-allowed border-primary-200"/>
      </Field>
    );
    if (f.type === 'alpha') return (
      <Field key={f.key} label={f.label} error={er} required={f.required} tooltip={f.tooltip}>
        <input type="text" {...common}
          onChange={e => { if (/^[a-zA-Z\s]*$/.test(e.target.value)) handleChange(e); }}
          placeholder={f.label} maxLength={f.maxLen || 20}
          className={`input ${er ? 'input-err' : ''}`}/>
      </Field>
    );
    return (
      <Field key={f.key} label={f.label} error={er} required={f.required} help={f.help} tooltip={f.tooltip}>
        <Input type="text" {...common}
          minLength={f.minLen} maxLength={f.maxLen || 50}
          placeholder={f.label}
          onChange={f.generatesCode ? e => handleNameForCode(e, f.codeKey) : handleChange}/>
      </Field>
    );
  };

  const grouped = {};
  const noSection = [];
  fields.forEach(f => {
    if (f.hidden || f.key === 'module_id' || f.key === 'Module_ID') return;
    if (f.section) { if (!grouped[f.section]) grouped[f.section] = []; grouped[f.section].push(f); }
    else noSection.push(f);
  });
  const hasSections = Object.keys(grouped).length > 0;

  return (
    <div>
      <div className="card">
        <TblHeader title={title} search={search} onSearch={setSearch} onAdd={openCreate}
          addLabel={`Add ${title.toLowerCase()}`} filterCols={filterCols} data={data}/>
        <DataTable cols={columns} data={data} loading={loading}
          onEdit={openEdit} onDelete={destroy} onView={openView} onToggleStatus={toggleStatus}
          sortBy={sortBy} sortOrder={sortOrder} onSort={handleSort}/>
        <Pagination page={page} pages={pages} total={total} perPage={perPage} setPage={setPage} setPerPage={setPerPage}/>
      </div>

      <ViewModal open={!!viewing} onClose={closeView} title={title} record={viewing} cols={columns} fields={fields} lovData={lovData}/>

      <Modal open={modal} onClose={closeModal} title={`${editing ? 'Edit' : 'Add'} ${title}`} size="2xl"
        footer={<>
          <button onClick={closeModal} className="btn-outline btn">Cancel</button>
          <button onClick={save} disabled={loading} className="btn-primary btn">
            {loading ? <><Spin size={4}/>{' '}</> : null}
            {editing ? 'Update record' : 'Save record'}
          </button>
        </>}>
        <form onSubmit={save} ref={formRef}>
          <ContextSection form={form} onChange={handleChange}
            companies={lovData['companies'] || []}
            businessTypes={lovData['business-types'] || []}
            businessGroups={lovData['business-groups'] || []}
            modules={lovData['modules'] || []}
            errors={errors}/>

          {extraForm && extraForm({ form, onChange: handleChange, errors, lovData, setForm })}

          {hasSections
            ? Object.entries(grouped).map(([sec, flds]) => (
                <div key={sec} className="fsec">
                  <p className="fsec-title">📝 {sec}</p>
                  <div className="fgrid">{flds.map(f => renderField(f))}</div>
                </div>
              ))
            : <div className="fsec">
                <p className="fsec-title">📝 Details</p>
                <div className="fgrid">{noSection.map(f => renderField(f))}</div>
              </div>
          }
          {hasSections && noSection.length > 0 && (
            <div className="fsec">
              <p className="fsec-title">📝 Other</p>
              <div className="fgrid">{noSection.map(f => renderField(f))}</div>
            </div>
          )}
          <AuditSection form={form} onChange={handleChange} user={user}/>
        </form>
      </Modal>
    </div>
  );
};

export default GenericModule;
