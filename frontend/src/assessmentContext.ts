export type AssessmentContext = {
  unitName: string;
  careComplexityLevel: string;
  sourceLabel: string;
  assessmentSystemHint: string;
  assessmentDate: string;
  status: string;
  note: string;
};

const assessmentContextNote =
  "Die Pflegekomplexität dient der Führungseinschätzung. CareFlow erstellt keine Pflegeeinstufung und keine automatische Qualitätsbewertung.";

export const assessmentContextsByUnit: Record<string, AssessmentContext> = {
  "Wohnbereich A": {
    unitName: "Wohnbereich A",
    careComplexityLevel: "erhöht",
    sourceLabel: "bestehendes Pflegebedarfssystem",
    assessmentSystemHint: "BESA/interRAI oder Pflegedokumentation",
    assessmentDate: "01.06.2026",
    status: "aktuell",
    note: assessmentContextNote,
  },
  "Wohnbereich B": {
    unitName: "Wohnbereich B",
    careComplexityLevel: "normal",
    sourceLabel: "bestehendes Pflegebedarfssystem",
    assessmentSystemHint: "BESA/interRAI oder Pflegedokumentation",
    assessmentDate: "01.06.2026",
    status: "aktuell",
    note: assessmentContextNote,
  },
};
