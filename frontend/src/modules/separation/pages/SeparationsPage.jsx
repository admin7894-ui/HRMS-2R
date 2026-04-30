import React from 'react';
import GenericModule from '../../GenericModule';
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
      {key:'HRMS_assignment_id',label:'Assignment',type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id},
      {key:'separation_type',label:'Separation type',type:'select',options:[{v:'RESIGNATION',l:'Resignation'},{v:'TERMINATION',l:'Termination'},{v:'RETIREMENT',l:'Retirement'},{v:'LAYOFF',l:'Layoff'},{v:'ABSCONDING',l:'Absconding'},{v:'CONTRACT_END',l:'Contract end'},{v:'TRANSFER',l:'Transfer'}]},
      {key:'reason',label:'Reason',type:'textarea',maxLen:200},
      {key:'resignation_date',label:'Resignation date',type:'date'},
      {key:'notice_period_days',label:'Notice period (days)',numeric:true,min:0},
      {key:'last_working_date',label:'Last working date',type:'date'},
      {key:'separation_status',label:'Status',type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'},{v:'IN_PROGRESS',l:'In progress'},{v:'COMPLETED',l:'Completed'}]},
      {key:'approved_by_employee_id',label:'Approved by',type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
    ]}
  />;
}
