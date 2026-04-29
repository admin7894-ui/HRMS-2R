
import React from 'react';
import GenericModule from '../../GenericModule';
export default function BusinessGroupsPage() {
  return <GenericModule title="Business groups" endpoint="business-groups"
    filterCols={[{key:'BG_Name',label:'Group name'}]}
    columns={[{key:'BG_Name',label:'Group name'},{key:'Company_ID',label:'Company'}]}
    fields={[
      {key:'BG_Name',label:'Business group name',required:true,minLen:5,maxLen:20},
      {key:'Company_ID',label:'Company',type:'lov',lovEndpoint:'companies',labelFn:o=>o.Company_Name},
      {key:'Location_ID',label:'Location',type:'lov',lovEndpoint:'locations',labelFn:o=>`${o.City}, ${o.State}`},
    ]}
  />;
}