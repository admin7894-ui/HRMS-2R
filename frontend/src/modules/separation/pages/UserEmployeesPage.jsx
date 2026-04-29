import React from 'react';
import GenericModule from '../../GenericModule';
export default function UserEmployeesPage() {
  return <GenericModule title="User employees" endpoint="user-employees"
    columns={[
      {key:'Employee_ID',label:'Employee',render:(_,r)=>r._empName||r.Employee_ID||'—'},
      {key:'Assignment_ID',label:'Assignment'},
      {key:'Supervisor_ID',label:'Supervisor'},
    ]}
    fields={[
      {key:'Employee_ID',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Application_ID',label:'Application',type:'lov',lovEndpoint:'applications',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Applicant_ID',label:'Applicant',type:'lov',lovEndpoint:'applicants',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Template_Assignment_ID',label:'Template assignment',type:'lov',lovEndpoint:'template-assignments',labelFn:o=>o._displayId||o.id},
      {key:'Person_Bank_Account_ID',label:'Bank account',type:'lov',lovEndpoint:'bank-accounts',labelFn:o=>`${o.Bank_Name} — ${o.Account_Number}`},
      {key:'Consent_Letter_ID',label:'Consent letter',type:'lov',lovEndpoint:'consent-letters',labelFn:o=>o._displayId||o.id},
      {key:'Offer_Letter_ID',label:'Offer letter',type:'lov',lovEndpoint:'offer-letters',labelFn:o=>o._displayId||o.id},
      {key:'Assignment_ID',label:'Assignment',type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id},
      {key:'Supervisor_ID',label:'Supervisor',type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Leave_Balance_ID',label:'Leave balance',type:'lov',lovEndpoint:'leave-balances',labelFn:o=>o._displayId||o.id},
      {key:'Timecard_ID',label:'Time card',type:'lov',lovEndpoint:'time-cards',labelFn:o=>o._displayId||o.id},
    ]}
  />;
}
