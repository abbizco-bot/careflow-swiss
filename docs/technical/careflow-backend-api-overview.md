# CareFlow Backend API Overview

## Purpose

This document describes the active backend entry points and route families in the current CareFlow MVP implementation.

## Current Implementation Status

The backend is an Express application written in TypeScript.

Main files:

- `src/server.ts`: runtime server entry
- `src/app.ts`: Express app creation and route mounting
- `src/lib/prisma.ts`: Prisma client setup using `DATABASE_URL`

The root backend build command is:

```bash
npm run build
```

It runs:

```bash
tsc
```

## App Entry

`src/server.ts` imports `createApp` from `src/app.ts`, creates the Express app, and listens on port `3001`.

`src/app.ts` configures:

- CORS
- JSON body parsing
- root health/message route at `GET /`
- module route mounts

## Route Mounting

`src/app.ts` mounts these route families:

| Mount | Route file |
| --- | --- |
| `/shifts` | `src/modules/shifts/shift.routes.ts` |
| `/assignments` | `src/modules/assignments/assignment.routes.ts` |
| `/employees` | `src/modules/employees/employees.routes.ts` |
| `/validations` | `src/modules/validations/validations.routes.ts` |
| `/leadership` | `src/modules/leadership-view/leadership-view.routes.ts` |
| `/rolling-planning` | `src/modules/rolling-planning-view/rolling-planning-view.routes.ts` |
| `/absences` | `src/modules/absences/absence.routes.ts` |
| `/availability-requests` | `src/modules/availability-requests/availability-requests.routes.ts` |
| `/planning-months` | `src/modules/planning-months/planning-months.routes.ts` |
| `/ui` | `src/modules/leadership-ui/leadership-ui.routes.ts` |

## Endpoint Families

Leadership:

- `GET /leadership/day?date=YYYY-MM-DD`
- `GET /leadership/week?date=YYYY-MM-DD`
- `GET /leadership/week?start=YYYY-MM-DD&end=YYYY-MM-DD`
- `GET /leadership/month?date=YYYY-MM-DD`

Validations:

- `GET /validations/coverage/shifts`
- `GET /validations/coverage/shifts/:shiftId`
- `GET /validations/conflicts/employees/:employeeId`
- `GET /validations/employees/overview`
- `GET /validations/shifts/overview`
- `GET /validations/shifts/full`
- `GET /validations/situation/trend`
- `GET /validations/situation/history`
- `GET /validations/situation/summary`
- `GET /validations/situation/dashboard`
- `GET /validations/qualification/shifts`
- `GET /validations/qualification/shifts/:shiftId`
- `GET /validations/full/shifts`
- `GET /validations/full/shifts/:shiftId`

Shifts:

- `GET /shifts/ping`
- `GET /shifts`
- `GET /shifts/:id`
- `POST /shifts`
- `PATCH /shifts/:id`
- `DELETE /shifts/:id`

Assignments:

- `GET /assignments`
- `GET /assignments/:id`
- `POST /assignments`
- `PATCH /assignments/:id`
- `DELETE /assignments/:id`

Employees:

- `GET /employees/ping`
- `GET /employees`
- `GET /employees/:employeeId`
- `POST /employees`
- `PATCH /employees/:employeeId`

Absences:

- `GET /absences/active`
- `POST /absences`

Availability requests:

- `GET /availability-requests`
- `GET /availability-requests/:id`
- `POST /availability-requests`
- `PATCH /availability-requests/:id/status`

Planning months:

- `GET /planning-months`
- `GET /planning-months/:id`
- `GET /planning-months/:id/comparison`
- `POST /planning-months`
- `POST /planning-months/:id/initialize-days`
- `GET /planning-months/days/:planningDayId/shift-templates`
- `POST /planning-months/days/:planningDayId/shift-templates`
- `GET /planning-months/shift-templates/:id`
- `PATCH /planning-months/shift-templates/:id`
- `DELETE /planning-months/shift-templates/:id`

Rolling planning:

- `GET /rolling-planning/window`

UI route:

- `/ui` is mounted through `src/modules/leadership-ui/leadership-ui.routes.ts`.
- Exact intended role of this route family in the current application is to be verified before treating it as part of a stable frontend/backend contract.

## Endpoint Used By Earlier Leadership Day MVP Frontend

The earlier backend-integrated Leadership Day MVP frontend currently calls:

- `GET /leadership/day?date=YYYY-MM-DD`

This is implemented through:

- `apps/careflow-mvp-frontend/src/api.ts`
- `src/modules/leadership-view/leadership-view.routes.ts`
- `src/modules/leadership-view/leadership-view.controller.ts`
- `src/modules/leadership-view/leadership-view.service.ts`

## Known Limitations

- This overview lists route definitions, not full request/response contracts for every endpoint.
- Authentication and authorization are not visible in the inspected active route setup.
- Some route families may support development or preparatory behavior; active product scope should be checked against governance docs before expanding UI usage.

## Next Likely Extensions

- Add endpoint-level contracts for frontend-consumed APIs.
- Document validation query parameters and response shapes when frontend or external consumers rely on them.
- Add explicit status for `/ui` if it remains or is removed.

## Update Triggers

Update this document when route files, route mounts, query parameters, response shapes, or endpoint ownership changes.
