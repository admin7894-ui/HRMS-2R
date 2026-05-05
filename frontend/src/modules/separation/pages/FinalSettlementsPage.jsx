import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';

function FinalSettlementAutoFill({ form, setForm, api }) {
  const prevSepId = useRef(null);

  useEffect(() => {
    const sid = form.HRMS_separation_id;
    if (!sid) {
      prevSepId.current = null;
      setForm(p => ({ ...p, HRMS_employee_id: '', HRMS_assignment_id: '' }));
      return;
    }
    if (sid === prevSepId.current) return;
    prevSepId.current = sid;

    api.get(`/separations/${sid}`).then(async (res) => {
      const sep = res?.data || {};
      const employeeId = sep.HRMS_employee_id || '';
      let assignmentId = sep.HRMS_assignment_id || '';

      if (!assignmentId && employeeId) {
        try {
          const asnList = await api.get(`/employees/${employeeId}/assignments`);
          assignmentId = asnList?.data?.[0]?.id || '';
        } catch {}
      }

      setForm(p => ({
        ...p,
        HRMS_employee_id: employeeId,
        HRMS_assignment_id: assignmentId,
      }));
    }).catch(() => {});
  }, [form.HRMS_separation_id, setForm, api]);

  return null;
}

export default function FinalSettlementsPage() {
  return <GenericModule title="Final settlements" endpoint="final-settlements"
    filterCols={[{key:'settlement_status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'—'},
      {key:'total_earnings',label:'Total earnings',type:'currency'},
      {key:'total_deductions',label:'Total deductions',type:'currency'},
      {key:'net_settlement',label:'Net settlement',type:'currency'},
      {key:'settlement_status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_separation_id',label:'Separation',required:true,type:'lov',lovEndpoint:'separations',labelFn:o=>`${o._displayId||o.id} – ${o.Employee_Name || o._empName || '—'}`},
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_assignment_id',label:'Assignment',type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id,readOnly:true,tooltip:'Auto-filled from selected separation employee assignment'},
      {key:'pending_salary',label:'Pending salary',numeric:true,min:0},
      {key:'leave_encashment_days',label:'Leave encashment days',numeric:true,min:0},
      {key:'leave_encashment_amount',label:'Leave encashment amount',numeric:true,min:0},
      {key:'gratuity_amount',label:'Gratuity amount',numeric:true,min:0},
      {key:'bonus_due',label:'Bonus due',numeric:true,min:0},
      {key:'total_earnings',label:'Total earnings',numeric:true,min:0},
      {key:'recovery_name',label:'Recovery (named)',numeric:true,min:0},
      {key:'recovery_other',label:'Other recovery',numeric:true,min:0},
      {key:'total_deductions',label:'Total deductions',numeric:true,min:0},
      {key:'net_settlement',label:'Net settlement',numeric:true},
      {key:'settlement_status',label:'Status',type:'select',options:[{v:'DRAFT',l:'Draft'},{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'PAID',l:'Paid'}]},
    ]}
    extraForm={({ form, setForm, api }) => <FinalSettlementAutoFill form={form} setForm={setForm} api={api} />}
  />;
}
