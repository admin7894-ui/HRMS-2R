import React, { useEffect } from 'react';
import GenericModule from '../../GenericModule';
// Auto-fetch assignment from employee; work schedule from assignment;
// Hours worked = clockOut - clockIn (overnight-safe); Rate multiplier & OT amount REMOVED from form
// Approved by = supervisor LOV auto-populated from employee's supervisor
export default function TimeCardsPage() {
  return <GenericModule title="Time cards" endpoint="time-cards"
    filterCols={[{key:'attendance_status',label:'Attendance'},{key:'approval_status',label:'Approval'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'work_date',label:'Date',type:'date'},
      {key:'clock_in',label:'In'},
      {key:'clock_out',label:'Out'},
      {key:'hours_worked',label:'Hours'},
      {key:'attendance_status',label:'Attendance',type:'badge'},
      {key:'approval_status',label:'Approval status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_assignment_id',label:'Assignment',required:true,type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id,tooltip:'Auto-filters to selected employee only'},
      {key:'HRMS_work_schedule_id',label:'Work schedule',type:'readonly',help:'Auto-populated from assignment'},
      {key:'work_date',label:'Work date',required:true,type:'date',maxDate:new Date().toISOString().split('T')[0]},
      {key:'clock_in',label:'Clock in',required:true,type:'time',tooltip:'hh:mm format'},
      {key:'clock_out',label:'Clock out',required:true,type:'time',tooltip:'hh:mm format. Overnight shifts handled.'},
      {key:'hours_worked',label:'Hours worked',type:'readonly',help:'Auto-calculated (overnight-safe)'},
      {key:'attendance_status',label:'Attendance status',required:true,type:'select',options:[{v:'PRESENT',l:'Present'},{v:'ABSENT',l:'Absent'},{v:'HALF_DAY',l:'Half-day'},{v:'LEAVE',l:'On leave'},{v:'HOLIDAY',l:'Holiday'}]},
      {key:'approval_status',label:'Approval status',required:true,type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'}]},
      {key:'approved_by',label:'Approved by',type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,tooltip:'Auto-populated from employee supervisor. Can be overridden.'},
    ]}
  />;
}
