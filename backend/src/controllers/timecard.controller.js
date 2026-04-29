
const { db, create, update, softDelete } = require('../seed/store');
const { ok, err } = require('../utils/response');
const { genId } = require('../utils/idGen');
const { makeController } = require('./base.controller');

const base = makeController('time_cards', ['HRMS_employee_id', 'attendance_status']);
exports.list = base.list;
exports.get = base.get;
exports.remove = base.remove;
exports.toggleStatus = base.toggleStatus;

const parseTime = t => { if (!t) return null; const [h, m] = t.split(':').map(Number); return h * 60 + m; };

exports.create = (req, res) => {
  const { work_date, clock_in, clock_out, attendance_status, overtime_hours, overtime_rate_multiplier } = req.body;
  if (new Date(work_date) > new Date()) return err(res, 'Work date cannot be a future date');
  const ci = parseTime(clock_in), co = parseTime(clock_out);
  // Handle overnight shifts
  let diffMin = co - ci;
  if (diffMin < 0) diffMin += 24 * 60;
  if (ci !== null && co !== null && diffMin === 0) return err(res, 'Clock out must be after clock in');
  let hours_worked = attendance_status === 'ABSENT' ? 0 : parseFloat((diffMin / 60).toFixed(2));
  const oh = parseFloat(overtime_hours || 0);
  const rm = parseFloat(overtime_rate_multiplier || 1);
  const emp = db.employees?.find(e => e.id === req.body.HRMS_employee_id);
  const hourlyRate = emp ? (parseFloat(emp.Last_Drawn_Salary) || 50000) / (30 * 8) : 100;
  const overtime_amount = oh > 0 ? parseFloat((oh * hourlyRate * rm).toFixed(2)) : 0;
  const body = { ...req.body, hours_worked, overtime_amount, _displayId: genId('TC', 'time_cards'), active_flag: 'Y', created_by: req.user?.username, updated_by: req.user?.username };
  ok(res, create('time_cards', body), 'Created', 201);
};

exports.update = (req, res) => {
  if (!db.time_cards?.find(r => r.id === req.params.id)) return err(res, 'Not found', 404);
  const { clock_in, clock_out, attendance_status, overtime_hours, overtime_rate_multiplier } = req.body;
  const ci = parseTime(clock_in), co = parseTime(clock_out);
  let diffMin = (co ?? 0) - (ci ?? 0);
  if (diffMin < 0) diffMin += 24 * 60;
  let hours_worked = attendance_status === 'ABSENT' ? 0 : parseFloat((diffMin / 60).toFixed(2));
  const oh = parseFloat(overtime_hours || 0);
  const rm = parseFloat(overtime_rate_multiplier || 1);
  const emp = db.employees?.find(e => e.id === req.body.HRMS_employee_id);
  const hourlyRate = emp ? (parseFloat(emp.Last_Drawn_Salary) || 50000) / (30 * 8) : 100;
  const overtime_amount = oh > 0 ? parseFloat((oh * hourlyRate * rm).toFixed(2)) : 0;
  ok(res, update('time_cards', req.params.id, { ...req.body, hours_worked, overtime_amount, updated_by: req.user?.username }));
};
