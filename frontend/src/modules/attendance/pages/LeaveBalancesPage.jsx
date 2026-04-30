import React, { useEffect } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

export default function LeaveBalancesPage() {
  return <GenericModule title="Leave balances" endpoint="leave-balances"
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'-'},
      {key:'HRMS_absence_type_id',label:'Absence type',render:(_,r)=>r.Absence_Type_Name||r._absenceTypeName||r.HRMS_absence_type_id||'-'},
      {key:'entitlement',label:'Entitlement'},
      {key:'used',label:'Used'},
      {key:'balance',label:'Balance'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_absence_type_id',label:'Absence type',required:true,type:'lov',lovEndpoint:'absence-types',labelFn:o=>o.absence_name},
      {key:'entitlement',label:'Entitlement days',type:'readonly',help:'Auto-fetched from absence type'},
      {key:'used',label:'Used days',type:'readonly',help:'Auto-calculated from approved absences'},
      {key:'balance',label:'Balance days',type:'readonly',help:'Entitlement - Used'},
    ]}
    extraForm={({form, setForm}) => {
      useEffect(() => {
        let cancelled = false;
        const employeeId = form.HRMS_employee_id;
        const absenceTypeId = form.HRMS_absence_type_id;

        if (!employeeId || !absenceTypeId) {
          setForm(p => ({ ...p, entitlement: '', used: '', balance: '' }));
          return;
        }

        api.get(`/employees/${employeeId}/absences-summary/${absenceTypeId}`)
          .then(r => {
            if (cancelled) return;
            const summary = r.data || {};
            setForm(p => ({
              ...p,
              entitlement: summary.entitlement ?? '',
              used: summary.used ?? '',
              balance: summary.balance ?? '',
            }));
          })
          .catch(() => {
            if (!cancelled) setForm(p => ({ ...p, entitlement: '', used: '', balance: '' }));
          });

        return () => { cancelled = true; };
      }, [form.HRMS_employee_id, form.HRMS_absence_type_id]);

      return null;
    }}
  />;
}
