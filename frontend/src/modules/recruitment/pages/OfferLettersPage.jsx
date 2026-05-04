
import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';
// Salary Offered not NaN fix; Signed shows Yes/No; All dropdowns show names; Position/Grade/Joining etc. fields
export default function OfferLettersPage() {
  return <GenericModule title="Offer letters" endpoint="offer-letters"
    columns={[
      {key:'HRMS_Application_ID',label:'Application',render:(_,r)=>r._applicationName||r.HRMS_Application_ID||'—'},
      {key:'Offered_Salary',label:'Salary offered',render:(v)=>v!=null&&!isNaN(parseFloat(v))?'₹'+Number(parseFloat(v)).toLocaleString('en-IN'):'—'},
      {key:'Joining_Date',label:'Joining date',type:'date'},
      {key:'Offer_Letter_Signed',label:'Signed',type:'yesno'},
    ]}
    fields={[
      {key:'HRMS_Application_ID',label:'Application',required:true,type:'lov',lovEndpoint:'applications',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,section:'References'},
      {key:'HRMS_Applicant_ID',label:'Applicant',required:true,type:'lov',lovEndpoint:'applicants',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,section:'References'},
      {key:'HRMS_Requisition_ID',label:'Requisition',required:true,type:'lov',lovEndpoint:'requisitions',labelFn:o=>o._displayId||o.id,section:'References'},
      {key:'HRMS_Position_ID',label:'Position',required:true,type:'lov',lovEndpoint:'positions',labelFn:o=>o.Position_Name,section:'References'},
      {key:'HRMS_Consent_Letter_ID',label:'Consent letter',required:true,type:'lov',lovEndpoint:'consent-letters',labelFn:o=>o._displayId||o.id,section:'References'},
      {key:'HRMS_Template_Assignment_ID',label:'Template assignment',required:true,type:'lov',lovEndpoint:'template-assignments',labelFn:o=>o._displayId||o.id,section:'References'},
      {key:'HRMS_Grade_ID',label:'Grade',required:true,type:'lov',lovEndpoint:'grades',labelFn:o=>o.Grade_Name,section:'Compensation'},
      {key:'Offered_Salary',label:'Salary offered',required:true,type:'lov',lovEndpoint:'salary-amounts',valueKey:'Salary_Amount',labelFn:o=>o.Salary_Amount!=null&&!isNaN(parseFloat(o.Salary_Amount))?'₹'+Number(parseFloat(o.Salary_Amount)).toLocaleString('en-IN')+' '+o.Currency_Code:'—',section:'Compensation'},
      {key:'Joining_Date',label:'Joining date',required:true,type:'date',section:'Dates'},
      {key:'Offer_Date',label:'Offered letter date',required:true,type:'date',section:'Dates'},
      {key:'Offer_Expiry_Date',label:'Offer expiry date',required:true,type:'date',section:'Dates'},
      {key:'Duration_Type',label:'Duration type',type:'select',options:[{v:'PERMANENT',l:'Permanent'},{v:'CONTRACT',l:'Contract'},{v:'TEMPORARY',l:'Temporary'},{v:'INTERN',l:'Internship'}],section:'Details'},
      {key:'Offer_Letter_Signed',label:'Offer letter signed',type:'select',options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}],section:'Details'},
    ]}
    extraForm={({ form, setForm }) => {
      const prevAppId = useRef(null);

      useEffect(() => {
        const appId = form.HRMS_Application_ID;
        if (!appId || appId === prevAppId.current) return;
        prevAppId.current = appId;

        api.get(`/applications/${appId}`).then(res => {
          const app = res?.data || res || {};
          const applicantId = app.HRMS_Applicant_ID ?? app.Applicant_ID ?? app.applicant_id;
          const requisitionId = app.HRMS_Requisition_ID ?? app.Requisition_ID ?? app.requisition_id;
          const jobPostingId = app.HRMS_Job_Posting_ID ?? app.Job_Posting_ID ?? app.job_posting_id;

          // Populate only if data exists; keep editable (user can change later)
          if (jobPostingId) {
            api.get(`/job-postings/${jobPostingId}`).then(r2 => {
              const posting = r2?.data || r2 || {};
              const posId = posting.HRMS_Position_ID ?? posting.Position_ID ?? posting.position_id;
              setForm(p => ({
                ...p,
                HRMS_Application_ID: appId,
                ...(applicantId ? { HRMS_Applicant_ID: applicantId } : {}),
                ...(requisitionId ? { HRMS_Requisition_ID: requisitionId } : {}),
                ...(posId ? { HRMS_Position_ID: posId } : {}),
              }));
            }).catch(() => {
              setForm(p => ({
                ...p,
                HRMS_Application_ID: appId,
                ...(applicantId ? { HRMS_Applicant_ID: applicantId } : {}),
                ...(requisitionId ? { HRMS_Requisition_ID: requisitionId } : {}),
              }));
            });
          } else {
            setForm(p => ({
              ...p,
              HRMS_Application_ID: appId,
              ...(applicantId ? { HRMS_Applicant_ID: applicantId } : {}),
              ...(requisitionId ? { HRMS_Requisition_ID: requisitionId } : {}),
            }));
          }
        }).catch(() => {});
      }, [form.HRMS_Application_ID, setForm]);

      return null;
    }}
  />;
}