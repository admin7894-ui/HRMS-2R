import React from 'react';
import GenericModule from '../../GenericModule';
// Assignment ID field REMOVED per requirement
export default function AdvancePaymentsPage() {
  return <GenericModule title="Advance payments" endpoint="advance-payments"
    filterCols={[{key:'approval_status',label:'Approval'},{key:'advance_status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee name',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
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
      {key:'recovery_type',label:'Recovery type',type:'select',options:[{v:'LUMP_SUM',l:'Lump sum'},{v:'INSTALLMENT',l:'Installment'}]},
      {key:'installment_amount',label:'Installment amount',numeric:true,min:0},
      {key:'total_installments',label:'Total installments',numeric:true,min:1},
      {key:'recovered_amount',label:'Recovered amount',numeric:true,min:0},
      {key:'remaining_balance',label:'Remaining balance',numeric:true,min:0},
      {key:'approval_status',label:'Approval status',type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'}]},
      {key:'approved_by',label:'Approved by',type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'advance_status',label:'Advance status',type:'select',options:[{v:'ACTIVE',l:'Active'},{v:'CLOSED',l:'Closed'}]},
    ]}
  />;
}
