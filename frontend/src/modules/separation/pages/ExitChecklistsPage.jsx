import React from 'react';
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
export default function ExitChecklistsPage() {
  return <GenericModule title="Exit checklists" endpoint="exit-checklists"
    filterCols={[{key:'status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'checklist_item',label:'Checklist item'},
      {key:'department',label:'Department'},
      {key:'status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_separation_id',label:'Separation',required:true,type:'lov',lovEndpoint:'separations',labelFn:o=>o._displayId||o.id},
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'checklist_item',label:'Checklist items',required:true,type:'multicheck',options:CHECKLIST_ITEMS,tooltip:'Select all applicable checklist items'},
      {key:'department',label:'Department',type:'lov',lovEndpoint:'departments',labelFn:o=>o.Department_Name},
      {key:'assigned_to',label:'Assigned to',type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'status',label:'Status',type:'select',options:[{v:'PENDING',l:'Pending'},{v:'IN_PROGRESS',l:'In progress'},{v:'COMPLETED',l:'Completed'}]},
      {key:'completion_date',label:'Completion date',type:'date'},
      {key:'remarks',label:'Remarks',type:'textarea',maxLen:200},
    ]}
  />;
}
