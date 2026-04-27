import type { GapPrimaryCause, GapSeverity } from "./api";

export function translateSeverity(severity: GapSeverity) {
  const labels: Record<GapSeverity, string> = {
    none: "Stabil",
    attention: "Beobachten",
    critical: "Kritisch",
  };

  return labels[severity];
}

export function translatePrimaryCause(primaryCause: GapPrimaryCause) {
  const labels: Record<GapPrimaryCause, string> = {
    none: "keine erkennbare Luecke",
    operational: "operative Unterdeckung",
    absence: "Abwesenheit wirkt auf Besetzung",
    request_context: "unsichere oder angefragte Besetzung",
    mixed: "mehrere Ursachen kombiniert",
  };

  return labels[primaryCause];
}

export function describeSeverity(severity: GapSeverity) {
  const descriptions: Record<GapSeverity, string> = {
    none: "Die geplante Besetzung ist wirksam abgedeckt.",
    attention:
      "Es gibt einen relevanten Kontext, aber noch keine wirksame Unterdeckung.",
    critical: "Es besteht eine wirksame Luecke in Besetzung oder Qualifikation.",
  };

  return descriptions[severity];
}
