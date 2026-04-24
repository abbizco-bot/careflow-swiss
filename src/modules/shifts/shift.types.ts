export const allowedShiftTypes = ["early", "late", "night", "day"] as const;

export type ShiftType = (typeof allowedShiftTypes)[number];

export function isShiftType(value: string): value is ShiftType {
  return allowedShiftTypes.includes(value as ShiftType);
}
