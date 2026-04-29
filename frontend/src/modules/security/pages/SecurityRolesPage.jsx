
import React from 'react';
import GenericModule from '../../GenericModule';
export default function SecurityRolesPage() {
  return <GenericModule title="Security roles" endpoint="security-roles"
    columns={[{key:'USER_NAME',label:'Username'},{key:'ROLES_ID',label:'Role'}]}
    fields={[
      {key:'PROFILE_ACCESS_ID',label:'Profile access',type:'lov',lovEndpoint:'profile-accesses',labelFn:o=>o.id},
      {key:'DEPARTMENT_ID',label:'Department',type:'lov',lovEndpoint:'departments',labelFn:o=>o.Department_Name},
      {key:'ROLES_ID',label:'Role',type:'lov',lovEndpoint:'roles',labelFn:o=>o.Role_Name},
      {key:'DESIGNATION_ID',label:'Designation',type:'lov',lovEndpoint:'designations',labelFn:o=>o.Designation_Name},
      {key:'USER_NAME',label:'Username',required:true,type:'email'},
      {key:'PASSWORD',label:'Password'},
    ]}
  />;
}