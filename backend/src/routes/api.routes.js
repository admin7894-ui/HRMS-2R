
const express = require('express');
const path = require('path');
const { auth } = require('../middleware/auth');
const { db, create, update, paginate, search } = require('../seed/store');
const { ok, err } = require('../utils/response');
const { genId, genCodeFromName, genBenefitCode } = require('../utils/idGen');
const { makeController } = require('../controllers/base.controller');
const otCtrl = require('../controllers/overtime.controller');
const tcCtrl = require('../controllers/timecard.controller');
const upload = require('../middleware/upload');

const r = express.Router();
r.use(auth);

// ── File upload ──────────────────────────────────────────────────────────────
r.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return err(res, 'No file uploaded');
  ok(res, { url: '/uploads/' + req.file.filename, name: req.file.originalname });
});

// ── Code preview endpoint ────────────────────────────────────────────────────
r.get('/code-preview', (req, res) => ok(res, { code: genCodeFromName(req.query.name || '') }));

// ── Wire helper: separate controller per table ───────────────────────────────
const wire = (path, table, searchFlds, codeField, nameField) => {
  const c = makeController(table, searchFlds, codeField, nameField);
  r.get(`/${path}`, c.list);
  r.get(`/${path}/:id`, c.get);
  r.post(`/${path}`, c.create);
  r.put(`/${path}/:id`, c.update);
  r.delete(`/${path}/:id`, c.remove);
  r.patch(`/${path}/:id/toggle-status`, c.toggleStatus);
};

// ── All 59 tables — each with dedicated route + controller instance ──────────
wire('departments',          'departments',          ['Department_Name']);
wire('roles',                'roles',                ['Role_Name']);
wire('designations',         'designations',         ['Designation_Name']);
wire('business-types',       'business_types',       ['Business_Type_Name'], 'Business_Type_Code', 'Business_Type_Name');
wire('companies',            'companies',            ['Company_Name', 'PAN']);
wire('locations',            'locations',            ['Country', 'State', 'City']);
wire('business-groups',      'business_groups',      ['BG_Name']);
wire('modules',              'modules',              ['Module_Name', 'Module_Code']);
wire('security-profiles',    'security_profiles',    ['Profile_Code']);
wire('profile-accesses',     'profile_accesses',     ['Scope_Type']);
wire('security-roles',       'security_roles',       ['USER_NAME']);
wire('table-accesses',       'table_accesses',       ['TABLE_ACCESS']);
wire('salary-amounts',       'salary_amounts',       ['Currency_Code']);
wire('salary-ranges',        'salary_ranges',        ['Currency_Code']);
wire('grades',               'grades',               ['Grade_Name', 'Grade_Code'], 'Grade_Code', 'Grade_Name');
wire('grade-steps',          'grade_steps',          ['Step_Name']);
wire('grade-ladders',        'grade_ladders',        ['Ladder_Name']);
wire('jobs',                 'jobs',                 ['Job_Name', 'Job_Code'], 'Job_Code', 'Job_Name');
// Positions — enrich list with _jobName and _gradeName
const posCtrl = makeController('positions', ['Position_Name']);
r.get('/positions', (req, res) => {
  try {
    let all = db.positions || [];
    if (req.query.q) {
      const lq = req.query.q.toLowerCase();
      all = all.filter(p => p.Position_Name?.toLowerCase().includes(lq));
    }
    // Column filters
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
    // Enrich with resolved names
    all = all.map(p => ({
      ...p,
      _jobName:   (db.jobs   || []).find(j => j.id === p.HRMS_Job_ID)?.Job_Name   || null,
      _gradeName: (db.grades || []).find(g => g.id === p.HRMS_Grade_ID)?.Grade_Name || null,
    }));
    const pg = Math.max(1, +req.query.page || 1), lim = Math.min(200, +req.query.limit || 10);
    res.json({ success: true, data: all.slice((pg-1)*lim, pg*lim), total: all.length, page: pg, limit: lim, pages: Math.ceil(all.length / lim) });
  } catch (e) { err(res, e.message, 500); }
});
r.get('/positions/:id',              posCtrl.get);
r.post('/positions',                 posCtrl.create);
r.put('/positions/:id',              posCtrl.update);
r.delete('/positions/:id',           posCtrl.remove);
r.patch('/positions/:id/toggle-status', posCtrl.toggleStatus);

wire('work-schedules',       'work_schedules',       ['Work_Schedule_Name'], 'Work_Schedule_Code', 'Work_Schedule_Name');
wire('assignment-statuses',  'assignment_statuses',  ['Status_Name', 'Status_Code'], 'Status_Code', 'Status_Name');
// Requisitions — enrich with _deptName and _positionName
const reqCtrl = makeController('requisitions', ['Priority', 'Requisition_Status']);
r.get('/requisitions', (req, res) => {
  try {
    let all = db.requisitions || [];
    if (req.query.q) { const lq = req.query.q.toLowerCase(); all = all.filter(x => ['Priority','Requisition_Status'].some(f => String(x[f]??'').toLowerCase().includes(lq))); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k) && v) { const vals = Array.isArray(v)?v:[v]; all = all.filter(x => vals.some(vv => String(x[k]??'').toLowerCase() === vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir = req.query.sortOrder==='desc'?-1:1; all = [...all].sort((a,b) => String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => ({
      ...x,
      _deptName:     (db.departments||[]).find(d => d.id === x.HRMS_Department_ID)?.Department_Name || null,
      _positionName: (db.positions||[]).find(p => p.id === x.HRMS_Position_ID)?.Position_Name     || null,
    }));
    const pg = Math.max(1,+req.query.page||1), lim = Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/requisitions/:id',              reqCtrl.get);
r.post('/requisitions',                 reqCtrl.create);
r.put('/requisitions/:id',              reqCtrl.update);
r.delete('/requisitions/:id',           reqCtrl.remove);
r.patch('/requisitions/:id/toggle-status', reqCtrl.toggleStatus);

wire('job-postings',         'job_postings',         ['Posting_Title', 'Posting_Status']);
wire('applicants',           'applicants',           ['First_Name', 'Last_Name', 'Email']);
// Applications — custom list: backfill _displayId for records created before ID gen was in place
const appCtrl = makeController('applications', ['Application_Status', 'Email_ID', 'First_Name', 'Last_Name']);
r.get('/applications', (req, res) => {
  try {
    let all = db.applications || [];
    if (req.query.q) { const lq=req.query.q.toLowerCase(); all=all.filter(x=>['Application_Status','Email_ID','First_Name','Last_Name'].some(f=>String(x[f]??'').toLowerCase().includes(lq))); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k)&&v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    // Backfill _displayId for records that don't have one yet
    let appCounter = 0;
    all = all.map(x => {
      if (x._displayId) return x;
      appCounter++;
      return { ...x, _displayId: 'APP' + String(appCounter).padStart(3,'0') };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/applications/:id',              appCtrl.get);
r.post('/applications',                 appCtrl.create);
r.put('/applications/:id',              appCtrl.update);
r.delete('/applications/:id',           appCtrl.remove);
r.patch('/applications/:id/toggle-status', appCtrl.toggleStatus);

// Interviews — enrich with _applicationName (First_Name + Last_Name from applications)
const intCtrl = makeController('interviews', ['Interview_Status']);
r.get('/interviews', (req, res) => {
  try {
    let all = db.interviews || [];
    if (req.query.q) { const lq = req.query.q.toLowerCase(); all = all.filter(x => String(x.Interview_Status??'').toLowerCase().includes(lq)); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k) && v) { const vals = Array.isArray(v)?v:[v]; all = all.filter(x => vals.some(vv => String(x[k]??'').toLowerCase() === vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir = req.query.sortOrder==='desc'?-1:1; all = [...all].sort((a,b) => String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const app = (db.applications||[]).find(a => a.id === x.HRMS_Application_ID);
      return { ...x, _applicationName: app ? `${app.First_Name} ${app.Last_Name}`.trim() : null };
    });
    const pg = Math.max(1,+req.query.page||1), lim = Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/interviews/:id',              intCtrl.get);
r.post('/interviews',                 intCtrl.create);
r.put('/interviews/:id',              intCtrl.update);
r.delete('/interviews/:id',           intCtrl.remove);
r.patch('/interviews/:id/toggle-status', intCtrl.toggleStatus);

wire('template-masters',     'template_masters',     ['Template_Name', 'Template_Code'], 'Template_Code', 'Template_Name');
// Template assignments — enrich with _applicantName and _templateName
const tasCtrl = makeController('template_assignments', ['Assigned_Date']);
r.get('/template-assignments', (req, res) => {
  try {
    let all = db.template_assignments || [];
    if (req.query.q) { const lq = req.query.q.toLowerCase(); all = all.filter(x => String(x.Assigned_Date??'').toLowerCase().includes(lq)); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k) && v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const app  = (db.applications||[]).find(a => a.id === x.HRMS_Application_ID);
      const tmpl = (db.template_masters||[]).find(t => t.id === x.HRMS_Template_Master_ID);
      return { ...x, _applicantName: app  ? `${app.First_Name} ${app.Last_Name}`.trim() : null,
                      _templateName: tmpl ? tmpl.Template_Name : null };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/template-assignments/:id',              tasCtrl.get);
r.post('/template-assignments',                 tasCtrl.create);
r.put('/template-assignments/:id',              tasCtrl.update);
r.delete('/template-assignments/:id',           tasCtrl.remove);
r.patch('/template-assignments/:id/toggle-status', tasCtrl.toggleStatus);
// Consent letters — enrich with _applicationName
const clCtrl = makeController('consent_letters', ['Consent_Letter_Signed']);
r.get('/consent-letters', (req, res) => {
  try {
    let all = db.consent_letters || [];
    if (req.query.q) { const lq=req.query.q.toLowerCase(); all=all.filter(x=>String(x.Consent_Letter_Signed??'').toLowerCase().includes(lq)); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k) && v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const app = (db.applications||[]).find(a => a.id === x.HRMS_Application_ID);
      return { ...x, _applicationName: app ? `${app.First_Name} ${app.Last_Name}`.trim() : null };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/consent-letters/:id',              clCtrl.get);
r.post('/consent-letters',                 clCtrl.create);
r.put('/consent-letters/:id',              clCtrl.update);
r.delete('/consent-letters/:id',           clCtrl.remove);
r.patch('/consent-letters/:id/toggle-status', clCtrl.toggleStatus);

// Offer letters — enrich with _applicationName; resolve Offered_Salary UUID→numeric
const olCtrl = makeController('offer_letters', ['Duration_Type']);
r.get('/offer-letters', (req, res) => {
  try {
    let all = db.offer_letters || [];
    if (req.query.q) { const lq=req.query.q.toLowerCase(); all=all.filter(x=>String(x.Duration_Type??'').toLowerCase().includes(lq)); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k)&&v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const app = (db.applications||[]).find(a => a.id === x.HRMS_Application_ID);
      // Resolve Offered_Salary: UUID→numeric if needed
      let salary = x.Offered_Salary;
      if (salary && String(salary).includes('-')) {
        const sr = (db.salary_amounts||[]).find(s => s.id === salary);
        salary = sr ? sr.Salary_Amount : salary;
      }
      return { ...x, _applicationName: app ? `${app.First_Name} ${app.Last_Name}`.trim() : null,
                      Offered_Salary: salary,
                      _offerLetterLabel: `${x._displayId || x.id}${app ? ' – ' + app.First_Name + ' ' + app.Last_Name : ''}`.trim() };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/offer-letters/:id',              olCtrl.get);
r.post('/offer-letters',                 olCtrl.create);
r.put('/offer-letters/:id',              olCtrl.update);
r.delete('/offer-letters/:id',           olCtrl.remove);
r.patch('/offer-letters/:id/toggle-status', olCtrl.toggleStatus);
// Hire records — enrich with _applicantName and _offerLetterRef
const hrCtrl = makeController('hire_records', ['Hire_Status', 'Employee_Type']);
r.get('/hire-records', (req, res) => {
  try {
    let all = db.hire_records || [];
    if (req.query.q) { const lq=req.query.q.toLowerCase(); all=all.filter(x=>['Hire_Status','Employee_Type'].some(f=>String(x[f]??'').toLowerCase().includes(lq))); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k)&&v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const app = (db.applications||[]).find(a => a.id === x.HRMS_Application_ID);
      const ol  = (db.offer_letters||[]).find(o => o.id === x.HRMS_Offer_Letter_ID);
      const olApp = ol ? (db.applications||[]).find(a => a.id === ol.HRMS_Application_ID) : null;
      return { ...x, _applicantName: app ? `${app.First_Name} ${app.Last_Name}`.trim() : null,
                      _offerLetterRef: ol?._displayId || null,
                      _offerLetterLabel: ol ? `${ol._displayId||ol.id}${olApp?' \u2013 '+olApp.First_Name+' '+olApp.Last_Name:''}`.trim() : null };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/hire-records/:id',              hrCtrl.get);
r.post('/hire-records',                 hrCtrl.create);
r.put('/hire-records/:id',              hrCtrl.update);
r.delete('/hire-records/:id',           hrCtrl.remove);
r.patch('/hire-records/:id/toggle-status', hrCtrl.toggleStatus);

wire('employees',            'employees',            ['First_Name', 'Last_Name', 'Email_ID']);
// Bank Accounts — enrich with _empName
const baCtrl = makeController('bank_accounts', ['Bank_Name', 'Account_Number']);
r.get('/bank-accounts', (req, res) => {
  try {
    let all = db.bank_accounts || [];
    if (req.query.q) { const lq=req.query.q.toLowerCase(); all=all.filter(x=>['Bank_Name','Account_Number'].some(f=>String(x[f]??'').toLowerCase().includes(lq))); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k)&&v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const emp = (db.employees||[]).find(e => e.id === x.HRMS_Employee_ID);
      return { ...x, _empName: emp ? `${emp.First_Name} ${emp.Last_Name}`.trim() : null };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/bank-accounts/:id',              baCtrl.get);
r.post('/bank-accounts',                 baCtrl.create);
r.put('/bank-accounts/:id',              baCtrl.update);
r.delete('/bank-accounts/:id',           baCtrl.remove);
r.patch('/bank-accounts/:id/toggle-status', baCtrl.toggleStatus);
wire('programs',             'programs',             ['Program_Name', 'Program_Code'], 'Program_Code', 'Program_Name');
// Enrollments — enrich with _empName and _programName
const enCtrl = makeController('enrollments', ['completion_status']);
r.get('/enrollments', (req, res) => {
  try {
    let all = db.enrollments || [];
    if (req.query.q) { const lq=req.query.q.toLowerCase(); all=all.filter(x=>String(x.completion_status??'').toLowerCase().includes(lq)); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k)&&v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const emp  = (db.employees||[]).find(e => e.id === x.HRMS_employee_id);
      const prog = (db.programs||[]).find(p => p.id === x.HRMS_program_id);
      return { ...x, _empName:     emp  ? `${emp.First_Name} ${emp.Last_Name}`.trim() : null,
                      _programName: prog ? prog.Program_Name : null };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/enrollments/:id',              enCtrl.get);
r.post('/enrollments',                 enCtrl.create);
r.put('/enrollments/:id',              enCtrl.update);
r.delete('/enrollments/:id',           enCtrl.remove);
r.patch('/enrollments/:id/toggle-status', enCtrl.toggleStatus);

// Assignments — enrich with _empName, _deptName, _posName
const asgCtrl = makeController('assignments', ['assignment_type']);
r.get('/assignments', (req, res) => {
  try {
    let all = db.assignments || [];
    if (req.query.q) { const lq=req.query.q.toLowerCase(); all=all.filter(x=>String(x.assignment_type??'').toLowerCase().includes(lq)); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k)&&v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const emp = (db.employees||[]).find(e => e.id === x.HRMS_employee_id);
      const dept = (db.departments||[]).find(d => d.id === x.HRMS_department_id);
      const pos = (db.positions||[]).find(p => p.id === x.HRMS_position_id);
      return { 
        ...x, 
        _empName:  emp  ? `${emp.First_Name} ${emp.Last_Name}`.trim() : null,
        _deptName: dept ? dept.Department_Name : null,
        _posName:  pos  ? pos.Position_Name : null
      };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/assignments/:id',              asgCtrl.get);
r.post('/assignments',                 asgCtrl.create);
r.put('/assignments/:id',              asgCtrl.update);
r.delete('/assignments/:id',           asgCtrl.remove);
r.patch('/assignments/:id/toggle-status', asgCtrl.toggleStatus);
// Supervisors — enrich with _empName, _asnName, _supName
const supCtrl = makeController('supervisors', ['HRMS_employee_id']);
r.get('/supervisors', (req, res) => {
  try {
    let all = db.supervisors || [];
    if (req.query.q) { const lq=req.query.q.toLowerCase(); all=all.filter(x=>String(x.HRMS_employee_id??'').toLowerCase().includes(lq)); }
    const skip = new Set(['q','page','limit','sortBy','sortOrder']);
    Object.entries(req.query).forEach(([k,v]) => { if (!skip.has(k)&&v) { const vals=Array.isArray(v)?v:[v]; all=all.filter(x=>vals.some(vv=>String(x[k]??'').toLowerCase()===vv.toLowerCase())); } });
    if (req.query.sortBy) { const dir=req.query.sortOrder==='desc'?-1:1; all=[...all].sort((a,b)=>String(a[req.query.sortBy]??'').localeCompare(String(b[req.query.sortBy]??''),undefined,{numeric:true})*dir); }
    all = all.map(x => {
      const emp = (db.employees||[]).find(e => e.id === x.HRMS_employee_id);
      const asn = (db.assignments||[]).find(a => a.id === x.HRMS_assignment_id);
      const sup = (db.employees||[]).find(e => e.id === x.supervisor_employee_id);
      return { 
        ...x, 
        _empName: emp ? `${emp.First_Name} ${emp.Last_Name}`.trim() : null,
        _asnName: asn ? (asn._displayId || asn.id) : null,
        _supName: sup ? `${sup.First_Name} ${sup.Last_Name}`.trim() : null
      };
    });
    const pg=Math.max(1,+req.query.page||1), lim=Math.min(200,+req.query.limit||10);
    res.json({ success:true, data:all.slice((pg-1)*lim,pg*lim), total:all.length, page:pg, limit:lim, pages:Math.ceil(all.length/lim) });
  } catch(e) { err(res,e.message,500); }
});
r.get('/supervisors/:id',              supCtrl.get);
r.post('/supervisors',                 supCtrl.create);
r.put('/supervisors/:id',              supCtrl.update);
r.delete('/supervisors/:id',           supCtrl.remove);
r.patch('/supervisors/:id/toggle-status', supCtrl.toggleStatus);
wire('employee-histories',   'employee_histories',   ['change_type', 'field_changed']);
wire('holidays',             'holidays',             ['holiday_name', 'holiday_type']);
wire('absence-types',        'absence_types',        ['absence_name', 'absence_code'], 'absence_code', 'absence_name');
wire('absences',             'absences',             ['status']);
wire('leave-balances',       'leave_balances',       ['HRMS_employee_id']);
wire('appraisal-cycles',     'appraisal_cycles',     ['cycle_name']);
wire('appraisals',           'appraisals',           ['appraisal_status', 'review_period']);
wire('appraisal-key-areas',  'appraisal_key_areas',  ['key_area_name']);
wire('employee-appraisals',  'employee_appraisals',  ['appraisal_status']);
wire('appraisal-ratings',    'appraisal_ratings',    ['key_area_name']);
wire('competences',          'competences',          ['competence_name', 'competence_code'], 'competence_code', 'competence_name');
wire('employee-competences', 'employee_competences', ['competence_type']);
wire('separations',          'separations',          ['separation_type', 'separation_status']);
wire('exit-checklists',      'exit_checklists',      ['checklist_item', 'status']);
wire('final-settlements',    'final_settlements',    ['settlement_status']);
wire('advance-payments',     'advance_payments',     ['advance_reason', 'advance_status']);
wire('advance-recovery-schedules', 'advance_recovery_schedules', ['payment_status']);
wire('user-employees',       'user_employees',       ['Employee_ID']);

// ── Benefit Plans — special auto-code BP001+ ─────────────────────────────────
const bpBase = makeController('benefit_plans', ['benefit_plan_name']);
r.get('/benefit-plans', bpBase.list);
r.get('/benefit-plans/:id', bpBase.get);
r.post('/benefit-plans', (req, res) => {
  if (!req.body.benefit_plan_name) return err(res, 'Benefit plan name is required');
  const body = { ...req.body, benefit_plan_code: genBenefitCode(), _displayId: genId('BP', 'benefit_plans'), active_flag: 'Y', created_by: req.user?.username, updated_by: req.user?.username };
  ok(res, create('benefit_plans', body), 'Created', 201);
});
r.put('/benefit-plans/:id', bpBase.update);
r.delete('/benefit-plans/:id', bpBase.remove);
r.patch('/benefit-plans/:id/toggle-status', bpBase.toggleStatus);

// ── Benefit Enrollments — no Assignment ID ───────────────────────────────────
const beBase = makeController('benefit_enrollments', ['enrollment_status']);
r.get('/benefit-enrollments', beBase.list);
r.get('/benefit-enrollments/:id', beBase.get);
r.post('/benefit-enrollments', (req, res) => {
  const body = { ...req.body };
  delete body.HRMS_assignment_id; // Remove per requirement
  body._displayId = genId('BE', 'benefit_enrollments');
  body.active_flag = 'Y'; body.created_by = req.user?.username; body.updated_by = req.user?.username;
  ok(res, create('benefit_enrollments', body), 'Created', 201);
});
r.put('/benefit-enrollments/:id', beBase.update);
r.delete('/benefit-enrollments/:id', beBase.remove);
r.patch('/benefit-enrollments/:id/toggle-status', beBase.toggleStatus);

// ── Overtime & Timecards — special controllers ────────────────────────────────
r.get('/overtimes', otCtrl.list);
r.get('/overtimes/:id', otCtrl.get);
r.post('/overtimes', otCtrl.create);
r.put('/overtimes/:id', otCtrl.update);
r.delete('/overtimes/:id', otCtrl.remove);
r.patch('/overtimes/:id/toggle-status', otCtrl.toggleStatus);

r.get('/time-cards', tcCtrl.list);
r.get('/time-cards/:id', tcCtrl.get);
r.post('/time-cards', tcCtrl.create);
r.put('/time-cards/:id', tcCtrl.update);
r.delete('/time-cards/:id', tcCtrl.remove);
r.patch('/time-cards/:id/toggle-status', tcCtrl.toggleStatus);

// ── Dependent LOV endpoints ──────────────────────────────────────────────────
const dep = fn => (req, res) => { try { ok(res, fn(req.params, req.query)); } catch(e) { err(res, e.message, 500); }};

r.get('/companies/:cid/context', dep(({ cid }) => {
  const co = db.companies?.find(c => c.id === cid);
  if (!co) return {};
  const bg = db.business_groups?.find(b => b.Company_ID === cid);
  const loc = bg ? db.locations?.find(l => l.id === bg.Location_ID) : null;
  return { business_type_id: co.Business_Type_ID, business_group_id: bg?.id, currency: loc?.Currency || 'INR' };
}));

r.get('/employees/:eid/assignments', dep(({ eid }) => (db.assignments||[]).filter(a => a.HRMS_employee_id === eid)));
r.get('/employees/:eid/supervisor', dep(({ eid }) => {
  const sup = (db.supervisors||[]).find(s => s.HRMS_employee_id === eid);
  return sup ? (db.employees||[]).find(e => e.id === sup.supervisor_employee_id) : null;
}));
r.get('/employees/:eid/leave-balances', dep(({ eid }) => (db.leave_balances||[]).filter(l => l.HRMS_employee_id === eid)));
r.get('/employees/:eid/absences-summary/:abtid', dep(({ eid, abtid }) => {
  const approved = (db.absences||[]).filter(a => a.HRMS_employee_id === eid && a.HRMS_absence_type_id === abtid && a.status === 'APPROVED');
  const used = approved.reduce((s, a) => s + (parseFloat(a.days) || 0), 0);
  const at = (db.absence_types||[]).find(t => t.id === abtid);
  const entitlement = at ? parseFloat(at.entitlement_per_year) || 0 : 0;
  return { entitlement, used, balance: entitlement - used };
}));

r.get('/applications/:aid/offer-letter', dep(({ aid }) => {
  const ol = (db.offer_letters||[]).find(o => o.HRMS_Application_ID === aid);
  return ol || null;
}));

r.get('/interviews/:iid/consent-data', dep(({ iid }) => {
  const iv = (db.interviews||[]).find(i => i.id === iid);
  if (!iv) return null;
  const app = (db.applications||[]).find(a => a.id === iv.HRMS_Application_ID);
  return { application_id: iv.HRMS_Application_ID, applicant_id: app?.HRMS_Applicant_ID, applicant_name: app ? `${app.First_Name} ${app.Last_Name}` : '' };
}));

r.get('/absence-types/:atid/entitlement', dep(({ atid }) => {
  const at = (db.absence_types||[]).find(t => t.id === atid);
  return at ? { entitlement: at.entitlement_per_year } : null;
}));

r.get('/appraisals/:aid/key-areas', dep(({ aid }) => (db.appraisal_key_areas||[]).filter(k => k.HRMS_appraisal_id === aid && k.active_flag !== 'N')));
r.get('/employee-appraisals/:eaid/ratings', dep(({ eaid }) => {
  const ea = (db.employee_appraisals||[]).find(e => e.id === eaid);
  if (!ea) return [];
  return (db.appraisal_ratings||[]).filter(r => r.HRMS_employee_appraisal_id === eaid);
}));

// ── Lookup name resolvers ────────────────────────────────────────────────────
r.get('/resolve/employee/:id', dep(({ id }) => {
  const e = (db.employees||[]).find(e => e.id === id);
  return e ? `${e.First_Name} ${e.Last_Name}` : id;
}));

// ── Dashboard stats ───────────────────────────────────────────────────────────
r.get('/dashboard/stats', (req, res) => {
  const emps = db.employees || [], apps = db.applications || [],
    abs = db.absences || [], advs = db.advance_payments || [], reqs = db.requisitions || [];
  const empName = id => { const e = emps.find(e => e.id === id); return e ? `${e.First_Name} ${e.Last_Name}` : id; };
  ok(res, {
    totals: {
      employees: emps.filter(e => e.active_flag !== 'N').length,
      departments: (db.departments||[]).filter(d => d.active_flag !== 'N').length,
      open_requisitions: reqs.filter(r => r.Requisition_Status === 'OPEN').length,
      applicants: (db.applicants||[]).length,
      open_postings: (db.job_postings||[]).filter(j => j.Posting_Status === 'OPEN').length,
      pending_absences: abs.filter(a => a.status === 'PENDING').length,
      pending_advances: advs.filter(a => a.approval_status === 'PENDING').length,
      companies: (db.companies||[]).filter(c => c.active_flag !== 'N').length,
    },
    recruitment_pipeline: {
      APPLIED: apps.filter(a => a.Application_Status === 'APPLIED').length,
      SCREENING: apps.filter(a => a.Application_Status === 'SCREENING').length,
      INTERVIEW: apps.filter(a => a.Application_Status === 'INTERVIEW').length,
      SELECTED: apps.filter(a => a.Application_Status === 'SELECTED').length,
      REJECTED: apps.filter(a => a.Application_Status === 'REJECTED').length,
    },
    dept_headcount: (db.departments||[]).filter(d => d.active_flag !== 'N').map(d => ({
      dept: d.Department_Name, count: (db.assignments||[]).filter(a => a.HRMS_department_id === d.id).length
    })),
    recent_employees: emps.slice(-5).reverse().map(e => ({ ...e, _name: `${e.First_Name} ${e.Last_Name}` })),
  });
});

module.exports = r;
