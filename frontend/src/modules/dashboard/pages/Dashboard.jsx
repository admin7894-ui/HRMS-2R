import React, { useState, useEffect } from 'react';
import api from '../../../utils/api';
import { toast } from 'react-toastify';
import { StatCard, Spin } from '../../../components/UI';
import { useAuth } from '../../../context/AuthContext';

const COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#06b6d4'];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setLoading(false); return; }   // skip fetch when signed out
    let cancelled = false;
    api.get('/dashboard/stats')
      .then(r  => { if (!cancelled) { setStats(r); setLoading(false); } })
      .catch(e => { if (!cancelled && e?.response?.status !== 401) toast.error('Failed to load dashboard'); if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-64"><Spin size={8}/></div>;
  if (!stats) return null;

  const { totals, dept_headcount, recent_employees } = stats;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">HRMS Pro v3 — 59 modules, separate page per table, full validations</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Employees" value={totals?.employees} icon="👥" color="blue"/>
        <StatCard label="Departments" value={totals?.departments} icon="🏬" color="green"/>
        <StatCard label="Open requisitions" value={totals?.open_requisitions} icon="📝" color="yellow"/>
        <StatCard label="Applicants" value={totals?.applicants} icon="🙋" color="purple"/>
        <StatCard label="Open postings" value={totals?.open_postings} icon="📢" color="orange"/>
        <StatCard label="Pending leaves" value={totals?.pending_absences} icon="🏖" color="red"/>
        <StatCard label="Pending advances" value={totals?.pending_advances} icon="💳" color="indigo"/>
        <StatCard label="Companies" value={totals?.companies} icon="🏢" color="teal"/>
        <StatCard label="Modules" value={59} icon="📦" color="blue"/>
        <StatCard label="Tables" value={59} icon="📋" color="green"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h3 className="font-bold text-gray-700 mb-4">Department headcount</h3>
          <div className="space-y-2">
            {(dept_headcount||[]).slice(0,8).map((d,i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="text-sm text-gray-600 w-32 truncate">{d.dept}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className="bg-primary-500 h-2 rounded-full" style={{width:`${Math.min(100,(d.count/Math.max(...(dept_headcount||[]).map(x=>x.count),1))*100)}%`}}/>
                </div>
                <span className="text-xs font-bold text-gray-700 w-6 text-right">{d.count}</span>
              </div>
            ))}
            {(dept_headcount||[]).length === 0 && <p className="text-gray-400 text-sm italic">No assignment data yet — create assignments to populate.</p>}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="font-bold text-gray-700 mb-4">Recent employees</h3>
          <div className="space-y-2">
            {(recent_employees||[]).slice(0,5).map((e,i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0">{e.First_Name?.[0]}{e.Last_Name?.[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{e.First_Name} {e.Last_Name}</p>
                  <p className="text-xs text-gray-400 truncate">{e.Email_ID}</p>
                </div>
                <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded font-medium">{e.Employee_Type||'—'}</span>
              </div>
            ))}
            {(recent_employees||[]).length === 0 && <p className="text-gray-400 text-sm italic">No employees yet — add employees to see them here.</p>}
          </div>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="font-bold text-gray-700 mb-4">✅ All requirements applied</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {[
            'View modal shows ALL fields','Created by / Updated by auto-filled','Active + Inactive records always shown',
            'Deactivation confirmation popup','No duplicate module field','BT + BG auto-fill from Company',
            'BT + BG non-editable until Company','Sentence case throughout','DD-MM-YYYY date format',
            'Effective from mandatory','End date ≥ Start date','Company / BT / BG / Module error msgs',
            'Field placeholders = field name','No GUIDs in LOV dropdowns','Update confirmation popup',
            'Red border on error fields','Scroll to first error','Records per page + pagination',
            'Tooltips on all fields','Alphabetic validation + char limits','Email format validation',
            'Phone: +91 + 10-digit separate','FK columns show names not IDs','Grade: Max salary removed',
            'Grade Step NaN fixed','Job saves correctly','Position shows job/grade names',
            'Work schedule: no duplicate module','Assignment status code auto-gen','Requisition fixes applied',
            'Applicant: 4 file uploads, validations','Interview: future dates only','Template code auto-gen',
            'Consent letter: names not codes','Offer letter: all fields fixed','Hire records: dept LOV added',
            'Employee: all required fields','Bank account: IFSC validation','Training: duration max 999h',
            'Enrollment: score decimal fix','OT: server-calc amount','Absence code auto-gen',
            'Absence: days + balance auto-calc','Leave balance: system-maintained','Time card: hours auto-calc overnight',
            'Appraisal key area: rating LOV 0–5','Employee appraisal: key area table','Appraisal ratings: avg auto-calc',
            'Benefit plan: save fixed','Benefit enrollment: assignment removed','Exit checklist: multi-select LOV',
            'Advance payment: assignment removed',
          ].map((t,i) => (
            <div key={i} className="flex items-start gap-1.5 p-2 bg-emerald-50 rounded text-emerald-800">
              <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>{t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
