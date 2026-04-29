
import React from 'react';
import GenericModule from '../../GenericModule';
const ROUND = [{v:1,l:'1'},{v:2,l:'2'},{v:3,l:'3'},{v:4,l:'4'},{v:5,l:'5'},{v:6,l:'6'},{v:7,l:'7'},{v:8,l:'8'},{v:9,l:'9'},{v:10,l:'10'}];
const RATING = [{v:1,l:'1'},{v:2,l:'2'},{v:3,l:'3'},{v:4,l:'4'},{v:5,l:'5'}];
// Interview date: future dates only; time defaults 00:00; Status: Scheduled/Completed/Cancelled
const tomorrow = () => { const d = new Date(); d.setDate(d.getDate()+1); return d.toISOString().split('T')[0]; };
export default function InterviewsPage() {
  return <GenericModule title="Interviews" endpoint="interviews"
    filterCols={[{key:'Interview_Status',label:'Status'},{key:'Interview_Mode',label:'Mode'}]}
    columns={[
      {key:'HRMS_Application_ID',label:'Application',render:(_,r)=>r._applicationName||r.HRMS_Application_ID||'—'},
      {key:'Interview_Round',label:'Round'},
      {key:'Interview_Mode',label:'Mode',type:'badge'},
      {key:'Interview_Status',label:'Status',type:'badge'},
      {key:'Rating',label:'Rating'},
    ]}
    fields={[
      {key:'HRMS_Application_ID',label:'Application',required:true,type:'lov',lovEndpoint:'applications',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Interview_Round',label:'Interview round',required:true,type:'select',options:ROUND},
      {key:'Interview_Date',label:'Interview date & time',required:true,type:'datetime-local',minDate:tomorrow(),tooltip:'Future dates only. Time defaults to 00:00'},
      {key:'Interview_Employee_ID',label:'Interviewer',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
      {key:'Interview_Mode',label:'Mode',required:true,type:'select',options:[{v:'ONLINE',l:'Online'},{v:'OFFLINE',l:'Offline'},{v:'PHONE',l:'Phone'},{v:'HYBRID',l:'Hybrid'}]},
      {key:'Interview_Status',label:'Status',required:true,type:'select',options:[{v:'SCHEDULED',l:'Scheduled'},{v:'COMPLETED',l:'Completed'},{v:'CANCELLED',l:'Cancelled'}]},
      {key:'Rating',label:'Rating (1–5)',required:true,type:'select',options:RATING},
      {key:'Feedback',label:'Feedback',type:'textarea',minLen:3,maxLen:200},
    ]}
  />;
}