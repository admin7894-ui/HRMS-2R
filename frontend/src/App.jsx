import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import AppLayout from './modules/layout/AppLayout';
import ApplyNow from './modules/public/ApplyNow';
import Dashboard from './modules/dashboard/pages/Dashboard';

// Organisation
import DepartmentsPage from './modules/organisation/pages/DepartmentsPage';
import RolesPage from './modules/organisation/pages/RolesPage';
import DesignationsPage from './modules/organisation/pages/DesignationsPage';
import BusinessTypesPage from './modules/organisation/pages/BusinessTypesPage';
import CompaniesPage from './modules/organisation/pages/CompaniesPage';
import LocationsPage from './modules/organisation/pages/LocationsPage';
import BusinessGroupsPage from './modules/organisation/pages/BusinessGroupsPage';
import ModulesPage from './modules/organisation/pages/ModulesPage';

// Security
import SecurityProfilesPage from './modules/security/pages/SecurityProfilesPage';
import ProfileAccessPage from './modules/security/pages/ProfileAccessPage';
import SecurityRolesPage from './modules/security/pages/SecurityRolesPage';
import TableAccessPage from './modules/security/pages/TableAccessPage';

// Compensation
import SalaryAmountsPage from './modules/compensation/pages/SalaryAmountsPage';
import SalaryRangesPage from './modules/compensation/pages/SalaryRangesPage';
import GradesPage from './modules/compensation/pages/GradesPage';
import GradeStepsPage from './modules/compensation/pages/GradeStepsPage';
import GradeLaddersPage from './modules/compensation/pages/GradeLaddersPage';

// Jobs
import JobsPage from './modules/jobs/pages/JobsPage';
import PositionsPage from './modules/jobs/pages/PositionsPage';
import WorkSchedulesPage from './modules/jobs/pages/WorkSchedulesPage';
import AssignmentStatusesPage from './modules/jobs/pages/AssignmentStatusesPage';

// Recruitment
import RequisitionsPage from './modules/recruitment/pages/RequisitionsPage';
import JobPostingsPage from './modules/recruitment/pages/JobPostingsPage';
import ApplicantsPage from './modules/recruitment/pages/ApplicantsPage';
import ApplicationsPage from './modules/recruitment/pages/ApplicationsPage';
import InterviewsPage from './modules/recruitment/pages/InterviewsPage';
import TemplateMastersPage from './modules/recruitment/pages/TemplateMastersPage';
import TemplateAssignmentsPage from './modules/recruitment/pages/TemplateAssignmentsPage';
import ConsentLettersPage from './modules/recruitment/pages/ConsentLettersPage';
import OfferLettersPage from './modules/recruitment/pages/OfferLettersPage';
import HireRecordsPage from './modules/recruitment/pages/HireRecordsPage';

// Employee
import EmployeesPage from './modules/employee/pages/EmployeesPage';
import BankAccountsPage from './modules/employee/pages/BankAccountsPage';
import ProgramsPage from './modules/employee/pages/ProgramsPage';
import EnrollmentsPage from './modules/employee/pages/EnrollmentsPage';
import AssignmentsPage from './modules/employee/pages/AssignmentsPage';
import SupervisorsPage from './modules/employee/pages/SupervisorsPage';
import EmployeeHistoryPage from './modules/employee/pages/EmployeeHistoryPage';

// Attendance
import HolidaysPage from './modules/attendance/pages/HolidaysPage';
import OvertimePage from './modules/attendance/pages/OvertimePage';
import AbsenceTypesPage from './modules/attendance/pages/AbsenceTypesPage';
import AbsencesPage from './modules/attendance/pages/AbsencesPage';
import LeaveBalancesPage from './modules/attendance/pages/LeaveBalancesPage';
import TimeCardsPage from './modules/attendance/pages/TimeCardsPage';

// Performance
import AppraisalCyclesPage from './modules/performance/pages/AppraisalCyclesPage';
import AppraisalsPage from './modules/performance/pages/AppraisalsPage';
import AppraisalKeyAreasPage from './modules/performance/pages/AppraisalKeyAreasPage';
import EmployeeAppraisalsPage from './modules/performance/pages/EmployeeAppraisalsPage';
import AppraisalRatingsPage from './modules/performance/pages/AppraisalRatingsPage';

// Benefits
import BenefitPlansPage from './modules/benefits/pages/BenefitPlansPage';
import BenefitEnrollmentsPage from './modules/benefits/pages/BenefitEnrollmentsPage';
import CompetencesPage from './modules/benefits/pages/CompetencesPage';
import EmployeeCompetencesPage from './modules/benefits/pages/EmployeeCompetencesPage';

// Separation
import SeparationsPage from './modules/separation/pages/SeparationsPage';
import ExitChecklistsPage from './modules/separation/pages/ExitChecklistsPage';
import FinalSettlementsPage from './modules/separation/pages/FinalSettlementsPage';
import AdvancePaymentsPage from './modules/separation/pages/AdvancePaymentsPage';
import AdvanceRecoveryPage from './modules/separation/pages/AdvanceRecoveryPage';
import UserEmployeesPage from './modules/separation/pages/UserEmployeesPage';

// Waits for auto-login to complete before rendering any pages
const Ready = ({ children }) => {
  const { ready } = useAuth();
  if (!ready) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', background:'#0f172a', color:'#94a3b8', fontSize:'14px' }}>
      Loading HRMS…
    </div>
  );
  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes — no auth required */}
          <Route path="/apply" element={<ApplyNow />} />
          <Route path="/" element={<Ready><AppLayout /></Ready>}>
            <Route index element={<Dashboard />} />
            {/* Organisation */}
            <Route path="departments" element={<DepartmentsPage />} />
            <Route path="roles" element={<RolesPage />} />
            <Route path="designations" element={<DesignationsPage />} />
            <Route path="business-types" element={<BusinessTypesPage />} />
            <Route path="companies" element={<CompaniesPage />} />
            <Route path="locations" element={<LocationsPage />} />
            <Route path="business-groups" element={<BusinessGroupsPage />} />
            <Route path="modules" element={<ModulesPage />} />
            {/* Security */}
            <Route path="security-profiles" element={<SecurityProfilesPage />} />
            <Route path="profile-accesses" element={<ProfileAccessPage />} />
            <Route path="security-roles" element={<SecurityRolesPage />} />
            <Route path="table-accesses" element={<TableAccessPage />} />
            {/* Compensation */}
            <Route path="salary-amounts" element={<SalaryAmountsPage />} />
            <Route path="salary-ranges" element={<SalaryRangesPage />} />
            <Route path="grades" element={<GradesPage />} />
            <Route path="grade-steps" element={<GradeStepsPage />} />
            <Route path="grade-ladders" element={<GradeLaddersPage />} />
            {/* Jobs */}
            <Route path="jobs" element={<JobsPage />} />
            <Route path="positions" element={<PositionsPage />} />
            <Route path="work-schedules" element={<WorkSchedulesPage />} />
            <Route path="assignment-statuses" element={<AssignmentStatusesPage />} />
            {/* Recruitment */}
            <Route path="requisitions" element={<RequisitionsPage />} />
            <Route path="job-postings" element={<JobPostingsPage />} />
            <Route path="applicants" element={<ApplicantsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="interviews" element={<InterviewsPage />} />
            <Route path="template-masters" element={<TemplateMastersPage />} />
            <Route path="template-assignments" element={<TemplateAssignmentsPage />} />
            <Route path="consent-letters" element={<ConsentLettersPage />} />
            <Route path="offer-letters" element={<OfferLettersPage />} />
            <Route path="hire-records" element={<HireRecordsPage />} />
            {/* Employee */}
            <Route path="employees" element={<EmployeesPage />} />
            <Route path="bank-accounts" element={<BankAccountsPage />} />
            <Route path="programs" element={<ProgramsPage />} />
            <Route path="enrollments" element={<EnrollmentsPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="supervisors" element={<SupervisorsPage />} />
            <Route path="employee-histories" element={<EmployeeHistoryPage />} />
            {/* Attendance */}
            <Route path="holidays" element={<HolidaysPage />} />
            <Route path="overtimes" element={<OvertimePage />} />
            <Route path="absence-types" element={<AbsenceTypesPage />} />
            <Route path="absences" element={<AbsencesPage />} />
            <Route path="leave-balances" element={<LeaveBalancesPage />} />
            <Route path="time-cards" element={<TimeCardsPage />} />
            {/* Performance */}
            <Route path="appraisal-cycles" element={<AppraisalCyclesPage />} />
            <Route path="appraisals" element={<AppraisalsPage />} />
            <Route path="appraisal-key-areas" element={<AppraisalKeyAreasPage />} />
            <Route path="employee-appraisals" element={<EmployeeAppraisalsPage />} />
            <Route path="appraisal-ratings" element={<AppraisalRatingsPage />} />
            {/* Benefits */}
            <Route path="benefit-plans" element={<BenefitPlansPage />} />
            <Route path="benefit-enrollments" element={<BenefitEnrollmentsPage />} />
            <Route path="competences" element={<CompetencesPage />} />
            <Route path="employee-competences" element={<EmployeeCompetencesPage />} />
            {/* Separation */}
            <Route path="separations" element={<SeparationsPage />} />
            <Route path="exit-checklists" element={<ExitChecklistsPage />} />
            <Route path="final-settlements" element={<FinalSettlementsPage />} />
            <Route path="advance-payments" element={<AdvancePaymentsPage />} />
            <Route path="advance-recovery-schedules" element={<AdvanceRecoveryPage />} />
            <Route path="user-employees" element={<UserEmployeesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnHover />
    </AuthProvider>
  );
}

export default App;
