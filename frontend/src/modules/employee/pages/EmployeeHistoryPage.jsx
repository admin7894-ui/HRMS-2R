
import React from 'react';
import GenericModule from '../../GenericModule';
// Fixed Change type LOV with specific values
const CHANGE_TYPES = [{v:'PROMOTION',l:'Promotion'},{v:'SALARY_REVISION',l:'Salary revision'},{v:'DEPARTMENT_TRANSFER',l:'Department transfer'},{v:'POSITION_CHANGE',l:'Position change'},{v:'GRADE_CHANGE',l:'Grade change'},{v:'STATUS_CHANGE',l:'Status change'},{v:'HIRE',l:'Hire (new joining)'},{v:'TERMINATION',l:'Termination'},{v:'REPORTING_MANAGER_CHANGE',l:'Reporting manager change'}];
export default function EmployeeHistoryPage() {
  return <GenericModule title="Employee history" endpoint="employee-histories"
    columns={[{key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},{key:'change_type',label:'Change type',type:'badge'},{key:'field_changed',label:'Field'},{key:'old_value',label:'Old value'},{key:'new_value',label:'New value'}]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_assignment_id',label:'Assignment',type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id},
      {key:'change_type',label:'Change type',type:'select',options:CHANGE_TYPES,tooltip:'Select type of change from predefined values'},
      {key:'field_changed',label:'Field changed'},
      {key:'old_value',label:'Old value'},
      {key:'new_value',label:'New value'},
      {key:'change_date',label:'Change date',type:'date'},
      {key:'changed_by',label:'Changed by'},
    ]}
  />;
}