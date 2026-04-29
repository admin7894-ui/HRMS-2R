
import React from 'react';
import GenericModule from '../../GenericModule';
const QUAL = [{v:'B.A',l:'B.A'},{v:'B.Com',l:'B.Com'},{v:'B.Sc',l:'B.Sc'},{v:'B.Tech / B.E',l:'B.Tech / B.E'},{v:'BBA',l:'BBA'},{v:'BCA',l:'BCA'},{v:'M.A',l:'M.A'},{v:'M.Com',l:'M.Com'},{v:'M.Sc',l:'M.Sc'},{v:'M.Tech / M.E',l:'M.Tech / M.E'},{v:'MBA',l:'MBA'},{v:'MCA',l:'MCA'},{v:'PhD',l:'PhD'},{v:'Diploma (Engineering)',l:'Diploma (Engineering)'},{v:'Diploma (Management)',l:'Diploma (Management)'},{v:'Other',l:'Other'}];
export default function RequisitionsPage() {
  // Vacancy Count: 1–1000; Qualification: LOV with Other; Status: Open/Close; Priority: High/Medium/Low
  return <GenericModule title="Requisitions" endpoint="requisitions"
    filterCols={[{key:'Priority',label:'Priority'},{key:'Requisition_Status',label:'Status'}]}
    columns={[
      {key:'HRMS_Department_ID',label:'Department',render:(_,r)=>r._deptName||r.HRMS_Department_ID||'—'},
      {key:'HRMS_Position_ID',label:'Position',render:(_,r)=>r._positionName||r.HRMS_Position_ID||'—'},
      {key:'Vacancy_Count',label:'Vacancies'},
      {key:'Priority',label:'Priority',type:'badge'},
      {key:'Requisition_Status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_Department_ID',label:'Department',required:true,type:'lov',lovEndpoint:'departments',labelFn:o=>o.Department_Name},
      {key:'HRMS_Position_ID',label:'Position',required:true,type:'lov',lovEndpoint:'positions',labelFn:o=>o.Position_Name},
      {key:'Requested_By_Employee_ID',label:'Requested by',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Vacancy_Count',label:'Vacancy count (1–1000)',required:true,numeric:true,min:1,max:1000},
      {key:'Priority',label:'Priority',required:true,type:'select',options:[{v:'HIGH',l:'High'},{v:'MEDIUM',l:'Medium'},{v:'LOW',l:'Low'}]},
      {key:'Requisition_Status',label:'Status',required:true,type:'select',options:[{v:'OPEN',l:'Open'},{v:'CLOSE',l:'Close'}]},
      {key:'Qualification_Required',label:'Qualification required',type:'select',options:QUAL},
      {key:'Raised_Date',label:'Raised date',required:true,type:'date'},
      {key:'Target_Closed_Date',label:'Target close date',required:true,type:'date'},
      // {key:'Effective_To',label:'Effective to',required:true,type:'date'},
    ]}
  />;
}