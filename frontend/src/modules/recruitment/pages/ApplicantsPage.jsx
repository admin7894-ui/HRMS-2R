import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

function ApplicantAutoFill({ form, setForm }) {
  const prevApplicationId = useRef(null);

  useEffect(() => {
    const applicationId = form.HRMS_Application_ID;
    if (!applicationId || applicationId === prevApplicationId.current) return;
    prevApplicationId.current = applicationId;

    api.get(`/applications/${applicationId}`).then(res => {
      const app = res?.data || res || {};
      setForm(p => {
        const updates = { ...p, HRMS_Application_ID: applicationId };

        const assignIfPresent = (formKey, value) => {
          if (value !== undefined && value !== null && value !== '') updates[formKey] = value;
        };

        assignIfPresent('First_Name', app.First_Name);
        assignIfPresent('Last_Name', app.Last_Name);
        assignIfPresent('Email', app.Email_ID);
        assignIfPresent('Phone', app.Phone_Number);
        assignIfPresent('Date_of_Birth', app.Date_of_Birth);
        assignIfPresent('Source', app.Source);
        // Link posting selection from public /apply (applications.HRMS_Job_Posting_ID)
        assignIfPresent('Job_Posting_ID', app.HRMS_Job_Posting_ID ?? app.Job_Posting_ID);
        assignIfPresent('Aadhar_Card_Number', app.Aadhar_Card_Number ?? app.Aadhaar_Number);
        assignIfPresent('PAN_Card_Number', app.PAN_Card_Number ?? app.PAN_Number);
        assignIfPresent('Aadhar_Card_Upload', app.Aadhar_Upload ?? app.Aadhaar_File);
        assignIfPresent('PAN_Card_Upload', app.PAN_Upload ?? app.PAN_File);
        assignIfPresent('Passport_Size_Upload', app.Photo_Upload ?? app.Photo_File);

        return updates;
      });
    }).catch(() => {});
  }, [form.HRMS_Application_ID, setForm]);

  return null;
}

export default function ApplicantsPage() {
  return <GenericModule title="Applicants" endpoint="applicants"
    filterCols={[{ key: 'Source', label: 'Source' }]}
    columns={[{ key: 'First_Name', label: 'First name' }, { key: 'Last_Name', label: 'Last name' }, { key: 'Email', label: 'Email' }, { key: 'Phone', label: 'Phone' }, { key: 'Source', label: 'Source', type: 'badge' }]}
    fields={[
      { key: 'HRMS_Application_ID', label: 'Application', type: 'lov', lovEndpoint: 'applications', labelFn: o => `${o.First_Name || ''} ${o.Last_Name || ''}`.trim() || o._applicantName || o.id, section: 'Personal', tooltip: 'Selecting an application auto-fills matching applicant fields.' },
      { key: 'First_Name', label: 'First name', required: true, minLen: 3, maxLen: 15, section: 'Personal' },
      { key: 'Last_Name', label: 'Last name', required: true, minLen: 3, maxLen: 15, section: 'Personal' },
      { key: 'Email', label: 'Email', required: true, type: 'email', section: 'Personal', tooltip: 'Format: abc@gmail.com' },
      { key: 'Phone', label: 'Mobile number', required: true, type: 'phone', section: 'Personal' },
      { key: 'Date_of_Birth', label: 'Date of birth', required: true, type: 'date', section: 'Personal' },
      { key: 'Source', label: 'Source', type: 'select', options: [{ v: 'PORTAL', l: 'Job portal' }, { v: 'LINKEDIN', l: 'LinkedIn' }, { v: 'REFERRAL', l: 'Referral' }, { v: 'DIRECT', l: 'Direct' }, { v: 'WEBSITE', l: 'Website' }, { v: 'SOCIAL', l: 'Social media' }], section: 'Personal' },
      // Stored as Job_Posting_ID (id), resolved via LOV to show Posting_Title
      { key: 'Job_Posting_ID', label: 'Posting title', type: 'lov', lovEndpoint: 'job-postings', labelFn: o => o.Posting_Title || o.id, section: 'Application', tooltip: 'Auto-filled from selected application; still editable.' },
      { key: 'Aadhar_Card_Number', label: 'Aadhaar number', required: true, section: 'Documents', tooltip: 'Exactly 12 digits' },
      { key: 'PAN_Card_Number', label: 'PAN card number', required: true, section: 'Documents', tooltip: 'Format: AAAAA0000A' },
      { key: 'Resume_Upload', label: 'Resume upload', type: 'file', accept: '.pdf,.doc,.docx', section: 'Documents', tooltip: 'PDF, DOC, DOCX only' },
      { key: 'Aadhar_Card_Upload', label: 'Aadhaar card upload', type: 'file', accept: '.pdf,.jpg,.jpeg,.png', section: 'Documents', tooltip: 'Max 2MB. PDF/JPG/JPEG/PNG' },
      { key: 'PAN_Card_Upload', label: 'PAN card upload', type: 'file', accept: '.pdf,.jpg,.jpeg,.png', section: 'Documents', tooltip: 'Max 1MB' },
      { key: 'Passport_Size_Upload', label: 'Passport size photo', type: 'file', accept: '.jpg,.jpeg,.png', section: 'Documents', tooltip: 'Max 500KB. JPG/JPEG/PNG only' },
    ]}
    extraForm={({ form, setForm }) => <ApplicantAutoFill form={form} setForm={setForm} />}
  />;
}
