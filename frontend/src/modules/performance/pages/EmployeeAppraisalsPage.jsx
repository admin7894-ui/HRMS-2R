import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api, { crudOf } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { Modal, Field, LOV, Badge, StatusToggle, DataTable, Pagination, TblHeader, ViewModal, AuditSection, ContextSection, Spin } from '../../../components/UI';

const RATING_OPTS = [{v:0,l:'0'},{v:1,l:'1'},{v:2,l:'2'},{v:3,l:'3'},{v:4,l:'4'},{v:5,l:'5'}];

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
    Promise.all(['companies','business-types','business-groups','modules','employees','appraisals'].map(ep =>
      api.get('/'+ep,{params:{limit:500}}).then(r=>({ep,data:r.data||[]})).catch(()=>({ep,data:[]}))
    )).then(rs => { const m={}; rs.forEach(r=>m[r.ep]=r.data); setLovData(m); });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await crud.list({page,limit:perPage,q:search||undefined});
      setData(r.data||[]); setTotal(r.total||0); setPages(r.pages||1);
    } catch(e){ toast.error(e.message); } finally { setLoading(false); }
  }, [page,perPage,search]);
  useEffect(()=>{ load(); },[load]);

  const loadKeyAreas = async (appraisalId) => {
    if (!appraisalId) { setKeyAreas([]); setRatings({}); return; }
    try {
      const r = await api.get(`/appraisals/${appraisalId}/key-areas`);
      const areas = r.data || [];
      setKeyAreas(areas);
      const init = {};
      areas.forEach(a => { init[a.id] = { self_rating: '', description: '' }; });
      setRatings(init);
    } catch(e) { setKeyAreas([]); }
  };

  const initForm = (rec=null) => {
    const today = new Date().toISOString().split('T')[0];
    setForm({ company_id:'',Business_Type_ID:'',business_group_id:'',module_id:'',active_flag:'Y',effective_from:today,...(rec||{}) });
    setErrors({});
    if (rec?.HRMS_appraisal_key_area_id || rec?.HRMS_appraisal_id) loadKeyAreas(rec.HRMS_appraisal_id||'');
    else { setKeyAreas([]); setRatings({}); }
  };

  const handleChange = e => {
    const {name,value} = e.target;
    setForm(p=>({...p,[name]:value}));
    if (name==='HRMS_appraisal_id') loadKeyAreas(value);
    if (errors[name]) setErrors(p=>({...p,[name]:''}));
  };

  const handleRating = (areaId, field, value) => {
    setRatings(p=>({...p,[areaId]:{...p[areaId],[field]:value}}));
  };

  const validate = () => {
    const errs = {};
    if (!form.company_id) errs.company_id = 'Please select the Company';
    if (!form.Business_Type_ID) errs.Business_Type_ID = 'Business type is required';
    if (!form.business_group_id) errs.business_group_id = 'Business group is required';
    if (!form.module_id) errs.module_id = 'Please select Module';
    if (!form.effective_from) errs.effective_from = 'Effective from is required';
    if (!form.HRMS_employee_id) errs.HRMS_employee_id = 'Employee is required';
    if (!form.HRMS_appraisal_id) errs.HRMS_appraisal_id = 'Appraisal is required';
    if (keyAreas.length > 0) {
      const incomplete = keyAreas.filter(a => !ratings[a.id]?.self_rating && ratings[a.id]?.self_rating !== 0 || !ratings[a.id]?.description);
      if (incomplete.length > 0) errs._keyAreas = 'Please complete Rating and Description for all Key Areas before submitting.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const save = async () => {
    if (!validate()) { toast.error('Please fix the validation errors'); return; }
    if (editing && !window.confirm('Are you sure you want to update this appraisal?')) return;
    setLoading(true);
    try {
      const body = {
        ...form,
        key_area_ratings: ratings,
        appraisal_status: editing ? form.appraisal_status : 'SUBMITTED', // auto-set on submit
        updated_by: user?.username||''
      };
      if (editing) await crud.update(editing.id, body);
      else await crud.create(body);
      toast.success('Employee appraisal saved!');
      setModal(false); load();
    } catch(e){ toast.error(e.message); } finally { setLoading(false); }
  };

  const destroy = async id => {
    if (!window.confirm('Delete?')) return;
    await crud.remove(id); load();
  };

  const toggleStatus = async (id, isActive) => {
    if (isActive && !window.confirm('Deactivate?')) return;
    await crud.toggle(id); load();
  };

  const cols = [
    {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
    {key:'HRMS_appraisal_id',label:'Appraisal',render:(_,r)=>r._appraisalRef||r.HRMS_appraisal_id||'—'},
    {key:'appraisal_status',label:'Status',type:'badge'},
  ];

  return (
    <div>
      <div className="card">
        <TblHeader title="Employee appraisals" search={search} onSearch={setSearch}
          onAdd={()=>{ initForm(); setEditing(null); setModal(true); }} addLabel="Add employee appraisal"/>
        <DataTable cols={cols} data={data} loading={loading}
          onEdit={r=>{ initForm(r); setEditing(r); setModal(true); }}
          onDelete={destroy} onView={r=>setViewing(r)} onToggleStatus={toggleStatus}/>
        <Pagination page={page} pages={pages} total={total} perPage={perPage} setPage={setPage} setPerPage={setPerPage}/>
      </div>

      <ViewModal open={!!viewing} onClose={()=>setViewing(null)} title="Employee appraisal" record={viewing} cols={cols}/>

      <Modal open={modal} onClose={()=>{setModal(false);setEditing(null);}} title={`${editing?'Edit':'Add'} employee appraisal`} size="2xl"
        footer={<>
          <button onClick={()=>{setModal(false);setEditing(null);}} className="btn-outline btn">Cancel</button>
          <button onClick={save} disabled={loading} className="btn-primary btn">{loading?<Spin size={4}/>:null} {editing?'Update':'Submit appraisal'}</button>
        </>}>
        <ContextSection form={form} onChange={handleChange}
          companies={lovData['companies']||[]} businessTypes={lovData['business-types']||[]}
          businessGroups={lovData['business-groups']||[]} modules={lovData['modules']||[]} errors={errors}/>

        <div className="fsec">
          <p className="fsec-title">📝 Appraisal details</p>
          <div className="fgrid">
            <LOV label="Employee" name="HRMS_employee_id" value={form.HRMS_employee_id||''} onChange={handleChange}
              error={errors.HRMS_employee_id} required options={lovData['employees']||[]} labelFn={o=>`${o.First_Name} ${o.Last_Name}`}/>
            <LOV label="Appraisal" name="HRMS_appraisal_id" value={form.HRMS_appraisal_id||''} onChange={handleChange}
              error={errors.HRMS_appraisal_id} required options={lovData['appraisals']||[]}
              labelFn={o=>{const e=o._empName||''; return e?`${e} – ${o.review_period||''}`:o._displayId||o.id;}}
              tooltip="Shows employee name + period — not APR1"/>
          </div>
        </div>

        {keyAreas.length > 0 && (
          <div className="fsec">
            <p className="fsec-title">⭐ Key areas — self rating</p>
            {errors._keyAreas && <p className="err-msg mb-2">⚠ {errors._keyAreas}</p>}
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead className="thead"><tr>
                  <th className="th">Key area</th>
                  <th className="th w-32">Self rating (0–5) *</th>
                  <th className="th">Description *</th>
                </tr></thead>
                <tbody>
                  {keyAreas.map(a => (
                    <tr key={a.id} className="tr">
                      <td className="td font-medium">{a.key_area_name}</td>
                      <td className="td">
                        <select className="input w-24" value={ratings[a.id]?.self_rating??''} onChange={e=>handleRating(a.id,'self_rating',e.target.value)}>
                          <option value="">—</option>
                          {RATING_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                        </select>
                      </td>
                      <td className="td">
                        <textarea className="input text-xs" rows={2} placeholder="Employee comments (mandatory)"
                          value={ratings[a.id]?.description||''} onChange={e=>handleRating(a.id,'description',e.target.value)}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="hint mt-2">Status auto-sets to "Submitted" on save. HR can then approve or reject.</p>
          </div>
        )}
        {keyAreas.length === 0 && form.HRMS_appraisal_id && (
          <div className="fsec"><p className="text-sm text-gray-400 italic p-3">No key areas found for this appraisal. Add key areas first.</p></div>
        )}

        <AuditSection form={form} onChange={handleChange} user={user}/>
      </Modal>
    </div>
  );
}
