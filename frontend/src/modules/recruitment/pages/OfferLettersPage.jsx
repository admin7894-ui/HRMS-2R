
import React from 'react';
import GenericModule from '../../GenericModule';
// Salary Offered not NaN fix; Signed shows Yes/No; All dropdowns show names; Position/Grade/Joining etc. fields
export default function OfferLettersPage() {
  return <GenericModule title="Offer letters" endpoint="offer-letters"
    columns={[
      {key:'HRMS_Application_ID',label:'Application',render:(_,r)=>r._applicationName||r.HRMS_Application_ID||'—'},
      {key:'Offered_Salary',label:'Salary offered',render:(v)=>v!=null&&!isNaN(parseFloat(v))?'₹'+Number(parseFloat(v)).toLocaleString('en-IN'):'—'},
      {key:'Joining_Date',label:'Joining date',type:'date'},
      {key:'Offer_Letter_Signed',label:'Signed',type:'yesno'},
    ]}
    fields={[
      {key:'HRMS_Application_ID',label:'Application',required:true,type:'lov',lovEndpoint:'applications',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,section:'References'},
      {key:'HRMS_Applicant_ID',label:'Applicant',required:true,type:'lov',lovEndpoint:'applicants',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,section:'References'},
      {key:'HRMS_Requisition_ID',label:'Requisition',required:true,type:'lov',lovEndpoint:'requisitions',labelFn:o=>o._displayId||o.id,section:'References'},
      {key:'HRMS_Position_ID',label:'Position',required:true,type:'lov',lovEndpoint:'positions',labelFn:o=>o.Position_Name,section:'References'},
      {key:'HRMS_Consent_Letter_ID',label:'Consent letter',required:true,type:'lov',lovEndpoint:'consent-letters',labelFn:o=>o._displayId||o.id,section:'References'},
      {key:'HRMS_Template_Assignment_ID',label:'Template assignment',required:true,type:'lov',lovEndpoint:'template-assignments',labelFn:o=>o._displayId||o.id,section:'References'},
      {key:'HRMS_Grade_ID',label:'Grade',required:true,type:'lov',lovEndpoint:'grades',labelFn:o=>o.Grade_Name,section:'Compensation'},
      {key:'Offered_Salary',label:'Salary offered',required:true,type:'lov',lovEndpoint:'salary-amounts',valueKey:'Salary_Amount',labelFn:o=>o.Salary_Amount!=null&&!isNaN(parseFloat(o.Salary_Amount))?'₹'+Number(parseFloat(o.Salary_Amount)).toLocaleString('en-IN')+' '+o.Currency_Code:'—',section:'Compensation'},
      {key:'Joining_Date',label:'Joining date',required:true,type:'date',section:'Dates'},
      {key:'Offer_Date',label:'Offered letter date',required:true,type:'date',section:'Dates'},
      {key:'Offer_Expiry_Date',label:'Offer expiry date',required:true,type:'date',section:'Dates'},
      {key:'Duration_Type',label:'Duration type',type:'select',options:[{v:'PERMANENT',l:'Permanent'},{v:'CONTRACT',l:'Contract'},{v:'TEMPORARY',l:'Temporary'},{v:'INTERN',l:'Internship'}],section:'Details'},
      {key:'Offer_Letter_Signed',label:'Offer letter signed',type:'select',options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}],section:'Details'},
    ]}
  />;
}