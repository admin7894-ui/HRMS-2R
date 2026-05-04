import React, { useEffect } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

const minutesFromTime = value => {
  if (!value) return null;
  const [hours, minutes] = String(value).split(':').map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
  return hours * 60 + minutes;
};

export default function TimeCardsPage() {
  return <GenericModule title="Time cards" endpoint="time-cards"
    defaultForm={{ attendance_status: 'PRESENT', approval_status: 'PENDING' }}
    filterCols={[{key:'attendance_status',label:'Attendance'},{key:'approval_status',label:'Approval'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'-'},
      {key:'work_date',label:'Date',type:'date'},
      {key:'clock_in',label:'In'},
      {key:'clock_out',label:'Out'},
      {key:'hours_worked',label:'Hours'},
      {key:'attendance_status',label:'Attendance',type:'badge'},
      {key:'approval_status',label:'Approval status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_assignment_id',label:'Assignment',required:true,type:'lov',lovEndpoint:'assignments',labelFn:o=>o._displayId||o.HRMS_assignment_id||o.id,tooltip:'Auto-filled from selected employee',readOnly:true},
      {key:'HRMS_work_schedule_id',label:'Work schedule',type:'lov',lovEndpoint:'work-schedules',labelFn:o=>o.Work_Schedule_Name,help:'Auto-filled from assignment',readOnly:true},
      {key:'work_date',label:'Work date',required:true,type:'date',maxDate:new Date().toISOString().split('T')[0]},
      {key:'clock_in',label:'Clock in',required:true,type:'time',tooltip:'hh:mm format'},
      {key:'clock_out',label:'Clock out',required:true,type:'time',tooltip:'hh:mm format. Overnight shifts handled.'},
      {key:'hours_worked',label:'Total hours worked',type:'readonly',help:'Auto-calculated from clock in and clock out'},
      {key:'attendance_status',label:'Attendance status',required:true,type:'select',options:[{v:'PRESENT',l:'Present'},{v:'ABSENT',l:'Absent'},{v:'HALF_DAY',l:'Half-day'},{v:'LEAVE',l:'On leave'},{v:'HOLIDAY',l:'Holiday'}]},
      {key:'approval_status',label:'Approval status',required:true,type:'select',options:[{v:'PENDING',l:'Pending'},{v:'APPROVED',l:'Approved'},{v:'REJECTED',l:'Rejected'}]},
      {key:'description',label:'Description',type:'textarea',maxLen:300},
      {key:'approved_by',label:'Approved by',type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`,tooltip:'Auto-filled from employee supervisor. Can be overridden.'},
    ]}
    extraForm={({form, lovData, setForm}) => {
      useEffect(() => {
        const assignments = lovData.assignments || [];
        if (!form.HRMS_employee_id || assignments.length === 0) return;

        const employeeAssignments = assignments.filter(a => (
          a.active_flag !== 'N' && String(a.HRMS_employee_id) === String(form.HRMS_employee_id)
        ));
        const current = employeeAssignments.find(a => String(a.id) === String(form.HRMS_assignment_id));
        const selected = current || employeeAssignments[0];

        setForm(p => ({
          ...p,
          HRMS_assignment_id: selected?.id || '',
          HRMS_work_schedule_id: selected?.HRMS_work_schedule_id || '',
        }));
      }, [form.HRMS_employee_id, form.HRMS_assignment_id, lovData.assignments?.length]);

      useEffect(() => {
        let cancelled = false;
        if (!form.HRMS_employee_id) {
          setForm(p => ({ ...p, approved_by: '' }));
          return;
        }

        api.get(`/employees/${form.HRMS_employee_id}/supervisor`)
          .then(r => {
            if (!cancelled) setForm(p => ({ ...p, approved_by: r.data?.id || '' }));
          })
          .catch(() => {});

        return () => { cancelled = true; };
      }, [form.HRMS_employee_id]);

      useEffect(() => {
        const clockIn = minutesFromTime(form.clock_in);
        const clockOut = minutesFromTime(form.clock_out);
        if (clockIn === null || clockOut === null) {
          setForm(p => ({ ...p, hours_worked: '' }));
          return;
        }

        let diff = clockOut - clockIn;
        if (diff < 0) diff += 24 * 60;
        const hours = form.attendance_status === 'ABSENT' ? 0 : Number((diff / 60).toFixed(2));
        setForm(p => ({ ...p, hours_worked: diff === 0 ? '' : hours }));
      }, [form.clock_in, form.clock_out, form.attendance_status]);

      return null;
    }}
  />;
}
