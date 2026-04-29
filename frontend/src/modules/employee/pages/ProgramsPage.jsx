
import React from 'react';
import GenericModule from '../../GenericModule';
// Duration Hours max REMOVED (was incorrectly 8); now 999; Code auto-generates
export default function ProgramsPage() {
  return <GenericModule title="Training programs" endpoint="programs"
    filterCols={[{key:'Delivery_Mode',label:'Mode'}]}
    columns={[{key:'Program_Code',label:'Training program code'},{key:'Program_Name',label:'Training program name'},{key:'Provider',label:'Provider name'},{key:'Duration_Hours',label:'Hours'},{key:'Delivery_Mode',label:'Mode',type:'badge'}]}
    fields={[
      {key:'Program_Name',label:'Training program name',required:true,minLen:5,maxLen:50,generatesCode:true,codeKey:'Program_Code',tooltip:'Name auto-generates the code instantly'},
      {key:'Program_Code',label:'Training program code',type:'code',tooltip:'Auto-generated from name'},
      {key:'Provider',label:'Provider name'},
      {key:'Duration_Hours',label:'Duration hours',numeric:true,min:0,max:999,tooltip:'Maximum 999 hours (not 8)'},
      {key:'Cost_per_Person',label:'Cost per person (₹)',numeric:true},
      {key:'Delivery_Mode',label:'Delivery mode',type:'select',options:[{v:'ONLINE',l:'Online'},{v:'OFFLINE',l:'Offline'},{v:'HYBRID',l:'Hybrid'}]},
    ]}
  />;
}