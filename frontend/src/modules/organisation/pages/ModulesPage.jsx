
import React from 'react';
import GenericModule from '../../GenericModule';
export default function ModulesPage() {
  return <GenericModule title="Modules" endpoint="modules"
    filterCols={[{key:'Module_Name',label:'Module'}]}
    columns={[{key:'Module_Name',label:'Module name'},{key:'Module_Code',label:'Code'}]}
    fields={[
      {key:'Module_Name',label:'Module name',required:true,minLen:5,maxLen:20,generatesCode:true,codeKey:'Module_Code'},
      {key:'Module_Code',label:'Module code',type:'code'},
    ]}
  />;
}