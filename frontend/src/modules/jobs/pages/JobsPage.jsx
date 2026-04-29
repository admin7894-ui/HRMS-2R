
import React from 'react';
import GenericModule from '../../GenericModule';
export default function JobsPage() {
  return <GenericModule title="Jobs" endpoint="jobs"
    filterCols={[{key:'Job_Name',label:'Job name'}]}
    columns={[{key:'Job_Code',label:'Code'},{key:'Job_Name',label:'Job name'}]}
    fields={[
      {key:'Job_Name',label:'Job name',required:true,minLen:5,maxLen:20,generatesCode:true,codeKey:'Job_Code',tooltip:'Name auto-generates the job code'},
      {key:'Job_Code',label:'Job code',required:true,type:'code'},
      {key:'Description',label:'Description',type:'textarea',maxLen:200},
    ]}
  />;
}