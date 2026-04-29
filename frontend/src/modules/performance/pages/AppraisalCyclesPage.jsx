import React from 'react';
import GenericModule from '../../GenericModule';
export default function AppraisalCyclesPage() {
  return <GenericModule title="Appraisal cycles" endpoint="appraisal-cycles"
    columns={[{key:'cycle_name',label:'Cycle name'},{key:'appraisal_after_months',label:'After (months)'},{key:'eligibility_days',label:'Eligibility days'}]}
    fields={[
      {key:'cycle_name',label:'Cycle name',required:true,minLen:5,maxLen:50},
      {key:'appraisal_after_months',label:'Appraisal after (months)',numeric:true,min:1,max:24},
      {key:'eligibility_days',label:'Eligibility days',numeric:true,min:1},
    ]}
  />;
}
