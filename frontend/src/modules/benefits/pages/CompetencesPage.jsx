import React from 'react';
import GenericModule from '../../GenericModule';
// Competence code: auto-generated
export default function CompetencesPage() {
  return <GenericModule title="Competences" endpoint="competences"
    filterCols={[{key:'competence_type',label:'Type'}]}
    columns={[{key:'competence_code',label:'Code'},{key:'competence_name',label:'Competence name'},{key:'competence_type',label:'Type',type:'badge'}]}
    fields={[
      {key:'competence_name',label:'Competence name',required:true,minLen:3,maxLen:50,generatesCode:true,codeKey:'competence_code',tooltip:'Code auto-generates in UPPER_SNAKE format'},
      {key:'competence_code',label:'Competence code',type:'code',help:'Auto-generated (e.g. PYTHON_PROGRAMMING)'},
      {key:'competence_type',label:'Competence type',type:'select',options:[{v:'TECHNICAL',l:'Technical'},{v:'BEHAVIORAL',l:'Behavioral'},{v:'LEADERSHIP',l:'Leadership'},{v:'FUNCTIONAL',l:'Functional'}]},
    ]}
  />;
}
