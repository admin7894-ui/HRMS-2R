
import React from 'react';
import GenericModule from '../../GenericModule';
export default function SalaryRangesPage() {
  return <GenericModule title="Salary ranges" endpoint="salary-ranges"
    columns={[{key:'Minimum_Salary',label:'Min salary',type:'currency'},{key:'Maximum_Salary',label:'Max salary',type:'currency'},{key:'Currency_Code',label:'Currency'}]}
    fields={[
      {key:'Minimum_Salary',label:'Minimum salary',required:true,numeric:true,min:0},
      {key:'Maximum_Salary',label:'Maximum salary',required:true,numeric:true,min:0},
      {key:'Currency_Code',label:'Currency code',required:true},
    ]}
  />;
}