
const express = require('express');
const r = express.Router();
const { db, create } = require('../seed/store');
const { ok, err } = require('../utils/response');
const { genId } = require('../utils/idGen');

// Public: submit candidate application — no auth required
r.post('/apply', (req, res) => {
  try {
    const now = new Date().toISOString().split('T')[0];
    const selectedCompany = (db.companies || []).find(c =>
      [c.id, c.Company_ID, c._displayId, c.Company_Name]
        .filter(Boolean)
        .map(v => String(v).toLowerCase())
        .includes(String(req.body.company_id || req.body.Company_ID || '').toLowerCase())
    );
    const normalizedCompanyId = selectedCompany?.id || req.body.company_id || req.body.Company_ID || null;
    const contextBusinessTypeId =
      req.body.business_type_id ||
      req.body.Business_Type_ID ||
      selectedCompany?.Business_Type_ID ||
      null;
    const contextBusinessGroupId =
      req.body.business_group_id ||
      req.body.Business_Group_ID ||
      (db.business_groups || []).find(bg => bg.Company_ID === normalizedCompanyId)?.id ||
      null;
    const contextModuleId =
      req.body.module_id ||
      req.body.Module_ID ||
      'MOD1';
    const record = {
      ...req.body,
      company_id:          normalizedCompanyId,
      Company_ID:          normalizedCompanyId,
      business_type_id:    contextBusinessTypeId,
      Business_Type_ID:    contextBusinessTypeId,
      business_group_id:   contextBusinessGroupId,
      Business_Group_ID:   contextBusinessGroupId,
      module_id:           contextModuleId,
      Module_ID:           contextModuleId,
      _displayId:          genId('APP', 'applications'),
      Application_Status:  req.body.Application_Status || 'APPLIED',
      Applied_Date:        now,
      active_flag:         'Y',
      Effective_From:      now,
      Created_By:          'portal',
      Updated_By:          'portal',
    };
    const created = create('applications', record);
    ok(res, created, 'Application submitted successfully');
  } catch (e) {
    err(res, e.message, 500);
  }
});

// Public: fetch open job postings
r.get('/job-postings', (req, res) => {
  try {
    const postings = (db.job_postings || []).filter(j => j.Posting_Status === 'OPEN');
    // Return them in an array under "data" property since ok() adds success and data
    ok(res, postings, 'Open job postings');
  } catch (e) {
    err(res, e.message, 500);
  }
});

// Public: fetch active companies
r.get('/companies', (req, res) => {
  try {
    const companies = (db.companies || []).filter(c => c.active_flag === 'Y');
    ok(res, companies, 'Active companies');
  } catch (e) {
    err(res, e.message, 500);
  }
});

// Public: upload document — no auth required
const upload = require('../middleware/upload');
r.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return err(res, 'No file uploaded');
  // Return the filename so the frontend can store it and generate URLs
  ok(res, { url: '/uploads/' + req.file.filename, filename: req.file.filename });
});

module.exports = r;
