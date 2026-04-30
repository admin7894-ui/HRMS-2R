
const { db, create, update, softDelete } = require('../seed/store');
const { ok, err } = require('../utils/response');
const { genId } = require('../utils/idGen');
const { makeController, paginate } = require('./base.controller');

const base = makeController('overtimes', ['HRMS_employee_id', 'approval_status']);

const empName = id => {
  const emp = db.employees?.find(e => e.id === id);
  return emp ? `${emp.First_Name} ${emp.Last_Name}`.trim() : null;
};

exports.list = (req, res) => {
  try {
    let all = db.overtimes || [];
    if (req.query.q) {
      const lq = req.query.q.toLowerCase();
      all = all.filter(x => ['HRMS_employee_id', 'approval_status'].some(f => String(x[f] ?? '').toLowerCase().includes(lq)));
    }
    const skip = new Set(['q', 'page', 'limit', 'sortBy', 'sortOrder']);
    Object.entries(req.query).forEach(([k, v]) => {
      if (!skip.has(k) && v) {
        const vals = Array.isArray(v) ? v : [v];
        all = all.filter(x => vals.some(vv => String(x[k] ?? '').toLowerCase() === vv.toLowerCase()));
      }
    });
    if (req.query.sortBy) {
      const dir = req.query.sortOrder === 'desc' ? -1 : 1;
      all = [...all].sort((a, b) => String(a[req.query.sortBy] ?? '').localeCompare(String(b[req.query.sortBy] ?? ''), undefined, { numeric: true }) * dir);
    }
    all = all.map(x => {
      const Employee_Name = empName(x.HRMS_employee_id);
      return { ...x, Employee_Name, _empName: Employee_Name };
    });
    const pg = Math.max(1, +req.query.page || 1), lim = Math.min(200, +req.query.limit || 10);
    res.json({ success: true, data: all.slice((pg - 1) * lim, pg * lim), total: all.length, page: pg, limit: lim, pages: Math.ceil(all.length / lim) });
  } catch(e) { err(res, e.message, 500); }
};
exports.get = base.get;
exports.remove = base.remove;
exports.toggleStatus = base.toggleStatus;

exports.create = (req, res) => {
  const { work_date, overtime_hours, overtime_rate_multiplier, approval_status, approved_by } = req.body;
  if (new Date(work_date) > new Date()) return err(res, 'Work date cannot be a future date');
  const oh = parseFloat(overtime_hours);
  if (isNaN(oh) || oh < 1 || oh > 24) return err(res, 'Overtime hours must be 1–24');
  const rm = parseFloat(overtime_rate_multiplier);
  if (![1.5, 2, 3].includes(rm)) return err(res, 'Rate multiplier must be 1.5, 2, or 3');
  if (approval_status === 'APPROVED' && !approved_by) return err(res, 'Approved by is required when status is Approved');
  const emp = db.employees?.find(e => e.id === req.body.HRMS_employee_id);
  const hourlyRate = emp ? (parseFloat(emp.Last_Drawn_Salary) || 50000) / (30 * 8) : 100;
  const overtime_amount = parseFloat((oh * hourlyRate * rm).toFixed(2));
  const body = { ...req.body, overtime_amount, _displayId: genId('OT', 'overtimes'), active_flag: 'Y', created_by: req.user?.username, updated_by: req.user?.username };
  ok(res, create('overtimes', body), 'Created', 201);
};

exports.update = (req, res) => {
  if (!db.overtimes?.find(r => r.id === req.params.id)) return err(res, 'Not found', 404);
  const oh = parseFloat(req.body.overtime_hours || 0);
  const rm = parseFloat(req.body.overtime_rate_multiplier || 1);
  const emp = db.employees?.find(e => e.id === req.body.HRMS_employee_id);
  const hourlyRate = emp ? (parseFloat(emp.Last_Drawn_Salary) || 50000) / (30 * 8) : 100;
  const overtime_amount = parseFloat((oh * hourlyRate * rm).toFixed(2));
  ok(res, update('overtimes', req.params.id, { ...req.body, overtime_amount, updated_by: req.user?.username }));
};
