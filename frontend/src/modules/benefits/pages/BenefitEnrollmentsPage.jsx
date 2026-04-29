import React from 'react';
import GenericModule from '../../GenericModule';
// Assignment ID REMOVED; nominee details added
const NOM_REL = [{v:'FATHER',l:'Father'},{v:'MOTHER',l:'Mother'},{v:'SPOUSE',l:'Spouse'},{v:'SON',l:'Son'},{v:'DAUGHTER',l:'Daughter'},{v:'BROTHER',l:'Brother'},{v:'SISTER',l:'Sister'},{v:'OTHER',l:'Other'}];
const BLOOD = [{v:'A+',l:'A+'},{v:'A-',l:'A-'},{v:'B+',l:'B+'},{v:'B-',l:'B-'},{v:'AB+',l:'AB+'},{v:'AB-',l:'AB-'},{v:'O+',l:'O+'},{v:'O-',l:'O-'}];
export default function BenefitEnrollmentsPage() {
  return <GenericModule title="Benefit enrollments" endpoint="benefit-enrollments"
    filterCols={[{key:'enrollment_status',label:'Status'}]}
    columns={[
      {key:'HRMS_employee_id',label:'Employee name',render:(_,r)=>r._empName||r.HRMS_employee_id||'—'},
      {key:'HRMS_benefit_plan_id',label:'Benefit plan',render:(_,r)=>r._planName||r.HRMS_benefit_plan_id||'—'},
      {key:'nominee_name',label:'Nominee name'},
      {key:'enrollment_status',label:'Status',type:'badge'},
    ]}
    fields={[
      {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'HRMS_benefit_plan_id',label:'Benefit plan',required:true,type:'lov',lovEndpoint:'benefit-plans',labelFn:o=>o.benefit_plan_name},
      {key:'nominee_name',label:'Nominee name',type:'alpha'},
      {key:'nominee_relation',label:'Nominee relation',type:'select',options:NOM_REL},
      {key:'percentage_share',label:'Share %',numeric:true,min:1,max:100},
      {key:'nominee_date_of_birth',label:'Nominee DOB',type:'date'},
      {key:'nominee_contact_number',label:'Nominee contact',type:'phone'},
      {key:'nominee_blood_group',label:'Blood group',type:'select',options:BLOOD},
      {key:'enrollment_status',label:'Enrollment status',type:'select',options:[{v:'ACTIVE',l:'Active'},{v:'INACTIVE',l:'Inactive'},{v:'PENDING',l:'Pending'},{v:'CANCELLED',l:'Cancelled'}]},
    ]}
  />;
}
