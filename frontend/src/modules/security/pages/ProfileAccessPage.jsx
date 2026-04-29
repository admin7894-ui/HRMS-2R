
import React from 'react';
import GenericModule from '../../GenericModule';
export default function ProfileAccessPage() {
  return <GenericModule title="Profile access" endpoint="profile-accesses"
    columns={[{key:'Profile_ID',label:'Profile'},{key:'Scope_Type',label:'Scope',type:'badge'}]}
    fields={[
      {key:'Profile_ID',label:'Security profile',type:'lov',lovEndpoint:'security-profiles',labelFn:o=>o.Profile_Code},
      {key:'Scope_Type',label:'Scope type',type:'select',options:[{v:'ALL',l:'All'},{v:'SPECIFIC',l:'Specific'},{v:'RESTRICTED',l:'Restricted'}]},
    ]}
  />;
}