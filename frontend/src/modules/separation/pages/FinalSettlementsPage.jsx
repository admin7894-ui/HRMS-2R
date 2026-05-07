import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';

function FinalSettlementAutoFill({ form, setForm, api }) {
  const prevSepId = useRef(null);

  useEffect(() => {
    const sid = form.HRMS_separation_id;
    if (!sid) {
      if (prevSepId.current !== null) {
        prevSepId.current = null;
        setForm(p => ({ ...p, HRMS_employee_id: '', HRMS_assignment_id: '' }));
      }
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

  useEffect(() => {
    const pendingSalary = parseFloat(form.pending_salary) || 0;
    const leaveEncashmentAmount = parseFloat(form.leave_encashment_amount) || 0;
    const gratuityAmount = parseFloat(form.gratuity_amount) || 0;
    const bonusDue = parseFloat(form.bonus_due) || 0;

    const totalEarnings = pendingSalary + leaveEncashmentAmount + gratuityAmount + bonusDue;

    const recoveryName = parseFloat(form.recovery_name) || 0;
    const recoveryOther = parseFloat(form.recovery_other) || 0;

    const totalDeductions = recoveryName + recoveryOther;
    const netSettlement = totalEarnings - totalDeductions;

    if (
      parseFloat(form.total_earnings || 0) !== totalEarnings ||
      parseFloat(form.total_deductions || 0) !== totalDeductions ||
      parseFloat(form.net_settlement || 0) !== netSettlement
    ) {
      setForm(p => ({
        ...p,
        total_earnings: totalEarnings,
        total_deductions: totalDeductions,
        net_settlement: netSettlement,
      }));
    }
  }, [
    form.pending_salary,
    form.leave_encashment_amount,
    form.gratuity_amount,
    form.bonus_due,
    form.recovery_name,
    form.recovery_other,
    form.total_earnings,
    form.total_deductions,
    form.net_settlement,
    setForm
  ]);

  const net = parseFloat(form.net_settlement || 0);
  if (net < 0) {
    return (
      <div className="col-span-full mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
        Warning: Net Settlement is negative. Total deductions exceed total earnings.
      </div>
    );
  }

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
      {key:'total_earnings',label:'Total earnings',numeric:true,min:0,readOnly:true,tooltip:'Auto-calculated: Pending Salary + Leave Encashment Amount + Gratuity Amount + Bonus Due'},
      {key:'recovery_name',label:'Recovery (named)',numeric:true,min:0},
      {key:'recovery_other',label:'Other recovery',numeric:true,min:0},
      {key:'total_deductions',label:'Total deductions',numeric:true,min:0,readOnly:true,tooltip:'Auto-calculated: Recovery Named + Other Recovery'},
      {key:'net_settlement',label:'Net settlement',numeric:true,readOnly:true,tooltip:'Auto-calculated: Total Earnings - Total Deductions'},
      {key:'settlement_status',label:'Status',type:'select',options:[{v:'DRAFT',l:'Draft'},{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'PAID',l:'Paid'}]},
    ]}
    extraForm={({ form, setForm, api }) => <FinalSettlementAutoFill form={form} setForm={setForm} api={api} />}
  />;
}
