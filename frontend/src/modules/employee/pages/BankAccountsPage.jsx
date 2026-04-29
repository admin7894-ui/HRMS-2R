
import React from 'react';
import GenericModule from '../../GenericModule';
const BANKS = [{v:'State Bank of India',l:'State Bank of India'},{v:'HDFC Bank',l:'HDFC Bank'},{v:'ICICI Bank',l:'ICICI Bank'},{v:'Axis Bank',l:'Axis Bank'},{v:'Punjab National Bank',l:'Punjab National Bank'},{v:'Canara Bank',l:'Canara Bank'},{v:'Bank of Baroda',l:'Bank of Baroda'},{v:'Union Bank',l:'Union Bank of India'},{v:'IndusInd Bank',l:'IndusInd Bank'},{v:'Kotak Mahindra Bank',l:'Kotak Mahindra Bank'},{v:'Yes Bank',l:'Yes Bank'},{v:'Federal Bank',l:'Federal Bank'},{v:'IDFC First Bank',l:'IDFC First Bank'},{v:'Other',l:'Other'}];
const NOMINEE_REL = [{v:'FATHER',l:'Father'},{v:'MOTHER',l:'Mother'},{v:'SPOUSE',l:'Spouse'},{v:'SON',l:'Son'},{v:'DAUGHTER',l:'Daughter'},{v:'BROTHER',l:'Brother'},{v:'SISTER',l:'Sister'},{v:'OTHER',l:'Other'}];
const GENDER = [{v:'MALE',l:'Male'},{v:'FEMALE',l:'Female'},{v:'NON_BINARY',l:'Non-binary'},{v:'PREFER_NOT',l:'Prefer not to say'},{v:'OTHER',l:'Other (specify below)'}];
export default function BankAccountsPage() {
  // Covered in Insurance REMOVED; IFSC validated; Account Number 10-18 digits
  return <GenericModule title="Bank accounts" endpoint="bank-accounts"
    columns={[{key:'HRMS_Employee_ID',label:'Employee',render:(_,r)=>r._empName||r.HRMS_Employee_ID||'—'},{key:'Bank_Name',label:'Bank name'},{key:'Account_Number',label:'Account #'},{key:'IFSC_Code',label:'IFSC'},{key:'Account_Type',label:'Type',type:'badge'}]}
    fields={[
      {key:'HRMS_Employee_ID',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Bank_Name',label:'Bank name',required:true,type:'select',options:BANKS},
      {key:'Branch_Name',label:'Branch name',required:true,type:'alpha',minLen:5,maxLen:20},
      {key:'Account_Number',label:'Account number',required:true,numeric:true,tooltip:'Numeric only, 10–18 digits'},
      {key:'IFSC_Code',label:'IFSC code',required:true,tooltip:'Format: 4 alphabets + 0 + 6 alphanumeric'},
      {key:'Account_Type',label:'Account type',required:true,type:'select',options:[{v:'SAVINGS',l:'Savings'},{v:'CURRENT',l:'Current'},{v:'SALARY',l:'Salary'}]},
      {key:'Nominee_Name',label:'Nominee name',type:'alpha'},
      {key:'Nominee_Relationship',label:'Nominee relationship',type:'select',options:NOMINEE_REL},
      {key:'Nominee_Date_of_Birth',label:'Nominee DOB',type:'date'},
      {key:'Nominee_Gender',label:'Nominee gender',type:'select',options:GENDER},
    ]}
  />;
}