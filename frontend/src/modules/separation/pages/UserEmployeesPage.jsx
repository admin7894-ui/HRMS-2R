import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
export default function UserEmployeesPage() {
  return <GenericModule title="User employees" endpoint="user-employees"
    columns={[
      {key:'Employee_ID',label:'Employee',render:(_,r)=>r._empName||r.Employee_ID||'—'},
      {key:'Assignment_ID',label:'Assignment',render:(_,r)=>r._asnName||r.Assignment_ID||'—'},
      {key:'Supervisor_ID',label:'Supervisor',render:(_,r)=>r._supName||r.Supervisor_ID||'—'},
    ]}
    fields={[
      {key:'Employee_ID',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Application_ID',label:'Application',type:'lov',lovEndpoint:'applications',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Applicant_ID',label:'Applicant',type:'lov',lovEndpoint:'applicants',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Template_Assignment_ID',label:'Template assignment',type:'lov',lovEndpoint:'template-assignments',labelFn:o=>o._displayId||o.id},
      {key:'Person_Bank_Account_ID',label:'Bank account',type:'lov',lovEndpoint:'bank-accounts',labelFn:o=>`${o.Bank_Name} — ${o.Account_Number}`},
      {key:'Consent_Letter_ID',label:'Consent letter',type:'lov',lovEndpoint:'consent-letters',labelFn:o=>o._displayId||o.id},
      {key:'Offer_Letter_ID',label:'Offer letter',type:'lov',lovEndpoint:'offer-letters',labelFn:o=>o._displayId||o.id},
      {key:'Assignment_ID',label:'Assignment',type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.id},
      // Store selected supervisor employee id, but show only supervisors returned by backend
      {key:'Supervisor_ID',label:'Supervisor',type:'lov',lovEndpoint:'supervisors',valueKey:'supervisor_employee_id',labelFn:o=>o._supName||o.supervisor_employee_id},
      {key:'Leave_Balance_ID',label:'Leave balance',type:'lov',lovEndpoint:'leave-balances',labelFn:o=>o._displayId||o.id},
      {key:'Timecard_ID',label:'Time card',type:'lov',lovEndpoint:'time-cards',labelFn:o=>o._displayId||o.id},
      {key:'Separation_ID',label:'Separation',type:'lov',lovEndpoint:'separations',labelFn:o=>o._displayId||o.id},
      {key:'Appraisal_ID',label:'Appraisal',type:'lov',lovEndpoint:'appraisals',labelFn:o=>o._displayId||o.id},
      {key:'Employee_Appraisal_ID',label:'Employee appraisal',type:'lov',lovEndpoint:'employee-appraisals',labelFn:o=>o._displayId||o.id},
      {key:'Overtime_ID',label:'Overtime',type:'lov',lovEndpoint:'overtimes',labelFn:o=>o._displayId||o.id},
      {key:'Exit_Checklist_ID',label:'Exit checklist',type:'lov',lovEndpoint:'exit-checklists',labelFn:o=>o._displayId||o.id},
      {key:'Final_Settlement_ID',label:'Final settlement',type:'lov',lovEndpoint:'final-settlements',labelFn:o=>o._displayId||o.id},
    ]}
    extraForm={({ form, setForm, lovData, setLovData, api }) => {
      const lastEmpRef = useRef(null);
      const reqIdRef = useRef(0);

      const employeeId = form.Employee_ID || '';

      useEffect(() => {
        if (!employeeId || employeeId === lastEmpRef.current) return;
        lastEmpRef.current = employeeId;
        const reqId = ++reqIdRef.current;

        // Reset dependent selections when employee changes
        setForm(p => ({
          ...p,
          Application_ID: '',
          Applicant_ID: '',
          Template_Assignment_ID: '',
          Person_Bank_Account_ID: '',
          Consent_Letter_ID: '',
          Offer_Letter_ID: '',
          Assignment_ID: '',
          Supervisor_ID: '',
          Leave_Balance_ID: '',
          Timecard_ID: '',
          Separation_ID: '',
          Appraisal_ID: '',
          Employee_Appraisal_ID: '',
          Overtime_ID: '',
          Exit_Checklist_ID: '',
          Final_Settlement_ID: '',
        }));

        const endpoints = [
          { ep: 'applications', key: 'Application_ID', viaMapping: true },
          { ep: 'applicants', key: 'Applicant_ID', viaMapping: true },
          { ep: 'template-assignments', key: 'Template_Assignment_ID', viaMapping: true },
          { ep: 'bank-accounts', key: 'Person_Bank_Account_ID' },
          { ep: 'consent-letters', key: 'Consent_Letter_ID', viaMapping: true },
          { ep: 'offer-letters', key: 'Offer_Letter_ID', viaMapping: true },
          { ep: 'assignments', key: 'Assignment_ID' },
          { ep: 'supervisors', key: 'Supervisor_ID', valueKey: 'supervisor_employee_id' },
          { ep: 'leave-balances', key: 'Leave_Balance_ID' },
          { ep: 'time-cards', key: 'Timecard_ID' },
          { ep: 'separations', key: 'Separation_ID' },
          { ep: 'appraisals', key: 'Appraisal_ID' },
          { ep: 'employee-appraisals', key: 'Employee_Appraisal_ID' },
          { ep: 'overtimes', key: 'Overtime_ID' },
          { ep: 'exit-checklists', key: 'Exit_Checklist_ID' },
          { ep: 'final-settlements', key: 'Final_Settlement_ID' },
        ];

        const fetches = [
          ...endpoints.map(({ ep, viaMapping }) =>
            viaMapping
              ? Promise.resolve({ ep, data: [] })
              : api.get('/' + ep, { params: { employee_id: employeeId, limit: 500 } })
                  .then(r => ({ ep, data: r.data || [] }))
                  .catch(() => ({ ep, data: [] }))
          ),
          api.get('/user-employees', { params: { Employee_ID: employeeId, limit: 1 } })
            .then(r => ({ ep: '__mapping__', data: r.data || [] }))
            .catch(() => ({ ep: '__mapping__', data: [] })),
        ];

        Promise.all(
          fetches
        ).then(results => {
          if (reqId !== reqIdRef.current) return; // ignore stale response

          const mapping = results.find(x => x.ep === '__mapping__')?.data?.[0] || null;
          const nextLov = { ...lovData };
          const nextForm = {};

          endpoints.forEach((spec) => {
            const { ep, key } = spec;
            const data = results.find(x => x.ep === ep)?.data || [];
            nextLov[ep] = data;

            if (spec.viaMapping) {
              nextForm[key] = mapping?.[key] || '';
              return;
            }

            if (!data || data.length === 0) {
              nextForm[key] = '';
              return;
            }

            const valueKey = spec.valueKey || 'id';
            const picked = [...data].sort((a, b) =>
              String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || ''))
            )[0];
            nextForm[key] = picked?.[valueKey] ?? '';
          });

          setLovData(nextLov);
          setForm(p => ({ ...p, ...nextForm }));
        });
      }, [employeeId]);

      return null;
    }}
  />;
}
