import React from 'react';
import GenericModule from '../../GenericModule';
// Absence code: auto-generated from name; Entitlement max 365 (days, not months)
const MAX_CARRY = [{v:0,l:'0'},{v:1,l:'1'},{v:2,l:'2'},{v:3,l:'3'},{v:4,l:'4'},{v:5,l:'5'}];
export default function AbsenceTypesPage() {
  return <GenericModule title="Absence types" endpoint="absence-types"
    columns={[
      {key:'absence_code',label:'Absence code'},
      {key:'absence_name',label:'Absence name'},
      {key:'entitlement_per_year',label:'Entitlement / year'},
      {key:'carry_forward_flag',label:'Carry forward',type:'yesno'},
    ]}
    fields={[
      {key:'absence_name',label:'Absence name',required:true,type:'alpha',minLen:3,maxLen:15,generatesCode:true,codeKey:'absence_code',tooltip:'Alphabets only. Code auto-generates from name.'},
      {key:'absence_code',label:'Absence code',required:true,type:'code',help:'Auto-generated from absence name'},
      {key:'entitlement_per_year',label:'Entitlement per year (days)',required:true,numeric:true,min:1,max:365,tooltip:'Enter number of days (max 365). NOT months.'},
      {key:'carry_forward_flag',label:'Carry forward',required:true,type:'select',options:[{v:'true',l:'Yes'},{v:'false',l:'No'}]},
      {key:'max_carry_days',label:'Max carry days (0–5)',required:true,type:'select',options:MAX_CARRY},
    ]}
  />;
}
