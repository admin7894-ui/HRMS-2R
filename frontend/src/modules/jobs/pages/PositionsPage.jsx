
import React from 'react';
import GenericModule from '../../GenericModule';
// Headcount: searchable LOV 0-100 with typeahead
const HEADCOUNT = Array.from({length:101},(_,i)=>({value:i,label:String(i)}));
export default function PositionsPage() {
  return <GenericModule title="Positions" endpoint="positions"
    filterCols={[{key:'Position_Name',label:'Position'}]}
    columns={[
      {key:'Position_Name',label:'Position name'},
      {key:'HRMS_Job_ID',label:'Job',render:(_,r)=>r._jobName||r.HRMS_Job_ID||'—'},
      {key:'HRMS_Grade_ID',label:'Grade',render:(_,r)=>r._gradeName||r.HRMS_Grade_ID||'—'},
      {key:'Headcount',label:'Headcount'},
    ]}
    fields={[
      {key:'Position_Name',label:'Position name',required:true,minLen:5,maxLen:50},
      {key:'HRMS_Job_ID',label:'Job',required:true,type:'lov',lovEndpoint:'jobs',labelFn:o=>o.Job_Name,tooltip:'Select the job for this position'},
      {key:'HRMS_Grade_ID',label:'Grade',required:true,type:'lov',lovEndpoint:'grades',labelFn:o=>o.Grade_Name},
      {key:'Headcount',label:'Headcount (0–100)',required:true,type:'searchable-lov',options:HEADCOUNT,tooltip:'Searchable: type to filter 0–100'},
    ]}
  />;
}