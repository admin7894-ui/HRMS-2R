import React from 'react';
import GenericModule from '../../GenericModule';
// Minimum rating: LOV 0–5 (not free text)
const RATING_OPTS = [{ v: 0, l: '0' }, { v: 1, l: '1' }, { v: 2, l: '2' }, { v: 3, l: '3' }, { v: 4, l: '4' }, { v: 5, l: '5' }];
export default function AppraisalKeyAreasPage() {
  return <GenericModule title="Appraisal key areas" endpoint="appraisal-key-areas"
    columns={[{ key: 'key_area_name', label: 'Key area name' }, { key: 'key_area_weightage', label: 'Weightage %' }, { key: 'minimum_rating', label: 'Min' }, { key: 'maximum_rating', label: 'Max' }]}
    fields={[ /* Form fix: Replace Appraisal LOV field with Appraisal Cycle LOV field */
      { key: 'HRMS_appraisal_cycle_id', label: 'Appraisal Cycle', required: true, type: 'lov', lovEndpoint: 'appraisal-cycles', labelFn: o => o.cycle_name, tooltip: 'Displays the name of the appraisal cycle' },
      { key: 'key_area_name', label: 'Key area name', required: true, minLen: 3, maxLen: 50 },
      { key: 'key_area_weightage', label: 'Weightage (%)', numeric: true, min: 1, max: 100 },
      { key: 'minimum_rating', label: 'Minimum rating (0–5)', required: true, type: 'select', options: RATING_OPTS, tooltip: 'Select from 0–5. Free text not allowed.' },
      { key: 'maximum_rating', label: 'Maximum rating', numeric: true, min: 0, max: 10 },
      { key: 'description', label: 'Description', type: 'textarea', maxLen: 200 },
    ]}
  />;
}
