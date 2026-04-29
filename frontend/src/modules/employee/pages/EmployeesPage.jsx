
import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

const GENDER      = [{v:'MALE',l:'Male'},{v:'FEMALE',l:'Female'},{v:'NON_BINARY',l:'Non-binary'},{v:'PREFER_NOT',l:'Prefer not to say'},{v:'OTHER',l:'Other (specify below)'}];
const MARITAL     = [{v:'SINGLE',l:'Single'},{v:'MARRIED',l:'Married'},{v:'DIVORCED',l:'Divorced'},{v:'WIDOWED',l:'Widowed'},{v:'SEPARATED',l:'Separated'}];
const QUAL        = [{v:'B.A',l:'B.A'},{v:'B.Com',l:'B.Com'},{v:'B.Sc',l:'B.Sc'},{v:'B.Tech / B.E',l:'B.Tech / B.E'},{v:'BBA',l:'BBA'},{v:'BCA',l:'BCA'},{v:'M.A',l:'M.A'},{v:'M.Com',l:'M.Com'},{v:'M.Sc',l:'M.Sc'},{v:'M.Tech / M.E',l:'M.Tech / M.E'},{v:'MBA',l:'MBA'},{v:'MCA',l:'MCA'},{v:'PhD',l:'PhD'},{v:'Diploma (Engineering)',l:'Diploma (Engineering)'},{v:'Diploma (Management)',l:'Diploma (Management)'},{v:'Other',l:'Other'}];
const EMP_TYPE    = [{v:'PERMANENT',l:'Permanent'},{v:'CONTRACT',l:'Contract'},{v:'INTERN',l:'Intern'},{v:'TEMPORARY',l:'Temporary'}];
const NOMINEE_REL = [{v:'FATHER',l:'Father'},{v:'MOTHER',l:'Mother'},{v:'SPOUSE',l:'Spouse'},{v:'SON',l:'Son'},{v:'DAUGHTER',l:'Daughter'},{v:'BROTHER',l:'Brother'},{v:'SISTER',l:'Sister'},{v:'OTHER',l:'Other'}];

// Auto-fills employment fields when Hire Record is selected
function HireRecordAutoFill({ form, setForm }) {
  const prevId = useRef(null);
  useEffect(() => {
    const id = form.Hire_Record_ID;
    if (!id || id === prevId.current) return;
    prevId.current = id;
    api.get('/hire-records/' + id).then(result => {
      const hr = result?.data;
      if (!hr) return;
      setForm(p => ({
        ...p,
        Employee_Type:       hr.Employee_Type        || p.Employee_Type,
        HRMS_Department_ID:  hr.HRMS_Department_ID   || p.HRMS_Department_ID,
        HRMS_Position_ID:    hr.HRMS_Position_ID     || p.HRMS_Position_ID,
        HRMS_Grade_ID:       hr.HRMS_Grade_ID        || p.HRMS_Grade_ID,
        Date_of_Joining:     hr.Date_of_Joining      || p.Date_of_Joining,
        Hired_Salary:        hr.Hired_Salary         || p.Hired_Salary,
      }));
    }).catch(() => {});
  }, [form.Hire_Record_ID]);
  return null;
}

export default function EmployeesPage() {
  return <GenericModule title="Employees" endpoint="employees"
    filterCols={[{key:'Gender',label:'Gender'},{key:'Employee_Type',label:'Type'}]}
    columns={[{key:'First_Name',label:'First name'},{key:'Last_Name',label:'Last name'},{key:'Email_ID',label:'Email'},{key:'Phone_Number',label:'Phone'},{key:'Gender',label:'Gender'},{key:'Employee_Type',label:'Type',type:'badge'}]}
    fields={[
      // ── Personal ───────────────────────────────────────────────────────────
      {key:'Hire_Record_ID',  label:'Hire record', type:'lov', lovEndpoint:'hire-records',
        labelFn: o => `${o._displayId||o.id}${o._applicantName?' \u2013 '+o._applicantName:''}`,
        tooltip:'Select hire record to auto-fill employment fields', section:'Personal'},
      {key:'Employee_Type',   label:'Employee type', type:'select', options:EMP_TYPE, section:'Personal'},
      {key:'First_Name',      label:'First name',  required:true, type:'alpha', minLen:5, maxLen:30, section:'Personal'},
      {key:'Middle_Name',     label:'Middle name', required:true, type:'alpha', maxLen:30, section:'Personal'},
      {key:'Last_Name',       label:'Last name',   required:true, type:'alpha', minLen:5, maxLen:30, section:'Personal'},
      {key:'Date_of_Birth',   label:'Date of birth', required:true, type:'date', section:'Personal'},
      {key:'Gender',          label:'Gender',      required:true, type:'select', options:GENDER, section:'Personal'},
      {key:'Gender_Other',    label:'Other gender (specify)', section:'Personal', tooltip:'Fill if gender is Other. Alphabets only, 5–30 chars.'},
      {key:'Marital_Status',  label:'Marital status', required:true, type:'select', options:MARITAL, section:'Personal'},
      {key:'Nationality',     label:'Nationality', required:true, type:'alpha', section:'Personal'},
      // ── Employment (auto-filled from hire record) ──────────────────────────
      {key:'HRMS_Department_ID', label:'Department', type:'lov', lovEndpoint:'departments', labelFn:o=>o.Department_Name, section:'Employment'},
      {key:'HRMS_Position_ID',   label:'Position',   type:'lov', lovEndpoint:'positions',   labelFn:o=>o.Position_Name,   section:'Employment'},
      {key:'HRMS_Grade_ID',      label:'Grade',      type:'lov', lovEndpoint:'grades',      labelFn:o=>o.Grade_Name,      section:'Employment'},
      {key:'Date_of_Joining',    label:'Date of joining', type:'date', section:'Employment'},
      {key:'Hired_Salary',       label:'Hired salary',    numeric:true, min:0, section:'Employment'},
      // ── Contact ────────────────────────────────────────────────────────────
      {key:'Email_ID',                  label:'Email',                  required:true, type:'email', section:'Contact'},
      {key:'Phone_Number',              label:'Mobile number',          required:true, type:'phone', section:'Contact'},
      {key:'Alternate_Phone',           label:'Alternate number',       required:true, type:'phone', section:'Contact'},
      {key:'Emergency_Contact_Name',    label:'Emergency contact name', required:true, type:'alpha', section:'Contact'},
      {key:'Emergency_Contact_Number',  label:'Emergency contact number', required:true, type:'phone', section:'Contact'},
      // ── Address ────────────────────────────────────────────────────────────
      {key:'Address_Line1', label:'Address line 1', required:true, section:'Address'},
      {key:'Address_Line2', label:'Address line 2',               section:'Address'},
      {key:'City',          label:'City',           required:true, section:'Address'},
      {key:'State',         label:'State',          required:true, section:'Address'},
      {key:'Country',       label:'Country',        required:true, section:'Address'},
      {key:'Pincode',       label:'Pincode',        required:true, section:'Address'},
      // ── Education ──────────────────────────────────────────────────────────
      {key:'Qualification',  label:'Qualification', required:true, type:'select', options:QUAL, section:'Education'},
      {key:'Degree_Name',    label:'Degree',        required:true, minLen:5, maxLen:30, section:'Education'},
      {key:'Specialization', label:'Specialization',required:true, minLen:5, maxLen:30, section:'Education'},
      {key:'University_Name',label:'University',    required:true, minLen:5, maxLen:30, section:'Education'},
      {key:'Institute_Name', label:'Institute name',required:true, minLen:5, maxLen:30, section:'Education'},
      {key:'Edu_Start_Year', label:'Start year',    required:true, type:'date', section:'Education', tooltip:'DD-MM-YYYY format'},
      {key:'Edu_End_Year',   label:'End year',      required:true, type:'date', section:'Education'},
      {key:'Percentage',     label:'Percentage',    required:true, numeric:true, min:0, max:100, section:'Education'},
      // ── Experience ─────────────────────────────────────────────────────────
      {key:'Is_Fresher',        label:'Is fresher',            type:'select', options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}], section:'Experience'},
      {key:'Prev_Company_Name', label:'Previous company',      required:true, minLen:5, maxLen:30, section:'Experience'},
      {key:'Industry_Type',     label:'Previous industry name',required:true, minLen:5, maxLen:30, section:'Experience'},
      {key:'Prev_Department',   label:'Previous department',   required:true, minLen:5, maxLen:30, section:'Experience'},
      {key:'Prev_Designation',  label:'Previous designation',  required:true, minLen:5, maxLen:30, section:'Experience'},
      {key:'Total_Experience',  label:'Total experience (yrs)',required:true, numeric:true, min:0, section:'Experience'},
      {key:'Last_Drawn_Salary', label:'Last drawn salary',     required:true, numeric:true, min:0, section:'Experience'},
      {key:'Reason_For_Leaving',label:'Reason for leaving',    required:true, section:'Experience'},
      // ── Nominee ────────────────────────────────────────────────────────────
      {key:'Nominee_Name',          label:'Nominee name',         type:'alpha', section:'Nominee'},
      {key:'Nominee_Relationship',  label:'Nominee relationship', type:'select', options:NOMINEE_REL, section:'Nominee'},
      {key:'Nominee_Date_of_Birth', label:'Nominee DOB',          type:'date',   section:'Nominee'},
      {key:'Nominee_Contact_Number',label:'Nominee contact number', type:'phone', section:'Nominee'},
    ]}
    extraForm={({ form, setForm }) => <HireRecordAutoFill form={form} setForm={setForm}/>}
  />;
}