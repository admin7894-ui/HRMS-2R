
import React from 'react';
import GenericModule from '../../GenericModule';
export default function SalaryRangesPage() {
  return <GenericModule title="Salary ranges" endpoint="salary-ranges"
    columns={[{key:'Minimum_Salary',label:'Min salary',type:'currency'},{key:'Maximum_Salary',label:'Max salary',type:'currency'},{key:'Currency_Code',label:'Currency'}]}
    fields={[
      {key:'Minimum_Salary',label:'Minimum salary',required:true,numeric:true,min:0,max:999999.99,maxLength:9,step:0.01,pattern:/^\d{1,6}(\.\d{1,2})?$/,tooltip:'Max 6 digits with up to 2 decimal places (e.g. 999999.99)'},
      {key:'Maximum_Salary',label:'Maximum salary',required:true,numeric:true,min:0,max:999999.99,maxLength:9,step:0.01,pattern:/^\d{1,6}(\.\d{1,2})?$/,tooltip:'Max 6 digits with up to 2 decimal places (e.g. 999999.99)'},
      {key:'Currency_Code',label:'Currency code',required:true},
    ]}
  />;
}