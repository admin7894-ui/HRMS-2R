import React from 'react';
import GenericModule from '../../GenericModule';
// Fully system-maintained — read-only UI
export default function LeaveBalancesPage() {
  return <GenericModule title="Leave balances" endpoint="leave-balances"
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'HRMS_absence_type_id',label:'Absence type'},
      {key:'entitlement',label:'Entitlement'},
      {key:'used',label:'Used'},
      {key:'balance',label:'Balance'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_absence_type_id',label:'Absence type',required:true,type:'lov',lovEndpoint:'absence-types',labelFn:o=>o.absence_name},
      {key:'entitlement',label:'Entitlement days',type:'readonly',help:'Auto-fetched from absence type'},
      {key:'used',label:'Used days',type:'readonly',help:'Auto-calculated from approved absences'},
      {key:'balance',label:'Balance days',type:'readonly',help:'Entitlement − Used'},
    ]}
  />;
}
