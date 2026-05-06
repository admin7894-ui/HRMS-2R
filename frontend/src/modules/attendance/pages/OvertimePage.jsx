import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

function OvertimeAutoFill({ form, setForm }) {
  const prevEmpId = useRef(null);

  useEffect(() => {
    const eid = form.HRMS_employee_id;
    if (!eid) {
      prevEmpId.current = null;
      setForm(p => ({ ...p, HRMS_assignment_id: '' }));
      return;
    }
    if (eid === prevEmpId.current) return;
    prevEmpId.current = eid;

    api.get(`/employees/${eid}/assignments`).then(res => {
      const assignments = res?.data || [];
      if (!Array.isArray(assignments) || assignments.length === 0) {
        setForm(p => ({ ...p, HRMS_assignment_id: '' }));
        return;
      }
      // Prefer latest assignment for the selected employee.
      const picked = [...assignments].sort((a, b) =>
        String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || ''))
      )[0];
      setForm(p => ({ ...p, HRMS_assignment_id: picked?.id || '' }));
    }).catch(() => { });
  }, [form.HRMS_employee_id, setForm]);

  return null;
}

// OT: work date not future; hours 1–24; multiplier 1.5/2/3; amount server-calc
// Approved by: LOV from employees; Assignment shows name
export default function OvertimePage() {
  return <GenericModule title="Overtime" endpoint="overtimes"
    filterCols={[{ key: 'approval_status', label: 'Approval status' }]}
    columns={[
      { key: 'HRMS_employee_id', label: 'Employee name', render: (_, r) => r.Employee_Name || r._empName || r.HRMS_employee_id || '—' },
      { key: 'work_date', label: 'Date', type: 'date' },
      { key: 'overtime_hours', label: 'Hours' },
      // {key:'overtime_amount',label:'Amount',type:'currency'},
      { key: 'approval_status', label: 'Approval status', type: 'badge' },
      { key: 'active_flag', label: 'Record status', type: 'badge' },
    ]}
    fields={[
      { key: 'HRMS_employee_id', label: 'Employee', required: true, type: 'lov', lovEndpoint: 'employees', labelFn: o => `${o.First_Name} ${o.Last_Name}` },
      { key: 'HRMS_assignment_id', label: 'Assignment name', required: true, type: 'lov', lovEndpoint: 'assignments', labelFn: o => o._displayId || o.id, tooltip: 'Auto-filled from selected employee assignment ID', readOnly: true },
      { key: 'work_date', label: 'Work date', required: true, type: 'date', maxDate: new Date().toISOString().split('T')[0], tooltip: 'Cannot be a future date' },
      { key: 'overtime_hours', label: 'Overtime hours (1–24)', required: true, numeric: true, min: 1, max: 24, regex: /^(?:[1-9]|1[0-9]|2[0-4])$/, regexMsg: 'Overtime hours must be a whole number between 1 and 24' },
      // {key:'overtime_rate_multiplier',label:'Rate multiplier',required:true,type:'select',options:[{v:'1.5',l:'1.5×'},{v:'2',l:'2×'},{v:'3',l:'3×'}]},
      // {key:'overtime_amount',label:'Overtime amount',type:'readonly',help:'Auto-calculated by server'},
      { key: 'approval_status', label: 'Approval status', required: true, type: 'select', options: [{ v: 'PENDING', l: 'Pending' }, { v: 'APPROVED', l: 'Approved' }, { v: 'REJECTED', l: 'Rejected' }] },
      { key: 'approved_by', label: 'Approved by', type: 'lov', lovEndpoint: 'employees', labelFn: o => `${o.First_Name} ${o.Last_Name}`, tooltip: 'Required when status is Approved' },
    ]}
    extraForm={({ form, setForm }) => <OvertimeAutoFill form={form} setForm={setForm} />}
  />;
}
