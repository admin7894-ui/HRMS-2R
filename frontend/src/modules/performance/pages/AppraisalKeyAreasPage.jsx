import React from 'react';
import GenericModule from '../../GenericModule';

const RATING_OPTS = Array.from({ length: 11 }, (_, i) => ({ v: i, l: String(i) }));

export default function AppraisalKeyAreasPage() {
  return <GenericModule title="Appraisal key areas" endpoint="appraisal-key-areas"
    columns={[{ key: 'key_area_name', label: 'Key area name' }, { key: 'key_area_weightage', label: 'Weightage %' }, { key: 'minimum_rating', label: 'Min' }, { key: 'maximum_rating', label: 'Max' }]}
    fields={[
      { key: 'HRMS_appraisal_cycle_id', label: 'Appraisal Cycle', required: true, type: 'lov', lovEndpoint: 'appraisal-cycles', labelFn: o => o.cycle_name, tooltip: 'Displays the name of the appraisal cycle' },
      { key: 'key_area_name', label: 'Key area name', required: true, minLen: 3, maxLen: 50 },
      { key: 'key_area_weightage', label: 'Weightage (%)', numeric: true, min: 1, max: 100 },
      { key: 'minimum_rating', label: 'Minimum rating', required: true, type: 'select', options: RATING_OPTS, tooltip: 'Select from 0 to 10.' },
      { key: 'maximum_rating', label: 'Maximum rating', required: true, type: 'select', options: RATING_OPTS, tooltip: 'Select from 0 to 10.' },
      { key: 'description', label: 'Description', type: 'textarea', maxLen: 200 },
    ]}
    customValidate={candidate => {
      const min = parseFloat(candidate.minimum_rating);
      const max = parseFloat(candidate.maximum_rating);
      if (!Number.isNaN(min) && !Number.isNaN(max) && max <= min) {
        return { maximum_rating: 'Maximum Rating must be greater than Minimum Rating' };
      }
      return {};
    }}
  />;
}
