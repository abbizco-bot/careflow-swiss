export type DemoScenarioKey = "stable" | "mixed" | "critical";

export type DemoScenario = {
  key: DemoScenarioKey;
  label: string;
  date: string;
  severity: "stable" | "attention" | "critical";
  title: string;
  description: string;
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
  },
  {
    key: "mixed",
    label: "Angespannt",
    date: "2026-06-12",
    severity: "attention",
    title: "Einzelne Dienste benötigen Aufmerksamkeit",
    description:
      "Die Lage ist grundsätzlich führbar. Einzelne Hinweise zeigen jedoch eine erhöhte Aufmerksamkeitssituation.",
  },
  {
    key: "critical",
    label: "Kritisch",
    date: "2026-06-15",
    severity: "critical",
    title: "Führungshandeln erforderlich",
    description:
      "Für mindestens einen Dienst besteht eine kritische Unterdeckung. Die Lage muss operativ geprüft werden.",
  },
];