
import React from 'react';
import GenericModule from '../../GenericModule';
// Employee/Dept/Position show names not codes; Inventory Unit REMOVED
export default function AssignmentsPage() {
  return <GenericModule title="Assignments" endpoint="assignments"
    filterCols={[{key:'assignment_type',label:'Type'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'HRMS_department_id',label:'Department',render:(_,r)=>r._deptName||r.HRMS_department_id||'—'},
      {key:'HRMS_position_id',label:'Position',render:(_,r)=>r._posName||r.HRMS_position_id||'—'},
      {key:'assignment_type',label:'Type',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_department_id',label:'Department',required:true,type:'lov',lovEndpoint:'departments',labelFn:o=>o.Department_Name},
      {key:'HRMS_position_id',label:'Position',required:true,type:'lov',lovEndpoint:'positions',labelFn:o=>o.Position_Name},
      {key:'HRMS_grade_id',label:'Grade',required:true,type:'lov',lovEndpoint:'grades',labelFn:o=>o.Grade_Name},
      {key:'HRMS_work_schedule_id',label:'Work schedule',type:'lov',lovEndpoint:'work-schedules',labelFn:o=>o.Work_Schedule_Name},
      {key:'HRMS_status_type_id',label:'Status type',required:true,type:'lov',lovEndpoint:'assignment-statuses',labelFn:o=>o.Status_Name},
      {key:'assignment_type',label:'Assignment type',required:true,type:'select',options:[{v:'PERMANENT',l:'Permanent'},{v:'TEMPORARY',l:'Temporary'},{v:'TRANSFER',l:'Transfer'}]},
    ]}
  />;
}