import React, { useEffect, useRef, useState } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

function AppraisalAutoFill({ form, setForm, setOptions }) {
  const prevEmpId = useRef(null);
  const prevRatingKey = useRef('');

  useEffect(() => {
    const eid = form.HRMS_employee_id;
    if (eid && eid !== prevEmpId.current) {
      prevEmpId.current = eid;
      api.get(`/assignments?employee_id=${eid}`).then(res => {
        const asns = res.data || [];
        setOptions(asns.map(a => ({ v: a.id, l: a._displayId || a.id })));
        setForm(p => ({ ...p, HRMS_assignment_id: asns.length === 1 ? asns[0].id : '' }));
      }).catch(() => {});
    } else if (!eid && prevEmpId.current) {
      prevEmpId.current = null;
      setOptions([]);
      setForm(p => ({ ...p, HRMS_assignment_id: '' }));
    }
  }, [form.HRMS_employee_id, setForm, setOptions]);

  useEffect(() => {
    const eid = form.HRMS_employee_id;
    const cycleId = form.HRMS_appraisal_cycle_id;
    const key = `${eid || ''}:${cycleId || ''}`;
    if (!eid || !cycleId || key === prevRatingKey.current) return;
    prevRatingKey.current = key;
    api.get(`/appraisal-ratings?employee_id=${eid}&appraisal_cycle_id=${cycleId}&limit=500`).then(res => {
      const ratings = res.data || [];
      if (ratings.length === 0) return;
      const numeric = ratings.map(r => parseFloat(r.avg_hr_rating)).filter(v => !Number.isNaN(v));
      if (numeric.length === 0) return;
      const average = (numeric.reduce((sum, value) => sum + value, 0) / numeric.length).toFixed(2);
      setForm(p => ({ ...p, overall_rating: average }));
    }).catch(() => {});
  }, [form.HRMS_employee_id, form.HRMS_appraisal_cycle_id, setForm]);

  return null;
}

const REVIEW_PERIOD = [
  { v: 'APR_MAR', l: 'Apr - Mar' },
  { v: 'APR_SEP', l: 'Apr - Sep' },
  { v: 'OCT_MAR', l: 'Oct - Mar' },
  { v: 'APR_JUN', l: 'Apr - Jun' },
  { v: 'JUL_SEP', l: 'Jul - Sep' },
  { v: 'OCT_DEC', l: 'Oct - Dec' },
  { v: 'JAN_MAR', l: 'Jan - Mar' },
];

export default function AppraisalsPage() {
  const [asnOptions, setAsnOptions] = useState([]);

  return <GenericModule title="Appraisals" endpoint="appraisals"
    filterCols={[{ key: 'appraisal_status', label: 'Status' }]}
    columns={[
      { key: 'HRMS_employee_id', label: 'Employee name', render: (_, r) => r.Employee_Name || r._empName || r.HRMS_employee_id || '-' },
      { key: 'review_period', label: 'Review period' },
      { key: 'overall_rating', label: 'Overall rating' },
      { key: 'appraisal_status', label: 'Status', type: 'badge' },
    ]}
    fields={[
      { key: 'HRMS_appraisal_cycle_id', label: 'Appraisal cycle', type: 'lov', lovEndpoint: 'appraisal-cycles', labelFn: o => o.cycle_name },
      { key: 'HRMS_employee_id', label: 'Employee', required: true, type: 'lov', lovEndpoint: 'employees', labelFn: o => `${o.First_Name} ${o.Last_Name}`, tooltip: 'Shows employee name, not internal code' },
      { key: 'HRMS_assignment_id', label: 'Assignment', type: 'select', options: asnOptions },
      { key: 'HRMS_template_master_id', label: 'Template', type: 'lov', lovEndpoint: 'template-masters', labelFn: o => o.Template_Name },
      { key: 'review_period', label: 'Review period', type: 'select', options: REVIEW_PERIOD },
      { key: 'reviewer_employee_id', label: 'Reviewer', type: 'lov', lovEndpoint: 'employees', labelFn: o => `${o.First_Name} ${o.Last_Name}` },
      { key: 'overall_rating', label: 'Overall rating', numeric: true, min: 1, max: 10, help: 'Auto-fetched from average HR rating for the selected employee and appraisal cycle. Editable if needed.' },
      { key: 'recommendation', label: 'Recommendation', type: 'select', options: [{ v: 'INCREMENT', l: 'Increment' }, { v: 'PROMOTION', l: 'Promotion' }, { v: 'NO_CHANGE', l: 'No change' }, { v: 'PIP', l: 'PIP' }] },
      { key: 'appraisal_status', label: 'Status', type: 'select', options: [{ v: 'DRAFT', l: 'Draft' }, { v: 'SUBMITTED', l: 'Submitted' }, { v: 'APPROVED', l: 'Approved' }, { v: 'REJECTED', l: 'Rejected' }] },
    ]}
    extraForm={({ form, setForm }) => <AppraisalAutoFill form={form} setForm={setForm} setOptions={setAsnOptions} />}
  />;
}
