import React, { useState, useEffect } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';
import { Modal, DataTable, Badge } from '../../../components/UI';

export default function LeaveBalancesPage() {
  const [history, setHistory] = useState(null);

  const fetchHistory = (row) => {
    api.get('/absences', { params: { HRMS_employee_id: row.HRMS_employee_id, HRMS_absence_type_id: row.HRMS_absence_type_id, status: 'APPROVED', limit: 1000 } })
      .then(r => setHistory({ row, absences: r.data || [] }));
  };

  return (
    <>
      <GenericModule title="Leave balances" endpoint="leave-balances"
        columns={[
          {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r.Employee_Name||r._empName||r.HRMS_employee_id||'-'},
          {key:'HRMS_absence_type_id',label:'Absence type',render:(_,r)=>r.Absence_Type_Name||r._absenceTypeName||r.HRMS_absence_type_id||'-'},
          {key:'entitlement',label:'Entitlement'},
          {key:'used',label:'Used'},
          {key:'balance',label:'Balance'},
          {key:'last_leave_date',label:'Last leave date',type:'date'},
          {key:'actions', label: 'History', render: (_, r) => (
            <button className="btn btn-ghost btn-xs text-primary-600 hover:bg-primary-50 px-2" onClick={() => fetchHistory(r)} title="View Absence History">
              👁 View History
            </button>
          )}
        ]}
        fields={[
          {key:'HRMS_employee_id',label:'Employee',required:true,type:'lov',lovEndpoint:'employees',labelFn:o=>`${o.First_Name} ${o.Last_Name}`},
          {key:'HRMS_absence_type_id',label:'Absence type',required:true,type:'lov',lovEndpoint:'absence-types',labelFn:o=>o.absence_name},
          {key:'entitlement',label:'Entitlement days',type:'readonly',help:'Auto-fetched from absence type'},
          {key:'used',label:'Used days',type:'readonly',help:'Auto-calculated from approved absences'},
          {key:'balance',label:'Balance days',type:'readonly',help:'Entitlement - Used'},
          {key:'last_leave_date',label:'Last leave date',type:'readonly'},
        ]}
        extraForm={({form, setForm}) => {
          useEffect(() => {
            if (form.HRMS_employee_id && form.HRMS_absence_type_id) {
              api.get(`/employees/${form.HRMS_employee_id}/absences-summary/${form.HRMS_absence_type_id}`)
                .then(r => {
                  const summary = r.data || {};
                  setForm(p => ({
                    ...p,
                    entitlement: summary.entitlement ?? '',
                    used: summary.used ?? '',
                    balance: summary.balance ?? '',
                  }));
                });
            }
          }, [form.HRMS_employee_id, form.HRMS_absence_type_id]);
          return null;
        }}
      />

      <Modal open={!!history} onClose={() => setHistory(null)} title="Absence History" size="lg">
        {history && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employee</p>
                <p className="text-sm font-bold text-gray-900">{history.row.Employee_Name || history.row._empName}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Absence Type</p>
                <p className="text-sm font-bold text-gray-900">{history.row.Absence_Type_Name || history.row._absenceTypeName}</p>
              </div>
            </div>

            <DataTable
              cols={[
                { key: 'start_date', label: 'Start Date', type: 'date' },
                { key: 'end_date', label: 'End Date', type: 'date' },
                { key: 'days', label: 'Days' },
                { key: 'status', label: 'Status', type: 'badge' },
              ]}
              data={history.absences.sort((a,b) => new Date(b.start_date) - new Date(a.start_date))}
            />

            <div className="flex justify-between items-center bg-primary-50 p-4 rounded-xl border border-primary-100">
              <div>
                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">Total Entitlement</p>
                <p className="text-xl font-black text-primary-700">{history.row.entitlement}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">Total Used Days</p>
                <p className="text-xl font-black text-primary-700">{history.row.used}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-primary-400 uppercase tracking-wider">Remaining Balance</p>
                <p className="text-xl font-black text-emerald-600">{history.row.balance}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
