# HRMS Pro v3 — Complete Restructure with All Fixes

## Architecture
- **Frontend**: React (Vite) + Tailwind CSS — **Separate page file per table** (59 pages in 10 modules)
- **Backend**: Node.js + Express — **Separate route + controller per table** (no generic CRUD)
- **Data**: In-memory store (no database required)

## Quick Start
```bash
# Backend (terminal 1)
cd hrms-v3/backend && npm install && npm start    # → http://localhost:5000

# Frontend (terminal 2)
cd hrms-v3/frontend && npm install && npm run dev  # → http://localhost:5173
```

## Login Credentials
| Role     | Email            | Password |
|----------|------------------|----------|
| Admin    | admin@hrms.com   | admin123 |
| HR       | hr@hrms.com      | hr123    |
| Employee | emp@hrms.com     | emp123   |

## ✅ All 59 Tables — Separate Page Per Table
- Organisation (8): Departments, Roles, Designations, Business types, Companies, Locations, Business groups, Modules
- Security (4): Security profiles, Profile access, Security roles, Table access
- Compensation (5): Salary amounts, Salary ranges, Grades, Grade steps, Grade ladders
- Jobs (4): Jobs, Positions, Work schedules, Assignment statuses
- Recruitment (10): Requisitions, Job postings, Applicants, Applications, Interviews, Template masters, Template assignments, Consent letters, Offer letters, Hire records
- Employee (7): Employees, Bank accounts, Training programs, Enrollments, Assignments, Supervisors, Employee history
- Attendance (6): Holidays, Overtime, Absence types, Absences, Leave balances, Time cards
- Performance (5): Appraisal cycles, Appraisals, Appraisal key areas, Employee appraisals, Appraisal ratings
- Benefits (4): Benefit plans, Benefit enrollments, Competences, Employee competences
- Separation (6): Separations, Exit checklists, Final settlements, Advance payments, Recovery schedules, User employees

## ✅ All Global Fixes Applied
1. View modal shows ALL fields grouped by section
2. Created by / Updated by auto-filled, read-only, with helper text
3. Active + Inactive records always shown; deactivation requires confirmation
4. No duplicate Module field in Details section
5. BT + BG auto-fill from Company; non-editable until Company selected; helper text shown
6. Tooltips on all section headings and fields
7. Sentence case throughout all UI text
8. DD-MM-YYYY date format everywhere
9. Effective from mandatory with asterisk
10. End date calendar restricts to ≥ Start date
11. Error messages: "Please select the Company", "Business type is required", etc.
12. Field placeholders = field name only
13. No raw GUIDs in any LOV dropdown
14. Update confirmation popup before save
15. Red border highlight on error fields
16. Auto-scroll to first error field
17. Records per page selector + pagination on every table
18. View modal redesigned with sections
19. Alphabetic validation + char limits on name fields
20. Email validation with helper text
21. Phone: +91 prefix box + 10-digit field
22. FK columns show human-readable names

## ✅ All Table-Specific Fixes Applied
- Grade: Max salary removed; code auto-generates; save fixed
- Grade Step: NaN display fixed
- Job: Validation fixed; saves correctly
- Position: Job + Grade show names
- Work Schedule: No duplicate Module field
- Assignment Status: Code auto-generates from name
- Requisition: Vacancy 1-1000; Status Open/Close; Priority High/Med/Low
- Applicant: 4 file uploads; Aadhaar 12 digits; PAN validation
- Interview: Future dates only; Status Scheduled/Completed/Cancelled
- Template Master: Code auto-generates; no duplicate Module
- Template Assignment: Applicant removed; Application mandatory
- Consent Letters: Shows names not INT1/RQ1
- Offer Letters: All dropdowns show names; Salary NaN fixed
- Hire Records: Applicant removed; Dept LOV added; two status columns labelled
- Employee: All experience fields mandatory; Other gender input
- Bank Account: Branch alpha 5-20; Account 10-18 digits; IFSC validated
- Training Programs: Code auto-generates; Duration max 999h
- Enrollments: Score decimal 0-100
- Assignments: Employee/Dept/Position show names
- Overtime: Approved by LOV; two status columns labelled
- Absence Types: Code auto-generates; Entitlement max 365 days
- Absences: Days auto-calc; entitlement auto-fetch; balance auto-calc
- Leave Balance: System-maintained; read-only
- Time Cards: Hours auto-calc (overnight-safe); Rate + OT removed from form
- Appraisal Key Areas: Minimum rating LOV 0-5
- Employee Appraisals: Key areas as table with self-rating per area; status auto-set
- Appraisal Ratings: HR rating per key area LOV 0-5; averages auto-calc
- Benefit Plans: Save fixed; code auto BP001+
- Benefit Enrollment: Assignment ID removed
- Exit Checklist: Multi-select LOV with 6 fixed items
- Advance Payment: Assignment ID removed
