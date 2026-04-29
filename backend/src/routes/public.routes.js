
const express = require('express');
const r = express.Router();
const { db, create } = require('../seed/store');
const { ok, err } = require('../utils/response');
const { genId } = require('../utils/idGen');

// Public: submit candidate application — no auth required
r.post('/apply', (req, res) => {
  try {
    const now = new Date().toISOString().split('T')[0];
    const record = {
      ...req.body,
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

module.exports = r;
