
import React from 'react';
import GenericModule from '../../GenericModule';
// Template Code auto-generates from Template Name; No duplicate Module field
export default function TemplateMastersPage() {
  return <GenericModule title="Template masters" endpoint="template-masters"
    filterCols={[{key:'Template_Type',label:'Type'}]}
    columns={[{key:'Template_Code',label:'Code'},{key:'Template_Type',label:'Type',type:'badge'},{key:'Template_Name',label:'Name'}]}
    fields={[
      {key:'Template_Name',label:'Template name',required:true,minLen:5,maxLen:50,generatesCode:true,codeKey:'Template_Code',tooltip:'Name auto-generates the code'},
      {key:'Template_Code',label:'Template code',required:true,type:'code'},
      {key:'Template_Type',label:'Template type',required:true,type:'select',options:[{v:'CONSENT',l:'Consent'},{v:'APPRAISAL',l:'Appraisal'},{v:'OFFER_LETTER',l:'Offer letter'},{v:'TERMINATION',l:'Termination'},{v:'OTHER',l:'Other'}]},
      {key:'Description',label:'Description',type:'textarea',maxLen:200},
    ]}
  />;
}