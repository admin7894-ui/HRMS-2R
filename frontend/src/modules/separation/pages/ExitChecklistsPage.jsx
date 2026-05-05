import React, { useEffect, useRef } from 'react';
import GenericModule from '../../GenericModule';
// Checklist item: multi-select LOV with fixed values
const CHECKLIST_ITEMS = [
  {v:'RETURN_LAPTOP',l:'Return laptop'},
  {v:'REVOKE_ACCESS_CARDS',l:'Revoke access cards'},
  {v:'RETURN_ID_CARD',l:'Return ID card'},
  {v:'KNOWLEDGE_TRANSFER',l:'Knowledge transfer'},
  {v:'CLEAR_DUES',l:'Clear dues'},
  {v:'HANDOVER_DOCUMENTATION',l:'Handover documentation'},
];

function ExitChecklistAutoFill({ form, setForm, api }) {
  const prevSepId = useRef(null);

  useEffect(() => {
    const sid = form.HRMS_separation_id;
    if (!sid) {
      prevSepId.current = null;
      setForm(p => ({ ...p, HRMS_employee_id: '', department: '' }));
      return;
    }
    if (sid === prevSepId.current) return;
    prevSepId.current = sid;

    api.get(`/separations/${sid}`).then(async (res) => {
      const sep = res?.data || {};
      const employeeId = sep.HRMS_employee_id || '';
      let departmentId = '';

      if (sep.HRMS_assignment_id) {
        try {
          const asnRes = await api.get(`/assignments/${sep.HRMS_assignment_id}`);
          departmentId = asnRes?.data?.HRMS_department_id || '';
        } catch {}
      }
      if (!departmentId && employeeId) {
        try {
          const asnList = await api.get(`/employees/${employeeId}/assignments`);
          departmentId = asnList?.data?.[0]?.HRMS_department_id || '';
        } catch {}
      }

      setForm(p => ({
        ...p,
        HRMS_employee_id: employeeId,
        department: departmentId,
      }));
    }).catch(() => {});
  }, [form.HRMS_separation_id, setForm, api]);

  return null;
}

export default function ExitChecklistsPage() {
  return <GenericModule title="Exit checklists" endpoint="exit-checklists"
    filterCols={[{key:'status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'—'},
      {key:'checklist_item',label:'Checklist item',render:(_,r)=>r.Checklist_Item_Display||r.checklist_item||'—'},
      {key:'department',label:'Department',render:(_,r)=>r.Department_Name||r._deptName||r.department||'—'},
      {key:'status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_separation_id',label:'Separation',required:true,type:'lov',lovEndpoint:'separations',labelFn:o=>`${o._displayId||o.id} – ${o.Employee_Name || o._empName || '—'}`},
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'checklist_item',label:'Checklist items',required:true,type:'multicheck',options:CHECKLIST_ITEMS,tooltip:'Select all applicable checklist items'},
      {key:'department',label:'Department',required:true,type:'lov',lovEndpoint:'departments',labelFn:o=>o.Department_Name,readOnly:true,tooltip:'Auto-filled from selected separation/assignment'},
      {key:'assigned_to',label:'Assigned to',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'status',label:'Status',required:true,type:'select',options:[{v:'PENDING',l:'Pending'},{v:'IN_PROGRESS',l:'In progress'},{v:'COMPLETED',l:'Completed'}]},
      {key:'completion_date',label:'Completion date',required:true,type:'date'},
      {key:'remarks',label:'Remarks',type:'textarea',maxLen:200},
    ]}
    extraForm={({ form, setForm, api }) => <ExitChecklistAutoFill form={form} setForm={setForm} api={api} />}
  />;
}
