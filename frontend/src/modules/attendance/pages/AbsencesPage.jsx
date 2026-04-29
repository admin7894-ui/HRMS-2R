import React, { useEffect } from 'react';
import GenericModule from '../../GenericModule';
// Auto-fetch entitlement; auto-calc days; approved by LOV; balance auto-calc
const DAYS_OPTS = Array.from({length:31},(_,i)=>({v:i+1,l:String(i+1)}));
export default function AbsencesPage() {
  return <GenericModule title="Absences" endpoint="absences"
    filterCols={[{key:'status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'start_date',label:'Start date',type:'date'},
      {key:'end_date',label:'End date',type:'date'},
      {key:'days',label:'Days'},
      {key:'status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_absence_type_id',label:'Absence type',required:true,type:'lov',lovEndpoint:'absence-types',labelFn:o=>o.absence_name,tooltip:'Selecting this auto-fetches entitlement'},
      {key:'start_date',label:'Start date',required:true,type:'date'},
      {key:'end_date',label:'End date',required:true,type:'date'},
      {key:'days',label:'Number of days',type:'readonly',help:'Auto-calculated: End date − Start date + 1'},
      {key:'status',label:'Status',required:true,type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'},{v:'CANCELLED',l:'Cancelled'}]},
      {key:'approved_by_supervisor_id',label:'Approved by',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,tooltip:'Select approving supervisor'},
      {key:'entitlement',label:'Entitlement leaves',type:'readonly',help:'Auto-fetched from absence type'},
      {key:'used',label:'Used leaves',required:true,numeric:true,min:0},
      {key:'balance',label:'Balance',type:'readonly',help:'Auto-calculated: Entitlement − Used'},
    ]}
    extraForm={({form, onChange, setForm}) => {
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
      // Auto-calc balance
      useEffect(() => {
        const ent = parseFloat(form.entitlement || 0);
        const used = parseFloat(form.used || 0);
        if (!isNaN(ent) && !isNaN(used)) setForm(p => ({...p, balance: ent - used}));
      }, [form.entitlement, form.used]);
      return null;
    }}
  />;
}
