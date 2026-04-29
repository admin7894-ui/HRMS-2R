
import React from 'react';
import GenericModule from '../../GenericModule';
// Applicant field REMOVED; Application is mandatory
export default function TemplateAssignmentsPage() {
  return <GenericModule title="Template assignments" endpoint="template-assignments"
    columns={[{key:'HRMS_Application_ID',label:'Application',render:(_,r)=>r._applicantName||r.HRMS_Application_ID||'—'},{key:'HRMS_Template_Master_ID',label:'Template',render:(_,r)=>r._templateName||r.HRMS_Template_Master_ID||'—'},{key:'Assigned_Date',label:'Date',type:'date'}]}
    fields={[
      {key:'HRMS_Application_ID',label:'Application',required:true,type:'lov',lovEndpoint:'applications',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_Template_Master_ID',label:'Template',required:true,type:'lov',lovEndpoint:'template-masters',labelFn:o=>o.Template_Name},
      {key:'Assigned_Date',label:'Assigned date',required:true,type:'date'},
    ]}
  />;
}