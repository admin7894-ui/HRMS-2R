import React, { useEffect } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';
import { toast } from 'react-toastify';

function AbsenceLogic({ form, setForm, holidays }) {
  const [exclusionMsg, setExclusionMsg] = React.useState(null);

  useEffect(() => {
    if (form.start_date && form.end_date) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);
      if (end < start) {
        setForm(p => ({ ...p, days: 0 }));
        setExclusionMsg(null);
        return;
      }

      let count = 0;
      const excludedDates = [];
      const cur = new Date(start);

      while (cur <= end) {
        const dateStr = cur.toISOString().split('T')[0];
        const isSunday = cur.getDay() === 0;
        const isHoliday = holidays.find(h => h.holiday_date === dateStr);

        if (isSunday || isHoliday) {
          excludedDates.push({ date: dateStr, reason: isSunday ? 'Sunday' : `Holiday (${isHoliday.holiday_name})` });
        } else {
          count++;
        }
        cur.setDate(cur.getDate() + 1);
      }

      if (form.days !== count) setForm(p => ({ ...p, days: count }));
      
      if (excludedDates.length > 0) {
        setExclusionMsg({
          count: excludedDates.length,
          dates: excludedDates.map(d => `${d.date} (${d.reason})`).join(', ')
        });
      } else {
        setExclusionMsg(null);
      }
    }
  }, [form.start_date, form.end_date, holidays, setForm, form.days]);

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
  }, [form.HRMS_employee_id, form.HRMS_absence_type_id, setForm]);

  return exclusionMsg ? (
    <div className="col-span-full mb-4 p-3 bg-indigo-50 text-indigo-700 rounded border border-indigo-100 text-xs leading-relaxed">
      <div className="flex items-center gap-2 font-bold mb-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        Non-working days excluded ({exclusionMsg.count} days)
      </div>
      <p>The following dates were excluded from the leave count: <span className="font-medium">{exclusionMsg.dates}</span></p>
    </div>
  ) : null;
}

export default function AbsencesPage() {
  const [holidays, setHolidays] = React.useState([]);

  useEffect(() => {
    api.get('/holidays', { params: { limit: 1000 } }).then(r => setHolidays(r?.data || []));
  }, []);

  const customValidate = (form) => {
    const errs = {};

    const checkRestricted = (dateStr, field) => {
      if (!dateStr) return;
      const d = new Date(dateStr);
      if (d.getDay() === 0) errs[field] = 'Cannot select a Sunday as the date';
      const h = holidays.find(x => x.holiday_date === dateStr);
      if (h) errs[field] = `Cannot select a holiday (${h.holiday_name}) as the date`;
    };

    checkRestricted(form.start_date, 'start_date');
    checkRestricted(form.end_date, 'end_date');

    const ent = parseFloat(form.entitlement || 0);
    const used = parseFloat(form.used || 0);
    const cur = parseFloat(form.days || 0);
    if (form.status === 'APPROVED' && (used + cur) > ent) {
      errs.days = `Exceeds entitlement. Total Used (${used + cur}) > Entitlement (${ent})`;
    }
    return errs;
  };

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
      {key:'days',label:'Number of days',type:'readonly',help:'Auto-calculated: End date − Start date + 1 (excluding Sundays and holidays)'},
      {key:'status',label:'Status',required:true,type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'},{v:'CANCELLED',l:'Cancelled'}]},
      {key:'approved_by_supervisor_id',label:'Approved by',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,tooltip:'Select approving supervisor'},
      {key:'entitlement',label:'Entitlement leaves',type:'readonly',help:'Pulled from matching Leave Balance record'},
      {key:'used',label:'Used leaves',type:'readonly',help:'Existing approved absences for this type'},
      {key:'balance',label:'Balance',type:'readonly',help:'Auto-calculated: Entitlement − Used'},
    ]}
    customValidate={customValidate}
    extraForm={(props) => <AbsenceLogic {...props} holidays={holidays} />}
  />;
}
