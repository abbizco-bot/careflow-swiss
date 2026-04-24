import { describe, expect, it } from "vitest";
import {
  deriveQualifiedFromBaseQualification,
  isEmployeeCountedAsQualified,
} from "./employee-qualification.rules";

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

describe("base qualification to qualified mapping", () => {
  it.each([
    ["DIPL_PFLEGE", true],
    ["FAGE", true],
    ["AGS", false],
    ["PFLEGEHILFE", false],
    ["LEARNER", false],
    ["EXTERNAL", false],
    ["OTHER", false],
  ] as const)("maps %s to %s", (baseQualification, expected) => {
    expect(deriveQualifiedFromBaseQualification(baseQualification)).toBe(
      expected
    );
  });
});
