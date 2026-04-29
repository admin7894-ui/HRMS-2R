
import React from 'react';
import GenericModule from '../../GenericModule';
export default function DepartmentsPage() {
  return <GenericModule title="Departments" endpoint="departments"
    filterCols={[{key:'Department_Name',label:'Department name'},{key:'active_flag',label:'Status'}]}
    columns={[{key:'Department_Name',label:'Department name'}]}
    fields={[{key:'Department_Name',label:'Department name',required:true,type:'alpha',minLen:5,maxLen:20,tooltip:'Name of the department (alphabets only)'}]}
  />;
}