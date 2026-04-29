
import React from 'react';
import GenericModule from '../../GenericModule';
export default function DesignationsPage() {
  return <GenericModule title="Designations" endpoint="designations"
    filterCols={[{key:'Designation_Name',label:'Designation'}]}
    columns={[{key:'Designation_Name',label:'Designation name'}]}
    fields={[{key:'Designation_Name',label:'Designation name',required:true,type:'alpha',minLen:5,maxLen:20}]}
  />;
}