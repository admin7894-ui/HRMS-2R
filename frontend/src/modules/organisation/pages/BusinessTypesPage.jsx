
import React from 'react';
import GenericModule from '../../GenericModule';
export default function BusinessTypesPage() {
  return <GenericModule title="Business types" endpoint="business-types"
    filterCols={[{key:'Business_Type_Name',label:'Type name'}]}
    columns={[{key:'Business_Type_Name',label:'Name'},{key:'Business_Type_Code',label:'Code'}]}
    fields={[
      {key:'Business_Type_Name',label:'Business type name',required:true,minLen:5,maxLen:20,generatesCode:true,codeKey:'Business_Type_Code',tooltip:'Name auto-generates the code'},
      {key:'Business_Type_Code',label:'Business type code',type:'code'},
    ]}
  />;
}