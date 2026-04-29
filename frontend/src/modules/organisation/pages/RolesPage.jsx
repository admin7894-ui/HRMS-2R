
import React from 'react';
import GenericModule from '../../GenericModule';
export default function RolesPage() {
  return <GenericModule title="Roles" endpoint="roles"
    filterCols={[{key:'Role_Name',label:'Role name'}]}
    columns={[{key:'Role_Name',label:'Role name'}]}
    fields={[{key:'Role_Name',label:'Role name',required:true,type:'alpha',minLen:5,maxLen:20}]}
  />;
}