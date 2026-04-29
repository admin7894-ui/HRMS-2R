
import React from 'react';
import GenericModule from '../../GenericModule';
export default function SecurityProfilesPage() {
  return <GenericModule title="Security profiles" endpoint="security-profiles"
    columns={[{key:'Profile_Code',label:'Code'},{key:'Company_ID',label:'Company'}]}
    fields={[
      {key:'Profile_Code',label:'Profile code',required:true},
      {key:'Company_ID',label:'Company',type:'lov',lovEndpoint:'companies',labelFn:o=>o.Company_Name},
    ]}
  />;
}