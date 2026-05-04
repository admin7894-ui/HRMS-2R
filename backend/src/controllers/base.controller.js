
const { v4: uuidv4 } = require('uuid');
const { ok, err } = require('../utils/response');
const { genId, genCodeFromName, genShortCode } = require('../utils/idGen');
const { TABLE_PREFIXES } = require('../models/index');

// Shared store operations (imported lazily to avoid circular deps)
const store = () => require('../seed/store');

const paginate = (arr, page = 1, limit = 10) => {
  const p = Math.max(1, +page), l = Math.min(200, +limit || 10);
  return { data: arr.slice((p - 1) * l, p * l), total: arr.length, page: p, limit: l, pages: Math.ceil(arr.length / l) };
};

const searchArr = (arr, q, fields) => {
  if (!q) return arr;
  const lq = q.toLowerCase();
  return arr.filter(r => fields.some(f => r[f] != null && String(r[f]).toLowerCase().includes(lq)));
};

// Resolve foreign key to human-readable name
const resolveName = (table, id, nameFields) => {
  if (!id) return id;
  const { db } = store();
  const arr = db[table] || [];
  const rec = arr.find(r => r.id === id);
  if (!rec) return id;
  for (const f of nameFields) {
    if (rec[f]) return rec[f];
  }
  return id;
};

const makeController = (table, searchFields = ['id'], codeField = null, nameField = null) => {
  const prefix = TABLE_PREFIXES[table] || 'REC';

  return {
    list: (req, res) => {
      try {
        const { db } = store();
        // Show ALL records (active + inactive) - Rule #3
        let all = db[table] || [];
        if (req.query.q) all = searchArr(all, req.query.q, searchFields);
        // Common filter alias: employee_id -> various employee columns
        const employeeId = req.query.employee_id;
        if (employeeId) {
          const keys = ['HRMS_employee_id', 'HRMS_Employee_ID', 'Employee_ID', 'employee_id'];
          all = all.filter(x => keys.some(k => String(x?.[k] ?? '').toLowerCase() === String(employeeId).toLowerCase()));
        }
        // Column filters
        const skip = new Set(['q', 'page', 'limit', 'sortBy', 'sortOrder', 'employee_id']);
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
        res.json({ success: true, ...paginate(all, req.query.page, req.query.limit) });
      } catch (e) { err(res, e.message, 500); }
    },

    get: (req, res) => {
      const { db } = store();
      const x = (db[table] || []).find(r => r.id === req.params.id);
      if (!x) return err(res, 'Record not found', 404);
      ok(res, x);
    },

    create: (req, res) => {
      try {
        const { db, create } = store();
        const body = { ...req.body };
        // Auto-generate display ID
        body._displayId = genId(prefix, table);
        // Auto-generate code from name
        if (codeField && nameField && body[nameField] && !body[codeField]) {
          body[codeField] = genCodeFromName(body[nameField]);
        }
        body.active_flag = 'Y';
        body.effective_from = body.effective_from || new Date().toISOString().split('T')[0];
        body.created_by = req.user?.username || 'system';
        body.updated_by = req.user?.username || 'system';
        body.created_at = new Date().toISOString();
        body.updated_at = new Date().toISOString();
        const record = create(table, body);
        ok(res, record, 'Created successfully', 201);
      } catch (e) { err(res, e.message); }
    },

    update: (req, res) => {
      const { db, update } = store();
      const existing = (db[table] || []).find(r => r.id === req.params.id);
      if (!existing) return err(res, 'Not found', 404);
      const body = { ...req.body, updated_by: req.user?.username || 'system', updated_at: new Date().toISOString() };
      if (codeField && nameField && body[nameField]) {
        body[codeField] = genCodeFromName(body[nameField]);
      }
      ok(res, update(table, req.params.id, body), 'Updated successfully');
    },

    remove: (req, res) => {
      const { softDelete } = store();
      if (!softDelete(table, req.params.id)) return err(res, 'Not found', 404);
      ok(res, null, 'Deleted successfully');
    },

    toggleStatus: (req, res) => {
      const { db, update } = store();
      const x = (db[table] || []).find(r => r.id === req.params.id);
      if (!x) return err(res, 'Not found', 404);
      const newFlag = x.active_flag === 'Y' ? 'N' : 'Y';
      ok(res, update(table, req.params.id, { active_flag: newFlag, updated_by: req.user?.username }), 'Status toggled');
    },
  };
};

module.exports = { makeController, paginate, searchArr };
