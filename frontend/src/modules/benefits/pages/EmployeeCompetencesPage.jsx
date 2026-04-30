import React from 'react';
import GenericModule from '../../GenericModule';
export default function EmployeeCompetencesPage() {
  return <GenericModule title="Employee competences" endpoint="employee-competences"
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'—'},
      {key:'HRMS_competence_id',label:'Competence',render:(_,r)=>r.Competence_Name||r._compName||r.HRMS_competence_id||'—'},
      {key:'competence_type',label:'Type',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_competence_id',label:'Competence',required:true,type:'lov',lovEndpoint:'competences',labelFn:o=>o.competence_name},
      {key:'competence_type',label:'Type',type:'select',options:[{v:'TECHNICAL',l:'Technical'},{v:'BEHAVIORAL',l:'Behavioral'},{v:'LEADERSHIP',l:'Leadership'}]},
      {key:'description',label:'Description',type:'textarea',maxLen:200},
    ]}
  />;
}
