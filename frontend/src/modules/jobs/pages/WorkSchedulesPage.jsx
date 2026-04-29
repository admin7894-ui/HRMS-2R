
import React from 'react';
import GenericModule from '../../GenericModule';
export default function WorkSchedulesPage() {
  // No duplicate Module field - only under Organisation Context
  return <GenericModule title="Work schedules" endpoint="work-schedules"
    filterCols={[{key:'Work_Schedule_Name',label:'Schedule name'}]}
    columns={[{key:'Work_Schedule_Name',label:'Name'},{key:'Work_Schedule_Code',label:'Code'},{key:'Shift_Start',label:'Start'},{key:'Shift_End',label:'End'},{key:'Working_Hours',label:'Hours'}]}
    fields={[
      {key:'Work_Schedule_Name',label:'Schedule name',required:true,minLen:5,maxLen:20,generatesCode:true,codeKey:'Work_Schedule_Code'},
      {key:'Work_Schedule_Code',label:'Schedule code',required:true,type:'code'},
      {key:'Shift_Start',label:'Shift start',required:true,type:'time',tooltip:'hh:mm format, defaults to 00:00'},
      {key:'Shift_End',label:'Shift end',required:true,type:'time'},
      {key:'Break_Minutes',label:'Break minutes (max 30)',required:true,numeric:true,min:0,max:30,tooltip:'Maximum 30 minutes allowed'},
      {key:'Working_Hours',label:'Working hours (max 8)',required:true,numeric:true,min:0,max:8},
      {key:'Applicable_Days',label:'Applicable days',required:true,type:'multicheck',options:[{v:'Sun',l:'Sunday'},{v:'Mon',l:'Monday'},{v:'Tue',l:'Tuesday'},{v:'Wed',l:'Wednesday'},{v:'Thu',l:'Thursday'},{v:'Fri',l:'Friday'},{v:'Sat',l:'Saturday'}]},
    ]}
  />;
}