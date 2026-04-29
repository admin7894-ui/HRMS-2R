
import React from 'react';
import GenericModule from '../../GenericModule';
export default function GradesPage() {
  // Max Salary field REMOVED per requirement
  return <GenericModule title="Grades" endpoint="grades"
    filterCols={[{ key: 'Grade_Name', label: 'Grade name' }]}
    columns={[{ key: 'Grade_Code', label: 'Code' }, { key: 'Grade_Name', label: 'Name' }]}
    fields={[
      { key: 'Grade_Name', label: 'Grade name', required: true, type: 'alpha', minLen: 5, maxLen: 20, generatesCode: true, codeKey: 'Grade_Code', tooltip: 'Alphabets only. Code auto-generates.' },
      { key: 'Grade_Code', label: 'Grade code', required: false, type: 'code' },
      {
        key: 'Min_Salary', label: 'Salary range', required: true, type: 'lov', lovEndpoint: 'salary-ranges',
        labelFn: o => `${Number(o.Minimum_Salary || 0).toLocaleString('en-IN')} – ${Number(o.Maximum_Salary || 0).toLocaleString('en-IN')} ${o.Currency_Code || 'INR'}`,
        tooltip: 'Select salary range for this grade'
      },
    ]}
  />;
}