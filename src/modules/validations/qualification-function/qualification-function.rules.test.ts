import { describe, expect, it } from "vitest";
import type { AssignedFunction } from "../../assignments/assignment.types";
import type { BaseQualification } from "../../employees/employees.types";
import {
  getQualificationFunctionViolation,
  isFunctionAllowedForQualification,
} from "./qualification-function.rules";

describe("qualification function rules", () => {
  it.each([
    ["DIPL_PFLEGE", "Hausverantwortung", true],
    ["FAGE", "Hausverantwortung", false],
    ["DIPL_PFLEGE", "Pflegeleitung", true],
    ["AGS", "Pflegeleitung", false],
    ["DIPL_PFLEGE", "Tagesverantwortung", true],
    ["FAGE", "Tagesverantwortung", true],
    ["PFLEGEHILFE", "Tagesverantwortung", false],
    ["DIPL_PFLEGE", "Springer", true],
    ["FAGE", "Springer", true],
    ["AGS", "Springer", true],
    ["PFLEGEHILFE", "Springer", true],
    ["LEARNER", "Springer", false],
    ["LEARNER", "Lernende", true],
    ["FAGE", "Lernende", false],
    ["EXTERNAL", "Externe", true],
    ["OTHER", "Externe", false],
  ] satisfies Array<[BaseQualification, AssignedFunction, boolean]>)(
    "returns %s/%s as %s",
    (baseQualification, assignedFunction, expected) => {
      expect(
        isFunctionAllowedForQualification(baseQualification, assignedFunction)
      ).toBe(expected);
    }
  );

  it.each([
    "DIPL_PFLEGE",
    "FAGE",
    "AGS",
    "PFLEGEHILFE",
    "LEARNER",
    "EXTERNAL",
    "OTHER",
  ] satisfies BaseQualification[])(
    "allows Pflegedienst for %s",
    (baseQualification) => {
      expect(
        isFunctionAllowedForQualification(baseQualification, "Pflegedienst")
      ).toBe(true);
    }
  );

  it.each([
    "DIPL_PFLEGE",
    "FAGE",
    "AGS",
    "PFLEGEHILFE",
    "LEARNER",
    "EXTERNAL",
    "OTHER",
  ] satisfies BaseQualification[])("allows Andere for %s", (baseQualification) => {
    expect(
      isFunctionAllowedForQualification(baseQualification, "Andere")
    ).toBe(true);
  });

  it("returns no violation for allowed combinations", () => {
    expect(
      getQualificationFunctionViolation("FAGE", "Tagesverantwortung")
    ).toBeNull();
  });

  it("returns an explainable violation for disallowed combinations", () => {
    expect(
      getQualificationFunctionViolation("AGS", "Pflegeleitung")
    ).toEqual({
      baseQualification: "AGS",
      assignedFunction: "Pflegeleitung",
      message:
        "Die Funktion Pflegeleitung ist fuer die Stammqualifikation AGS nicht grundsaetzlich freigegeben.",
    });
  });
});
