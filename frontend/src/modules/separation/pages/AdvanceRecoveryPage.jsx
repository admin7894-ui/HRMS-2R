import React from 'react';
import GenericModule from '../../GenericModule';
export default function AdvanceRecoveryPage() {
  return <GenericModule title="Advance recovery schedules" endpoint="advance-recovery-schedules"
    filterCols={[{key:'payment_status',label:'Status'}]}
    columns={[
      {key:'HRMS_advance_id',label:'Advance / employee',render:(_,r)=>r.Advance_Display||r._advanceLabel||r.Employee_Name||r.HRMS_advance_id||'—'},
      {key:'installment_no',label:'#'},
      {key:'due_date',label:'Due date',type:'date'},
      {key:'installment_amount',label:'Amount',type:'currency'},
      {key:'payment_status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_advance_id',label:'Advance',required:true,type:'lov',lovEndpoint:'advance-payments',
        labelFn:o=>`${o._displayId||o.id} — ₹${Number(parseFloat(o.advance_amount)||0).toLocaleString('en-IN')}`},
      {key:'installment_no',label:'Installment no.',required:true,numeric:true,min:1},
      {key:'due_date',label:'Due date',type:'date'},
      {key:'installment_amount',label:'Installment amount',numeric:true,min:0},
      {key:'paid_amount',label:'Paid amount',numeric:true,min:0},
      {key:'balance_amount',label:'Balance amount',numeric:true,min:0},
      {key:'payment_date',label:'Payment date',type:'date'},
      {key:'payment_status',label:'Payment status',type:'select',options:[{v:'PENDING',l:'Pending'},{v:'PAID',l:'Paid'},{v:'PARTIAL',l:'Partial'},{v:'OVERDUE',l:'Overdue'}]},
    ]}
  />;
}
