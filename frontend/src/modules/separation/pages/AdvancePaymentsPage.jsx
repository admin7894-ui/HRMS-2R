import React, { useEffect } from 'react';
import GenericModule from '../../GenericModule';

function AdvancePaymentLogic({ form, setForm, api, editing }) {
  // Auto-calculation for installments
  useEffect(() => {
    if (form.recovery_type === 'LUMP_SUM') {
      const adv = parseFloat(form.advance_amount) || 0;
      if (form.total_installments !== 1 || parseFloat(form.installment_amount) !== adv) {
        setForm(p => ({ ...p, total_installments: 1, installment_amount: adv }));
      }
    } else if (form.recovery_type === 'INSTALLMENT') {
      const dur = parseFloat(form.recovery_duration) || 0;
      const unit = form.recovery_duration_unit;
      const adv = parseFloat(form.advance_amount) || 0;
      
      if (dur > 0 && unit && adv > 0) {
        const total = unit === 'YEARS' ? dur * 12 : dur;
        const amount = (adv / total).toFixed(2);
        if (parseFloat(form.total_installments) !== total || parseFloat(form.installment_amount) !== parseFloat(amount)) {
          setForm(p => ({ ...p, total_installments: total, installment_amount: amount }));
        }
      }
    }
  }, [form.recovery_type, form.recovery_duration, form.recovery_duration_unit, form.advance_amount, setForm]);

  useEffect(() => {
    if (editing) {
      // Fetch recovery schedules for this advance to calculate Recovered Amount
      api.get('/advance-recovery-schedules', { params: { HRMS_advance_id: editing.id, limit: 1000 } })
        .then(res => {
          const schedules = res.data || [];
          const recovered = schedules.reduce((acc, s) => acc + (parseFloat(s.paid_amount) || 0), 0);
          const advanceAmt = parseFloat(form.advance_amount) || 0;
          const remaining = Math.max(0, advanceAmt - recovered);
          
          let nextStatus = form.advance_status;
          // Auto-set Advance Status to Closed when Remaining Balance reaches 0
          if (remaining <= 0 && advanceAmt > 0 && form.advance_status !== 'CLOSED') {
            nextStatus = 'CLOSED';
          }

          if (
            parseFloat(form.recovered_amount || 0) !== recovered ||
            parseFloat(form.remaining_balance || 0) !== remaining ||
            form.advance_status !== nextStatus
          ) {
            setForm(p => ({
              ...p,
              recovered_amount: recovered,
              remaining_balance: remaining,
              advance_status: nextStatus
            }));
          }
        }).catch(() => {});
    }
  }, [editing?.id, form.advance_amount, form.advance_status, setForm, api]);

  return null;
}

export default function AdvancePaymentsPage() {
  const customValidate = (form) => {
    const errs = {};
    if (form.approved_date && form.disbursement_date) {
      // Disbursement Date cannot be before Approved Date
      if (new Date(form.disbursement_date) < new Date(form.approved_date)) {
        errs.disbursement_date = 'Disbursement date cannot be before Approved date';
      }
    }
    return errs;
  };

  return <GenericModule title="Advance payments" endpoint="advance-payments"
    filterCols={[{key:'approval_status',label:'Approval'},{key:'advance_status',label:'Status'}]}
    customValidate={customValidate}
    columns={[
      {key:'HRMS_employee_id',label:'Employee name',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'—'},
      {key:'advance_amount',label:'Amount',type:'currency'},
      {key:'advance_reason',label:'Reason'},
      {key:'approval_status',label:'Approval status',type:'badge'},
      {key:'advance_status',label:'Advance status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'advance_amount',label:'Advance amount',required:true,numeric:true,min:1},
      {key:'advance_reason',label:'Reason',required:true,type:'textarea',minLen:3,maxLen:200},
      {key:'request_date',label:'Request date',type:'date'},
      {key:'approved_date',label:'Approved date',type:'date'},
      {key:'disbursement_date',label:'Disbursement date',type:'date'},
      {key:'recovery_type',label:'Recovery type',required:true,type:'select',options:[{v:'LUMP_SUM',l:'Lump sum'},{v:'INSTALLMENT',l:'Installment'}]},
      {key:'recovery_duration',label:'Recovery duration',required:true,numeric:true,min:1,hidden:f=>f.recovery_type!=='INSTALLMENT'},
      {key:'recovery_duration_unit',label:'Duration unit',required:true,type:'select',options:[{v:'MONTHS',l:'Months'},{v:'YEARS',l:'Years'}],hidden:f=>f.recovery_type!=='INSTALLMENT'},
      {key:'installment_amount',label:'Installment amount',required:true,numeric:true,readOnly:true,hidden:f=>f.recovery_type==='LUMP_SUM',help:'Auto-calculated based on duration'},
      {key:'total_installments',label:'Total installments',required:true,numeric:true,readOnly:true,hidden:f=>f.recovery_type==='LUMP_SUM',help:'Auto-calculated based on duration'},
      {key:'recovered_amount',label:'Recovered amount',numeric:true,min:0,readOnly:true,hidden:f=>!f.id},
      {key:'remaining_balance',label:'Remaining balance',numeric:true,min:0,readOnly:true,hidden:f=>!f.id},
      {key:'approval_status',label:'Approval status',type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'}]},
      {key:'approved_by',label:'Approved by',type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'advance_status',label:'Advance status',type:'select',options:[{v:'ACTIVE',l:'Active'},{v:'CLOSED',l:'Closed'}]},
    ]}
    extraForm={(props) => <AdvancePaymentLogic {...props} />}
  />;
}
