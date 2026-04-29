import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public/apply';

const RE = {
  name: /^[a-zA-Z\s]{2,50}$/, email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  phone: /^[6-9][0-9]{9}$/, addr1: /^[a-zA-Z0-9\s,.-]{5,100}$/, addr2: /^[a-zA-Z0-9\s,.-]{0,100}$/,
  city: /^[a-zA-Z\s]{2,50}$/, pin: /^[1-9][0-9]{5}$/, degr: /^[a-zA-Z\s,.-]{2,100}$/,
  year: /^(19|20)\d{2}$/, pct: /^(100(\.0{1,2})?|[0-9]{1,2}(\.[0-9]{1,2})?)$/,
  grd: /^[A-Za-z0-9+\s]{1,5}$/, co: /^[a-zA-Z0-9\s,.-]{2,100}$/, ind: /^[a-zA-Z\s]{2,50}$/,
  exp: /^([0-9]|[1-3][0-9]|40)(\.[0-9]{1,2})?$/, sal: /^[0-9]{4,10}$/,
  rsn: /^[a-zA-Z0-9\s,.-]{2,200}$/, aadhaar: /^[0-9]{12}$/, pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
};

const STEPS = ['Personal', 'Contact', 'Address', 'Documents', 'Education', 'Experience', 'Nominee', 'Application'];
const GENDER_OPT = [{v:'MALE',l:'Male'},{v:'FEMALE',l:'Female'},{v:'OTHER',l:'Other'}];
const MARITAL_OPT = [{v:'SINGLE',l:'Single'},{v:'MARRIED',l:'Married'},{v:'DIVORCED',l:'Divorced'},{v:'WIDOWED',l:'Widowed'}];
const NOMINEE_REL = ['Father', 'Mother', 'Spouse', 'Son', 'Daughter', 'Brother', 'Sister', 'Other'];
const NATIONALITY_OPT = ['Indian', 'American', 'British', 'Canadian', 'Australian', 'German', 'French', 'Chinese', 'Japanese', 'Russian', 'Brazilian', 'South African', 'Singaporean', 'UAE (Emirati)', 'Saudi Arabian', 'Others'];
const QUAL_OPT = ['B.A', 'B.Com', 'B.Sc', 'B.Tech / B.E', 'BBA', 'BCA', 'M.A', 'M.Com', 'M.Sc', 'M.Tech / M.E', 'MBA', 'MCA', 'PhD', 'Diploma (Engineering)', 'Diploma (Management)', 'Other'];
const SPEC_OPT = ['Computer Science', 'Information Technology', 'Software Engineering', 'Data Science', 'Artificial Intelligence', 'Machine Learning', 'Cyber Security', 'Cloud Computing', 'Networking', 'Database Management', 'Web Development', 'Mobile App Development', 'Electronics and Communication', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Chemical Engineering', 'Automobile Engineering', 'Aeronautical Engineering', 'Biomedical Engineering', 'Biotechnology', 'Environmental Science', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Commerce', 'Accounting', 'Finance', 'Banking', 'Economics', 'Business Administration', 'Human Resource Management', 'Marketing', 'International Business', 'Operations Management', 'Supply Chain Management', 'Entrepreneurship', 'Law', 'Criminal Law', 'Corporate Law', 'International Law', 'Political Science', 'Public Administration', 'Sociology', 'Psychology', 'Philosophy', 'History', 'Geography', 'English Literature', 'Linguistics', 'Journalism', 'Mass Communication', 'Media Studies', 'Education', 'Early Childhood Education', 'Special Education', 'Nursing', 'Pharmacy', 'Medicine', 'Dentistry', 'Public Health', 'Hospital Management', 'Hotel Management', 'Tourism Management', 'Event Management', 'Fashion Designing', 'Interior Designing', 'Graphic Designing', 'Animation', 'Fine Arts', 'Performing Arts', 'Music', 'Theatre', 'Sports Science', 'Physical Education', 'Agriculture', 'Horticulture', 'Forestry', 'Veterinary Science', 'Food Technology', 'Nutrition and Dietetics'];
const SOURCE_OPT = [{v:'PORTAL',l:'Job portal'}, {v:'HRMS',l:'Internal HRMS'}, {v:'LINKEDIN',l:'LinkedIn'}, {v:'REFERRAL',l:'Referral'}, {v:'DIRECT',l:'Direct'}, {v:'WEBSITE',l:'Website'}];

const INIT = {
  company_id:'', First_Name:'', Last_Name:'', Middle_Name:'', Date_of_Birth:'', Gender:'', Marital_Status:'', Nationality:'',
  Email_ID:'', Phone_Number:'', Alternate_Phone:'', Emergency_Contact_Name:'', Emergency_Contact_Number:'',
  Address_Line1:'', Address_Line2:'', City:'', State:'', Country:'', Pincode:'',
  Aadhaar_Number:'', PAN_Number:'', Aadhaar_File:'', PAN_File:'', Photo_File:'', Other_Doc_File:'',
  Qualification:'', Degree_Name:'', Specialization:'', University_Name:'', Institute_Name:'', Edu_Start_Year:'', Edu_End_Year:'', Passing_Year:'', Percentage:'', Edu_Grade:'',
  Is_Fresher: false, Prev_Company_Name:'', Prev_Designation:'', Prev_Department:'', Industry_Type:'',
  Exp_Start_Date:'', Exp_End_Date:'', Total_Experience:'', Last_Drawn_Salary:'', Reason_For_Leaving:'',
  Nominee_Name:'', Nominee_Relationship:'', Nominee_Date_of_Birth:'', Nominee_Contact_Number:'',
  HRMS_Job_Posting_ID:'', Expected_Salary:'', Source:'', Applied_Date: new Date().toISOString().split('T')[0], Application_Status: 'APPLIED'
};

function validateStep(step, form) {
  const e = {};
  if (step === 0) {
    if (!form.company_id) e.company_id = 'Required';
    if (!RE.name.test(form.First_Name)) e.First_Name = 'Required, 2–50 letters';
    if (!RE.name.test(form.Last_Name)) e.Last_Name = 'Required, 2–50 letters';
    if (form.Middle_Name && !/^[a-zA-Z\s]{0,50}$/.test(form.Middle_Name)) e.Middle_Name = 'Max 50 letters';
    if (!form.Date_of_Birth) e.Date_of_Birth = 'Required';
    if (!form.Gender) e.Gender = 'Required';
    if (!form.Marital_Status) e.Marital_Status = 'Required';
    if (!form.Nationality) e.Nationality = 'Required';
  } else if (step === 1) {
    if (!RE.email.test(form.Email_ID)) e.Email_ID = 'Valid email required';
    if (!RE.phone.test(form.Phone_Number)) e.Phone_Number = '10-digit mobile starting 6-9';
    if (!RE.phone.test(form.Alternate_Phone)) e.Alternate_Phone = '10-digit mobile starting 6-9';
    if (!RE.name.test(form.Emergency_Contact_Name)) e.Emergency_Contact_Name = 'Required, 2–50 letters';
    if (!RE.phone.test(form.Emergency_Contact_Number)) e.Emergency_Contact_Number = '10-digit mobile starting 6-9';
  } else if (step === 2) {
    if (!RE.addr1.test(form.Address_Line1)) e.Address_Line1 = 'Required, 5–100 chars';
    if (form.Address_Line2 && !RE.addr2.test(form.Address_Line2)) e.Address_Line2 = 'Max 100 chars';
    if (!RE.city.test(form.City)) e.City = 'Required, 2–50 letters';
    if (!RE.city.test(form.State)) e.State = 'Required';
    if (!RE.city.test(form.Country)) e.Country = 'Required';
    if (!RE.pin.test(form.Pincode)) e.Pincode = '6-digit pincode';
  } else if (step === 3) {
    if (!RE.aadhaar.test(form.Aadhaar_Number)) e.Aadhaar_Number = 'Must be exactly 12 digits';
    if (!RE.pan.test(form.PAN_Number)) e.PAN_Number = 'PAN format: AAAAA0000A';
    if (!form.Aadhaar_File) e.Aadhaar_File = 'Required';
    if (!form.PAN_File) e.PAN_File = 'Required';
    if (!form.Photo_File) e.Photo_File = 'Required';
  } else if (step === 4) {
    if (!form.Qualification) e.Qualification = 'Required';
    if (!RE.degr.test(form.Degree_Name)) e.Degree_Name = 'Required, 2–100 chars';
    if (!form.Specialization) e.Specialization = 'Required';
    if (!RE.degr.test(form.University_Name)) e.University_Name = 'Required';
    if (!RE.degr.test(form.Institute_Name)) e.Institute_Name = 'Required';
    if (!RE.year.test(form.Edu_Start_Year)) e.Edu_Start_Year = '4-digit year';
    if (!RE.year.test(form.Edu_End_Year)) e.Edu_End_Year = '4-digit year';
    if (!RE.year.test(form.Passing_Year)) e.Passing_Year = '4-digit year';
    if (!RE.pct.test(form.Percentage)) e.Percentage = '0–100 with up to 2 decimals';
    if (!RE.grd.test(form.Edu_Grade)) e.Edu_Grade = '1–5 chars (e.g. A, B+)';
  } else if (step === 5) {
    if (!form.Is_Fresher) {
      if (!RE.co.test(form.Prev_Company_Name)) e.Prev_Company_Name = 'Required, 2–100 chars';
      if (!RE.co.test(form.Prev_Designation)) e.Prev_Designation = 'Required';
      if (!RE.co.test(form.Prev_Department)) e.Prev_Department = 'Required';
      if (!RE.ind.test(form.Industry_Type)) e.Industry_Type = 'Required';
      if (!form.Exp_Start_Date) e.Exp_Start_Date = 'Required';
      if (!form.Exp_End_Date) e.Exp_End_Date = 'Required';
      if (!RE.exp.test(form.Total_Experience)) e.Total_Experience = '0–40 years';
      if (!RE.sal.test(form.Last_Drawn_Salary)) e.Last_Drawn_Salary = '4–10 digit salary';
    }
    if (form.Reason_For_Leaving && !RE.rsn.test(form.Reason_For_Leaving)) e.Reason_For_Leaving = '2–200 chars';
  } else if (step === 6) {
    if (!RE.name.test(form.Nominee_Name)) e.Nominee_Name = 'Required, 2–50 letters';
    if (!form.Nominee_Relationship) e.Nominee_Relationship = 'Required';
    if (!form.Nominee_Date_of_Birth) e.Nominee_Date_of_Birth = 'Required';
    if (!RE.phone.test(form.Nominee_Contact_Number)) e.Nominee_Contact_Number = '10-digit mobile';
  } else if (step === 7) {
    if (!form.HRMS_Job_Posting_ID) e.HRMS_Job_Posting_ID = 'Required';
    if (form.Expected_Salary && !RE.sal.test(form.Expected_Salary)) e.Expected_Salary = 'Invalid salary format';
  }
  return e;
}

const S = {
  page: { minHeight:'100vh', background:'linear-gradient(135deg,#0f0c29,#302b63,#24243e)', fontFamily:"'Inter','Segoe UI',sans-serif", color:'#e2e8f0', padding:'0' },
  hero: { textAlign:'center', padding:'60px 20px 40px', position:'relative' },
  logo: { fontSize:38, marginBottom:8 },
  htitle: { fontSize:'clamp(2rem,5vw,3.2rem)', fontWeight:800, background:'linear-gradient(90deg,#a78bfa,#60a5fa,#34d399)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', margin:'0 0 12px' },
  hsub: { color:'#94a3b8', fontSize:17, maxWidth:520, margin:'0 auto 36px' },
  applyBtn: { background:'linear-gradient(135deg,#7c3aed,#2563eb)', border:'none', color:'#fff', fontSize:17, fontWeight:700, padding:'15px 44px', borderRadius:50, cursor:'pointer', boxShadow:'0 8px 32px rgba(124,58,237,.45)', transition:'transform .2s,box-shadow .2s', letterSpacing:.5 },
  card: { background:'rgba(255,255,255,.06)', backdropFilter:'blur(20px)', border:'1px solid rgba(255,255,255,.12)', borderRadius:20, padding:'36px 40px', maxWidth:820, margin:'0 auto 32px', boxShadow:'0 8px 40px rgba(0,0,0,.35)' },
  progress: { display:'flex', justifyContent:'center', marginBottom:36, flexWrap:'wrap', gap:4 },
  stepDot: (active, done) => ({ width:34, height:34, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, cursor:'default', transition:'all .3s', background: done ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : active ? 'rgba(124,58,237,.4)' : 'rgba(255,255,255,.08)', border: active ? '2px solid #7c3aed' : done ? '2px solid #7c3aed' : '2px solid rgba(255,255,255,.15)', color: done||active ? '#fff' : '#64748b' }),
  stepLbl: (active, done) => ({ fontSize:11, marginTop:4, color: active ? '#a78bfa' : done ? '#60a5fa' : '#475569', fontWeight: active||done ? 600 : 400 }),
  stepItem: { display:'flex', flexDirection:'column', alignItems:'center', minWidth:70 },
  stepConn: { width:24, height:2, background:'rgba(255,255,255,.1)', marginTop:16, alignSelf:'flex-start' },
  sh2: { fontSize:22, fontWeight:700, marginBottom:24, color:'#e2e8f0', display:'flex', alignItems:'center', gap:10 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'18px 24px' },
  grid1: { display:'grid', gridTemplateColumns:'1fr', gap:'18px' },
  fld: { display:'flex', flexDirection:'column', gap:6 },
  lbl: { fontSize:12, fontWeight:600, color:'#94a3b8', letterSpacing:.8, textTransform:'uppercase' },
  inp: (err) => ({ background:'rgba(255,255,255,.07)', border:`1.5px solid ${err ? '#f87171' : 'rgba(255,255,255,.15)'}`, borderRadius:10, padding:'10px 14px', color:'#e2e8f0', fontSize:14, outline:'none', transition:'border-color .2s', width:'100%', boxSizing:'border-box' }),
  sel: (err) => ({ background:'rgba(15,12,41,.9)', border:`1.5px solid ${err ? '#f87171' : 'rgba(255,255,255,.15)'}`, borderRadius:10, padding:'10px 14px', color:'#e2e8f0', fontSize:14, outline:'none', width:'100%', boxSizing:'border-box' }),
  errtxt: { fontSize:11, color:'#f87171', marginTop:2 },
  toggle: { display:'flex', alignItems:'center', gap:12, padding:'12px 0' },
  togBox: (on) => ({ width:46, height:24, borderRadius:12, background: on ? 'linear-gradient(135deg,#7c3aed,#2563eb)' : 'rgba(255,255,255,.12)', cursor:'pointer', position:'relative', transition:'background .3s', flexShrink:0 }),
  togThumb: (on) => ({ width:18, height:18, borderRadius:'50%', background:'#fff', position:'absolute', top:3, left: on ? 25 : 3, transition:'left .3s' }),
  fileBox: (err) => ({ border:`2px dashed ${err ? '#f87171' : 'rgba(124,58,237,.5)'}`, borderRadius:14, padding:'22px 16px', textAlign:'center', cursor:'pointer', transition:'border-color .2s, background .2s', background:'rgba(255,255,255,.03)' }),
  nav: { display:'flex', justifyContent:'space-between', marginTop:28 },
  btnSec: { background:'rgba(255,255,255,.08)', border:'1.5px solid rgba(255,255,255,.15)', color:'#cbd5e1', borderRadius:10, padding:'10px 28px', cursor:'pointer', fontSize:14, fontWeight:600 },
  btnPri: { background:'linear-gradient(135deg,#7c3aed,#2563eb)', border:'none', color:'#fff', borderRadius:10, padding:'10px 28px', cursor:'pointer', fontSize:14, fontWeight:700, boxShadow:'0 4px 16px rgba(124,58,237,.4)' },
  success: { textAlign:'center', padding:'80px 20px' },
  checkCircle: { width:80, height:80, borderRadius:'50%', background:'linear-gradient(135deg,#059669,#10b981)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, margin:'0 auto 24px' },
};

const icons = ['👤','📞','🏠','📄','🎓','💼','❤️'];

function Field({ label, error, children }) {
  return (
    <div style={S.fld}>
      <label style={S.lbl}>{label}</label>
      {children}
      {error && <span style={S.errtxt}>⚠ {error}</span>}
    </div>
  );
}

function Inp({ f, k, label, type='text', ...rest }) {
  return (
    <Field label={label} error={f.errors[k]}>
      <input type={type} value={f.form[k]||''} onChange={e => f.set(k, e.target.value)}
        style={S.inp(f.errors[k])} {...rest} />
    </Field>
  );
}

function Sel({ f, k, label, opts }) {
  return (
    <Field label={label} error={f.errors[k]}>
      <select value={f.form[k]||''} onChange={e => f.set(k, e.target.value)} style={S.sel(f.errors[k])}>
        <option value=''>Select {label}</option>
        {opts.map(o => <option key={o.v ?? o} value={o.v ?? o}>{o.l ?? o}</option>)}
      </select>
    </Field>
  );
}

function FileField({ f, k, label, accept, maxMB }) {
  const handleFile = useCallback(e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > maxMB * 1024 * 1024) { alert(`Max size is ${maxMB}MB`); return; }
    f.set(k, file.name);
  }, [f, k, maxMB]);
  return (
    <Field label={label} error={f.errors[k]}>
      <div style={S.fileBox(f.errors[k])} onClick={() => document.getElementById('fu_'+k).click()}>
        <input id={'fu_'+k} type='file' accept={accept} style={{display:'none'}} onChange={handleFile}/>
        {f.form[k] ? <><div style={{fontSize:22}}>✅</div><div style={{color:'#34d399',fontSize:13,marginTop:4}}>{f.form[k]}</div></>
          : <><div style={{fontSize:28, color:'#7c3aed'}}>📎</div><div style={{fontSize:13,color:'#64748b',marginTop:6}}>Click to upload · {accept} · max {maxMB}MB</div></>}
      </div>
    </Field>
  );
}

export default function ApplyNow() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setFormState] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [jobPostings, setJobPostings] = useState([]);
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    const apiBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api/public';
    axios.get(apiBase + '/job-postings')
      .then(res => setJobPostings((res.data?.data || res.data || []).map(j => ({ v: j.id, l: j.Posting_Title }))))
      .catch(() => {});
    axios.get(apiBase + '/companies')
      .then(res => setCompanies((res.data?.data || res.data || []).map(c => ({ v: c.id, l: c.Company_Name }))))
      .catch(() => {});
  }, []);

  const set = useCallback((k, v) => setFormState(p => ({ ...p, [k]: v })), []);
  const f = { form, errors, set };

  const next = () => {
    const e = validateStep(step, form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStep(s => s + 1);
  };
  const prev = () => { setErrors({}); setStep(s => s - 1); };

  const submit = async () => {
    const e = validateStep(7, form);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await axios.post(API, { ...form, Application_Status: 'APPLIED' });
      setDone(true);
    } catch {
      alert('Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  const restart = () => { setOpen(false); setStep(0); setFormState(INIT); setErrors({}); setDone(false); };

  const sections = [
    // 0 Personal
    <div>
      <div style={S.sh2}>{icons[0]} Personal Information</div>
      <div style={S.grid}>
        <div style={{gridColumn:'1/-1'}}><Sel f={f} k='company_id' label='Company *' opts={companies}/></div>
        <Inp f={f} k='First_Name' label='First Name *'/>
        <Inp f={f} k='Middle_Name' label='Middle Name'/>
        <Inp f={f} k='Last_Name' label='Last Name *'/>
        <Inp f={f} k='Date_of_Birth' label='Date of Birth *' type='date'/>
        <Sel f={f} k='Gender' label='Gender *' opts={GENDER_OPT}/>
        <Sel f={f} k='Marital_Status' label='Marital Status *' opts={MARITAL_OPT}/>
        <Sel f={f} k='Nationality' label='Nationality *' opts={NATIONALITY_OPT}/>
      </div>
    </div>,
    // 1 Contact
    <div>
      <div style={S.sh2}>{icons[1]} Contact Details</div>
      <div style={S.grid}>
        <Inp f={f} k='Email_ID' label='Email *' type='email'/>
        <Inp f={f} k='Phone_Number' label='Mobile Number *' maxLength={10}/>
        <Inp f={f} k='Alternate_Phone' label='Alternate Number *' maxLength={10}/>
        <Inp f={f} k='Emergency_Contact_Name' label='Emergency Contact Name *'/>
        <Inp f={f} k='Emergency_Contact_Number' label='Emergency Contact Number *' maxLength={10}/>
      </div>
    </div>,
    // 2 Address
    <div>
      <div style={S.sh2}>{icons[2]} Address</div>
      <div style={S.grid}>
        <div style={{gridColumn:'1/-1'}}><Inp f={f} k='Address_Line1' label='Address Line 1 *'/></div>
        <div style={{gridColumn:'1/-1'}}><Inp f={f} k='Address_Line2' label='Address Line 2'/></div>
        <Inp f={f} k='City' label='City *'/>
        <Inp f={f} k='State' label='State *'/>
        <Inp f={f} k='Country' label='Country *'/>
        <Inp f={f} k='Pincode' label='Pincode *' maxLength={6}/>
      </div>
    </div>,
    // 3 Documents
    <div>
      <div style={S.sh2}>{icons[3]} Documents</div>
      <div style={S.grid}>
        <Inp f={f} k='Aadhaar_Number' label='Aadhaar Number *' maxLength={12}/>
        <Inp f={f} k='PAN_Number' label='PAN Number *' maxLength={10} style={S.inp(f.errors.PAN_Number)} onInput={e=>e.target.value=e.target.value.toUpperCase()}/>
        <FileField f={f} k='Aadhaar_File' label='Aadhaar Card *' accept='.pdf,.jpg,.jpeg,.png' maxMB={2}/>
        <FileField f={f} k='PAN_File' label='PAN Card *' accept='.pdf,.jpg,.jpeg,.png' maxMB={2}/>
        <FileField f={f} k='Photo_File' label='Passport Photo *' accept='.jpg,.jpeg,.png' maxMB={1}/>
        <FileField f={f} k='Other_Doc_File' label='Other Document' accept='.pdf,.jpg,.jpeg,.png' maxMB={5}/>
      </div>
    </div>,
    // 4 Education
    <div>
      <div style={S.sh2}>{icons[4]} Education</div>
      <div style={S.grid}>
        <Sel f={f} k='Qualification' label='Qualification *' opts={QUAL_OPT}/>
        <Inp f={f} k='Degree_Name' label='Degree *'/>
        <Sel f={f} k='Specialization' label='Specialization *' opts={SPEC_OPT}/>
        <Inp f={f} k='University_Name' label='University *'/>
        <Inp f={f} k='Institute_Name' label='Institute *'/>
        <Inp f={f} k='Edu_Start_Year' label='Start Year *' maxLength={4} placeholder='YYYY'/>
        <Inp f={f} k='Edu_End_Year' label='End Year *' maxLength={4} placeholder='YYYY'/>
        <Inp f={f} k='Passing_Year' label='Passing Year *' maxLength={4} placeholder='YYYY'/>
        <Inp f={f} k='Percentage' label='Percentage *' placeholder='e.g. 85.5'/>
        <Inp f={f} k='Edu_Grade' label='Grade *' placeholder='e.g. A, B+'/>
      </div>
    </div>,
    // 5 Experience
    <div>
      <div style={S.sh2}>{icons[5]} Work Experience</div>
      <div style={S.toggle}>
        <div style={S.togBox(form.Is_Fresher)} onClick={() => set('Is_Fresher', !form.Is_Fresher)}>
          <div style={S.togThumb(form.Is_Fresher)}/>
        </div>
        <span style={{fontSize:15, fontWeight:600, color: form.Is_Fresher ? '#34d399' : '#94a3b8'}}>I am a Fresher (no prior experience)</span>
      </div>
      {!form.Is_Fresher && (
        <div style={S.grid}>
          <Inp f={f} k='Prev_Company_Name' label='Previous Company *'/>
          <Inp f={f} k='Prev_Designation' label='Designation *'/>
          <Inp f={f} k='Prev_Department' label='Department *'/>
          <Inp f={f} k='Industry_Type' label='Industry *'/>
          <Inp f={f} k='Exp_Start_Date' label='Start Date *' type='date'/>
          <Inp f={f} k='Exp_End_Date' label='End Date *' type='date'/>
          <Inp f={f} k='Total_Experience' label='Total Experience (yrs) *' placeholder='e.g. 3.5'/>
          <Inp f={f} k='Last_Drawn_Salary' label='Last Drawn Salary *' placeholder='e.g. 450000'/>
          <div style={{gridColumn:'1/-1'}}><Inp f={f} k='Reason_For_Leaving' label='Reason For Leaving'/></div>
        </div>
      )}
    </div>,
    // 6 Nominee
    <div>
      <div style={S.sh2}>{icons[6]} Nominee Details</div>
      <div style={S.grid}>
        <Inp f={f} k='Nominee_Name' label='Nominee Name *'/>
        <Sel f={f} k='Nominee_Relationship' label='Relationship *' opts={NOMINEE_REL}/>
        <Inp f={f} k='Nominee_Date_of_Birth' label='Nominee DOB *' type='date'/>
        <Inp f={f} k='Nominee_Contact_Number' label='Nominee Contact *' maxLength={10}/>
      </div>
    </div>,
    // 7 Application Info
    <div>
      <div style={S.sh2}>🏢 Application Info</div>
      <div style={S.grid}>
        <Sel f={f} k='HRMS_Job_Posting_ID' label='Job Posting *' opts={jobPostings}/>
        <Inp f={f} k='Expected_Salary' label='Expected Salary' placeholder='e.g. 500000'/>
        <Sel f={f} k='Source' label='Source' opts={SOURCE_OPT}/>
        <Inp f={f} k='Applied_Date' label='Applied Date' type='date' readOnly disabled/>
        <Inp f={f} k='Application_Status' label='Status' readOnly disabled/>
      </div>
    </div>,
  ];

  if (!open) return (
    <div style={S.page}>
      <div style={S.hero}>
        <div style={S.logo}>🏢</div>
        <h1 style={S.htitle}>Join Our Team</h1>
        <p style={S.hsub}>We're looking for passionate people. Fill out your application and take the first step towards an exciting career.</p>
        <button style={S.applyBtn} onClick={() => setOpen(true)}
          onMouseEnter={e => { e.target.style.transform='scale(1.05)'; e.target.style.boxShadow='0 12px 40px rgba(124,58,237,.6)'; }}
          onMouseLeave={e => { e.target.style.transform='scale(1)'; e.target.style.boxShadow='0 8px 32px rgba(124,58,237,.45)'; }}>
          Apply Now →
        </button>
      </div>
    </div>
  );

  if (done) return (
    <div style={S.page}>
      <div style={S.success}>
        <div style={S.checkCircle}>✅</div>
        <h2 style={{fontSize:28, fontWeight:800, color:'#34d399', marginBottom:12}}>Application Submitted!</h2>
        <p style={{color:'#94a3b8', fontSize:16, maxWidth:480, margin:'0 auto 32px'}}>Thank you for applying. We've received your application and will be in touch soon.</p>
        <button style={S.btnPri} onClick={restart}>Back to Home</button>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={{padding:'32px 20px 60px'}}>
        <div style={{textAlign:'center', marginBottom:32}}>
          <div style={{fontSize:24, fontWeight:800, background:'linear-gradient(90deg,#a78bfa,#60a5fa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent'}}>
            🏢 Candidate Application
          </div>
        </div>
        {/* Progress */}
        <div style={S.progress}>
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div style={S.stepItem}>
                <div style={S.stepDot(i === step, i < step)}>{i < step ? '✓' : i + 1}</div>
                <div style={S.stepLbl(i === step, i < step)}>{s}</div>
              </div>
              {i < STEPS.length - 1 && <div style={S.stepConn}/>}
            </React.Fragment>
          ))}
        </div>
        {/* Form card */}
        <div style={S.card}>
          {sections[step]}
          <div style={S.nav}>
            {step > 0 ? <button style={S.btnSec} onClick={prev}>← Previous</button> : <span/>}
            {step < STEPS.length - 1
              ? <button style={S.btnPri} onClick={next}>Next →</button>
              : <button style={{...S.btnPri, opacity: submitting ? .6 : 1}} onClick={submit} disabled={submitting}>
                  {submitting ? 'Submitting…' : '🚀 Submit Application'}
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  );
}
