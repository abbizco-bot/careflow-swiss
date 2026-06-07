# CareFlow API Frontend Contract

## Purpose

This document records the currently active contract between the MVP frontend and backend.

It covers only the endpoint currently consumed by `apps/careflow-mvp-frontend`.

## Current Implementation Status

The active MVP frontend consumes:

- `GET /leadership/day?date=YYYY-MM-DD`

Frontend implementation:

- `apps/careflow-mvp-frontend/src/api.ts`
- `apps/careflow-mvp-frontend/src/components/LeadershipDayView.tsx`
- `apps/careflow-mvp-frontend/src/components/ShiftCard.tsx`

Backend implementation:

- `src/modules/leadership-view/leadership-view.routes.ts`
- `src/modules/leadership-view/leadership-view.controller.ts`
- `src/modules/leadership-view/leadership-view.service.ts`
- `src/modules/leadership-view/leadership-view.types.ts`

## Request

```http
GET /leadership/day?date=YYYY-MM-DD
```

The `date` query parameter is required by the backend controller.

If the date query is missing or empty, the backend returns an error response through `ConflictValidationError`.

## Frontend Base URL

The frontend API client uses:

```text
VITE_CAREFLOW_API_BASE_URL
```

Fallback:

```text
http://localhost:3001
```

## Response Shape Used By Frontend

The active frontend expects:

```ts
type LeadershipDayResponse = {
  date: string;
  day: {
    headline: {
      title: string;
      detail: string | null;
      contextLine: string | null;
    };
    shifts: LeadershipDayShift[];
  };
};

type LeadershipDayShift = {
  type: string;
  label: string;
  plannedCount: number;
  actualCount: number;
  qualification: {
    status: string;
  };
  gap: {
    primaryCause: "none" | "operational" | "absence" | "request_context" | "mixed";
    signals: string[];
    effectiveCoverageGap: number;
    effectiveQualificationGap: number;
    severity: "none" | "attention" | "critical";
  };
};
```

The backend type includes `qualification.status` as a qualification status or `null`. The current frontend type declares it as `string`. Whether this should be adjusted to include `null` is to be verified.

## Frontend Rendering Semantics

The frontend renders:

- day headline title, detail, and context line
- day-level severity derived from the severities of all returned shifts
- shift type and label
- planned and actual counts
- effective coverage and qualification gaps
- primary cause translated into leadership-facing language
- qualification status
- technical signal codes

Translations are in:

- `apps/careflow-mvp-frontend/src/translations.ts`

## Demo Scenarios

The frontend calls the same endpoint with dates from:

- `apps/careflow-mvp-frontend/src/demoScenarios.ts`

Current dates:

- `2088-05-12`
- `2088-05-13`
- `2088-05-05`
- `2088-05-06`
- `2088-05-16`
- `2088-05-07`

## Known Limitations

- This contract documents only the active frontend-consumed endpoint.
- Week, month, validations, planning comparison, and rolling planning endpoints are active backend surface but not currently consumed by the active MVP frontend.
- Error response rendering is generic in the frontend; detailed error contract is not documented here.
- `qualification.status` nullability should be verified against frontend type expectations.

## Next Likely Extensions

- Add contract tests or fixtures for Leadership Day responses.
- Document Planning Comparison once the active MVP frontend consumes it.
- Align frontend TypeScript types with backend response nullability if needed.

## Update Triggers

Update this document when `src/modules/leadership-view/leadership-view.types.ts`, `apps/careflow-mvp-frontend/src/api.ts`, or frontend rendering assumptions change.

