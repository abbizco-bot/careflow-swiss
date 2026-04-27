export type DemoScenario = {
  id: string;
  label: string;
  date: string;
  description: string;
};

export const demoScenarios: DemoScenario[] = [
  {
    id: "stable-day",
    label: "Stabiler Tag",
    date: "2088-05-12",
    description: "zeigt Normalzustand ohne Gap",
  },
  {
    id: "attention-request-context",
    label: "Aufmerksamkeit",
    date: "2088-05-13",
    description: "zeigt einen Request-Kontext ohne wirksame Unterdeckung",
  },
  {
    id: "critical-operational-gap",
    label: "Operative Unterdeckung",
    date: "2088-05-05",
    description: "zeigt eine direkte personelle Unterdeckung",
  },
  {
    id: "critical-qualification-gap",
    label: "Qualifikationsluecke",
    date: "2088-05-06",
    description: "zeigt eine wirksame Qualifikationsluecke",
  },
  {
    id: "absence-driven-gap",
    label: "Abwesenheitswirkung",
    date: "2088-05-16",
    description: "zeigt, wie Abwesenheit geplante Besetzung unwirksam macht",
  },
  {
    id: "mixed-gap",
    label: "Gemischte Ursache",
    date: "2088-05-07",
    description: "zeigt mehrere Ursachen in einer Lage",
  },
];
