import { describe, it, expect } from "vitest";
import { derivePlanningPublicationState } from "./planning-publication-state";

describe("derivePlanningPublicationState", () => {
  it("maps draft to working_draft", () => {
    expect(derivePlanningPublicationState("draft")).toBe("working_draft");
  });

  it("maps published to published_reference", () => {
    expect(derivePlanningPublicationState("published")).toBe("published_reference");
  });

  it("maps reference to published_reference", () => {
    expect(derivePlanningPublicationState("reference")).toBe("published_reference");
  });

  it("maps unknown values to unknown_status", () => {
    expect(derivePlanningPublicationState("something_else")).toBe("unknown_status");
  });
});