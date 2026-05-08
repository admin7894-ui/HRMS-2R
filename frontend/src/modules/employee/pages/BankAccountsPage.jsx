import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

const BANKS = [{v:'State Bank of India',l:'State Bank of India'},{v:'HDFC Bank',l:'HDFC Bank'},{v:'ICICI Bank',l:'ICICI Bank'},{v:'Axis Bank',l:'Axis Bank'},{v:'Punjab National Bank',l:'Punjab National Bank'},{v:'Canara Bank',l:'Canara Bank'},{v:'Bank of Baroda',l:'Bank of Baroda'},{v:'Union Bank',l:'Union Bank of India'},{v:'IndusInd Bank',l:'IndusInd Bank'},{v:'Kotak Mahindra Bank',l:'Kotak Mahindra Bank'},{v:'Yes Bank',l:'Yes Bank'},{v:'Federal Bank',l:'Federal Bank'},{v:'IDFC First Bank',l:'IDFC First Bank'},{v:'Other',l:'Other'}];
const NOMINEE_REL = [{v:'FATHER',l:'Father'},{v:'MOTHER',l:'Mother'},{v:'SPOUSE',l:'Spouse'},{v:'SON',l:'Son'},{v:'DAUGHTER',l:'Daughter'},{v:'BROTHER',l:'Brother'},{v:'SISTER',l:'Sister'},{v:'OTHER',l:'Other'}];
const GENDER = [{v:'MALE',l:'Male'},{v:'FEMALE',l:'Female'},{v:'NON_BINARY',l:'Non-binary'},{v:'PREFER_NOT',l:'Prefer not to say'},{v:'OTHER',l:'Other (specify below)'}];

function EmployeeDobFetcher({ form, setForm }) {
  const prevId = useRef(null);
  useEffect(() => {
    const id = form.HRMS_Employee_ID;
    if (!id || id === prevId.current) return;
    prevId.current = id;
    api.get('/employees/' + id).then(r => {
      if (r?.data?.Date_of_Birth) {
        setForm(p => ({ ...p, _empDob: r.data.Date_of_Birth }));
      }
    }).catch(() => {});
  }, [form.HRMS_Employee_ID, setForm]);
  return null;
}

export default function BankAccountsPage() {
  const today = new Date().toISOString().split('T')[0];
  const hundredYearsAgo = new Date(new Date().setFullYear(new Date().getFullYear() - 100)).toISOString().split('T')[0];

  const getAge = (dob) => {
    const todayDate = new Date();
    const d = new Date(dob);
    let age = todayDate.getFullYear() - d.getFullYear();
    const m = todayDate.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && todayDate.getDate() < d.getDate())) age--;
    return age;
  };

  const customValidate = (form) => {
    const e = {};
    if (form.Nominee_Date_of_Birth) {
      const nDob = new Date(form.Nominee_Date_of_Birth);
      const nAge = getAge(form.Nominee_Date_of_Birth);
      const rel = form.Nominee_Relationship;
      const todayDate = new Date();

      if (nDob > todayDate) {
        e.Nominee_Date_of_Birth = 'Future dates not allowed';
      } else if (nAge > 100) {
        e.Nominee_Date_of_Birth = 'Nominee age cannot exceed 100 years';
      } else if (form._empDob) {
        const eDob = new Date(form._empDob);
        if (rel === 'SON' || rel === 'DAUGHTER') {
          if (nDob <= eDob) e.Nominee_Date_of_Birth = 'Nominee must be born after the employee';
          else if (nAge > 40) e.Nominee_Date_of_Birth = 'Nominee age must not exceed 40 years';
        } else if (rel === 'FATHER' || rel === 'MOTHER') {
          const eighteenYearsAfterNominee = new Date(nDob);
          eighteenYearsAfterNominee.setFullYear(eighteenYearsAfterNominee.getFullYear() + 18);
          if (eDob < eighteenYearsAfterNominee) e.Nominee_Date_of_Birth = 'Nominee must be at least 18 years older than employee';
        } else if (rel === 'SPOUSE') {
          if (nAge < 18) e.Nominee_Date_of_Birth = 'Nominee must be at least 18 years old';
        }
      }
    }
    return e;
  };

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
      {key:'Nominee_Date_of_Birth',label:'Nominee DOB',type:'date', minDate: hundredYearsAgo, maxDate: today},
      {key:'Nominee_Gender',label:'Nominee gender',type:'select',options:GENDER},
    ]}
    customValidate={customValidate}
    extraForm={({ form, setForm }) => <EmployeeDobFetcher form={form} setForm={setForm}/>}
  />;
}