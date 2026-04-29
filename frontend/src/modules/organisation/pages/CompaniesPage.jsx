
import React from 'react';
import GenericModule from '../../GenericModule';
export default function CompaniesPage() {
  return <GenericModule title="Companies" endpoint="companies"
    filterCols={[{key:'Company_Name',label:'Company'}]}
    columns={[{key:'Company_Name',label:'Company name'},{key:'PAN',label:'PAN'},{key:'Authorized_Person',label:'Authorized person'}]}
    fields={[
      {key:'Company_Name',label:'Company name',required:true,minLen:5,maxLen:50,section:'Basic info'},
      {key:'Authorized_Person',label:'Authorized person',section:'Contact'},
      {key:'Website_URL',label:'Website URL',section:'Contact'},
      {key:'Incorporation_Date',label:'Incorporation date',type:'date',section:'Contact'},
      {key:'PAN',label:'PAN number',section:'Statutory'},
      {key:'GST',label:'GST number',section:'Statutory'},
      {key:'TAN',label:'TAN number',section:'Statutory'},
    ]}
  />;
}