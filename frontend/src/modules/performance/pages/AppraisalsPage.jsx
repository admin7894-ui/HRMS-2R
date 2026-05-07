import React, { useEffect, useRef, useState } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';

function AppraisalAutoFill({ form, setForm, setOptions }) {
  const prevKey = useRef('');
  const prevAsnId = useRef(null);
  const prevLadderId = useRef(null);

  useEffect(() => {
    const eid = form.HRMS_employee_id;
    const cycleId = form.HRMS_appraisal_cycle_id;
    const key = `${eid || ''}:${cycleId || ''}`;

    // Requirement 3: Reset when either changes
    if (key !== prevKey.current) {
      prevKey.current = key;
      // Skip reset if it's initial load of an existing record
      if (form.id) return;

      setForm(p => ({
        ...p,
        HRMS_assignment_id: '',
        reviewer_employee_id: '',
        overall_rating: '',
        HRMS_template_master_id: '',
        review_period: '',
        recommendation: '',
        current_grade_id: '',
        recommended_grade_id: ''
      }));

      // Requirement 1: Only fetch if BOTH are selected
      if (!eid || !cycleId) {
        setOptions([]);
        return;
      }

      // Fetch assignments for the employee (needed for the dropdown)
      api.get(`/employees/${eid}/assignments`).then(res => {
        const asns = res?.data || [];
        setOptions(asns.map(a => ({ v: a.id, l: a._displayId || a.id })));
        const latestAsn = [...asns].sort((a, b) =>
          String(b.updated_at || b.created_at || '').localeCompare(String(a.updated_at || a.created_at || ''))
        )[0];

        // Requirement 2: Fetch LATEST previous appraisal for this employee + cycle
        api.get(`/appraisals?HRMS_employee_id=${eid}&HRMS_appraisal_cycle_id=${cycleId}&sortBy=created_at&sortOrder=desc&limit=1`).then(aRes => {
          const latestAppr = aRes.data?.[0];
          
          // Requirement: Auto-fetch average HR rating from Appraisal Ratings table
          api.get('/appraisal-ratings', { params: { employee_id: eid, appraisal_cycle_id: cycleId, limit: 1 } }).then(arRes => {
            const ar = arRes.data?.[0];
            const avgRating = ar ? ar.avg_hr_rating : '';

            if (latestAppr) {
              setForm(p => ({
                ...p,
                HRMS_assignment_id: latestAppr.HRMS_assignment_id || latestAsn?.id || '',
                reviewer_employee_id: latestAppr.reviewer_employee_id || '',
                overall_rating: avgRating || latestAppr.overall_rating || '',
                HRMS_template_master_id: latestAppr.HRMS_template_master_id || '',
                review_period: latestAppr.review_period || '',
                recommendation: latestAppr.recommendation || ''
              }));
            } else {
              setForm(p => ({ 
                ...p, 
                HRMS_assignment_id: latestAsn?.id || '',
                overall_rating: avgRating || ''
              }));
            }

            // Auto-fetch Template Assignment
            api.get('/template-assignments', { params: { HRMS_employee_id: eid, limit: 1 } }).then(taRes => {
              const ta = taRes.data?.[0];
              if (ta) {
                setForm(p => ({
                  ...p,
                  HRMS_template_assignment_id: ta.id,
                  HRMS_template_master_id: p.HRMS_template_master_id || ta.HRMS_template_master_id || ''
                }));
              }
            });
          }).catch(() => {
            // Fallback if appraisal-ratings fetch fails
            if (latestAppr) {
              setForm(p => ({
                ...p,
                HRMS_assignment_id: latestAppr.HRMS_assignment_id || latestAsn?.id || '',
                reviewer_employee_id: latestAppr.reviewer_employee_id || '',
                overall_rating: latestAppr.overall_rating || '',
                HRMS_template_master_id: latestAppr.HRMS_template_master_id || '',
                review_period: latestAppr.review_period || '',
                recommendation: latestAppr.recommendation || ''
              }));
            } else {
              setForm(p => ({ ...p, HRMS_assignment_id: latestAsn?.id || '' }));
            }
          });
        });
      }).catch(() => { });
    }
  }, [form.HRMS_employee_id, form.HRMS_appraisal_cycle_id, form.id, setForm, setOptions]);

  // Handle manual Template Assignment selection -> update Template
  useEffect(() => {
    const taid = form.HRMS_template_assignment_id;
    if (taid && !form.id) { // Only auto-update template on selection if it's a new record
      api.get(`/template-assignments/${taid}`).then(res => {
        if (res.data?.HRMS_template_master_id) {
          setForm(p => ({ ...p, HRMS_template_master_id: res.data.HRMS_template_master_id }));
        }
      });
    }
  }, [form.HRMS_template_assignment_id, setForm, form.id]);

  // Fetch Current Grade when Assignment changes
  useEffect(() => {
    const asid = form.HRMS_assignment_id;
    if (asid && asid !== prevAsnId.current) {
      prevAsnId.current = asid;
      api.get(`/assignments/${asid}`).then(res => {
        const asn = res.data;
        if (asn) {
          let gradeId = asn.HRMS_grade_id || asn.grade_id;
          if (!gradeId && asn.HRMS_position_id) {
            api.get(`/positions/${asn.HRMS_position_id}`).then(pRes => {
              setForm(p => ({ ...p, current_grade_id: pRes.data?.HRMS_grade_id || '' }));
            });
          } else {
            setForm(p => ({ ...p, current_grade_id: gradeId || '' }));
          }
        }
      }).catch(() => { });
    }
  }, [form.HRMS_assignment_id, setForm]);

  // Fetch Recommended Grade when Grade Ladder changes
  useEffect(() => {
    const glid = form.HRMS_grade_ladder_id;
    const curGrade = form.current_grade_id;
    if (glid && (glid !== prevLadderId.current || curGrade !== (setForm.prevCurGrade || ''))) {
      prevLadderId.current = glid;
      setForm.prevCurGrade = curGrade;
      api.get(`/grade-ladders/${glid}`).then(res => {
        const ladder = res.data;
        if (ladder && String(ladder.HRMS_From_Grade_ID) === String(curGrade)) {
          setForm(p => ({ ...p, recommended_grade_id: ladder.HRMS_To_Grade_ID || '' }));
        } else {
          setForm(p => ({ ...p, recommended_grade_id: '' }));
        }
      }).catch(() => { });
    } else if (!glid) {
      setForm(p => ({ ...p, recommended_grade_id: '' }));
    }
  }, [form.HRMS_grade_ladder_id, form.current_grade_id, setForm]);

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
      { key: 'HRMS_assignment_id', label: 'Assignment', required: true, type: 'select', options: asnOptions, readOnly: true, tooltip: 'Auto-filled from selected employee assignment ID' },
      { key: 'HRMS_grade_ladder_id', label: 'Grade ladder', type: 'lov', lovEndpoint: 'grade-ladders', labelFn: o => o.Ladder_Name },
      { key: 'current_grade_id', label: 'Current grade', type: 'lov', lovEndpoint: 'grades', labelFn: o => o.Grade_Name, readOnly: true },
      { key: 'HRMS_template_master_id', label: 'Template', type: 'lov', lovEndpoint: 'template-masters', labelFn: o => o.Template_Name },
      { key: 'HRMS_template_assignment_id', label: 'Template assignment', type: 'lov', lovEndpoint: 'template-assignments', labelFn: o => `${o._templateName || o.HRMS_template_master_id || ''} — ${o.Employee_Name || o._empName || o._applicantName || o.HRMS_employee_id || ''}` },
      { key: 'review_period', label: 'Review period', type: 'select', options: REVIEW_PERIOD },
      { key: 'reviewer_employee_id', label: 'Reviewer', type: 'lov', lovEndpoint: 'employees', labelFn: o => `${o.First_Name} ${o.Last_Name}` },
      { key: 'overall_rating', label: 'Overall rating', numeric: true, min: 1, max: 10, help: 'Auto-fetched from average HR rating for the selected employee and appraisal cycle. Editable if needed.' },
      { key: 'recommendation', label: 'Recommendation', type: 'select', options: [{ v: 'INCREMENT', l: 'Increment' }, { v: 'PROMOTION', l: 'Promotion' }, { v: 'NO_CHANGE', l: 'No change' }, { v: 'PIP', l: 'PIP' }] },
      { key: 'appraisal_status', label: 'Status', type: 'select', options: [{ v: 'DRAFT', l: 'Draft' }, { v: 'SUBMITTED', l: 'Submitted' }, { v: 'APPROVED', l: 'Approved' }, { v: 'REJECTED', l: 'Rejected' }] },
    ]}
    extraForm={({ form, setForm }) => <AppraisalAutoFill form={form} setForm={setForm} setOptions={setAsnOptions} />}
  />;
}
