
import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

const EMPTYPE    = [{v:'PERMANENT',l:'Permanent'},{v:'CONTRACT',l:'Contract'},{v:'INTERN',l:'Intern'},{v:'TEMPORARY',l:'Temporary'}];
const HIRE_STATUS= [{v:'JOINED',l:'Joined'},{v:'NOT_JOINED',l:'Not joined'},{v:'ONBOARDING',l:'Onboarding'},{v:'PENDING',l:'Pending'}];

// Auto-fills hire form fields when Offer Letter is selected
function OfferLetterAutoFill({ form, setForm, lovData }) {
  const prevId = useRef(null);
  useEffect(() => {
    const id = form.HRMS_Offer_Letter_ID;
    if (!id || id === prevId.current) return;
    prevId.current = id;
    api.get('/offer-letters/' + id).then(result => {
      const ol = result?.data;
      if (!ol) return;
      // Resolve Hired_Salary: if UUID look up in lovData salary-amounts
      let salary = ol.Offered_Salary;
      if (salary && String(salary).includes('-')) {
        const sr = (lovData?.['salary-amounts'] || []).find(s => s.id === salary);
        salary = sr ? sr.Salary_Amount : salary;
      }
      setForm(p => ({
        ...p,
        HRMS_Position_ID:      ol.HRMS_Position_ID      || p.HRMS_Position_ID,
        HRMS_Grade_ID:         ol.HRMS_Grade_ID          || p.HRMS_Grade_ID,
        Date_of_Joining:       ol.Joining_Date           || p.Date_of_Joining,
        Offer_Period_End_Date: ol.Offer_Expiry_Date      || p.Offer_Period_End_Date,
        Employee_Type:         ol.Duration_Type          || p.Employee_Type,
        Hired_Salary:          salary                    || p.Hired_Salary,
      }));
    }).catch(() => {});
  }, [form.HRMS_Offer_Letter_ID]);
  return null;
}

export default function HireRecordsPage() {
  return <GenericModule title="Hire records" endpoint="hire-records"
    filterCols={[{key:'Hire_Status',label:'Hire status'},{key:'Employee_Type',label:'Type'}]}
    columns={[
      {key:'_applicantName',  label:'Applicant name', render:(_,r)=>r._applicantName||'—'},
      {key:'HRMS_Offer_Letter_ID', label:'Offer letter', render:(_,r)=>r._offerLetterLabel||r._offerLetterRef||r.HRMS_Offer_Letter_ID||'—'},
      {key:'Date_of_Joining', label:'DOJ', type:'date'},
      {key:'Hire_Status',     label:'Hire status', type:'badge'},
    ]}
    fields={[
      {key:'HRMS_Application_ID',  label:'Application',  required:true, type:'lov', lovEndpoint:'applications',  labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_Offer_Letter_ID', label:'Offer letter', required:true, type:'lov', lovEndpoint:'offer-letters', labelFn:o=>`${o._displayId||o.id}${o._applicationName?' \u2013 '+o._applicationName:''}`, tooltip:'Selecting this will auto-fill fields below'},
      {key:'HRMS_Department_ID',   label:'Department',   required:true, type:'lov', lovEndpoint:'departments',   labelFn:o=>o.Department_Name},
      {key:'HRMS_Position_ID',     label:'Position',     required:true, type:'lov', lovEndpoint:'positions',     labelFn:o=>o.Position_Name},
      {key:'HRMS_Grade_ID',        label:'Grade',        required:true, type:'lov', lovEndpoint:'grades',        labelFn:o=>o.Grade_Name},
      {key:'Date_of_Joining',      label:'Date of joining',  required:true, type:'date'},
      {key:'Offer_Period_End_Date',label:'Offer period end', required:true, type:'date'},
      {key:'Employee_Type',        label:'Employee type', required:true, type:'select', options:EMPTYPE},
      {key:'Hired_Salary',         label:'Hired salary',  required:true, numeric:true},
      {key:'Hire_Status',          label:'Hire status',   required:true, type:'select', options:HIRE_STATUS},
    ]}
    extraForm={({ form, setForm, lovData }) => <OfferLetterAutoFill form={form} setForm={setForm} lovData={lovData}/>}
  />;
}