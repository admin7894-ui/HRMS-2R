
import React from 'react';
import GenericModule from '../../GenericModule';

const GENDER      = [{v:'MALE',l:'Male'},{v:'FEMALE',l:'Female'},{v:'OTHER',l:'Other'}];
const MARITAL     = [{v:'SINGLE',l:'Single'},{v:'MARRIED',l:'Married'},{v:'DIVORCED',l:'Divorced'},{v:'WIDOWED',l:'Widowed'}];
const QUAL        = [{v:'B.A',l:'B.A'},{v:'B.Com',l:'B.Com'},{v:'B.Sc',l:'B.Sc'},{v:'B.Tech / B.E',l:'B.Tech / B.E'},{v:'BBA',l:'BBA'},{v:'BCA',l:'BCA'},{v:'M.A',l:'M.A'},{v:'M.Com',l:'M.Com'},{v:'M.Sc',l:'M.Sc'},{v:'M.Tech / M.E',l:'M.Tech / M.E'},{v:'MBA',l:'MBA'},{v:'MCA',l:'MCA'},{v:'PhD',l:'PhD'},{v:'Diploma (Engineering)',l:'Diploma (Engineering)'},{v:'Diploma (Management)',l:'Diploma (Management)'},{v:'Other',l:'Other'}];
const NOMINEE_REL = ['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'].map(x => ({v:x, l:x}));
const STATUS_OPT  = [{v:'APPLIED',l:'Applied'},{v:'SCREENING',l:'Screening'},{v:'SELECTED_FOR_INTERVIEW',l:'Selected for interview'},{v:'INTERVIEW',l:'Interview'},{v:'SELECTED',l:'Selected'},{v:'REJECTED',l:'Rejected'},{v:'OFFERED',l:'Offered'},{v:'JOINED',l:'Joined'}];
const NATIONALITY_OPT = ['Indian', 'American', 'British', 'Canadian', 'Australian', 'German', 'French', 'Chinese', 'Japanese', 'Russian', 'Brazilian', 'South African', 'Singaporean', 'UAE (Emirati)', 'Saudi Arabian', 'Others'].map(x => ({v:x, l:x}));
const SPEC_OPT = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Artificial Intelligence', 'Machine Learning', 'Cyber Security', 'Cloud Computing', 'Networking', 'Database Management', 'Web Development', 'Mobile App Development', 'Electronics and Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Automobile Engineering', 'Aeronautical Engineering', 'Biomedical Engineering', 'Biotechnology', 'Environmental Science', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Commerce', 'Accounting', 'Finance', 'Banking', 'Economics', 'Business Administration', 'Human Resource Management', 'Marketing', 'International Business', 'Operations Management', 'Supply Chain Management', 'Entrepreneurship', 'Law', 'Criminal Law', 'Corporate Law', 'International Law', 'Political Science', 'Public Administration', 'Sociology', 'Psychology', 'Philosophy', 'History', 'Geography', 'English Literature', 'Linguistics', 'Journalism', 'Mass Communication', 'Media Studies', 'Education', 'Early Childhood Education', 'Special Education', 'Nursing', 'Pharmacy', 'Medicine', 'Dentistry', 'Public Health', 'Hospital Management', 'Hotel Management', 'Tourism Management', 'Event Management', 'Fashion Designing', 'Interior Designing', 'Graphic Designing', 'Animation', 'Fine Arts', 'Performing Arts', 'Music', 'Theatre', 'Sports Science', 'Physical Education', 'Agriculture', 'Horticulture', 'Forestry', 'Veterinary Science', 'Food Technology', 'Nutrition and Dietetics'].map(x => ({v:x, l:x}));

export default function ApplicationsPage() {
  return <GenericModule title="Applications" endpoint="applications"
    defaultForm={{ Applied_Date: new Date().toISOString().split('T')[0], Application_Status: 'APPLIED', Is_Fresher: false }}
    filterCols={[{key:'Application_Status',label:'Status'},{key:'Gender',label:'Gender'}]}
    columns={[
      {key:'First_Name', label:'Applicant name', render:(_,r)=>[r.First_Name,r.Middle_Name,r.Last_Name].filter(Boolean).join(' ')||'—'},
      {key:'Email_ID',          label:'Email'},
      {key:'Phone_Number',      label:'Phone'},
      {key:'Degree_Name',       label:'Qualification',  render:(_,r)=>r.Degree_Name||'—'},
      {key:'Total_Experience',  label:'Experience',     render:(_,r)=>(r.Is_Fresher===true||r.Is_Fresher==='true')?'Fresher':r.Total_Experience?r.Total_Experience+' yrs':'—'},
      {key:'Applied_Date',      label:'Applied date',   type:'date'},
      {key:'Application_Status',label:'Status',         type:'badge'},
    ]}
    fields={[
      // ── Personal Information ──────────────────────────────────────────────────
      {key:'First_Name',       label:'First name',            required:true, type:'alpha', minLen:2, maxLen:50, section:'Personal Information'},
      {key:'Middle_Name',      label:'Middle name',           type:'alpha', maxLen:50,                          section:'Personal Information'},
      {key:'Last_Name',        label:'Last name',             required:true, type:'alpha', minLen:2, maxLen:50, section:'Personal Information'},
      {key:'Date_of_Birth',    label:'Date of birth',         required:true, type:'date',                       section:'Personal Information'},
      {key:'Gender',           label:'Gender',                required:true, type:'select', options:GENDER,     section:'Personal Information'},
      {key:'Marital_Status',   label:'Marital status',        required:true, type:'select', options:MARITAL,    section:'Personal Information'},
      {key:'Nationality',      label:'Nationality',           required:true, type:'select', options:NATIONALITY_OPT, section:'Personal Information'},
      // ── Contact Details ──────────────────────────────────────────────────────
      {key:'Email_ID',                  label:'Email',                    required:true, type:'email',  section:'Contact Details'},
      {key:'Phone_Number',              label:'Mobile number',            required:true, type:'phone',  section:'Contact Details'},
      {key:'Alternate_Phone',           label:'Alternate number',         required:true, type:'phone',  section:'Contact Details'},
      {key:'Emergency_Contact_Name',    label:'Emergency contact name',   required:true, type:'alpha', minLen:2, maxLen:50, section:'Contact Details'},
      {key:'Emergency_Contact_Number',  label:'Emergency contact number', required:true, type:'phone',  section:'Contact Details'},
      // ── Address ──────────────────────────────────────────────────────────────
      {key:'Address_Line1', label:'Address line 1', required:true, regex:/^[a-zA-Z0-9\s,.-]{5,100}$/, regexMsg:'5-100 valid characters', minLen:5, maxLen:100, section:'Address'},
      {key:'Address_Line2', label:'Address line 2',               regex:/^[a-zA-Z0-9\s,.-]{0,100}$/, regexMsg:'0-100 valid characters', maxLen:100,            section:'Address'},
      {key:'City',          label:'City',           required:true, type:'alpha', minLen:2, maxLen:50,  section:'Address'},
      {key:'State',         label:'State',          required:true, type:'alpha', minLen:2, maxLen:50,  section:'Address'},
      {key:'Country',       label:'Country',        required:true, type:'alpha', minLen:2, maxLen:50,  section:'Address'},
      {key:'Pincode',       label:'Pincode',        required:true, regex:/^[1-9][0-9]{5}$/, regexMsg:'6-digit pincode', minLen:6, maxLen:6,                 section:'Address', tooltip:'6-digit pincode'},
      // ── Documents ────────────────────────────────────────────────────────────
      {key:'Aadhaar_Number', label:'Aadhaar number', required:true, regex:/^[0-9]{12}$/, regexMsg:'Aadhaar must be exactly 12 digits', section:'Documents', tooltip:'12-digit Aadhaar number'},
      {key:'PAN_Number',     label:'PAN number',     required:true, regex:/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, regexMsg:'PAN format: AAAAA0000A', section:'Documents', tooltip:'10-character PAN (e.g. ABCDE1234F)'},
      {key:'Aadhaar_File',   label:'Aadhaar file (name/path)',  section:'Documents', tooltip:'File name or path of uploaded Aadhaar document'},
      {key:'PAN_File',       label:'PAN file (name/path)',      section:'Documents', tooltip:'File name or path of uploaded PAN document'},
      {key:'Photo_File',     label:'Photo file (name/path)',    section:'Documents', tooltip:'File name or path of passport photo'},
      {key:'Other_Doc_File', label:'Other document (name/path)',section:'Documents', tooltip:'Any other supporting document'},
      // ── Education ────────────────────────────────────────────────────────────
      {key:'Qualification',    label:'Qualification',  required:true, type:'select', options:QUAL, section:'Education'},
      {key:'Degree_Name',      label:'Degree name',    required:true, regex:/^[a-zA-Z\s,.-]{2,100}$/, regexMsg:'2-100 valid characters', minLen:2, maxLen:100, section:'Education'},
      {key:'Specialization',   label:'Specialization', required:true, type:'select', options:SPEC_OPT, section:'Education'},
      {key:'University_Name',  label:'University',     required:true, regex:/^[a-zA-Z\s,.-]{2,100}$/, regexMsg:'2-100 valid characters', minLen:2, maxLen:100, section:'Education'},
      {key:'Institute_Name',   label:'Institute name', required:true, regex:/^[a-zA-Z\s,.-]{2,100}$/, regexMsg:'2-100 valid characters', minLen:2, maxLen:100, section:'Education'},
      {key:'Edu_Start_Year',   label:'Start year',     required:true, minLen:4, maxLen:4, section:'Education', tooltip:'4-digit year e.g. 2018'},
      {key:'Edu_End_Year',     label:'End year',       required:true, minLen:4, maxLen:4, section:'Education', tooltip:'4-digit year e.g. 2022'},
      {key:'Passing_Year',     label:'Passing year',   required:true, minLen:4, maxLen:4, section:'Education', tooltip:'4-digit year'},
      {key:'Percentage',       label:'Percentage',     required:true, numeric:true, min:0, max:100,              section:'Education'},
      {key:'Edu_Grade',        label:'Grade',          required:true, minLen:1, maxLen:5, section:'Education', tooltip:'e.g. A, B+'},
      // ── Work Experience ────────────────────────────────────────────────────────
      {key:'Is_Fresher',        label:'Is fresher',    required:true, type:'select', options:[{v:true,l:'Yes — No prior experience'},{v:false,l:'No — Has work experience'}], section:'Work Experience'},
      {key:'Prev_Company_Name', label:'Previous company',     required:true, regex:/^[a-zA-Z0-9\s,.-]{2,100}$/, regexMsg:'2-100 valid characters', minLen:2, maxLen:100, section:'Work Experience', hidden: f=>f.Is_Fresher===true||f.Is_Fresher==='true'},
      {key:'Prev_Designation',  label:'Designation',          required:true, regex:/^[a-zA-Z0-9\s,.-]{2,100}$/, regexMsg:'2-100 valid characters', minLen:2, maxLen:100, section:'Work Experience', hidden: f=>f.Is_Fresher===true||f.Is_Fresher==='true'},
      {key:'Prev_Department',   label:'Department',           required:true, regex:/^[a-zA-Z0-9\s,.-]{2,100}$/, regexMsg:'2-100 valid characters', minLen:2, maxLen:100, section:'Work Experience', hidden: f=>f.Is_Fresher===true||f.Is_Fresher==='true'},
      {key:'Industry_Type',     label:'Industry type',        required:true, regex:/^[a-zA-Z\s]{2,50}$/, regexMsg:'2-50 valid characters', minLen:2, maxLen:50,  section:'Work Experience', hidden: f=>f.Is_Fresher===true||f.Is_Fresher==='true'},
      {key:'Exp_Start_Date',    label:'Experience start date', required:true, type:'date',         section:'Work Experience', hidden: f=>f.Is_Fresher===true||f.Is_Fresher==='true'},
      {key:'Exp_End_Date',      label:'Experience end date',   required:true, type:'date',         section:'Work Experience', hidden: f=>f.Is_Fresher===true||f.Is_Fresher==='true'},
      {key:'Total_Experience',  label:'Total experience (yrs)',required:true, numeric:true, min:0, max:40, section:'Work Experience', hidden: f=>f.Is_Fresher===true||f.Is_Fresher==='true'},
      {key:'Last_Drawn_Salary', label:'Last drawn salary',    required:true, numeric:true, min:0, regex:/^[0-9]{4,10}$/, regexMsg:'4-10 digit salary', section:'Work Experience', hidden: f=>f.Is_Fresher===true||f.Is_Fresher==='true'},
      {key:'Reason_For_Leaving',label:'Reason for leaving',   regex:/^[a-zA-Z0-9\s,.-]{2,200}$/, regexMsg:'2-200 valid characters', maxLen:200,                    section:'Work Experience'},
      // ── Nominee Details ──────────────────────────────────────────────────────
      {key:'Nominee_Name',          label:'Nominee name',         required:true, type:'alpha', minLen:2, maxLen:50, section:'Nominee Details'},
      {key:'Nominee_Relationship',  label:'Nominee relationship', required:true, type:'select', options:NOMINEE_REL,               section:'Nominee Details'},
      {key:'Nominee_Date_of_Birth', label:'Nominee DOB',          required:true, type:'date',                                       section:'Nominee Details'},
      {key:'Nominee_Contact_Number',label:'Nominee contact',      required:true, type:'phone',                                      section:'Nominee Details'},
      // ── Application Info ─────────────────────────────────────────────────────
      {key:'Applied_Date',       label:'Applied date',  type:'date', readOnly:true, section:'Application Info'},
      {key:'Source',             label:'Source',        type:'select', options:[{v:'PORTAL',l:'Job portal'},{v:'HRMS',l:'Internal HRMS'},{v:'LINKEDIN',l:'LinkedIn'},{v:'REFERRAL',l:'Referral'},{v:'DIRECT',l:'Direct'},{v:'WEBSITE',l:'Website'}], section:'Application Info'},
      {key:'HRMS_Job_Posting_ID',label:'Job posting',   required:true, type:'lov', lovEndpoint:'job-postings', labelFn:o=>o.Posting_Title, section:'Application Info'},
      {key:'Expected_Salary',    label:'Expected salary', numeric:true, min:0,                        section:'Application Info'},
      {key:'Application_Status', label:'Status',          required:true, type:'select', options:STATUS_OPT, section:'Application Info'},
    ]}
  />;
}