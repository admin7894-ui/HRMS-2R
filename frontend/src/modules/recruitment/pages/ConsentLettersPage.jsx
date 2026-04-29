
import React from 'react';
import GenericModule from '../../GenericModule';
// Dropdowns show names not IDs; Position + Applicant removed from form & table per req
export default function ConsentLettersPage() {
  return <GenericModule title="Consent letters" endpoint="consent-letters"
    columns={[
      {key:'HRMS_Application_ID',label:'Application',render:(_,r)=>r._applicationName||r.HRMS_Application_ID||'—'},
      {key:'Consent_Letter_Signed',label:'Signed',type:'yesno'},
    ]}
    fields={[
      {key:'HRMS_Interview_ID',label:'Interview',required:true,type:'lov',lovEndpoint:'interviews',labelFn:o=>o._displayId||o.id,tooltip:'Shows interview reference name'},
      {key:'HRMS_Application_ID',label:'Application',required:true,type:'lov',lovEndpoint:'applications',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_Requisition_ID',label:'Requisition',required:true,type:'lov',lovEndpoint:'requisitions',labelFn:o=>o._displayId||o.id,tooltip:'Shows requisition reference'},
      {key:'HRMS_Template_Assignment_ID',label:'Template assignment',required:true,type:'lov',lovEndpoint:'template-assignments',labelFn:o=>o._displayId||o.id},
      {key:'Consent_Letter_Signed',label:'Consent signed',required:true,type:'select',options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}]},
    ]}
  />;
}