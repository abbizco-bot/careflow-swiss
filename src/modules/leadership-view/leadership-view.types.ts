import type { QualificationStatus } from "../validations/qualification/qualification.types";
import type { SituationLevel } from "../validations/situation/situation.types";

export interface LeadershipDayHeadlineView {
  title: string;
  detail: string | null;
  contextLine: string | null;
}

export interface LeadershipDayShiftQualificationView {
  status: QualificationStatus | null;
}

export interface LeadershipDayShiftView {
  type: string;
  label: string;
  plannedCount: number;
  actualCount: number;
  qualification: LeadershipDayShiftQualificationView;
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
