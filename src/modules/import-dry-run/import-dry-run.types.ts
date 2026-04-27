export type ImportSourceType =
  | "csv"
  | "excel"
  | "api_export"
  | "structured_json"
  | "unknown";

export type ImportDryRunStatus =
  | "valid"
  | "valid_with_warnings"
  | "invalid";

export type ImportIssueSeverity = "error" | "warning" | "info";

export type ImportDryRunIssueCode =
  | "source_format_unknown"
  | "required_field_missing"
  | "invalid_date"
  | "date_outside_period"
  | "employee_unmapped"
  | "employee_duplicate_match"
  | "shift_type_unmapped"
  | "qualification_unmapped"
  | "daily_function_unmapped"
  | "absence_type_unmapped"
  | "status_unmapped"
  | "area_unmapped"
  | "mapping_profile_missing"
  | "mapping_profile_incomplete"
  | "duplicate_row"
  | "conflicting_assignment"
  | "import_would_create_operational_shift_blocked"
  | "import_would_create_reference_plan_blocked";

export type ImportMappingDimension =
  | "employee"
  | "shift_type"
  | "qualification"
  | "daily_function"
  | "absence"
  | "status"
  | "area"
  | "date_time"
  | "source_metadata";

export interface ImportDryRunSource {
  sourceType: ImportSourceType;
  sourceSystemName?: string;
  sourceFileName?: string;
  sourceFormatVersion?: string;
  importedAt?: string;
}

export interface ImportDryRunPeriod {
  startDate: string;
  endDate: string;
}

export interface MappingProfilePreview {
  id?: string;
  name?: string;
  sourceType?: ImportSourceType;
  mappingDimensions?: ImportMappingDimension[];
}

export interface MappingProfile {
  id?: string;
  name: string;
  sourceType?: ImportSourceType;
  sourceSystemName?: string;
  version?: string;
  dimensions: MappingProfileDimensions;
  metadata?: Record<string, unknown>;
}

export interface MappingProfileDimensions {
  employees?: MappingDimensionDefinition;
  shiftTypes?: MappingDimensionDefinition;
  qualifications?: MappingDimensionDefinition;
  dailyFunctions?: MappingDimensionDefinition;
  absences?: MappingDimensionDefinition;
  statuses?: MappingDimensionDefinition;
  areas?: MappingDimensionDefinition;
  dateTime?: MappingDimensionDefinition;
  sourceMetadata?: MappingDimensionDefinition;
}

export interface MappingDimensionDefinition {
  sourceFields?: string[];
  rules?: MappingRulePreview[];
  metadata?: Record<string, unknown>;
}

export interface MappingRulePreview {
  sourceValue?: unknown;
  targetValue?: unknown;
  description?: string;
  confidence?: "manual" | "inferred" | "unknown";
  metadata?: Record<string, unknown>;
}

export interface ImportDryRunMapping {
  mappingProfileId?: string;
  inlineMappingProfile?: MappingProfilePreview;
}

export interface ImportDryRunInputData {
  rawRows?: unknown[];
  normalizedRows?: unknown[];
}

export interface ImportDryRunInput {
  source: ImportDryRunSource;
  period: ImportDryRunPeriod;
  mapping: ImportDryRunMapping;
  data: ImportDryRunInputData;
  metadata?: Record<string, unknown>;
}

export interface ImportDryRunSummary {
  rowCount: number;
  mappedRowCount: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  unmappedEmployeeCount?: number;
  unmappedShiftTypeCount?: number;
}

export interface ImportDryRunRow {
  rowIndex: number;
  externalRowId?: string;
  rawRow?: unknown;
  normalizedRow?: unknown;
  mappedRow?: unknown;
  issues?: ImportDryRunIssue[];
}

export interface ImportDryRunIssue {
  severity: ImportIssueSeverity;
  code: ImportDryRunIssueCode;
  message: string;
  blocking: boolean;
  rowRef?: {
    rowIndex?: number;
    externalRowId?: string;
  };
  fieldRef?: {
    rawFieldName?: string;
    normalizedFieldName?: string;
    careflowField?: string;
  };
  rawValue?: unknown;
  mappedValue?: unknown;
  mappingDimension?: ImportMappingDimension;
}

export interface ImportDryRunWrites {
  createsOperationalShifts: false;
  createsAssignments: false;
  createsReferencePlan: false;
  overwritesPlanningMonth: false;
  writesAbsences: false;
  changesOperationalPlan: false;
}

export interface DraftPlanCandidatePreview {
  isPersisted: false;
  isApproved: false;
  isReferencePlan: false;
  period: ImportDryRunPeriod;
  summary?: Record<string, unknown>;
}

export interface ImportDryRunResult {
  status: ImportDryRunStatus;
  source: ImportDryRunSource;
  period: ImportDryRunPeriod;
  summary: ImportDryRunSummary;
  rows: ImportDryRunRow[];
  issues: ImportDryRunIssue[];
  draftPlanCandidate?: DraftPlanCandidatePreview;
  writes: ImportDryRunWrites;
}
