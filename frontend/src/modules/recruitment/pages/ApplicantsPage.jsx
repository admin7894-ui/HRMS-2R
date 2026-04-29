
import React from 'react';
import GenericModule from '../../GenericModule';
export default function ApplicantsPage() {
  return <GenericModule title="Applicants" endpoint="applicants"
    filterCols={[{key:'Source',label:'Source'}]}
    columns={[{key:'First_Name',label:'First name'},{key:'Last_Name',label:'Last name'},{key:'Email',label:'Email'},{key:'Phone',label:'Phone'},{key:'Source',label:'Source',type:'badge'}]}
    fields={[
      {key:'First_Name',label:'First name',required:true,minLen:3,maxLen:15,section:'Personal'},
      {key:'Last_Name',label:'Last name',required:true,minLen:3,maxLen:15,section:'Personal'},
      {key:'Email',label:'Email',required:true,type:'email',section:'Personal',tooltip:'Format: abc@gmail.com'},
      {key:'Phone',label:'Mobile number',required:true,type:'phone',section:'Personal'},
      {key:'Date_of_Birth',label:'Date of birth',required:true,type:'date',section:'Personal'},
      {key:'Source',label:'Source',type:'select',options:[{v:'PORTAL',l:'Job portal'},{v:'LINKEDIN',l:'LinkedIn'},{v:'REFERRAL',l:'Referral'},{v:'DIRECT',l:'Direct'},{v:'WEBSITE',l:'Website'},{v:'SOCIAL',l:'Social media'}],section:'Personal'},
      {key:'Posting_Title',label:'Posting title',minLen:3,maxLen:20,section:'Application',tooltip:'Alphabets and spaces only, 3–20 characters'},
      {key:'Aadhar_Card_Number',label:'Aadhaar number',required:true,section:'Documents',tooltip:'Exactly 12 digits'},
      {key:'PAN_Card_Number',label:'PAN card number',required:true,section:'Documents',tooltip:'Format: AAAAA0000A'},
      {key:'Resume_Upload',label:'Resume upload',type:'file',accept:'.pdf,.doc,.docx',section:'Documents',tooltip:'PDF, DOC, DOCX only'},
      {key:'Aadhar_Card_Upload',label:'Aadhaar card upload',type:'file',accept:'.pdf,.jpg,.jpeg,.png',section:'Documents',tooltip:'Max 2MB. PDF/JPG/JPEG/PNG'},
      {key:'PAN_Card_Upload',label:'PAN card upload',type:'file',accept:'.pdf,.jpg,.jpeg,.png',section:'Documents',tooltip:'Max 1MB'},
      {key:'Passport_Size_Upload',label:'Passport size photo',type:'file',accept:'.jpg,.jpeg,.png',section:'Documents',tooltip:'Max 500KB. JPG/JPEG/PNG only'},
    ]}
  />;
}