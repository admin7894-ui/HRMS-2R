import React from 'react';
import GenericModule from '../../GenericModule';
// Fixed save — code auto BP001+; Coverage in Lakhs
export default function BenefitPlansPage() {
  return <GenericModule title="Benefit plans" endpoint="benefit-plans"
    filterCols={[{key:'benefit_plan_type',label:'Plan type'}]}
    columns={[{key:'benefit_plan_code',label:'Code'},{key:'benefit_plan_name',label:'Plan name'},{key:'benefit_plan_type',label:'Type',type:'badge'},{key:'coverage',label:'Coverage (lakhs)'}]}
    fields={[
      {key:'benefit_plan_name',label:'Benefit plan name',required:true,minLen:3,maxLen:50,tooltip:'Name of the benefit plan'},
      {key:'benefit_plan_code',label:'Benefit plan code',type:'readonly',help:'Auto-generated (BP001, BP002…)'},
      {key:'benefit_plan_type',label:'Plan type',type:'select',options:[{v:'HEALTH',l:'Health'},{v:'LIFE',l:'Life'},{v:'OTHER',l:'Other'}]},
      {key:'coverage',label:'Coverage (lakhs)',required:true,numeric:true,min:1,tooltip:'Amount in lakhs (₹)'},
      {key:'employer_contribution_percentage',label:'Employer contribution %',required:true,numeric:true,min:0,max:100},
    ]}
  />;
}
