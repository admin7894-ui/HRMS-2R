
import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

function SupervisorAutoFill({ form, setForm }) {
  const prevEmpId = useRef(null);
  const prevSupId = useRef(null);

  useEffect(() => {
    const eid = form.HRMS_employee_id;
    if (!eid) {
      prevEmpId.current = null;
      setForm(p => ({ ...p, HRMS_assignment_id: '' }));
      return;
    }
    if (eid !== prevEmpId.current) {
      prevEmpId.current = eid;
      api.get(`/employees/${eid}/assignments`).then(res => {
        const asn = res?.data?.[0];
        setForm(p => ({ ...p, HRMS_assignment_id: asn?.id || '' }));
      }).catch(() => {});
    }
  }, [form.HRMS_employee_id, setForm]);

  useEffect(() => {
    const sid = form.supervisor_employee_id;
    if (!sid) {
      prevSupId.current = null;
      setForm(p => ({ ...p, supervisor_assignment_id: '' }));
      return;
    }
    if (sid !== prevSupId.current) {
      prevSupId.current = sid;
      api.get(`/employees/${sid}/assignments`).then(res => {
        const asn = res?.data?.[0];
        setForm(p => ({ ...p, supervisor_assignment_id: asn?.id || '' }));
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
      {key:'HRMS_assignment_id',label:'Employee assignment name',required:true,type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id,tooltip:'Auto-filled from selected employee assignment ID',readOnly:true},
      {key:'supervisor_employee_id',label:'Supervisor',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'supervisor_assignment_id',label:'Supervisor assignment name',type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id,tooltip:'Auto-filled from selected supervisor assignment ID',readOnly:true},
    ]}
    extraForm={({ form, setForm }) => <SupervisorAutoFill form={form} setForm={setForm}/>}
  />;
}