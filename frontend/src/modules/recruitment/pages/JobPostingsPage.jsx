
import React from 'react';
import GenericModule from '../../GenericModule';
const QUAL = [{v:'B.A',l:'B.A'},{v:'B.Com',l:'B.Com'},{v:'B.Sc',l:'B.Sc'},{v:'B.Tech / B.E',l:'B.Tech / B.E'},{v:'BBA',l:'BBA'},{v:'BCA',l:'BCA'},{v:'M.A',l:'M.A'},{v:'M.Com',l:'M.Com'},{v:'M.Sc',l:'M.Sc'},{v:'M.Tech / M.E',l:'M.Tech / M.E'},{v:'MBA',l:'MBA'},{v:'MCA',l:'MCA'},{v:'PhD',l:'PhD'},{v:'Diploma (Engineering)',l:'Diploma (Engineering)'},{v:'Diploma (Management)',l:'Diploma (Management)'},{v:'Other',l:'Other'}];
const EXP = [{v:0,l:'0'},{v:1,l:'1'},{v:2,l:'2'},{v:3,l:'3'},{v:4,l:'4'},{v:5,l:'5'},{v:6,l:'6'},{v:7,l:'7'},{v:8,l:'8'},{v:9,l:'9'},{v:10,l:'10'}];
export default function JobPostingsPage() {
  return <GenericModule title="Job postings" endpoint="job-postings"
    filterCols={[{key:'Posting_Status',label:'Status'}]}
    columns={[{key:'Posting_Title',label:'Title'},{key:'Posting_Status',label:'Status',type:'badge'},{key:'Posting_Date',label:'Posted',type:'date'},{key:'Closing_Date',label:'Closing',type:'date'}]}
    fields={[
      {key:'HRMS_Requisition_ID',label:'Requisition',required:true,type:'lov',lovEndpoint:'requisitions',labelFn:o=>o._displayId||o.id},
      {key:'Posting_Title',label:'Posting title',required:true,minLen:5,maxLen:50},
      {key:'Posting_Description',label:'Description',type:'textarea',maxLen:200},
      {key:'Qualification_Required',label:'Qualification required',required:true,type:'select',options:QUAL},
      {key:'Experience_Years_Min',label:'Min experience (yrs)',required:true,type:'select',options:EXP},
      {key:'Experience_Years_Max',label:'Max experience (yrs)',required:true,type:'select',options:EXP},
      {key:'Salary_Range_Min',label:'Min salary',required:true,type:'lov',lovEndpoint:'salary-amounts',labelFn:o=>o.Salary_Amount!=null?'₹'+Number(parseFloat(o.Salary_Amount)).toLocaleString('en-IN')+' '+o.Currency_Code:'—'},
      {key:'Salary_Range_Max',label:'Max salary',required:true,type:'lov',lovEndpoint:'salary-amounts',labelFn:o=>o.Salary_Amount!=null?'₹'+Number(parseFloat(o.Salary_Amount)).toLocaleString('en-IN')+' '+o.Currency_Code:'—'},
      {key:'Posting_Date',label:'Posting date',required:true,type:'date'},
      {key:'Closing_Date',label:'Closing date',required:true,type:'date'},
      {key:'Posting_Status',label:'Status',required:true,type:'select',options:[{v:'OPEN',l:'Open'},{v:'CLOSED',l:'Closed'}]},
    ]}
  />;
}