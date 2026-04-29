
import React from 'react';
import GenericModule from '../../GenericModule';
export default function LocationsPage() {
  return <GenericModule title="Locations" endpoint="locations"
    filterCols={[{key:'Country',label:'Country'},{key:'State',label:'State'}]}
    columns={[{key:'Country',label:'Country'},{key:'State',label:'State'},{key:'City',label:'City'},{key:'Currency',label:'Currency'}]}
    fields={[
      {key:'Country',label:'Country',required:true},
      {key:'Currency',label:'Currency',required:true,tooltip:'Currency code e.g. INR, USD'},
      {key:'Time_Zone',label:'Time zone'},
      {key:'Country_Code',label:'Country code'},
      {key:'State',label:'State'},
      {key:'City',label:'City'},
      {key:'Postal_Code',label:'Postal code'},
    ]}
  />;
}