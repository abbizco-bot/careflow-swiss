# CareFlow V0.1 Task List

## Phase 1 - Project Foundation
- [ ] Initialize Next.js project with TypeScript
- [ ] Add Tailwind CSS
- [ ] Add Prisma
- [ ] Configure PostgreSQL connection
- [ ] Create Docker setup
- [ ] Create base folder structure
- [ ] Add README and AGENTS instructions

## Phase 2 - Core Data Model
- [ ] Model OrganizationUnit
- [ ] Model Employee
- [ ] Model AvailabilityProfile
- [ ] Model QualificationProfile
- [ ] Model PlanningEvent
- [ ] Model StaffingRequirement
- [ ] Model PlanAssignment
- [ ] Model WarningSignal
- [ ] Create Prisma migrations
- [ ] Create seed data for demo nursing home

## Phase 3 - Employee Master Data UI
- [ ] Employee list page
- [ ] Employee detail page
- [ ] Create employee form
- [ ] Edit employee form
- [ ] Capture workload percentage
- [ ] Capture weekday constraints
- [ ] Capture shift restrictions
- [ ] Capture qualifications and special competencies

## Phase 4 - Planning Events UI
- [ ] Planning event list
- [ ] Add absence/event form
- [ ] Edit absence/event form
- [ ] Filter by employee / month / unit

## Phase 5 - Dashboard
- [ ] KPI cards
- [ ] Show open staffing risks
- [ ] Show qualification risks
- [ ] Show future warning signals
- [ ] Show likely temporary staffing needs

## Phase 6 - Monthly Planning View
- [ ] Create monthly planning screen
- [ ] Show days and shifts
- [ ] Show assigned staff
- [ ] Show gaps
- [ ] Show qualification gaps
- [ ] Allow simple manual assignment changes

## Phase 7 - Warning Logic
- [ ] Staffing gap detection
- [ ] Qualification gap detection
- [ ] Future absence cluster detection
- [ ] Exit-before-entry detection
- [ ] Temporary staffing hint logic

## Phase 8 - Monthly Report
- [ ] Build monthly management report view
- [ ] Summarize risks
- [ ] Summarize qualification gaps
- [ ] Summarize likely temporary staffing needs
- [ ] Add printable report layout

## Phase 9 - Export
- [ ] Add printable monthly plan
- [ ] Add PDF export
- [ ] Test layout readability

## Phase 10 - Cleanup
- [ ] Review domain naming
- [ ] Review UI clarity
- [ ] Remove unnecessary complexity
- [ ] Document next steps for V0.2