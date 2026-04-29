
import React from 'react';
import GenericModule from '../../GenericModule';
// Employee/Program show names not codes; Score whole number or 1 decimal
export default function EnrollmentsPage() {
  return <GenericModule title="Training enrollments" endpoint="enrollments"
    filterCols={[{key:'completion_status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee name',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'HRMS_program_id',label:'Training program',render:(_,r)=>r._programName||r.HRMS_program_id||'—'},
      {key:'completion_status',label:'Status',type:'badge'},
      {key:'score',label:'Score'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_program_id',label:'Training program',required:true,type:'lov',lovEndpoint:'programs',labelFn:o=>o.Program_Name},
      {key:'enrollment_date',label:'Enrollment date',required:true,type:'date'},
      {key:'completion_date',label:'Completion date',required:true,type:'date'},
      {key:'completion_status',label:'Status',required:true,type:'select',options:[{v:'ENROLLED',l:'Enrolled'},{v:'IN_PROGRESS',l:'In progress'},{v:'COMPLETED',l:'Completed'},{v:'FAILED',l:'Failed'}]},
      {key:'score',label:'Score (0–100)',required:true,numeric:true,min:0,max:100,tooltip:'Whole number or max 1 decimal place e.g. 89.5'},
      {key:'certificate_issued',label:'Certificate issued',required:true,type:'select',options:[{v:'true',l:'Yes'},{v:'false',l:'No'}]},
    ]}
  />;
}