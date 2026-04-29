import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import api, { crudOf } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { Modal, LOV, Badge, DataTable, Pagination, TblHeader, ViewModal, AuditSection, ContextSection, Spin, Field } from '../../../components/UI';

const RATING_OPTS = [{v:0,l:'0'},{v:1,l:'1'},{v:2,l:'2'},{v:3,l:'3'},{v:4,l:'4'},{v:5,l:'5'}];

export default function AppraisalRatingsPage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0); const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1); const [perPage, setPerPage] = useState(10);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false); const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null); const [search, setSearch] = useState('');
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [lovData, setLovData] = useState({});
  const [eaData, setEaData] = useState(null); // selected employee appraisal data
  const [hrRatings, setHrRatings] = useState({});
  const crud = crudOf('appraisal-ratings');

  useEffect(() => {
    Promise.all(['companies','business-types','business-groups','modules','employee-appraisals','appraisals'].map(ep =>
      api.get('/'+ep,{params:{limit:500}}).then(r=>({ep,data:r.data||[]})).catch(()=>({ep,data:[]}))
    )).then(rs => { const m={}; rs.forEach(r=>m[r.ep]=r.data); setLovData(m); });
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await crud.list({page,limit:perPage,q:search||undefined}); setData(r.data||[]); setTotal(r.total||0); setPages(r.pages||1); }
    catch(e){ toast.error(e.message); } finally { setLoading(false); }
  }, [page,perPage,search]);
  useEffect(()=>{ load(); },[load]);

  const loadEA = async (eaId) => {
    if (!eaId) { setEaData(null); setHrRatings({}); return; }
    try {
      const ea = (lovData['employee-appraisals']||[]).find(e=>e.id===eaId);
      if (ea && ea.key_area_ratings) {
        setEaData(ea);
        const init = {};
        Object.keys(ea.key_area_ratings||{}).forEach(kid=>{ init[kid]={hr_rating:'',hr_comments:''}; });
        setHrRatings(init);
      }
    } catch(e){ setEaData(null); }
  };

  const handleChange = e => {
    const {name,value}=e.target;
    setForm(p=>({...p,[name]:value}));
    if (name==='HRMS_employee_appraisal_id') loadEA(value);
    if(errors[name]) setErrors(p=>({...p,[name]:''}));
  };

  const handleHrRating = (kid, field, value) => setHrRatings(p=>({...p,[kid]:{...p[kid],[field]:value}}));

  // Compute averages
  const kaEntries = eaData?.key_area_ratings ? Object.entries(eaData.key_area_ratings) : [];
  const avgSelf = kaEntries.length>0 ? (kaEntries.reduce((s,[,v])=>s+parseFloat(v.self_rating||0),0)/kaEntries.length).toFixed(2) : '—';
  const hrVals = Object.values(hrRatings).map(v=>parseFloat(v.hr_rating)).filter(v=>!isNaN(v));
  const avgHr = hrVals.length>0 ? (hrVals.reduce((a,b)=>a+b,0)/hrVals.length).toFixed(2) : '—';

  const validate = () => {
    const errs = {};
    if (!form.company_id) errs.company_id='Please select the Company';
    if (!form.Business_Type_ID) errs.Business_Type_ID='Business type is required';
    if (!form.business_group_id) errs.business_group_id='Business group is required';
    if (!form.module_id) errs.module_id='Please select Module';
    if (!form.effective_from) errs.effective_from='Effective from is required';
    if (!form.HRMS_employee_appraisal_id) errs.HRMS_employee_appraisal_id='Employee appraisal is required';
    if (kaEntries.length>0) {
      const inc = kaEntries.filter(([kid])=>!hrRatings[kid]?.hr_rating&&hrRatings[kid]?.hr_rating!==0||!hrRatings[kid]?.hr_comments);
      if (inc.length>0) errs._hr='Please complete HR/Supervisor Rating and Comments for all Key Areas.';
    }
    setErrors(errs); return Object.keys(errs).length===0;
  };

  const save = async () => {
    if (!validate()) { toast.error('Please fix validation errors'); return; }
    if (editing && !window.confirm('Update this appraisal rating?')) return;
    setLoading(true);
    try {
      const body={...form,hr_ratings:hrRatings,avg_self_rating:avgSelf,avg_hr_rating:avgHr,updated_by:user?.username||''};
      if(editing) await crud.update(editing.id,body); else await crud.create(body);
      toast.success('Appraisal rating saved!'); setModal(false); load();
    } catch(e){ toast.error(e.message); } finally { setLoading(false); }
  };

  const cols=[
    {key:'HRMS_employee_appraisal_id',label:'Employee appraisal',render:(_,r)=>r._eaRef||r.HRMS_employee_appraisal_id||'—'},
    {key:'avg_self_rating',label:'Avg self rating'},
    {key:'avg_hr_rating',label:'Avg HR rating'},
  ];

  return (
    <div>
      <div className="card">
        <TblHeader title="Appraisal ratings" search={search} onSearch={setSearch}
          onAdd={()=>{setForm({active_flag:'Y',effective_from:new Date().toISOString().split('T')[0]});setEditing(null);setEaData(null);setHrRatings({});setModal(true);}}
          addLabel="Add appraisal rating"/>
        <DataTable cols={cols} data={data} loading={loading}
          onEdit={r=>{setForm({active_flag:'Y',effective_from:new Date().toISOString().split('T')[0],...r});setEditing(r);loadEA(r.HRMS_employee_appraisal_id);setModal(true);}}
          onDelete={async id=>{if(!window.confirm('Delete?'))return;await crud.remove(id);load();}}
          onView={r=>setViewing(r)}
          onToggleStatus={async(id,isActive)=>{if(isActive&&!window.confirm('Deactivate?'))return;await crud.toggle(id);load();}}/>
        <Pagination page={page} pages={pages} total={total} perPage={perPage} setPage={setPage} setPerPage={setPerPage}/>
      </div>
      <ViewModal open={!!viewing} onClose={()=>setViewing(null)} title="Appraisal rating" record={viewing} cols={cols}/>
      <Modal open={modal} onClose={()=>{setModal(false);setEditing(null);}} title={`${editing?'Edit':'Add'} appraisal rating`} size="2xl"
        footer={<>
          <button onClick={()=>{setModal(false);setEditing(null);}} className="btn-outline btn">Cancel</button>
          <button onClick={save} disabled={loading} className="btn-primary btn">{loading?<Spin size={4}/>:null} {editing?'Update':'Save rating'}</button>
        </>}>
        <ContextSection form={form} onChange={handleChange}
          companies={lovData['companies']||[]} businessTypes={lovData['business-types']||[]}
          businessGroups={lovData['business-groups']||[]} modules={lovData['modules']||[]} errors={errors}/>
        <div className="fsec">
          <p className="fsec-title">📝 Select employee appraisal</p>
          <LOV label="Employee appraisal" name="HRMS_employee_appraisal_id" value={form.HRMS_employee_appraisal_id||''}
            onChange={handleChange} error={errors.HRMS_employee_appraisal_id} required
            options={lovData['employee-appraisals']||[]}
            labelFn={o=>{const n=o._empName||''; return n?`${n} – ${o.review_period||o.HRMS_appraisal_id||''}`:o._displayId||o.id;}}
            tooltip="Shows Employee Name + Appraisal Period — not EA1"/>
        </div>
        {kaEntries.length>0 && (
          <div className="fsec">
            <p className="fsec-title">⭐ Key areas — HR/Supervisor rating</p>
            {errors._hr && <p className="err-msg mb-2">⚠ {errors._hr}</p>}
            <div className="overflow-x-auto">
              <table className="tbl">
                <thead className="thead"><tr>
                  <th className="th">Key area</th>
                  <th className="th">Self rating</th>
                  <th className="th">Self description</th>
                  <th className="th w-32">HR rating (0–5) *</th>
                  <th className="th">HR comments *</th>
                </tr></thead>
                <tbody>
                  {kaEntries.map(([kid,ka])=>(
                    <tr key={kid} className="tr">
                      <td className="td font-medium">{ka.key_area_name||kid}</td>
                      <td className="td text-center">{ka.self_rating??'—'}</td>
                      <td className="td text-sm text-gray-600">{ka.description||'—'}</td>
                      <td className="td">
                        <select className="input w-20" value={hrRatings[kid]?.hr_rating??''} onChange={e=>handleHrRating(kid,'hr_rating',e.target.value)}>
                          <option value="">—</option>
                          {RATING_OPTS.map(o=><option key={o.v} value={o.v}>{o.l}</option>)}
                        </select>
                      </td>
                      <td className="td">
                        <textarea className="input text-xs" rows={2} placeholder="HR comments (mandatory)"
                          value={hrRatings[kid]?.hr_comments||''} onChange={e=>handleHrRating(kid,'hr_comments',e.target.value)}/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 p-3 bg-primary-50 rounded-lg border border-primary-100">
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Average self rating</p>
                <p className="text-2xl font-extrabold text-primary-700">{avgSelf}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">Average HR/Supervisor rating</p>
                <p className="text-2xl font-extrabold text-emerald-700">{avgHr}</p>
              </div>
            </div>
          </div>
        )}
        <AuditSection form={form} onChange={handleChange} user={user}/>
      </Modal>
    </div>
  );
}
