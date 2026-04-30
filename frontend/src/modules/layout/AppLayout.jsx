import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const MENU = [
  { sec: 'Organisation', items: [
    { to: '/departments', label: 'Departments', icon: '🏬' },
    { to: '/roles', label: 'Roles', icon: '👤' },
    { to: '/designations', label: 'Designations', icon: '🎯' },
    { to: '/business-types', label: 'Business types', icon: '🏭' },
    { to: '/companies', label: 'Companies', icon: '🏢' },
    { to: '/locations', label: 'Locations', icon: '📍' },
    { to: '/business-groups', label: 'Business groups', icon: '🌐' },
    { to: '/modules', label: 'Modules', icon: '📦' },
  ]},
  { sec: 'Security', items: [
    { to: '/security-profiles', label: 'Security profiles', icon: '🛡' },
    { to: '/profile-accesses', label: 'Profile access', icon: '🔑' },
    { to: '/security-roles', label: 'Security roles', icon: '🔐' },
    { to: '/table-accesses', label: 'Table access', icon: '📋' },
  ]},
  { sec: 'Compensation', items: [
    { to: '/salary-amounts', label: 'Salary amounts', icon: '💵' },
    { to: '/salary-ranges', label: 'Salary ranges', icon: '📊' },
    { to: '/grades', label: 'Grades', icon: '🏅' },
    { to: '/grade-steps', label: 'Grade steps', icon: '🪜' },
    { to: '/grade-ladders', label: 'Grade ladders', icon: '📈' },
  ]},
  { sec: 'Jobs & positions', items: [
    { to: '/jobs', label: 'Jobs', icon: '💼' },
    { to: '/positions', label: 'Positions', icon: '📌' },
    { to: '/work-schedules', label: 'Work schedules', icon: '🕐' },
    { to: '/assignment-statuses', label: 'Assignment statuses', icon: '✅' },
  ]},
  { sec: 'Recruitment', items: [
    { to: '/requisitions', label: 'Requisitions', icon: '📝' },
    { to: '/job-postings', label: 'Job postings', icon: '📢' },
    { to: '/applications', label: 'Applications', icon: '📄' },
    { to: '/applicants', label: 'Applicants', icon: '🙋' },
    { to: '/interviews', label: 'Interviews', icon: '🎤' },
    { to: '/template-masters', label: 'Template masters', icon: '📃' },
    { to: '/template-assignments', label: 'Template assignments', icon: '📎' },
    { to: '/consent-letters', label: 'Consent letters', icon: '✍️' },
    { to: '/offer-letters', label: 'Offer letters', icon: '📬' },
    { to: '/hire-records', label: 'Hire records', icon: '🤝' },
  ]},
  { sec: 'Employee', items: [
    { to: '/employees', label: 'Employees', icon: '👨‍💼' },
    { to: '/bank-accounts', label: 'Bank accounts', icon: '🏦' },
    { to: '/programs', label: 'Training programs', icon: '📚' },
    { to: '/enrollments', label: 'Enrollments', icon: '📝' },
    { to: '/assignments', label: 'Assignments', icon: '📋' },
    { to: '/supervisors', label: 'Supervisors', icon: '👔' },
    { to: '/employee-histories', label: 'Employee history', icon: '📜' },
  ]},
  { sec: 'Attendance', items: [
    { to: '/holidays', label: 'Holidays', icon: '🎉' },
    { to: '/overtimes', label: 'Overtime', icon: '⏱' },
    { to: '/absence-types', label: 'Absence types', icon: '🏷' },
    { to: '/absences', label: 'Absences', icon: '🏖' },
    { to: '/leave-balances', label: 'Leave balances', icon: '⚖️' },
    { to: '/time-cards', label: 'Time cards', icon: '🕐' },
  ]},
  { sec: 'Performance', items: [
    { to: '/appraisal-cycles', label: 'Appraisal cycles', icon: '🔄' },
    { to: '/appraisal-key-areas', label: 'Appraisal key areas', icon: '🎯' },
    { to: '/employee-appraisals', label: 'Employee appraisals', icon: '📊' },
    { to: '/appraisal-ratings', label: 'Appraisal ratings', icon: '🌟' },
    { to: '/appraisals', label: 'Appraisals', icon: '⭐' },
  ]},
  { sec: 'Benefits', items: [
    { to: '/benefit-plans', label: 'Benefit plans', icon: '🎁' },
    { to: '/benefit-enrollments', label: 'Benefit enrollments', icon: '📋' },
    { to: '/competences', label: 'Competences', icon: '🧠' },
    { to: '/employee-competences', label: 'Employee competences', icon: '💡' },
  ]},
  { sec: 'Separation', items: [
    { to: '/separations', label: 'Separations', icon: '🚪' },
    { to: '/exit-checklists', label: 'Exit checklists', icon: '✅' },
    { to: '/final-settlements', label: 'Final settlements', icon: '💰' },
    { to: '/advance-payments', label: 'Advance payments', icon: '💳' },
    { to: '/advance-recovery-schedules', label: 'Recovery schedules', icon: '🗓' },
    { to: '/user-employees', label: 'User employees', icon: '🔗' },
  ]},
];

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sideOpen, setSideOpen] = useState(true);
  const [collapsed, setCollapsed] = useState({});
  const toggle = sec => setCollapsed(p => ({ ...p, [sec]: !p[sec] }));

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <aside className={`flex-shrink-0 bg-slate-900 flex flex-col transition-all duration-300 ${sideOpen ? 'w-60' : 'w-0 overflow-hidden'}`}>
        <div className="flex items-center gap-2 px-4 py-4 border-b border-white/10 flex-shrink-0">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">H</div>
          <div>
            <span className="text-white font-bold text-sm">HRMS Pro</span>
            <p className="text-slate-400 text-xs">v3 - 59 modules</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>🏠 Dashboard</NavLink>
          {MENU.map(({ sec, items }) => (
            <div key={sec}>
              <button onClick={() => toggle(sec)} className="nav-sec w-full text-left flex items-center justify-between hover:text-slate-300 py-1">
                <span>{sec}</span>
                <span className="text-xs opacity-60">{collapsed[sec] ? '▶' : '▼'}</span>
              </button>
              {!collapsed[sec] && items.map(({ to, label, icon }) => (
                <NavLink key={to} to={to} className={({ isActive }) => `nav-child ${isActive ? 'nav-child-a' : ''}`}>
                  {icon} {label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="px-3 py-3 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-xs font-bold">{user?.name?.[0] || 'A'}</div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.name}</p>
              <p className="text-slate-400 text-xs truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-xs text-slate-300 hover:bg-white/10 hover:text-white py-1.5 rounded text-center transition">🚪 Sign out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm">
          <button onClick={() => setSideOpen(p => !p)} className="p-1.5 hover:bg-gray-100 rounded-lg transition">
            <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span className="text-sm font-bold text-gray-700">HRMS Pro - Human resource management system</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-primary-100 text-primary-700 font-semibold px-2 py-1 rounded-full">59 modules</span>
            <span className="text-xs text-gray-400 hidden sm:block">{user?.username}</span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
