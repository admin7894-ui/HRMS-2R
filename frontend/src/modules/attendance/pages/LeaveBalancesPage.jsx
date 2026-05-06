import React, { useState, useEffect } from 'react';
import GenericModule from '../../GenericModule';
import api from '../../../utils/api';
import { Modal, DataTable, Badge } from '../../../components/UI';

export default function LeaveBalancesPage() {
  const [history, setHistory] = useState(null);

  const fetchHistory = (row) => {
    Promise.all([
      api.get('/absences', { params: { HRMS_employee_id: row.HRMS_employee_id, HRMS_absence_type_id: row.HRMS_absence_type_id, status: 'APPROVED', limit: 1000 } }),
      api.get('/leave-balances', { params: { HRMS_employee_id: row.HRMS_employee_id, limit: 100 } })
    ]).then(([absR, balR]) => {
      setHistory({
        row,
        absences: absR.data || [],
        balances: balR.data || []
      });
    });
  };

  const dataTransformer = (data) => {
    if (!data || data.length === 0) return data;

    // Group by employee
    const grouped = [];
    let currentEmpId = null;
    let currentGroup = [];

    const addTotalRow = (group) => {
      if (group.length === 0) return;
      const totalEntitlement = group.reduce((sum, r) => sum + (Number(r.entitlement) || 0), 0);
      const totalUsed = group.reduce((sum, r) => sum + (Number(r.used) || 0), 0);
      const totalBalance = group.reduce((sum, r) => sum + (Number(r.balance) || 0), 0);

      grouped.push({
        id: `total-${group[0].HRMS_employee_id}-${Math.random()}`,
        isSummary: true,
        HRMS_employee_id: '',
        Employee_Name: '',
        _empName: '',
        Absence_Type_Name: 'TOTAL',
        _absenceTypeName: 'TOTAL',
        entitlement: totalEntitlement,
        used: totalUsed,
        balance: totalBalance,
        last_leave_date: '',
        active_flag: 'Y'
      });
    };

    // Sort by employee name to ensure grouping works if backend doesn't sort
    const sortedData = [...data].sort((a, b) => {
      const nameA = (a.Employee_Name || a._empName || String(a.HRMS_employee_id)).toLowerCase();
      const nameB = (b.Employee_Name || b._empName || String(b.HRMS_employee_id)).toLowerCase();
      return nameA.localeCompare(nameB);
    });

    sortedData.forEach(row => {
      if (currentEmpId !== row.HRMS_employee_id) {
        if (currentGroup.length > 0) addTotalRow(currentGroup);
        currentEmpId = row.HRMS_employee_id;
        currentGroup = [];
      }
      grouped.push(row);
      currentGroup.push(row);
    });
    addTotalRow(currentGroup);

    return grouped;
  };

  return (
    <>
      <GenericModule title="Leave balances" endpoint="leave-balances"
        dataTransformer={dataTransformer}
        columns={[
          {key:'HRMS_employee_id',label:'Employee',render:(_,r)=>r.isSummary ? '' : (r.Employee_Name||r._empName||r.HRMS_employee_id||'-')},
          {key:'HRMS_absence_type_id',label:'Absence type',render:(_,r)=>r.isSummary ? <span className="font-black text-gray-900">TOTAL</span> : (r.Absence_Type_Name||r._absenceTypeName||r.HRMS_absence_type_id||'-')},
          {key:'entitlement',label:'Entitlement'},
          {key:'used',label:'Used'},
          {key:'balance',label:'Balance'},
          {key:'last_leave_date',label:'Last leave date',type:'date'},
          {key:'actions', label: 'History', render: (_, r) => r.isSummary ? null : (
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
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Viewing Details For</p>
                <p className="text-sm font-bold text-primary-600">{history.row.Absence_Type_Name || history.row._absenceTypeName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Absence History Records</h3>
              <DataTable
                cols={[
                  { key: 'start_date', label: 'Start Date', type: 'date' },
                  { key: 'end_date', label: 'End Date', type: 'date' },
                  { key: 'days', label: 'Days' },
                  { key: 'status', label: 'Status', type: 'badge' },
                ]}
                data={history.absences.sort((a,b) => new Date(b.start_date) - new Date(a.start_date))}
              />
              {history.absences.length === 0 && (
                <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-xs text-gray-400 italic">No absence records found for this type</p>
                </div>
              )}
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-100">
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Per Type Summary</h3>
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-[10px] font-bold text-gray-500 uppercase">
                      <tr>
                        <th className="px-4 py-2">Type</th>
                        <th className="px-4 py-2">Entitlement</th>
                        <th className="px-4 py-2">Used</th>
                        <th className="px-4 py-2">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {history.balances.map(b => (
                        <tr key={b.id} className={b.HRMS_absence_type_id === history.row.HRMS_absence_type_id ? 'bg-primary-50/50' : ''}>
                          <td className="px-4 py-2 font-medium">{b.Absence_Type_Name || b._absenceTypeName}</td>
                          <td className="px-4 py-2">{b.entitlement}</td>
                          <td className="px-4 py-2">{b.used}</td>
                          <td className="px-4 py-2 font-bold text-emerald-600">{b.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-between items-center bg-gray-900 p-4 rounded-xl shadow-lg">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Overall Total</p>
                  <p className="text-sm font-black text-white">TOTAL</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Entitlement</p>
                  <p className="text-lg font-black text-white">{history.balances.reduce((s, b) => s + (Number(b.entitlement) || 0), 0)}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Used</p>
                  <p className="text-lg font-black text-white">{history.balances.reduce((s, b) => s + (Number(b.used) || 0), 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Total Balance</p>
                  <p className="text-xl font-black text-emerald-400">{history.balances.reduce((s, b) => s + (Number(b.balance) || 0), 0)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
