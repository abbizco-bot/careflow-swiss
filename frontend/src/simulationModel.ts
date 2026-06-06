export type SimulationEventCategoryId =
  | "staff"
  | "qualification"
  | "resident"
  | "operational"
  | "quality";

export type SensitivityKey =
  | "shortNotice"
  | "qualification"
  | "workload"
  | "qm";

export type SensitivitySettings = Record<SensitivityKey, number>;

export type SimulationEventCategory = {
  id: SimulationEventCategoryId;
  label: string;
  description: string;
};

export type SimulationEvent = {
  id: string;
  category: SimulationEventCategoryId;
  label: string;
  description: string;
  baseImpact: number;
  sensitivity: SensitivitySettings;
  leadershipRelevance: string[];
};

export type CalculatedSimulationEvent = SimulationEvent & {
  impactScore: number;
  combinedSensitivity: number;
};

export type SimulationResult = {
  selectedEvents: CalculatedSimulationEvent[];
  totalImpact: number;
  status: "stabil" | "angespannt" | "kritisch" | "eskalation";
  statusLabel: string;
  interpretation: string;
  strongestDrivers: CalculatedSimulationEvent[];
  leadershipAreas: string[];
};

export const simulationEventCategories: SimulationEventCategory[] = [
  {
    id: "staff",
    label: "Personelle Ereignisse",
    description:
      "Ausfälle, kurzfristige Abwesenheiten, Engpässe oder Verschiebungen im Personaleinsatz.",
  },
  {
    id: "qualification",
    label: "Qualifikationsbezogene Ereignisse",
    description:
      "Ereignisse, bei denen nicht nur die Anzahl Personen, sondern die passende Qualifikation führungsrelevant wird.",
  },
  {
    id: "resident",
    label: "Bewohnerbezogene Ereignisse",
    description:
      "Veränderungen in der Betreuungslage, die Einfluss auf Pflegeaufwand, Teamstabilität oder Führungsaufmerksamkeit haben.",
  },
  {
    id: "operational",
    label: "Betriebliche Ereignisse",
    description:
      "Kurzfristige Störungen, organisatorische Zusatzbelastungen oder Umplanungsbedarf.",
  },
  {
    id: "quality",
    label: "QM- und Führungsereignisse",
    description:
      "Ereignisse, die nicht nur operativ, sondern auch für Qualitätsmanagement, Dokumentation oder Führungsauswertung relevant sind.",
  },
];

export const defaultSensitivitySettings: SensitivitySettings = {
  shortNotice: 1.0,
  qualification: 1.0,
  workload: 1.0,
  qm: 1.0,
};

export const simulationEvents: SimulationEvent[] = [
  {
    id: "short_notice_sick_leave",
    category: "staff",
    label: "Kurzfristige Krankmeldung",
    description: "Eine geplante Pflegeperson fällt kurzfristig aus.",
    baseImpact: 3,
    sensitivity: {
      shortNotice: 1.3,
      qualification: 1.1,
      workload: 1.0,
      qm: 0.6,
    },
    leadershipRelevance: ["Tagessteuerung", "Dienstersatz", "Teamstabilität"],
  },
  {
    id: "night_shift_absence",
    category: "staff",
    label: "Ausfall Nachtdienst",
    description: "Eine Nachtdienstbesetzung fällt aus oder ist nicht gesichert.",
    baseImpact: 5,
    sensitivity: {
      shortNotice: 1.4,
      qualification: 1.3,
      workload: 1.2,
      qm: 0.9,
    },
    leadershipRelevance: [
      "Sicherstellung Betreuung",
      "Eskalation",
      "Führungsaufmerksamkeit",
    ],
  },
  {
    id: "qualification_gap",
    category: "qualification",
    label: "Qualifikationslücke im Dienst",
    description:
      "Die Anzahl Personen reicht formal aus, aber die notwendige Qualifikation ist nicht ausreichend abgedeckt.",
    baseImpact: 4,
    sensitivity: {
      shortNotice: 1.1,
      qualification: 1.5,
      workload: 1.0,
      qm: 1.1,
    },
    leadershipRelevance: [
      "Fachverantwortung",
      "Risikoprüfung",
      "Kompetenzabdeckung",
    ],
  },
  {
    id: "resident_acuity_increase",
    category: "resident",
    label: "Erhöhter Pflege- oder Betreuungsbedarf",
    description:
      "Ein Bewohner benötigt kurzfristig deutlich mehr Aufmerksamkeit, Begleitung oder Pflegezeit.",
    baseImpact: 4,
    sensitivity: {
      shortNotice: 1.0,
      qualification: 1.2,
      workload: 1.5,
      qm: 0.8,
    },
    leadershipRelevance: ["Pflegeaufwand", "Teamlast", "Wohnbereichslage"],
  },
  {
    id: "resident_death",
    category: "resident",
    label: "Todesfall eines Bewohners",
    description:
      "Ein Todesfall erzeugt emotionale, organisatorische und dokumentationsbezogene Zusatzanforderungen.",
    baseImpact: 4,
    sensitivity: {
      shortNotice: 0.9,
      qualification: 1.0,
      workload: 1.1,
      qm: 1.4,
    },
    leadershipRelevance: [
      "Angehörigenkontakt",
      "Dokumentation",
      "Teamverarbeitung",
      "QM-Spur",
    ],
  },
  {
    id: "unplanned_admission",
    category: "operational",
    label: "Kurzfristige Aufnahme",
    description:
      "Eine ungeplante oder kurzfristig vorgezogene Aufnahme verändert die Belastungslage.",
    baseImpact: 3,
    sensitivity: {
      shortNotice: 1.3,
      qualification: 1.0,
      workload: 1.3,
      qm: 1.0,
    },
    leadershipRelevance: [
      "Aufnahmeprozess",
      "Ressourcenabgleich",
      "Koordination",
    ],
  },
  {
    id: "documentation_backlog",
    category: "quality",
    label: "Dokumentationsrückstand",
    description:
      "Wiederkehrende oder zunehmende Rückstände in der Dokumentation werden führungsrelevant.",
    baseImpact: 3,
    sensitivity: {
      shortNotice: 0.7,
      qualification: 0.9,
      workload: 1.1,
      qm: 1.5,
    },
    leadershipRelevance: ["QM-Risiko", "Nachvollziehbarkeit", "Auditfähigkeit"],
  },
];

export function calculateEventImpact(
  event: SimulationEvent,
  sensitivitySettings: SensitivitySettings = defaultSensitivitySettings,
): CalculatedSimulationEvent {
  const shortNoticeEffect =
    event.sensitivity.shortNotice * sensitivitySettings.shortNotice;

  const qualificationEffect =
    event.sensitivity.qualification * sensitivitySettings.qualification;

  const workloadEffect =
    event.sensitivity.workload * sensitivitySettings.workload;

  const qmEffect = event.sensitivity.qm * sensitivitySettings.qm;

  const combinedSensitivity =
    (shortNoticeEffect + qualificationEffect + workloadEffect + qmEffect) / 4;

  const impactScore = event.baseImpact * combinedSensitivity;

  return {
    ...event,
    impactScore: Number(impactScore.toFixed(1)),
    combinedSensitivity: Number(combinedSensitivity.toFixed(2)),
  };
}

export function runCareFlowSimulation(
  selectedEventIds: string[],
  sensitivitySettings: SensitivitySettings = defaultSensitivitySettings,
): SimulationResult {
  const selectedEvents = simulationEvents.filter((event) =>
    selectedEventIds.includes(event.id),
  );

  const calculatedEvents = selectedEvents.map((event) =>
    calculateEventImpact(event, sensitivitySettings),
  );

  const totalImpact = calculatedEvents.reduce(
    (sum, event) => sum + event.impactScore,
    0,
  );

  const roundedImpact = Number(totalImpact.toFixed(1));

  let status: SimulationResult["status"] = "stabil";
  let statusLabel = "Stabil";
  let interpretation =
    "Die simulierte Lage bleibt innerhalb eines gut führbaren Bereichs.";

  if (roundedImpact >= 6 && roundedImpact < 11) {
    status = "angespannt";
    statusLabel = "Angespannt";
    interpretation =
      "Die Lage ist führungsrelevant. Es besteht Beobachtungs- und Koordinationsbedarf.";
  }

  if (roundedImpact >= 11 && roundedImpact < 16) {
    status = "kritisch";
    statusLabel = "Kritisch";
    interpretation =
      "Die Lage verlangt aktive Führungsinterventionen und priorisierte Ressourcenprüfung.";
  }

  if (roundedImpact >= 16) {
    status = "eskalation";
    statusLabel = "Eskalation prüfen";
    interpretation =
      "Die simulierte Lage überschreitet den normalen Steuerungsrahmen. Eine Eskalation oder übergeordnete Unterstützung sollte geprüft werden.";
  }

  const strongestDrivers = [...calculatedEvents]
    .sort((a, b) => b.impactScore - a.impactScore)
    .slice(0, 3);

  const leadershipAreas = Array.from(
    new Set(calculatedEvents.flatMap((event) => event.leadershipRelevance)),
  );

  return {
    selectedEvents: calculatedEvents,
    totalImpact: roundedImpact,
    status,
    statusLabel,
    interpretation,
    strongestDrivers,
    leadershipAreas,
  };
}