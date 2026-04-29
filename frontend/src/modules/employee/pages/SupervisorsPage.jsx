
import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

function SupervisorAutoFill({ form, setForm }) {
  const prevEmpId = useRef(null);
  const prevSupId = useRef(null);

  useEffect(() => {
    const eid = form.HRMS_employee_id;
    if (eid && eid !== prevEmpId.current) {
      prevEmpId.current = eid;
      api.get(`/assignments?HRMS_employee_id=${eid}&limit=1`).then(res => {
        const asn = res.data?.data?.[0];
        if (asn) setForm(p => ({ ...p, HRMS_assignment_id: asn.id }));
      }).catch(() => {});
    }
  }, [form.HRMS_employee_id, setForm]);

  useEffect(() => {
    const sid = form.supervisor_employee_id;
    if (sid && sid !== prevSupId.current) {
      prevSupId.current = sid;
      api.get(`/assignments?HRMS_employee_id=${sid}&limit=1`).then(res => {
        const asn = res.data?.data?.[0];
        if (asn) setForm(p => ({ ...p, supervisor_assignment_id: asn.id }));
      }).catch(() => {});
    }
  }, [form.supervisor_employee_id, setForm]);

  return null;
}
// Employee/Supervisor/Assignment show names; auto-filter assignments
export default function SupervisorsPage() {
  return <GenericModule title="Supervisors" endpoint="supervisors"
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'HRMS_assignment_id',label:'Employee assignment',render:(_,r)=>r._asnName||r.HRMS_assignment_id||'—'},
      {key:'supervisor_employee_id',label:'Supervisor',render:(_,r)=>r._supName||r.supervisor_employee_id||'—'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_assignment_id',label:'Employee assignment name',required:true,type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id,tooltip:'Only shows assignments for selected employee'},
      {key:'supervisor_employee_id',label:'Supervisor',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'supervisor_assignment_id',label:'Supervisor assignment name',type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id},
    ]}
    extraForm={({ form, setForm }) => <SupervisorAutoFill form={form} setForm={setForm}/>}
  />;
}