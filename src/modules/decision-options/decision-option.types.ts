export type DecisionOptionType =
  | "coverage_alternative"
  | "qualification_alternative"
  | "function_alternative"
  | "shift_reassignment_option"
  | "request_resolution_option"
  | "external_staffing_option"
  | "no_action_but_monitor_option"
  | "escalate_to_leadership_option";

export interface DecisionOptionExpectedEffect {
  coverageGapDelta?: number;
  qualificationGapDelta?: number;
}

export interface DecisionOptionPreview {
  id: string;
  type: DecisionOptionType;
  explanation: string;
  expectedEffect?: DecisionOptionExpectedEffect;
  isRecommendation: false;
  requiresHumanApproval: true;
  writesPlanAutomatically: false;
  affectedEmployeeIds?: number[];
  riskNotes?: string[];
  metadata?: Record<string, unknown>;
}
