import React, { useEffect, useRef, useState } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

function AppraisalAutoFill({ form, setForm, setOptions }) {
  const prevEmpId = useRef(null);

  useEffect(() => {
    const eid = form.HRMS_employee_id;
    if (eid && eid !== prevEmpId.current) {
      prevEmpId.current = eid;
      api.get(`/assignments?HRMS_employee_id=${eid}`).then(res => {
        const asns = res.data?.data || [];
        setOptions(asns.map(a => ({ v: a.id, l: a._displayId || a.id })));
        
        if (asns.length > 0) {
          setForm(p => ({ ...p, HRMS_assignment_id: asns[0].id }));
        } else {
          setForm(p => ({ ...p, HRMS_assignment_id: '' }));
        }
      }).catch(() => {});
    } else if (!eid && prevEmpId.current) {
      prevEmpId.current = null;
      setOptions([]);
      setForm(p => ({ ...p, HRMS_assignment_id: '' }));
    }
  }, [form.HRMS_employee_id, setForm, setOptions]);

  return null;
}
const REVIEW_PERIOD = [{v:'APR_MAR',l:'Apr – Mar'},{v:'APR_SEP',l:'Apr – Sep'},{v:'OCT_MAR',l:'Oct – Mar'},{v:'APR_JUN',l:'Apr – Jun'},{v:'JUL_SEP',l:'Jul – Sep'},{v:'OCT_DEC',l:'Oct – Dec'},{v:'JAN_MAR',l:'Jan – Mar'}];
export default function AppraisalsPage() {
  const [asnOptions, setAsnOptions] = useState([]);

  return <GenericModule title="Appraisals" endpoint="appraisals"
    filterCols={[{key:'appraisal_status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee name',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'review_period',label:'Review period'},
      {key:'overall_rating',label:'Overall rating'},
      {key:'appraisal_status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_appraisal_cycle_id',label:'Appraisal cycle',type:'lov',lovEndpoint:'appraisal-cycles',labelFn:o=>o.cycle_name},
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,tooltip:'Shows employee name, not internal code'},
      {key:'HRMS_assignment_id',label:'Assignment',type:'select',options:asnOptions},
      {key:'HRMS_template_master_id',label:'Template',type:'lov',lovEndpoint:'template-masters',labelFn:o=>o.Template_Name},
      {key:'review_period',label:'Review period',type:'select',options:REVIEW_PERIOD},
      {key:'reviewer_employee_id',label:'Reviewer',type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'overall_rating',label:'Overall rating',numeric:true,min:1,max:10},
      {key:'recommendation',label:'Recommendation',type:'select',options:[{v:'INCREMENT',l:'Increment'},{v:'PROMOTION',l:'Promotion'},{v:'NO_CHANGE',l:'No change'},{v:'PIP',l:'PIP'}]},
      {key:'appraisal_status',label:'Status',type:'select',options:[{v:'DRAFT',l:'Draft'},{v:'SUBMITTED',l:'Submitted'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'}]},
    ]}
    extraForm={({ form, setForm }) => <AppraisalAutoFill form={form} setForm={setForm} setOptions={setAsnOptions}/>}
  />;
}
