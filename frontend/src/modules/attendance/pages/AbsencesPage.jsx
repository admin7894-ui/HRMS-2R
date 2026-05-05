import React, { useEffect } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

export default function AbsencesPage() {
  return <GenericModule title="Absences" endpoint="absences"
    filterCols={[{key:'status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'—'},
      {key:'start_date',label:'Start date',type:'date'},
      {key:'end_date',label:'End date',type:'date'},
      {key:'days',label:'Days'},
      {key:'status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_absence_type_id',label:'Absence type',required:true,type:'lov',lovEndpoint:'absence-types',labelFn:o=>o.absence_name,tooltip:'Selecting this pulls entitlement from leave balances'},
      {key:'start_date',label:'Start date',required:true,type:'date'},
      {key:'end_date',label:'End date',required:true,type:'date'},
      {key:'days',label:'Number of days',type:'readonly',help:'Auto-calculated: End date − Start date + 1'},
      {key:'status',label:'Status',required:true,type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'},{v:'CANCELLED',l:'Cancelled'}]},
      {key:'approved_by_supervisor_id',label:'Approved by',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,tooltip:'Select approving supervisor'},
      {key:'entitlement',label:'Entitlement leaves',type:'readonly',help:'Pulled from matching Leave Balance record'},
      {key:'used',label:'Used leaves',type:'readonly',help:'Existing approved absences for this type'},
      {key:'balance',label:'Balance',type:'readonly',help:'Auto-calculated: Entitlement − Used'},
    ]}
    customValidate={(form) => {
      const errs = {};
      const ent = parseFloat(form.entitlement || 0);
      const used = parseFloat(form.used || 0);
      const cur = parseFloat(form.days || 0);
      if (form.status === 'APPROVED' && (used + cur) > ent) {
        errs.days = `Exceeds entitlement. Total Used (${used + cur}) > Entitlement (${ent})`;
      }
      return errs;
    }}
    extraForm={({form, setForm}) => {
      // Auto-calc days when start/end date change
      useEffect(() => {
        if (form.start_date && form.end_date) {
          const s = new Date(form.start_date), e = new Date(form.end_date);
          if (e >= s) {
            const days = Math.round((e - s) / 86400000) + 1;
            setForm(p => ({...p, days}));
          }
        }
      }, [form.start_date, form.end_date]);

      // Fetch Leave Balance (Entitlement & Used)
      useEffect(() => {
        if (form.HRMS_employee_id && form.HRMS_absence_type_id) {
          api.get('/leave-balances', { params: { HRMS_employee_id: form.HRMS_employee_id, HRMS_absence_type_id: form.HRMS_absence_type_id } })
            .then(r => {
              const lb = r.data?.[0];
              if (lb) {
                setForm(p => ({
                  ...p,
                  entitlement: lb.entitlement || 0,
                  used: lb.used || 0,
                  balance: (lb.entitlement || 0) - (lb.used || 0)
                }));
              } else {
                // If no balance record, check absence type for default entitlement
                api.get(`/absence-types/${form.HRMS_absence_type_id}`)
                  .then(r2 => {
                    const at = r2.data || {};
                    setForm(p => ({
                      ...p,
                      entitlement: at.entitlement_per_year || 0,
                      used: 0,
                      balance: at.entitlement_per_year || 0
                    }));
                    toast.info('No existing Leave Balance found. Using default from Absence Type.');
                  });
              }
            });
        }
      }, [form.HRMS_employee_id, form.HRMS_absence_type_id]);

      return null;
    }}
  />;
}
