const {v4:uuidv4}=require('uuid');
const bcrypt=require('bcryptjs');
const a=(by='system')=>({active_flag:'Y',effective_from:'2024-01-01',effective_to:null,created_by:by,updated_by:by,created_at:new Date().toISOString(),updated_at:new Date().toISOString()});

const db={
_users:[
  {id:'U1',username:'admin@hrms.com',password:bcrypt.hashSync('admin123',8),role:'Admin',name:'Admin User',...a()},
  {id:'U2',username:'hr@hrms.com',password:bcrypt.hashSync('hr123',8),role:'HR',name:'HR Manager',...a()},
  {id:'U3',username:'emp@hrms.com',password:bcrypt.hashSync('emp123',8),role:'Employee',name:'Employee One',...a()},
],
modules:[
  {id:'MOD1',Module_ID:'MOD1',Module_Name:'Core HR',Module_Code:'CORE_HR',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'MOD2',Module_ID:'MOD2',Module_Name:'Recruitment',Module_Code:'RECRUIT',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'MOD3',Module_ID:'MOD3',Module_Name:'Payroll',Module_Code:'PAYROLL',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'MOD4',Module_ID:'MOD4',Module_Name:'Attendance',Module_Code:'TNA',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'MOD5',Module_ID:'MOD5',Module_Name:'Performance',Module_Code:'PERF',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
business_types:[
  {id:'BT1',Business_Type_ID:'BT1',Business_Type_Name:'IT Services',Business_Type_Code:'IT',module_id:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',...a()},
  {id:'BT2',Business_Type_ID:'BT2',Business_Type_Name:'Manufacturing',Business_Type_Code:'MFG',module_id:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',...a()},
  {id:'BT3',Business_Type_ID:'BT3',Business_Type_Name:'Finance',Business_Type_Code:'FIN',module_id:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',...a()},
],
companies:[
  {id:'C1',Company_ID:'C1',Company_Name:'VVSPL Pvt Ltd',Module_ID:'MOD1',Business_Type_ID:'BT1',PAN:'AABCV1234D',GST:'27AABCV1234D1ZK',TAN:'PNEC12345A',Authorized_Person:'Vikram Shah',Incorporation_Date:'2010-01-15',Website_URL:'www.vvspl.com',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'C2',Company_ID:'C2',Company_Name:'TechStar Ltd',Module_ID:'MOD1',Business_Type_ID:'BT1',PAN:'AABCT5678E',GST:'27AABCT5678E1ZK',TAN:'PNET56789B',Authorized_Person:'Priya Mehta',Incorporation_Date:'2015-06-01',Website_URL:'www.techstar.com',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
locations:[
  {id:'L1',Location_ID:'L1',Country:'India',Module_ID:'MOD1',Currency:'INR',Time_Zone:'IST',Country_Code:'91',State:'Maharashtra',City:'Pune',Postal_Code:'411001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'L2',Location_ID:'L2',Country:'India',Module_ID:'MOD1',Currency:'INR',Time_Zone:'IST',Country_Code:'91',State:'Karnataka',City:'Bengaluru',Postal_Code:'560001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
business_groups:[
  {id:'BG1',BG_ID:'BG1',BG_Name:'Technology Division',Module_ID:'MOD1',Company_ID:'C1',Location_ID:'L1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'BG2',BG_ID:'BG2',BG_Name:'Operations Division',Module_ID:'MOD1',Company_ID:'C1',Location_ID:'L2',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
departments:[
  {id:'D1',Department_ID:'D1',Department_Name:'Engineering',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'D2',Department_ID:'D2',Department_Name:'Human Resources',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'D3',Department_ID:'D3',Department_Name:'Finance',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'D4',Department_ID:'D4',Department_Name:'Marketing',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'D5',Department_ID:'D5',Department_Name:'Operations',Module_ID:'MOD1',company_id:'C2',business_group_id:'BG2',business_type_id:'BT2',module_id:'MOD1',...a()},
],
roles:[
  {id:'R1',Role_ID:'R1',Role_Name:'Backend Developer',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'R2',Role_ID:'R2',Role_Name:'HR Manager',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'R3',Role_ID:'R3',Role_Name:'Finance Analyst',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'R4',Role_ID:'R4',Role_Name:'Frontend Developer',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
designations:[
  {id:'DG1',Designation_ID:'DG1',Designation_Name:'Software Engineer',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'DG2',Designation_ID:'DG2',Designation_Name:'Senior Software Engineer',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'DG3',Designation_ID:'DG3',Designation_Name:'Tech Lead',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'DG4',Designation_ID:'DG4',Designation_Name:'HR Manager',Module_ID:'MOD1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
security_profiles:[
  {id:'SP1',Profile_ID:'SP1',Profile_Code:'ADMIN_PROF',Company_ID:'C1',Module_ID:'MOD1',Business_Type_ID:'BT1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'SP2',Profile_ID:'SP2',Profile_Code:'HR_PROF',Company_ID:'C1',Module_ID:'MOD1',Business_Type_ID:'BT1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
profile_accesses:[
  {id:'PA1',Profile_Access_ID:'PA1',Profile_ID:'SP1',Module_ID:'MOD1',Scope_Type:'ALL',Company_ID:'C1',Business_Type_ID:'BT1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'PA2',Profile_Access_ID:'PA2',Profile_ID:'SP2',Module_ID:'MOD2',Scope_Type:'SPECIFIC',Company_ID:'C1',Business_Type_ID:'BT1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
security_roles:[
  {id:'SR1',ROLE_ID:'SR1',PROFILE_ACCESS_ID:'PA1',MODULE_ID:'MOD1',DEPARTMENT_ID:'D1',ROLES_ID:'R1',DESIGNATION_ID:'DG1',USER_NAME:'admin@hrms.com',PASSWORD:bcrypt.hashSync('admin123',8),ACTIVE_FLAG:'Y',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',effective_from:'2024-01-01',effective_to:null,created_by:'system',updated_by:'system',created_at:new Date().toISOString(),updated_at:new Date().toISOString()},
  {id:'SR2',ROLE_ID:'SR2',PROFILE_ACCESS_ID:'PA2',MODULE_ID:'MOD2',DEPARTMENT_ID:'D2',ROLES_ID:'R2',DESIGNATION_ID:'DG4',USER_NAME:'hr@hrms.com',PASSWORD:bcrypt.hashSync('hr123',8),ACTIVE_FLAG:'Y',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',effective_from:'2024-01-01',effective_to:null,created_by:'system',updated_by:'system',created_at:new Date().toISOString(),updated_at:new Date().toISOString()},
],
table_accesses:[
  {id:'TA1',TABLE_ACCESS_ID:'TA1',SECURITY_ROLES_ID:'SR1',MODULE_ID:'MOD1',USER_NAME_ID:'admin@hrms.com',TABLE_ACCESS:'EMPLOYEE',CREATE:'Y',READ:'Y',UPDATE:'Y',DELETE:'Y',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'TA2',TABLE_ACCESS_ID:'TA2',SECURITY_ROLES_ID:'SR2',MODULE_ID:'MOD1',USER_NAME_ID:'hr@hrms.com',TABLE_ACCESS:'APPLICANT',CREATE:'Y',READ:'Y',UPDATE:'Y',DELETE:'N',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
salary_amounts:[
  {id:'SA1',HRMS_Salary_Amount_ID:'SA1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Salary_Amount:25000,Currency_Code:'INR',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'SA2',HRMS_Salary_Amount_ID:'SA2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Salary_Amount:50000,Currency_Code:'INR',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'SA3',HRMS_Salary_Amount_ID:'SA3',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Salary_Amount:80000,Currency_Code:'INR',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'SA4',HRMS_Salary_Amount_ID:'SA4',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Salary_Amount:120000,Currency_Code:'INR',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
],
salary_ranges:[
  {id:'SR_1',HRMS_Salary_Range_ID:'SR_1',Company_ID:'C1',Business_Group_ID:'BG1',Minimum_Salary:20000,Maximum_Salary:50000,Currency_Code:'INR',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'SR_2',HRMS_Salary_Range_ID:'SR_2',Company_ID:'C1',Business_Group_ID:'BG1',Minimum_Salary:50000,Maximum_Salary:120000,Currency_Code:'INR',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'SR_3',HRMS_Salary_Range_ID:'SR_3',Company_ID:'C1',Business_Group_ID:'BG1',Minimum_Salary:100000,Maximum_Salary:300000,Currency_Code:'INR',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
],
grades:[
  {id:'G1',HRMS_Grade_ID:'G1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Grade_Code:'G-JR',Grade_Name:'Junior Grade',Min_Salary:20000,Max_Salary:50000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'G2',HRMS_Grade_ID:'G2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Grade_Code:'G-MID',Grade_Name:'Mid Grade',Min_Salary:50000,Max_Salary:100000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'G3',HRMS_Grade_ID:'G3',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Grade_Code:'G-SR',Grade_Name:'Senior Grade',Min_Salary:100000,Max_Salary:200000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'G4',HRMS_Grade_ID:'G4',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Grade_Code:'G-MGR',Grade_Name:'Manager Grade',Min_Salary:150000,Max_Salary:350000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
],
grade_steps:[
  {id:'GS1',HRMS_Grade_Step_ID:'GS1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',HRMS_Grade_ID:'G1',Step_Number:1,Step_Name:'Step 1',Step_Amount:25000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'GS2',HRMS_Grade_Step_ID:'GS2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',HRMS_Grade_ID:'G1',Step_Number:2,Step_Name:'Step 2',Step_Amount:35000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'GS3',HRMS_Grade_Step_ID:'GS3',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',HRMS_Grade_ID:'G2',Step_Number:1,Step_Name:'Step 1',Step_Amount:55000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
],
grade_ladders:[
  {id:'GL1',HRMS_Ladder_ID:'GL1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Ladder_Name:'Junior to Mid',HRMS_From_Grade_ID:'G1',HRMS_To_Grade_ID:'G2',Sequence:1,Min_Years_in_Grade:2,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'GL2',HRMS_Ladder_ID:'GL2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',Ladder_Name:'Mid to Senior',HRMS_From_Grade_ID:'G2',HRMS_To_Grade_ID:'G3',Sequence:2,Min_Years_in_Grade:3,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
],
jobs:[
  {id:'J1',HRMS_Job_ID:'J1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Job_Code:'DEV01',Job_Name:'Software Engineer',Description:'Full-stack development',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'J2',HRMS_Job_ID:'J2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Job_Code:'HR01',Job_Name:'HR Manager',Description:'HR operations',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'J3',HRMS_Job_ID:'J3',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT3',Module_ID:'MOD1',Job_Code:'FIN01',Job_Name:'Finance Analyst',Description:'Financial analysis',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
positions:[
  {id:'P1',HRMS_Position_ID:'P1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',HRMS_Job_ID:'J1',HRMS_Grade_ID:'G1',Position_Name:'Junior Software Engineer',Headcount:10,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'P2',HRMS_Position_ID:'P2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',HRMS_Job_ID:'J1',HRMS_Grade_ID:'G2',Position_Name:'Senior Software Engineer',Headcount:5,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'P3',HRMS_Position_ID:'P3',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',HRMS_Job_ID:'J2',HRMS_Grade_ID:'G4',Position_Name:'HR Manager',Headcount:2,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
work_schedules:[
  {id:'WS1',HRMS_Work_Schedule_ID:'WS1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD4',Work_Schedule_Name:'General Shift',Work_Schedule_Code:'GEN_SHF',Shift_Start:'09:00',Shift_End:'18:00',Break_Minutes:60,Working_Hours:8,Applicable_Days:'Mon,Tue,Wed,Thu,Fri',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',...a()},
  {id:'WS2',HRMS_Work_Schedule_ID:'WS2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD4',Work_Schedule_Name:'Night Shift',Work_Schedule_Code:'NIGHT',Shift_Start:'21:00',Shift_End:'06:00',Break_Minutes:30,Working_Hours:8.5,Applicable_Days:'Mon,Tue,Wed,Thu,Fri',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',...a()},
],
assignment_statuses:[
  {id:'AS1',HRMS_Status_Type_ID:'AS1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Status_Code:'ACTIVE',Status_Name:'Active Employee',User_Status:'ACTIVE',System_Status:'ENABLED',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'AS2',HRMS_Status_Type_ID:'AS2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Status_Code:'INACTIVE',Status_Name:'Inactive Employee',User_Status:'INACTIVE',System_Status:'DISABLED',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'AS3',HRMS_Status_Type_ID:'AS3',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Status_Code:'TERMINATED',Status_Name:'Terminated',User_Status:'TERMINATED',System_Status:'DISABLED',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
requisitions:[
  {id:'RQ1',HRMS_Requisition_ID:'RQ1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD2',HRMS_Department_ID:'D1',HRMS_Position_ID:'P1',Requested_By_Employee_ID:'E1',Vacancy_Count:3,Priority:'HIGH',Requisition_Status:'OPEN',Raised_Date:'2024-03-01',Target_Closed_Date:'2024-06-30',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD2',...a()},
  {id:'RQ2',HRMS_Requisition_ID:'RQ2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD2',HRMS_Department_ID:'D2',HRMS_Position_ID:'P3',Requested_By_Employee_ID:'E2',Vacancy_Count:1,Priority:'MEDIUM',Requisition_Status:'IN_PROGRESS',Raised_Date:'2024-04-01',Target_Closed_Date:'2024-07-31',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD2',...a()},
],
job_postings:[
  {id:'JP1',HRMS_Job_Posting_ID:'JP1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD2',HRMS_Requisition_ID:'RQ1',Posting_Title:'Node.js Developer',Posting_Description:'Looking for experienced developer',Qualification_Required:'B.Tech CS',Experience_Years_Min:2,Experience_Years_Max:5,Salary_Range_Min:40000,Salary_Range_Max:80000,Posting_Date:'2024-03-05',Closing_Date:'2024-06-30',Posting_Status:'OPEN',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD2',...a()},
],
applicants:[
  {id:'AP1',HRMS_Applicant_ID:'AP1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD2',First_Name:'Rahul',Last_Name:'Sharma',Email:'rahul@email.com',Phone:'9876501001',Date_of_Birth:'1992-05-15',Source:'PORTAL',Current_Company:'XYZ Corp',Current_Designation:'Developer',Current_Company_Salary:45000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD2',...a()},
  {id:'AP2',HRMS_Applicant_ID:'AP2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD2',First_Name:'Priya',Last_Name:'Patel',Email:'priya@email.com',Phone:'9876501002',Date_of_Birth:'1995-08-22',Source:'LINKEDIN',Current_Company:'ABC Ltd',Current_Designation:'HR Exec',Current_Company_Salary:35000,company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD2',...a()},
],
applications:[
  {id:'APP1',HRMS_Application_ID:'APP1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD2',HRMS_Applicant_ID:'AP1',HRMS_Job_Posting_ID:'JP1',First_Name:'Rahul',Last_Name:'Sharma',Email_ID:'rahul@email.com',Phone_Number:'9876501001',Source:'PORTAL',Expected_Salary:70000,Application_Status:'INTERVIEW',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD2',...a()},
],
interviews:[
  {id:'INT1',HRMS_Interview_ID:'INT1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD2',HRMS_Application_ID:'APP1',Interview_Round:1,Interview_Date:'2024-04-15 10:00',Interview_Employee_ID:'E1',Interview_Mode:'ONLINE',Interview_Status:'COMPLETED',Rating:4.5,Feedback:'Excellent skills',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD2',...a()},
],
template_masters:[
  {id:'TM1',HRMS_Template_Master_ID:'TM1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Template_Code:'OFFER_LTR',Template_Type:'DOCUMENT',Template_Name:'Standard Offer Letter',Description:'Default offer letter',Is_Auto_Generated:'Y',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'TM2',HRMS_Template_Master_ID:'TM2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Template_Code:'CONSENT',Template_Type:'DOCUMENT',Template_Name:'Consent Letter',Description:'Consent letter',Is_Auto_Generated:'N',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
template_assignments:[
  {id:'TA_1',HRMS_Template_Assignment_ID:'TA_1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',HRMS_Applicant_ID:'AP1',HRMS_Application_ID:'APP1',HRMS_Template_Master_ID:'TM1',Assigned_Date:'2024-04-20',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
consent_letters:[
  {id:'CL1',HRMS_Consent_Letter_ID:'CL1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',HRMS_Interview_ID:'INT1',HRMS_Application_ID:'APP1',HRMS_Applicant_ID:'AP1',HRMS_Requisition_ID:'RQ1',HRMS_Position_ID:'P1',HRMS_Template_Assignment_ID:'TA_1',Consent_Letter_Signed:'Y',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
offer_letters:[
  {id:'OL1',HRMS_Offer_Letter_ID:'OL1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',HRMS_Application_ID:'APP1',HRMS_Applicant_ID:'AP1',HRMS_Requisition_ID:'RQ1',HRMS_Position_ID:'P1',HRMS_Consent_Letter_ID:'CL1',HRMS_Grade_ID:'G1',HRMS_Salary_Amount_ID:'SA2',HRMS_Template_Master_ID:'TM1',Offered_Salary:70000,Joining_Date:'2024-06-01',Offer_Date:'2024-04-25',Offer_Expiry_Date:'2024-05-25',Duration_Type:'PERMANENT',Offer_Letter_Signed:'Y',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
hire_records:[
  {id:'HR1',HRMS_Hire_Record_ID:'HR1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',HRMS_Applicant_ID:'AP1',HRMS_Application_ID:'APP1',HRMS_Offer_Letter_ID:'OL1',HRMS_Position_ID:'P1',HRMS_Grade_ID:'G1',Date_of_Joining:'2024-06-01',Employee_Type:'PERMANENT',Hired_Salary:70000,Hire_Status:'JOINED',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
employees:[
  {id:'E1',HRMS_Employee_ID:'E1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Employee_Type:'PERMANENT',First_Name:'Rahul',Middle_Name:'',Last_Name:'Sharma',Date_of_Birth:'1992-05-15',Gender:'MALE',Marital_Status:'MARRIED',Nationality:'Indian',Email_ID:'rahul.sharma@vvspl.com',Phone_Number:'9876501001',Emergency_Contact_Name:'Sunita Sharma',Emergency_Contact_Number:'9876502001',Address_Line1:'123 MG Road',City:'Pune',State:'Maharashtra',Country:'India',Pincode:'411001',Qualification:'B.Tech',Degree_Name:'Computer Science',University_Name:'Pune University',Institute_Name:'VIT',Edu_Start_Year:2010,Edu_End_Year:2014,Passing_Year:2014,Percentage:78.5,Is_Fresher:'N',Total_Experience:8,Nominee_Name:'Sunita Sharma',Nominee_Relationship:'Spouse',Nominee_Date_of_Birth:'1994-03-20',Nominee_Contact_Number:'9876502001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'E2',HRMS_Employee_ID:'E2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Employee_Type:'PERMANENT',First_Name:'Priya',Middle_Name:'',Last_Name:'Patel',Date_of_Birth:'1990-08-22',Gender:'FEMALE',Marital_Status:'SINGLE',Nationality:'Indian',Email_ID:'priya.patel@vvspl.com',Phone_Number:'9876501002',Emergency_Contact_Name:'Rajesh Patel',Emergency_Contact_Number:'9876502002',Address_Line1:'45 Andheri West',City:'Mumbai',State:'Maharashtra',Country:'India',Pincode:'400058',Qualification:'MBA',Degree_Name:'Human Resources',University_Name:'Mumbai University',Institute_Name:'NMIMS',Edu_Start_Year:2008,Edu_End_Year:2012,Passing_Year:2012,Percentage:82,Is_Fresher:'N',Total_Experience:10,Nominee_Name:'Rajesh Patel',Nominee_Relationship:'Father',Nominee_Date_of_Birth:'1965-01-10',Nominee_Contact_Number:'9876502002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'E3',HRMS_Employee_ID:'E3',Company_ID:'C1',Business_Group_ID:'BG2',Business_Type_ID:'BT3',Module_ID:'MOD1',Employee_Type:'CONTRACT',First_Name:'Amit',Middle_Name:'',Last_Name:'Kumar',Date_of_Birth:'1988-12-01',Gender:'MALE',Marital_Status:'MARRIED',Nationality:'Indian',Email_ID:'amit.kumar@vvspl.com',Phone_Number:'9876501003',Emergency_Contact_Name:'Sita Kumar',Emergency_Contact_Number:'9876502003',Address_Line1:'78 Kothrud',City:'Pune',State:'Maharashtra',Country:'India',Pincode:'411038',Qualification:'CA',Degree_Name:'Chartered Accountancy',University_Name:'ICAI',Institute_Name:'ICAI Pune',Edu_Start_Year:2006,Edu_End_Year:2011,Passing_Year:2011,Percentage:71,Is_Fresher:'N',Total_Experience:12,Nominee_Name:'Sita Kumar',Nominee_Relationship:'Spouse',Nominee_Date_of_Birth:'1990-05-15',Nominee_Contact_Number:'9876502003',company_id:'C1',business_group_id:'BG2',business_type_id:'BT3',module_id:'MOD1',...a()},
],
bank_accounts:[
  {id:'BA1',HRMS_Bank_Account_ID:'BA1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',HRMS_Employee_ID:'E1',Bank_Name:'HDFC Bank',Branch_Name:'Pune Main',Account_Number:'12345678901234',IFSC_Code:'HDFC0001234',Account_Type:'SAVINGS',Nominee_Name:'Sunita Sharma',Nominee_Relationship:'Spouse',Nominee_Date_of_Birth:'1994-03-20',Nominee_Gender:'FEMALE',Covered_in_Insurance:'Y',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
  {id:'BA2',HRMS_Bank_Account_ID:'BA2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD3',HRMS_Employee_ID:'E2',Bank_Name:'ICICI Bank',Branch_Name:'Mumbai Andheri',Account_Number:'98765432101234',IFSC_Code:'ICIC0001234',Account_Type:'SALARY',Nominee_Name:'Rajesh Patel',Nominee_Relationship:'Father',Nominee_Date_of_Birth:'1965-01-10',Nominee_Gender:'MALE',Covered_in_Insurance:'N',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',...a()},
],
programs:[
  {id:'PR1',HRMS_Program_ID:'PR1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Program_Code:'JAVA_BASIC',Program_Name:'Java Fundamentals',Provider:'Internal',Duration_Hours:40,Cost_per_Person:5000,Delivery_Mode:'ONLINE',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
  {id:'PR2',HRMS_Program_ID:'PR2',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Program_Code:'REACT_ADV',Program_Name:'React Advanced',Provider:'External',Duration_Hours:30,Cost_per_Person:8000,Delivery_Mode:'HYBRID',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
enrollments:[
  {id:'EN1',HRMS_enrollment_id:'HRMS_ENR_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',HRMS_employee_id:'E1',HRMS_program_id:'PR1',enrollment_date:'2024-02-01',completion_date:'2024-03-15',completion_status:'COMPLETED',score:88,certificate_issued:'true',...a()},
],
assignments:[
  {id:'ASN1',HRMS_assignment_id:'HRMS_ASG_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',HRMS_employee_id:'E1',HRMS_department_id:'D1',HRMS_position_id:'P1',HRMS_grade_id:'G1',HRMS_work_schedule_id:'WS1',HRMS_status_type_id:'AS1',assignment_type:'PERMANENT',inventory_unit:'IT_UNIT_01',...a()},
  {id:'ASN2',HRMS_assignment_id:'HRMS_ASG_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',HRMS_employee_id:'E2',HRMS_department_id:'D2',HRMS_position_id:'P3',HRMS_grade_id:'G4',HRMS_work_schedule_id:'WS1',HRMS_status_type_id:'AS1',assignment_type:'PERMANENT',inventory_unit:'HR_UNIT_01',...a()},
  {id:'ASN3',HRMS_assignment_id:'HRMS_ASG_003',company_id:'C1',business_group_id:'BG2',business_type_id:'BT3',module_id:'MOD1',HRMS_employee_id:'E3',HRMS_department_id:'D1',HRMS_position_id:'P1',HRMS_grade_id:'G1',HRMS_work_schedule_id:'WS2',HRMS_status_type_id:'AS1',assignment_type:'PERMANENT',inventory_unit:'FIN_UNIT_01',...a()},
],
supervisors:[
  {id:'SUP1',HRMS_supervisor_id:'HRMS_SUP_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',HRMS_employee_id:'E1',HRMS_assignment_id:'ASN1',supervisor_employee_id:'E2',supervisor_assignment_id:'ASN2',...a()},
],
employee_histories:[
  {id:'EH1',HRMS_employee_history_id:'HRMS_EH_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',HRMS_employee_id:'E1',HRMS_assignment_id:'ASN1',change_type:'CREATE',field_changed:'status',old_value:null,new_value:'ACTIVE',change_date:'2024-01-01T09:00:00',changed_by:'system',...a()},
],
holidays:[
  {id:'H1',HRMS_holiday_id:'HRMS_HOL_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',country_id:'L1',holiday_date:'2024-01-26',holiday_name:'Republic Day',holiday_type:'NATIONAL',...a()},
  {id:'H2',HRMS_holiday_id:'HRMS_HOL_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',country_id:'L1',holiday_date:'2024-08-15',holiday_name:'Independence Day',holiday_type:'NATIONAL',...a()},
  {id:'H3',HRMS_holiday_id:'HRMS_HOL_003',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',country_id:'L1',holiday_date:'2024-11-01',holiday_name:'Diwali',holiday_type:'RELIGIOUS',...a()},
],
overtimes:[
  {id:'OT1',HRMS_overtime_id:'HRMS_OT_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',HRMS_employee_id:'E1',HRMS_assignment_id:'ASN1',work_date:'2024-04-20',overtime_hours:2.5,overtime_rate_multiplier:1.5,overtime_amount:893.75,approval_status:'APPROVED',approved_by:'U1',...a()},
],
absence_types:[
  {id:'ABT1',HRMS_absence_type_id:'HRMS_ABT_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',absence_code:'ANNUAL',absence_name:'Annual Leave',entitlement_per_year:20,carry_forward_flag:'true',max_carry_days:5,...a()},
  {id:'ABT2',HRMS_absence_type_id:'HRMS_ABT_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',absence_code:'SICK',absence_name:'Sick Leave',entitlement_per_year:10,carry_forward_flag:'false',max_carry_days:0,...a()},
  {id:'ABT3',HRMS_absence_type_id:'HRMS_ABT_003',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',absence_code:'CASUAL',absence_name:'Casual Leave',entitlement_per_year:7,carry_forward_flag:'false',max_carry_days:0,...a()},
],
absences:[
  {id:'ABS1',HRMS_absence_id:'HRMS_ABS_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',HRMS_employee_id:'E1',HRMS_absence_type_id:'ABT1',start_date:'2024-03-10',end_date:'2024-03-15',days:5,status:'APPROVED',approved_by_supervisor_id:'SUP1',entitlement:20,used:5,balance:15,...a()},
  {id:'ABS2',HRMS_absence_id:'HRMS_ABS_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',HRMS_employee_id:'E2',HRMS_absence_type_id:'ABT2',start_date:'2024-04-05',end_date:'2024-04-06',days:2,status:'PENDING',approved_by_supervisor_id:null,entitlement:10,used:2,balance:8,...a()},
],
leave_balances:[
  {id:'LB1',HRMS_leave_balance_id:'HRMS_LB_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',HRMS_employee_id:'E1',HRMS_absence_type_id:'ABT1',entitlement:20,used:5,balance:15,...a()},
  {id:'LB2',HRMS_leave_balance_id:'HRMS_LB_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',HRMS_employee_id:'E1',HRMS_absence_type_id:'ABT2',entitlement:10,used:2,balance:8,...a()},
  {id:'LB3',HRMS_leave_balance_id:'HRMS_LB_003',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',HRMS_employee_id:'E2',HRMS_absence_type_id:'ABT1',entitlement:20,used:3,balance:17,...a()},
],
time_cards:[
  {id:'TC1',HRMS_timecard_id:'HRMS_TC_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',HRMS_employee_id:'E1',HRMS_assignment_id:'ASN1',HRMS_work_schedule_id:'WS1',work_date:'2024-04-15',clock_in:'09:05',clock_out:'18:10',hours_worked:9.08,attendance_status:'PRESENT',overtime_hours:1.08,overtime_rate_multiplier:1.5,overtime_amount:386.25,approval_status:'APPROVED',approved_by:'U1',...a()},
  {id:'TC2',HRMS_timecard_id:'HRMS_TC_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD4',HRMS_employee_id:'E2',HRMS_assignment_id:'ASN2',HRMS_work_schedule_id:'WS1',work_date:'2024-04-15',clock_in:'09:30',clock_out:'18:00',hours_worked:8.5,attendance_status:'PRESENT',overtime_hours:0,overtime_rate_multiplier:1.0,overtime_amount:0,approval_status:'APPROVED',approved_by:'U1',...a()},
],
appraisal_cycles:[
  {id:'APC1',HRMS_appraisal_cycle_id:'HRMS_APC_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',cycle_name:'Annual Review 2024',appraisal_after_months:12,eligibility_days:180,...a()},
  {id:'APC2',HRMS_appraisal_cycle_id:'HRMS_APC_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',cycle_name:'Mid-Year Review 2024',appraisal_after_months:6,eligibility_days:90,...a()},
],
appraisals:[
  {id:'APR1',HRMS_appraisal_id:'HRMS_APR_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',HRMS_appraisal_cycle_id:'APC1',HRMS_employee_id:'E1',HRMS_assignment_id:'ASN1',HRMS_template_master_id:'TM1',review_period:'Annual 2024',reviewer_employee_id:'E2',overall_rating:8.5,recommendation:'INCREMENT',appraisal_status:'APPROVED',...a()},
],
appraisal_key_areas:[
  {id:'AKA1',HRMS_appraisal_key_area_id:'HRMS_AKA_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',HRMS_appraisal_id:'APR1',key_area_name:'Technical Skills',key_area_weightage:40,minimum_rating:1,maximum_rating:10,description:'Technical expertise',...a()},
  {id:'AKA2',HRMS_appraisal_key_area_id:'HRMS_AKA_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',HRMS_appraisal_id:'APR1',key_area_name:'Communication',key_area_weightage:30,minimum_rating:1,maximum_rating:10,description:'Communication skills',...a()},
  {id:'AKA3',HRMS_appraisal_key_area_id:'HRMS_AKA_003',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',HRMS_appraisal_id:'APR1',key_area_name:'Leadership',key_area_weightage:30,minimum_rating:1,maximum_rating:10,description:'Leadership qualities',...a()},
],
employee_appraisals:[
  {id:'EA1',HRMS_employee_appraisal_id:'HRMS_EA_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',HRMS_employee_id:'E1',HRMS_appraisal_key_area_id:'AKA1',overall_rating:8.5,self_rating:8.0,appraisal_status:'APPROVED',...a()},
],
appraisal_ratings:[
  {id:'AR1',HRMS_appraisal_rating_id:'HRMS_AR_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',HRMS_employee_appraisal_id:'EA1',key_area_name:'Technical Skills',employee_self_rating:8.0,hr_supervisor_selection:8.5,comments:'Excellent',...a()},
],
benefit_plans:[
  {id:'BP1',HRMS_benefit_plan_id:'HRMS_BP_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',benefit_plan_name:'Health Insurance',benefit_plan_code:'HI001',benefit_plan_type:'INSURANCE',coverage:500000,employer_contribution_percentage:80,...a()},
  {id:'BP2',HRMS_benefit_plan_id:'HRMS_BP_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',benefit_plan_name:'Provident Fund',benefit_plan_code:'PF001',benefit_plan_type:'RETIREMENT',coverage:100000,employer_contribution_percentage:12,...a()},
],
benefit_enrollments:[
  {id:'BE1',HRMS_benefit_enrollment_id:'HRMS_BE_001',company_id:'C1',business_group_id:'BG1',module_id:'MOD1',HRMS_employee_id:'E1',HRMS_benefit_plan_id:'BP1',HRMS_assignment_id:'ASN1',nominee_name:'Sunita Sharma',nominee_relation:'SPOUSE',percentage_share:100,nominee_date_of_birth:'1994-03-20',nominee_contact_number:'9876502001',nominee_blood_group:'O+',enrollment_status:'APPROVED',...a()},
],
competences:[
  {id:'CO1',HRMS_competence_id:'HRMS_CO_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',competence_name:'Leadership',competence_code:'LEAD001',competence_type:'LEADERSHIP',...a()},
  {id:'CO2',HRMS_competence_id:'HRMS_CO_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',competence_name:'React.js',competence_code:'REACT01',competence_type:'TECHNICAL',...a()},
  {id:'CO3',HRMS_competence_id:'HRMS_CO_003',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',competence_name:'Communication',competence_code:'COMM01',competence_type:'BEHAVIORAL',...a()},
],
employee_competences:[
  {id:'EC1',HRMS_employee_competence_id:'HRMS_EC_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD5',HRMS_employee_id:'E1',HRMS_competence_id:'CO2',competence_type:'TECHNICAL',description:'Expert React developer',...a()},
],
separations:[
  {id:'SEP1',HRMS_separation_id:'HRMS_SEP_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',HRMS_employee_id:'E3',HRMS_assignment_id:'ASN1',separation_type:'RESIGNATION',reason:'Better opportunity',resignation_date:'2024-05-01',notice_period_days:30,last_working_date:'2024-05-31',separation_status:'APPROVED',approved_by_employee_id:'E2',...a()},
],
exit_checklists:[
  {id:'EC_1',HRMS_checklist_id:'HRMS_EC_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',HRMS_separation_id:'SEP1',HRMS_employee_id:'E3',checklist_item:'Return Laptop',department:'IT',assigned_to:'E1',status:'COMPLETED',completion_date:'2024-05-30',remarks:'Returned in good condition',...a()},
],
final_settlements:[
  {id:'FS1',HRMS_final_settlement_id:'HRMS_FS_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',HRMS_separation_id:'SEP1',HRMS_employee_id:'E3',HRMS_assignment_id:'ASN1',pending_salary:50000,leave_encashment_days:10,leave_encashment_amount:25000,gratuity_amount:45000,bonus_due:10000,total_earnings:130000,recovery_name:0,recovery_other:0,total_deductions:0,net_settlement:130000,settlement_status:'APPROVED',...a()},
],
advance_payments:[
  {id:'ADV1',HRMS_advance_id:'HRMS_ADV_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',HRMS_employee_id:'E1',HRMS_assignment_id:'ASN1',advance_amount:20000,advance_reason:'Medical emergency',request_date:'2024-03-01',approved_date:'2024-03-02',disbursement_date:'2024-03-05',recovery_type:'INSTALLMENT',installment_amount:2000,total_installments:10,recovered_amount:4000,remaining_balance:16000,approval_status:'APPROVED',approved_by:'E2',advance_status:'ACTIVE',...a()},
],
advance_recovery_schedules:[
  {id:'ARS1',HRMS_Advanced_Recovery_schedule_id:'HRMS_ARS_001',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',HRMS_advance_id:'ADV1',installment_no:1,due_date:'2024-04-30',installment_amount:2000,paid_amount:2000,balance_amount:0,payment_date:'2024-04-28',payment_status:'PAID',...a()},
  {id:'ARS2',HRMS_Advanced_Recovery_schedule_id:'HRMS_ARS_002',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD3',HRMS_advance_id:'ADV1',installment_no:2,due_date:'2024-05-31',installment_amount:2000,paid_amount:0,balance_amount:2000,payment_date:null,payment_status:'PENDING',...a()},
],
user_employees:[
  {id:'UE1',User_Employee_ID:'UE1',Company_ID:'C1',Business_Group_ID:'BG1',Business_Type_ID:'BT1',Module_ID:'MOD1',Employee_ID:'E1',Application_ID:'APP1',Applicant_ID:'AP1',Template_Assignment_ID:'TA_1',Employee_Detail_ID:'E1',Person_Bank_Account_ID:'BA1',Consent_Letter_ID:'CL1',Offer_Letter_ID:'OL1',Assignment_ID:'ASN1',Supervisor_ID:'E2',Leave_Balance_ID:'LB1',Timecard_ID:'TC1',company_id:'C1',business_group_id:'BG1',business_type_id:'BT1',module_id:'MOD1',...a()},
],
};

const getAll=(t)=>(db[t]||[]).filter(r=>r.active_flag!=='N');
const getById=(t,id)=>(db[t]||[]).find(r=>r.id===id)||null;
const create=(t,d)=>{if(!db[t])db[t]=[];const r={id:uuidv4(),...d,created_at:new Date().toISOString(),updated_at:new Date().toISOString()};db[t].push(r);return r;};
const update=(t,id,d)=>{const i=(db[t]||[]).findIndex(r=>r.id===id);if(i===-1)return null;db[t][i]={...db[t][i],...d,updated_at:new Date().toISOString()};return db[t][i];};
const softDelete=(t,id)=>{const i=(db[t]||[]).findIndex(r=>r.id===id);if(i===-1)return false;db[t][i].active_flag='N';db[t][i].updated_at=new Date().toISOString();return true;};
const paginate=(arr,page=1,limit=10)=>{const p=Math.max(1,+page),l=Math.min(100,+limit||10);return{data:arr.slice((p-1)*l,p*l),total:arr.length,page:p,limit:l,pages:Math.ceil(arr.length/l)};};
const search=(arr,q,flds)=>{if(!q)return arr;const lq=q.toLowerCase();return arr.filter(r=>flds.some(f=>r[f]!=null&&String(r[f]).toLowerCase().includes(lq)));};

module.exports={db,getAll,getById,create,update,softDelete,paginate,search};
