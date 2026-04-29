
import React from 'react';
import GenericModule from '../../GenericModule';
export default function TableAccessPage() {
  return <GenericModule title="Table access" endpoint="table-accesses"
    columns={[{key:'USER_NAME_ID',label:'User'},{key:'TABLE_ACCESS',label:'Table'},{key:'CREATE',label:'Create',type:'badge'},{key:'READ',label:'Read',type:'badge'}]}
    fields={[
      {key:'SECURITY_ROLES_ID',label:'Security role',type:'lov',lovEndpoint:'security-roles',labelFn:o=>o.USER_NAME},
      {key:'USER_NAME_ID',label:'Username',required:true},
      {key:'TABLE_ACCESS',label:'Table name',required:true},
      {key:'CREATE',label:'Create',type:'select',options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}]},
      {key:'READ',label:'Read',type:'select',options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}]},
      {key:'UPDATE',label:'Update',type:'select',options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}]},
      {key:'DELETE',label:'Delete',type:'select',options:[{v:'Y',l:'Yes'},{v:'N',l:'No'}]},
    ]}
  />;
}