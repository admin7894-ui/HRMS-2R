
import React from 'react';
import GenericModule from '../../GenericModule';
export default function SalaryAmountsPage() {
  return <GenericModule title="Salary amounts" endpoint="salary-amounts"
    filterCols={[{key:'Currency_Code',label:'Currency'}]}
    columns={[{key:'Salary_Amount',label:'Amount',type:'currency'},{key:'Currency_Code',label:'Currency'}]}
    fields={[
      {key:'Salary_Amount',label:'Salary amount',required:true,numeric:true,min:0,max:10000000,tooltip:'Maximum value: ₹1 Crore. Value 0 is allowed.'},
      {key:'Currency_Code',label:'Currency code',required:true,tooltip:'Auto-filled from company'},
    ]}
  />;
}