import React from 'react';
import GenericModule from '../../GenericModule';
export default function HolidaysPage() {
  return <GenericModule title="Holidays" endpoint="holidays"
    filterCols={[{key:'holiday_type',label:'Type'}]}
    columns={[{key:'holiday_date',label:'Date',type:'date'},{key:'holiday_name',label:'Holiday name'},{key:'holiday_type',label:'Type',type:'badge'}]}
    fields={[
      {key:'holiday_date',label:'Holiday date',required:true,type:'date'},
      {key:'holiday_name',label:'Holiday name',required:true,minLen:3,maxLen:50},
      {key:'holiday_type',label:'Holiday type',required:true,type:'select',options:[{v:'NATIONAL',l:'National'},{v:'REGIONAL',l:'Regional'},{v:'RELIGIOUS',l:'Religious'},{v:'COMPANY',l:'Company'}]},
      {key:'country_id',label:'Country / Location',required:true,type:'lov',lovEndpoint:'locations',labelFn:o=>`${o.City}, ${o.State}, ${o.Country}`},
    ]}
  />;
}
