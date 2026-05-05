import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';

function SeparationAutoFill({ form, setForm, api }) {
  const prevEmpId = useRef(null);

  useEffect(() => {
    const eid = form.HRMS_employee_id;
    if (!eid) {
      prevEmpId.current = null;
      setForm(p => ({ ...p, HRMS_assignment_id: '' }));
      return;
    }
    if (eid === prevEmpId.current) return;
    prevEmpId.current = eid;

    api.get(`/employees/${eid}/assignments`).then(res => {
      const asns = res?.data || [];
      const picked = [...asns].sort((a, b) =>
        String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || ''))
      )[0];
      setForm(p => ({ ...p, HRMS_assignment_id: picked?.id || '' }));
    }).catch(() => {});
  }, [form.HRMS_employee_id, setForm, api]);

  return null;
}

export default function SeparationsPage() {
  return <GenericModule title="Separations" endpoint="separations"
    filterCols={[{key:'separation_type',label:'Type'},{key:'separation_status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee name',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'—'},
      {key:'separation_type',label:'Separation type',type:'badge'},
      {key:'last_working_date',label:'Last working date',type:'date'},
      {key:'separation_status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_assignment_id',label:'Assignment',required:true,type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id,readOnly:true,tooltip:'Auto-filled from selected employee assignment ID'},
      {key:'separation_type',label:'Separation type',required:true,type:'select',options:[{v:'RESIGNATION',l:'Resignation'},{v:'TERMINATION',l:'Termination'},{v:'RETIREMENT',l:'Retirement'},{v:'LAYOFF',l:'Layoff'},{v:'ABSCONDING',l:'Absconding'},{v:'CONTRACT_END',l:'Contract end'},{v:'TRANSFER',l:'Transfer'}]},
      {key:'reason',label:'Reason',required:true,type:'textarea',maxLen:200},
      {key:'resignation_date',label:'Resignation date',required:true,type:'date'},
      {key:'notice_period_days',label:'Notice period (days)',required:true,numeric:true,min:0,max:90,tooltip:'Maximum allowed notice period is 90 days.'},
      {key:'last_working_date',label:'Last working date',required:true,type:'date'},
      {key:'separation_status',label:'Status',required:true,type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'},{v:'IN_PROGRESS',l:'In progress'},{v:'COMPLETED',l:'Completed'}]},
      {key:'approved_by_employee_id',label:'Approved by',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
    ]}
    extraForm={({ form, setForm, api }) => <SeparationAutoFill form={form} setForm={setForm} api={api} />}
  />;
}
