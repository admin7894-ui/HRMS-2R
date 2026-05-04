
import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';
// Dropdowns show names not IDs; Position + Applicant removed from form & table per req
export default function ConsentLettersPage() {
  return <GenericModule title="Consent letters" endpoint="consent-letters"
    columns={[
      {key:'HRMS_Application_ID',label:'Application',render:(_,r)=>r._applicationName||r.HRMS_Application_ID||'—'},
      {key:'Consent_Letter_Signed',label:'Signed',type:'yesno'},
    ]}
    fields={[
      {key:'HRMS_Interview_ID',label:'Interview',required:true,type:'lov',lovEndpoint:'interviews',labelFn:o=>`${o.Interview_Code || o._displayId || o.id} – ${o.Applicant_Name || o._applicationName || '—'}`,tooltip:'Shows interview reference'},
      {key:'HRMS_Application_ID',label:'Application',required:true,type:'lov',lovEndpoint:'applications',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_Requisition_ID',label:'Requisition',required:true,type:'lov',lovEndpoint:'requisitions',labelFn:o=>`${o.Requisition_Code || o.Requisition_ID || o._displayId || o.id} – ${o.Position_Name || o._positionName || '—'}`,tooltip:'Shows requisition reference'},
      {key:'HRMS_Template_Assignment_ID',label:'Template assignment',required:true,type:'lov',lovEndpoint:'template-assignments',labelFn:o=>o._displayId||o.id},
      {key:'Consent_Letter_Signed',label:'Consent signed',required:true,type:'select',options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}]},
    ]}
    extraForm={({ form, setForm }) => {
      const prevInterviewId = useRef(null);

      useEffect(() => {
        const interviewId = form.HRMS_Interview_ID;
        if (!interviewId || interviewId === prevInterviewId.current) return;
        prevInterviewId.current = interviewId;

        api.get(`/interviews/${interviewId}`).then(res => {
          const iv = res?.data || res || {};
          setForm(p => ({
            ...p,
            HRMS_Interview_ID: interviewId,
            // Auto-fill but keep editable
            HRMS_Application_ID: iv.HRMS_Application_ID || p.HRMS_Application_ID || '',
            HRMS_Requisition_ID: iv.HRMS_Requisition_ID || p.HRMS_Requisition_ID || '',
          }));
        }).catch(() => {});
      }, [form.HRMS_Interview_ID, setForm]);

      return null;
    }}
  />;
}