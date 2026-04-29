
import React from 'react';
import GenericModule from '../../GenericModule';
const seq = Array.from({length:10},(_,i)=>({v:i+1,l:String(i+1)}));
const seq0 = Array.from({length:11},(_,i)=>({v:i,l:String(i)}));
export default function GradeLaddersPage() {
  return <GenericModule title="Grade ladders" endpoint="grade-ladders"
    columns={[{key:'Ladder_Name',label:'Name'},{key:'HRMS_From_Grade_ID',label:'From grade'},{key:'HRMS_To_Grade_ID',label:'To grade'},{key:'Sequence',label:'Seq'}]}
    fields={[
      {key:'Ladder_Name',label:'Ladder name',required:true,tooltip:'Name for this progression ladder'},
      {key:'HRMS_From_Grade_ID',label:'From grade',required:true,type:'lov',lovEndpoint:'grades',labelFn:o=>o.Grade_Name},
      {key:'HRMS_To_Grade_ID',label:'To grade',required:true,type:'lov',lovEndpoint:'grades',labelFn:o=>o.Grade_Name},
      {key:'Sequence',label:'Sequence (1–10)',required:true,type:'select',options:seq,tooltip:'Order of progression'},
      {key:'Min_Years_in_Grade',label:'Minimum years in grade',required:true,type:'select',options:seq0,tooltip:'Minimum years required before promotion'},
    ]}
  />;
}