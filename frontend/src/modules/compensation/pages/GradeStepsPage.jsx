
import React from 'react';
import GenericModule from '../../GenericModule';
const seq = Array.from({length:10},(_,i)=>({v:i+1,l:String(i+1)}));
export default function GradeStepsPage() {
  return <GenericModule title="Grade steps" endpoint="grade-steps"
    columns={[
      {key:'HRMS_Grade_ID',label:'Grade',render:(_,r)=>{const name=r._gradeName;return name||r.HRMS_Grade_ID||'—';}},
      {key:'Step_Number',label:'Step no.'},
      {key:'Step_Name',label:'Step name'},
      {key:'Step_Amount',label:'Amount',render:(v)=>v!=null&&!isNaN(parseFloat(v))?'₹'+Number(parseFloat(v)).toLocaleString('en-IN'):'—'},
    ]}
    fields={[
      {key:'HRMS_Grade_ID',label:'Grade',required:true,type:'lov',lovEndpoint:'grades',labelFn:o=>o.Grade_Name,tooltip:'Select grade for this step'},
      {key:'Step_Number',label:'Step number (1–10)',required:true,type:'select',options:seq},
      {key:'Step_Name',label:'Step name',type:'alpha',maxLen:20},
      {
        key:'Step_Amount',label:'Step amount',required:true,
        type:'lov',
        lovEndpoint:'salary-amounts',
        valueKey:'Salary_Amount',
        labelFn: o => '₹' + Number(o.Salary_Amount).toLocaleString('en-IN') + ' ' + (o.Currency_Code || 'INR'),
        tooltip:'Select the salary amount for this step',
      },
    ]}
  />;
}