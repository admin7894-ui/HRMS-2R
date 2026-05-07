
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
      {key:'HRMS_Applicant_ID',label:'Applicant',required:true,type:'lov',lovEndpoint:'applicants',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,section:'References', tooltip: 'Auto-filled from Application'},
      {key:'HRMS_Requisition_ID',label:'Requisition',required:true,type:'lov',lovEndpoint:'requisitions',labelFn:o=> `${o._displayId || o.id} - ${o.Position_Name || o._positionName || 'No Position'}`,section:'References'},
      {key:'HRMS_Position_ID',label:'Position',required:true,type:'lov',lovEndpoint:'positions',labelFn:o=>o.Position_Name,section:'References'},
      {key:'HRMS_Consent_Letter_ID',label:'Consent letter',required:true,type:'lov',lovEndpoint:'consent-letters',labelFn:o=>o._displayId||o.id,section:'References'},
      {key:'HRMS_Template_Assignment_ID',label:'Template assignment',required:true,type:'lov',lovEndpoint:'template-assignments',labelFn:o=>o._displayId||o.id,section:'References'},
      {key:'HRMS_Grade_ID',label:'Grade',required:true,type:'lov',lovEndpoint:'grades',labelFn:o=>o.Grade_Name,section:'Compensation'},
      {key:'Offered_Salary',label:'Salary offered LPA',required:true,type:'lov',lovEndpoint:'salary-amounts',valueKey:'Salary_Amount',labelFn:o=>o.Salary_Amount!=null&&!isNaN(parseFloat(o.Salary_Amount))?'₹'+Number(parseFloat(o.Salary_Amount)).toLocaleString('en-IN')+' '+o.Currency_Code:'—',section:'Compensation'},
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
        // Reset if application is cleared
        if (!appId) {
          if (prevAppId.current) {
            setForm(p => ({
              ...p,
              HRMS_Applicant_ID: '',
              HRMS_Requisition_ID: '',
              HRMS_Position_ID: '',
              HRMS_Consent_Letter_ID: '',
              HRMS_Template_Assignment_ID: '',
            }));
          }
          prevAppId.current = null;
          return;
        }
        if (appId === prevAppId.current) return;
        prevAppId.current = appId;

        // Reset dependent fields immediately on change to ensure clean state and prevent mismatch
        setForm(p => ({
          ...p,
          HRMS_Applicant_ID: '',
          HRMS_Requisition_ID: '',
          HRMS_Position_ID: '',
          HRMS_Consent_Letter_ID: '',
          HRMS_Template_Assignment_ID: '',
        }));

        // Parallel fetch for all linked entities to ensure consistency
        Promise.all([
          api.get(`/applications/${appId}`),
          api.get('/consent-letters', { params: { HRMS_Application_ID: appId } }),
          api.get('/template-assignments', { params: { HRMS_Application_ID: appId } })
        ]).then(async ([appRes, clRes, taRes]) => {
          const app = appRes?.data || appRes || {};
          const clList = clRes?.data || clRes || [];
          const taList = taRes?.data || taRes || [];
          
          // Pick the first matching record if exists
          const consent = clList.find(x => x.HRMS_Application_ID === appId);
          const assignment = taList.find(x => x.HRMS_Application_ID === appId);

          const updates = {
            // Strictly link applicant to the selected application
            HRMS_Applicant_ID: app.HRMS_Applicant_ID || '',
            HRMS_Requisition_ID: app.HRMS_Requisition_ID || '',
            HRMS_Consent_Letter_ID: consent?.id || '',
            HRMS_Template_Assignment_ID: assignment?.id || '',
          };

          // Also resolve Position from Job Posting if linked
          if (app.HRMS_Job_Posting_ID) {
            try {
              const postingRes = await api.get(`/job-postings/${app.HRMS_Job_Posting_ID}`);
              const posting = postingRes?.data || postingRes || {};
              if (posting.HRMS_Position_ID) updates.HRMS_Position_ID = posting.HRMS_Position_ID;
            } catch (e) {}
          }

          setForm(p => ({ ...p, ...updates }));
        }).catch(err => {
          console.error('Offer Letter Auto-fill Error:', err);
        });
      }, [form.HRMS_Application_ID, setForm]);

      return null;
    }}
  />;
}