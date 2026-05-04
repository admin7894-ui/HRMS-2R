import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
export default function UserEmployeesPage() {
  return <GenericModule title="User employees" endpoint="user-employees"
    columns={[
      {key:'Employee_ID',label:'Employee',render:(_,r)=>r._empName||r.Employee_ID||'—'},
      {key:'Assignment_ID',label:'Assignment'},
      {key:'Supervisor_ID',label:'Supervisor'},
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
        }));

        const endpoints = [
          { ep: 'applications', key: 'Application_ID' },
          { ep: 'applicants', key: 'Applicant_ID' },
          { ep: 'template-assignments', key: 'Template_Assignment_ID' },
          { ep: 'bank-accounts', key: 'Person_Bank_Account_ID' },
          { ep: 'consent-letters', key: 'Consent_Letter_ID' },
          { ep: 'offer-letters', key: 'Offer_Letter_ID' },
          { ep: 'assignments', key: 'Assignment_ID' },
          { ep: 'supervisors', key: 'Supervisor_ID', valueKey: 'supervisor_employee_id' },
          { ep: 'leave-balances', key: 'Leave_Balance_ID' },
          { ep: 'time-cards', key: 'Timecard_ID' },
        ];

        Promise.all(
          endpoints.map(({ ep }) =>
            api.get('/' + ep, { params: { employee_id: employeeId, limit: 500 } })
              .then(r => ({ ep, data: r.data || [] }))
              .catch(() => ({ ep, data: [] }))
          )
        ).then(results => {
          if (reqId !== reqIdRef.current) return; // ignore stale response

          const nextLov = { ...lovData };
          const nextForm = {};

          results.forEach(({ ep, data }) => {
            nextLov[ep] = data;
            const spec = endpoints.find(x => x.ep === ep);
            if (!spec) return;

            const key = spec.key;
            if (!data || data.length === 0) {
              nextForm[key] = '';
              return;
            }

            if (data.length === 1) {
              const rec = data[0];
              const valueKey = spec.valueKey || 'id';
              nextForm[key] = rec?.[valueKey] ?? '';
            } else {
              // multiple: leave empty so user picks; dropdown contains all fetched options
              nextForm[key] = '';
            }
          });

          setLovData(nextLov);
          setForm(p => ({ ...p, ...nextForm }));
        });
      }, [employeeId]);

      return null;
    }}
  />;
}
