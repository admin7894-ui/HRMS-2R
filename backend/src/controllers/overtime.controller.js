
const { db, create, update, softDelete } = require('../seed/store');
const { ok, err } = require('../utils/response');
const { genId } = require('../utils/idGen');
const { makeController, paginate } = require('./base.controller');

const base = makeController('overtimes', ['HRMS_employee_id', 'approval_status']);

exports.list = base.list;
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
