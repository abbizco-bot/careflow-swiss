import { describe, expect, it } from "vitest";
import { isEmployeeCountedAsQualified } from "./employee-qualification.rules";

describe("employee qualification counting rule", () => {
  it("counts employees with qualified true as qualified", () => {
    expect(isEmployeeCountedAsQualified({ qualified: true })).toBe(true);
  });

  it("does not count employees with qualified false as qualified", () => {
    expect(isEmployeeCountedAsQualified({ qualified: false })).toBe(false);
  });

  it("does not count missing qualification values as qualified", () => {
    expect(isEmployeeCountedAsQualified({})).toBe(false);
    expect(isEmployeeCountedAsQualified({ qualified: null })).toBe(false);
    expect(isEmployeeCountedAsQualified(undefined)).toBe(false);
    expect(isEmployeeCountedAsQualified(null)).toBe(false);
  });
});
