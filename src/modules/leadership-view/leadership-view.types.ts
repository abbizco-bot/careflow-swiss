import type { QualificationStatus } from "../validations/qualification/qualification.types";
import type { SituationLevel } from "../validations/situation/situation.types";
import type {
  GapInterpretationSignalCode,
  GapPrimaryCause,
} from "../shared/gap-interpretation/gap-interpretation";
import type { LeadershipGapSeverity } from "./leadership-gap-severity";

import type { LeadershipVisibilityContext } from "./visibility-context";

export interface LeadershipDayHeadlineView {
  title: string;
  detail: string | null;
  contextLine: string | null;
  visibilityContext?: LeadershipVisibilityContext;
}

export interface LeadershipDayShiftQualificationView {
  status: QualificationStatus | null;
}

export interface LeadershipDayShiftGapView {
  primaryCause: GapPrimaryCause;
  signals: GapInterpretationSignalCode[];
  effectiveCoverageGap: number;
  effectiveQualificationGap: number;
  severity: LeadershipGapSeverity;
}

export interface LeadershipDayShiftView {
  type: string;
  label: string;
  plannedCount: number;
  actualCount: number;
  qualification: LeadershipDayShiftQualificationView;
  gap: LeadershipDayShiftGapView;
}

export interface LeadershipDayView {
  headline: LeadershipDayHeadlineView;
  shifts: LeadershipDayShiftView[];
}

export interface LeadershipMonthDayView {
  date: string;
  situation: SituationLevel;
}

export interface LeadershipMonthView {
  days: LeadershipMonthDayView[];
}

export interface LeadershipDayResponse {
  date: string;
  day: LeadershipDayView;
}

export interface LeadershipWeekDayView {
  date: string;
  situation: SituationLevel | null;
  note: string | null;
}

export interface LeadershipWeekResponse {
  date: string;
  week: {
    range: {
      from: string;
      to: string;
    };
    summary: {
      situation: SituationLevel | null;
    };
    days: LeadershipWeekDayView[];
  };
}

export interface LeadershipMonthHighlightDayView {
  date: string;
  situation: SituationLevel;
}

export interface LeadershipMonthGroupView {
  from: string;
  to: string;
  situation: SituationLevel | null;
  days: LeadershipMonthHighlightDayView[];
}

export interface LeadershipMonthResponse {
  date: string;
  month: {
    year: number;
    month: number;
    summary: {
      situation: SituationLevel | null;
    };
    groups: LeadershipMonthGroupView[];
  };
}
