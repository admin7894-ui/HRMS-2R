import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api, { crudOf } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { Modal, LOV, DataTable, Pagination, TblHeader, ViewModal, AuditSection, ContextSection, Spin } from '../../../components/UI';

export default function EmployeeAppraisalsPage() {
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
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [keyAreas, setKeyAreas] = useState([]);
  const [lovData, setLovData] = useState({});
  const [ratings, setRatings] = useState({});
  const crud = crudOf('employee-appraisals');

  useEffect(() => {
    Promise.all(['companies', 'business-types', 'business-groups', 'modules', 'employees', 'appraisal-cycles'].map(ep =>
      api.get('/' + ep, { params: { limit: 500 } }).then(r => ({ ep, data: r.data || [] })).catch(() => ({ ep, data: [] }))
    )).then(rs => {
      const map = {};
      rs.forEach(r => { map[r.ep] = r.data; });
      setLovData(map);
    });
  }, []);

  useEffect(() => {
    load();
  }, [page, perPage, search]);

  const load = async () => {
    setLoading(true);
    try {
      const r = await crud.list({ page, limit: perPage, q: search || undefined });
      setData(r.data || []);
      setTotal(r.total || 0);
      setPages(r.pages || 1);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const loadKeyAreas = async (existingRatings = null) => {
    try {
      const r = await api.get('/appraisal-key-areas', { params: { limit: 500 } });
      const areas = (r.data || []).filter(a => a.active_flag !== 'N');
      setKeyAreas(areas);
      setRatings(prev => {
        const next = {};
        areas.forEach(area => {
          const existing = existingRatings?.[area.id] || prev[area.id] || {};
          next[area.id] = {
            key_area_name: area.key_area_name,
            key_area_weightage: area.key_area_weightage,
            minimum_rating: area.minimum_rating,
            maximum_rating: area.maximum_rating,
            self_rating: existing.self_rating ?? '',
          };
        });
        return next;
      });
    } catch (e) {
      setKeyAreas([]);
      setRatings({});
      toast.error('Failed to load appraisal key areas');
    }
  };

  const initForm = rec => {
    const today = new Date().toISOString().split('T')[0];
    setForm({
      company_id: '',
      Business_Type_ID: '',
      business_group_id: '',
      module_id: '',
      active_flag: 'Y',
      effective_from: today,
      appraisal_status: 'SUBMITTED',
      ...rec,
    });
    setErrors({});
    if (rec?.key_area_ratings) loadKeyAreas(rec.key_area_ratings);
    else {
      setKeyAreas([]);
      setRatings({});
    }
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (name === 'HRMS_employee_id') {
      if (value) loadKeyAreas(editing?.key_area_ratings || null);
      else {
        setKeyAreas([]);
        setRatings({});
      }
    }
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleRating = (areaId, value) => {
    setRatings(p => ({
      ...p,
      [areaId]: { ...p[areaId], self_rating: value },
    }));
  };

  const handleDescription = (areaId, value) => {
    setRatings(p => ({
      ...p,
      [areaId]: { ...p[areaId], description: value.slice(0, 200) },
    }));
  };

  const getRatingError = area => {
    const raw = ratings[area.id]?.self_rating;
    if (raw === '' || raw == null) return 'Rating is required';
    const num = parseFloat(raw);
    const min = parseFloat(area.minimum_rating ?? 0);
    const max = parseFloat(area.maximum_rating ?? 10);
    if (Number.isNaN(num)) return 'Please enter a valid rating';
    if (num < min || num > max) return `Rating must be between ${min} and ${max}`;
    return '';
  };

  const validate = () => {
    const errs = {};
    if (!form.company_id) errs.company_id = 'Please select the Company';
    if (!form.Business_Type_ID) errs.Business_Type_ID = 'Business type is required';
    if (!form.business_group_id) errs.business_group_id = 'Business group is required';
    if (!form.module_id) errs.module_id = 'Please select Module';
    if (!form.effective_from) errs.effective_from = 'Effective from is required';
    if (!form.HRMS_employee_id) errs.HRMS_employee_id = 'Employee is required';
    if (!form.HRMS_appraisal_cycle_id) errs.HRMS_appraisal_cycle_id = 'Appraisal cycle is required';
    if (keyAreas.length === 0) errs._keyAreas = 'No active appraisal key areas found.';
    const invalid = keyAreas.filter(a => getRatingError(a));
    if (invalid.length > 0) errs._keyAreas = 'Please fix the rating errors for all key areas.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) {
      toast.error('Please fix the validation errors');
      return;
    }
    if (editing && !window.confirm('Are you sure you want to update this appraisal?')) return;
    setLoading(true);
    try {
      const selectedCycle = (lovData['appraisal-cycles'] || []).find(c => c.id === form.HRMS_appraisal_cycle_id);
      const ratingCount = keyAreas.length || 1;
      const totalScore = keyAreas.reduce((sum, area) => sum + parseFloat(ratings[area.id]?.self_rating || 0), 0);
      const body = {
        ...form,
        review_period: selectedCycle?.cycle_name || form.review_period || '',
        overall_rating: Number((totalScore / ratingCount).toFixed(2)),
        key_area_ratings: ratings,
        appraisal_status: editing ? form.appraisal_status : 'SUBMITTED',
        updated_by: user?.username || '',
      };
      if (editing) await crud.update(editing.id, body);
      else await crud.create(body);
      toast.success('Employee appraisal saved!');
      setModal(false);
      setEditing(null);
      load();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const destroy = async id => {
    if (!window.confirm('Delete?')) return;
    await crud.remove(id);
    load();
  };

  const toggleStatus = async (id, isActive) => {
    if (isActive && !window.confirm('Deactivate?')) return;
    await crud.toggle(id);
    load();
  };

  const cols = [
    { key: 'HRMS_employee_id', label: 'Employee', render: (_, r) => r.Employee_Name || r._empName || r.HRMS_employee_id || '-' },
    { key: 'HRMS_appraisal_cycle_id', label: 'Appraisal cycle', render: (_, r) => r.cycle_name || r._cycleName || r.HRMS_appraisal_cycle_id || '-' },
    { key: 'overall_rating', label: 'Overall rating' },
    { key: 'appraisal_status', label: 'Status', type: 'badge' },
  ];

  return (
    <div>
      <div className="card">
        <TblHeader
          title="Employee appraisals"
          search={search}
          onSearch={setSearch}
          onAdd={() => { initForm(); setEditing(null); setModal(true); }}
          addLabel="Add employee appraisal"
        />
        <DataTable
          cols={cols}
          data={data}
          loading={loading}
          onEdit={r => { initForm(r); setEditing(r); setModal(true); }}
          onDelete={destroy}
          onView={r => setViewing(r)}
          onToggleStatus={toggleStatus}
        />
        <Pagination page={page} pages={pages} total={total} perPage={perPage} setPage={setPage} setPerPage={setPerPage} />
      </div>

      <ViewModal open={!!viewing} onClose={() => setViewing(null)} title="Employee appraisal" record={viewing} cols={cols} />

      <Modal
        open={modal}
        onClose={() => { setModal(false); setEditing(null); }}
        title={`${editing ? 'Edit' : 'Add'} employee appraisal`}
        size="2xl"
        footer={
          <>
            <button onClick={() => { setModal(false); setEditing(null); }} className="btn-outline btn">Cancel</button>
            <button onClick={save} disabled={loading} className="btn-primary btn">{loading ? <Spin size={4} /> : null} {editing ? 'Update' : 'Submit appraisal'}</button>
          </>
        }
      >
        <ContextSection
          form={form}
          onChange={handleChange}
          companies={lovData['companies'] || []}
          businessTypes={lovData['business-types'] || []}
          businessGroups={lovData['business-groups'] || []}
          modules={lovData['modules'] || []}
          errors={errors}
        />

        <div className="fsec">
          <p className="fsec-title">Appraisal details</p>
          <div className="fgrid">
            <LOV
              label="Employee"
              name="HRMS_employee_id"
              value={form.HRMS_employee_id || ''}
              onChange={handleChange}
              error={errors.HRMS_employee_id}
              required
              options={lovData['employees'] || []}
              labelFn={o => `${o.First_Name} ${o.Last_Name}`}
            />
            <LOV
              label="Appraisal cycle"
              name="HRMS_appraisal_cycle_id"
              value={form.HRMS_appraisal_cycle_id || ''}
              onChange={handleChange}
              error={errors.HRMS_appraisal_cycle_id}
              required
              options={lovData['appraisal-cycles'] || []}
              labelFn={o => o.cycle_name}
            />
          </div>
        </div>

        {form.HRMS_employee_id && (
          <div className="fsec">
            <p className="fsec-title">Key area ratings</p>
            {errors._keyAreas && <p className="err-msg mb-2">Warning {errors._keyAreas}</p>}
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead className="thead">
                  <tr>
                    <th className="th">Key area name</th>
                    <th className="th">Weightage %</th>
                    <th className="th">Min rating</th>
                    <th className="th">Max rating</th>
                    <th className="th">Rating</th>
                    <th className="th">Self description</th>
                  </tr>
                </thead>
                <tbody>
                  {keyAreas.map(area => {
                    const ratingError = getRatingError(area);
                    return (
                      <tr key={area.id} className="tr">
                        <td className="td font-medium">{area.key_area_name}</td>
                        <td className="td">{area.key_area_weightage ?? '-'}</td>
                        <td className="td">{area.minimum_rating ?? '-'}</td>
                        <td className="td">{area.maximum_rating ?? '-'}</td>
                        <td className="td">
                          <input
                            type="number"
                            min={area.minimum_rating ?? 0}
                            max={area.maximum_rating ?? 10}
                            step="0.1"
                            value={ratings[area.id]?.self_rating ?? ''}
                            onChange={e => handleRating(area.id, e.target.value)}
                            className={`input w-28 ${ratingError ? 'input-err' : ''}`}
                            placeholder="Rating"
                          />
                          {ratingError && <p className="err-msg mt-1">{ratingError}</p>}
                        </td>
                        <td className="td">
                          <input
                            type="text"
                            maxLength={200}
                            value={ratings[area.id]?.description ?? ''}
                            onChange={e => handleDescription(area.id, e.target.value)}
                            className="input min-w-52"
                            placeholder="Optional comments"
                          />
                          <p className="hint mt-1">{String(ratings[area.id]?.description || '').length}/200</p>
                        </td>
                      </tr>
                    );
                  })}
                  {keyAreas.length === 0 && (
                    <tr className="tr">
                      <td className="td text-gray-400 italic" colSpan={6}>No active appraisal key areas found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <AuditSection form={form} onChange={handleChange} user={user} />
      </Modal>
    </div>
  );
}
