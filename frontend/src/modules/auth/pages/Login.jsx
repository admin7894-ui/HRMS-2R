import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';

const DEMO = [
  { u: 'admin@hrms.com', p: 'admin123', r: 'Admin', color: 'bg-blue-600' },
  { u: 'hr@hrms.com', p: 'hr123', r: 'HR', color: 'bg-emerald-600' },
  { u: 'emp@hrms.com', p: 'emp123', r: 'Employee', color: 'bg-purple-600' },
];

export default function Login() {
  const [form, setForm] = useState({ username: 'admin@hrms.com', password: 'admin123' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = async e => {
    e.preventDefault();
    setLoading(true);
    try { await login(form.username, form.password); navigate('/'); }
    catch (e) { toast.error(e.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-2xl">H</div>
          <h1 className="text-3xl font-extrabold text-white">HRMS Pro</h1>
          <p className="text-slate-400 mt-1 text-sm">Human resource management system v3</p>
          <p className="text-slate-500 text-xs mt-1">59 modules · Separate pages · Full validations</p>
        </div>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Sign in</h2>
          <form onSubmit={handle} className="space-y-4">
            <div>
              <label className="label">Username / Email</label>
              <input className="input" value={form.username} placeholder="Email address"
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" className="input" value={form.password} placeholder="Password"
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary btn w-full justify-center text-base py-2.5">
              {loading ? '…' : 'Sign in'}
            </button>
          </form>
          <div className="mt-6 border-t pt-4">
            <p className="text-xs text-gray-500 mb-3 text-center font-medium">Quick demo access</p>
            <div className="grid grid-cols-3 gap-2">
              {DEMO.map(a => (
                <button key={a.u} onClick={() => setForm({ username: a.u, password: a.p })}
                  className="text-xs bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg p-2 text-gray-700 transition text-center">
                  <div className={`w-6 h-6 ${a.color} rounded-full text-white font-bold text-xs flex items-center justify-center mx-auto mb-1`}>{a.r[0]}</div>
                  <div className="font-semibold">{a.r}</div>
                  <div className="text-gray-400 text-[10px] truncate">{a.p}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
