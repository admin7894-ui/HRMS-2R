
import React from 'react';
import GenericModule from '../../GenericModule';
// Status Code auto-generates from Status Name
const USER_STATUS = ['Working','On Probation','On Suspension','On Leave','Separated','Separation In Progress','Contract Employee','Employed'].map(v=>({v:v.toUpperCase().replace(/ /g,'_'),l:v}));
const SYS_STATUS = ['Active','Probation','Suspended','On Leave','Terminated','Resigned','Contract'].map(v=>({v:v.toUpperCase(),l:v}));
export default function AssignmentStatusesPage() {
  return <GenericModule title="Assignment statuses" endpoint="assignment-statuses"
    columns={[{key:'Status_Code',label:'Code'},{key:'Status_Name',label:'Status name'},{key:'User_Status',label:'User status'}]}
    fields={[
      {key:'Status_Name',label:'Status name',required:true,maxLen:25,type:'alpha',generatesCode:true,codeKey:'Status_Code',tooltip:'Alphabets only. Code auto-generates.'},
      {key:'Status_Code',label:'Status code',required:false,type:'code',tooltip:'Auto-generated from status name'},
      {key:'User_Status',label:'User status',required:true,type:'select',options:USER_STATUS},
      {key:'System_Status',label:'System status',required:true,type:'select',options:SYS_STATUS},
    ]}
  />;
}