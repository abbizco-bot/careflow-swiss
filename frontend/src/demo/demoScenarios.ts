export type DemoScenarioKey = "stable" | "mixed" | "critical";

export type DemoScenario = {
  key: DemoScenarioKey;
  label: string;
  date: string;
  severity: "stable" | "attention" | "critical";
  title: string;
  description: string;
  reason: string;
  leadershipHint: string;
  afterIntervention: string;
  intervention?: {
    title: string;
    action: string;
    effect: string;
  };
};

export const demoScenarios: DemoScenario[] = [
  {
    key: "stable",
    label: "Stabil",
    date: "2026-06-10",
    severity: "stable",
    title: "Stabile Personallage",
    description:
      "Die geplanten Dienste sind ausreichend besetzt. Es bestehen keine relevanten Abweichungen.",
    reason:
      "Referenzplan und aktuelle Verfügbarkeit stimmen überein.",
    leadershipHint:
      "Keine unmittelbare Intervention nötig. Lage weiter beobachten.",
    afterIntervention:
      "Keine unmittelbare Intervention erforderlich. Lage bleibt stabil und wird weiter beobachtet.",
  },
  {
    key: "mixed",
    label: "Angespannt",
    date: "2026-06-12",
    severity: "attention",
    title: "Einzelne Dienste benötigen Aufmerksamkeit",
    description:
      "Die Lage ist grundsätzlich führbar. Einzelne Hinweise zeigen jedoch eine erhöhte Aufmerksamkeitssituation.",
    reason:
      "Reduzierte Verfügbarkeit und knappe Qualifikationsreserve.",
    leadershipHint:
      "Frühzeitig Ersatzoptionen prüfen und Tagesfunktionen klären.",
    afterIntervention:
      "Risiken werden reduziert. Situation bleibt beobachtungspflichtig.",
    intervention: {
      title: "Mögliche Führungsoption",
      action:
        "Ersatzoptionen vormerken, Qualifikationsreserve prüfen und Tagesverteilung beobachten.",
      effect:
        "Lage bleibt beobachtungspflichtig, Risiken werden reduziert.",
    },
  },
  {
    key: "critical",
    label: "Kritisch",
    date: "2026-06-15",
    severity: "critical",
    title: "Führungshandeln erforderlich",
    description:
      "Für mindestens einen Dienst besteht eine kritische Unterdeckung. Die Lage muss operativ geprüft werden.",
    reason:
      "Krankmeldung einer Fachperson, operative Unterdeckung und Qualifikationslücke im Frühdienst.",
    leadershipHint:
      "Springerpool prüfen, interne Verschiebung klären oder Tagesfunktion neu zuweisen.",
    afterIntervention:
      "Lage stabilisiert sich teilweise. Operative Beobachtung bleibt erforderlich.",
    intervention: {
      title: "Mögliche Führungsintervention",
      action:
        "Springerpool aktiviert und Tagesfunktion neu zugewiesen.",
      effect:
        "Lage stabilisiert sich teilweise, bleibt beobachtungspflichtig.",
    },
  },
];