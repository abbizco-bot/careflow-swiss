import { useMemo, useState } from "react";
import logo from "./assets/careflow-signet.png";
import {
  currentLanguage,
  rollingLeadershipCopy,
  type Severity,
} from "./rollingLeadership.copy";
import {
  demoScenarios,
  type DemoScenario,
  type DemoScenarioKey,
} from "./demo/demoScenarios";

const copy = rollingLeadershipCopy[currentLanguage];

type Day = {
  date: string;
  daySeverity?: string;
  hasReferencePlan?: boolean;
  dataStatus?: string;
};

type DemoPage =
  | "rolling"
  | "day"
  | "week"
  | "deviations"
  | "interventions"
  | "staff"
  | "qualifications"
  | "reports"
  | "settings"
  | "employee";

type NavigationItem = {
  key: DemoPage;
  label: string;
  isEnabled: boolean;
};

type ShiftRow = {
  name: string;
  status: Severity;
  staffing: string;
  qualified: string;
  note: string;
};

type DayViewModel = {
  statusLabel: string;
  statusText: string;
  summaryCounts: {
    planned: number;
    stable: number;
    attention: number;
    critical: number;
  };
  overview: string;
  shifts: ShiftRow[];
  detailTitle: string;
  detailLines: Array<{ label: string; value: string; emphasis?: boolean }>;
  reason: string;
  leadershipHint: string;
  afterIntervention: string;
};

const navigationItems: NavigationItem[] = [
  { key: "rolling", label: "Rollierende Übersicht", isEnabled: true },
  { key: "employee", label: "Mein CareFlow", isEnabled: true },
  { key: "day", label: "Tagesansicht", isEnabled: true },
  { key: "reports", label: "Reports", isEnabled: false },
  { key: "week", label: "Wochenüberblick", isEnabled: true },
  { key: "deviations", label: "Abweichungen", isEnabled: true },
  { key: "interventions", label: "Interventionen", isEnabled: false },
  { key: "staff", label: "Personal", isEnabled: false },
  { key: "qualifications", label: "Qualifikationen", isEnabled: false },
   { key: "settings", label: "Einstellungen", isEnabled: false },
];

function normalizeSeverity(daySeverity?: string): Severity {
  if (daySeverity === "critical") return "critical";
  if (daySeverity === "attention") return "attention";
  return "stable";
}

function severityColor(severity: Severity): string {
  if (severity === "critical") return "#d92d20";
  if (severity === "attention") return "#d9a404";
  return "#1f8f4e";
}

function severitySoftBackground(severity: Severity): string {
  if (severity === "critical") return "#fbefef";
  if (severity === "attention") return "#fbf6df";
  return "#eef7f0";
}

function severitySoftBorder(severity: Severity): string {
  if (severity === "critical") return "#ecc4c0";
  if (severity === "attention") return "#ead99b";
  return "#cfe3d4";
}

function severityLabel(severity: Severity): string {
  if (severity === "critical") return "kritisch";
  if (severity === "attention") return "angespannt";
  return "stabil";
}

function severityBadgeLabel(severity: Severity): string {
  if (severity === "critical") return "KRITISCH";
  if (severity === "attention") return "ANGESPANNT";
  return "STABIL";
}

function getDemoSeverityForIndex(
  index: number,
  scenarioKey: DemoScenarioKey,
): Severity {
  if (scenarioKey === "critical") {
    if (index === 5) return "critical";
    if (index === 2 || index === 4) return "attention";
    return "stable";
  }

  if (scenarioKey === "mixed") {
    if (index === 3 || index === 5) return "attention";
    return "stable";
  }

  return "stable";
}

function applyDemoScenarioToDays(days: Day[], scenario?: DemoScenario): Day[] {
  if (!scenario) return days;

  return days.map((day, index) => ({
    ...day,
    daySeverity: getDemoSeverityForIndex(index, scenario.key),
    hasReferencePlan: day.hasReferencePlan ?? true,
  }));
}

function createFallbackDemoDays(scenario?: DemoScenario): Day[] {
  const startDate = scenario?.date ?? "2026-06-10";

  const baseDays: Day[] = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);

    return {
      date: date.toISOString().slice(0, 10),
      daySeverity: "stable",
      hasReferencePlan: true,
      dataStatus: "reference_plan",
    };
  });

  return applyDemoScenarioToDays(baseDays, scenario);
}

function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString("de-CH");
}

function formatLongDate(date: string): string {
  return new Date(date).toLocaleDateString("de-CH", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function getDayViewModel(severity: Severity): DayViewModel {
  if (severity === "critical") {
    return {
      statusLabel: "Kritisch",
      statusText: "Frühdienst mit Unterdeckung und Qualifikationslücke",
      summaryCounts: { planned: 3, stable: 1, attention: 1, critical: 1 },
      overview:
        "Der Frühdienst ist kritisch. Der Spätdienst ist angespannt. Der Nachtdienst ist stabil. Die Situation sollte vor Dienstbeginn geprüft werden.",
      shifts: [
        {
          name: "Frühdienst",
          status: "critical",
          staffing: "3 / 4",
          qualified: "1 / 2",
          note: "Unterdeckung und Qualifikationslücke",
        },
        {
          name: "Spätdienst",
          status: "attention",
          staffing: "4 / 4",
          qualified: "1 / 2",
          note: "Qualifikation knapp",
        },
        {
          name: "Nachtdienst",
          status: "stable",
          staffing: "2 / 2",
          qualified: "1 / 1",
          note: "Keine Intervention nötig",
        },
      ],
      detailTitle: "Detail: Frühdienst",
      detailLines: [
        { label: "Geplante Mindestbesetzung", value: "4 Personen" },
        { label: "Aktuell verfügbar", value: "3 Personen", emphasis: true },
        { label: "Benötigte Fachpersonen", value: "2" },
        { label: "Verfügbar", value: "1", emphasis: true },
      ],
      reason: "Krankmeldung einer Fachperson",
      leadershipHint:
        "Springerpool prüfen, interne Verschiebung klären oder Tagesfunktion neu zuweisen.",
      afterIntervention:
        "Lage kann stabilisiert werden, bleibt aber beobachtungspflichtig.",
    };
  }

  if (severity === "attention") {
    return {
      statusLabel: "Angespannt",
      statusText: "Ein Dienst weist eine knappe Qualifikationslage auf",
      summaryCounts: { planned: 3, stable: 2, attention: 1, critical: 0 },
      overview:
        "Die Gesamtlage ist tragfähig, aber ein Dienst benötigt erhöhte Aufmerksamkeit. Die Qualifikationsreserve ist knapp und sollte beobachtet werden.",
      shifts: [
        {
          name: "Frühdienst",
          status: "stable",
          staffing: "4 / 4",
          qualified: "2 / 2",
          note: "Keine relevante Abweichung",
        },
        {
          name: "Spätdienst",
          status: "attention",
          staffing: "4 / 4",
          qualified: "1 / 2",
          note: "Qualifikation knapp",
        },
        {
          name: "Nachtdienst",
          status: "stable",
          staffing: "2 / 2",
          qualified: "1 / 1",
          note: "Keine Intervention nötig",
        },
      ],
      detailTitle: "Detail: Spätdienst",
      detailLines: [
        { label: "Geplante Mindestbesetzung", value: "4 Personen" },
        { label: "Aktuell verfügbar", value: "4 Personen" },
        { label: "Benötigte Fachpersonen", value: "2" },
        { label: "Verfügbar", value: "1", emphasis: true },
      ],
      reason: "Knappe Fachpersonenreserve im Spätdienst",
      leadershipHint:
        "Interne Reserve prüfen, Tagesfunktion klären und Entwicklung beobachten.",
      afterIntervention:
        "Lage kann stabil gehalten werden, bleibt aber beobachtungspflichtig.",
    };
  }

  return {
    statusLabel: "Stabil",
    statusText: "Dienste ausreichend besetzt, keine relevante Abweichung",
    summaryCounts: { planned: 3, stable: 3, attention: 0, critical: 0 },
    overview:
      "Die geplanten Dienste sind ausreichend besetzt. Es bestehen keine relevanten Abweichungen. Die Lage kann im normalen Rhythmus weiter beobachtet werden.",
    shifts: [
      {
        name: "Frühdienst",
        status: "stable",
        staffing: "4 / 4",
        qualified: "2 / 2",
        note: "Keine Intervention nötig",
      },
      {
        name: "Spätdienst",
        status: "stable",
        staffing: "4 / 4",
        qualified: "2 / 2",
        note: "Keine Intervention nötig",
      },
      {
        name: "Nachtdienst",
        status: "stable",
        staffing: "2 / 2",
        qualified: "1 / 1",
        note: "Keine Intervention nötig",
      },
    ],
    detailTitle: "Detail: Tageslage",
    detailLines: [
      { label: "Geplante Dienste", value: "3" },
      { label: "Stabile Dienste", value: "3" },
      { label: "Relevante Abweichungen", value: "0" },
      { label: "Datenlage", value: "vollständig" },
    ],
    reason: "Referenzplan und aktuelle Verfügbarkeit stimmen überein.",
    leadershipHint: "Keine unmittelbare Intervention nötig. Lage weiter beobachten.",
    afterIntervention:
      "Keine unmittelbare Intervention erforderlich. Lage bleibt stabil.",
  };
}
function App() {
  const [activePage, setActivePage] = useState<DemoPage>("rolling");
  const [selectedDay, setSelectedDay] = useState<Day | null>(null);
  const [selectedScenarioKey, setSelectedScenarioKey] =
    useState<DemoScenarioKey>("critical");

   const selectedScenario =
    demoScenarios.find((scenario) => scenario.key === selectedScenarioKey) ??
    demoScenarios[0];

 const visibleDays = useMemo(
  () => createFallbackDemoDays(selectedScenario),
  [selectedScenario],
);
console.log("selectedScenarioKey", selectedScenarioKey);
console.log("selectedScenario", selectedScenario);
console.log("visibleDays", visibleDays.map((day) => day.daySeverity));

  const today = visibleDays[0];
  const selectedDayFromVisibleDays = selectedDay
    ? visibleDays.find((day) => day.date === selectedDay.date) ?? null
    : null;
  const currentSelectedDay = selectedDayFromVisibleDays ?? selectedDay ?? today;
  const stableDays = visibleDays.filter(
    (day) => normalizeSeverity(day.daySeverity) === "stable",
  ).length;
  const attentionDays = visibleDays.filter(
    (day) => normalizeSeverity(day.daySeverity) === "attention",
  ).length;
  const criticalDays = visibleDays.filter(
    (day) => normalizeSeverity(day.daySeverity) === "critical",
  ).length;

  const startDate = visibleDays[0]?.date;
  const endDate = visibleDays[visibleDays.length - 1]?.date;
  const formattedStartDate = startDate ? formatShortDate(startDate) : "";
  const formattedEndDate = endDate ? formatShortDate(endDate) : "";

  function renderShell(content: React.ReactNode) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f4f7f4",
          fontFamily: "Arial, sans-serif",
          color: "#1f2a24",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "230px minmax(0, 1fr)",
            minHeight: "100vh",
          }}
        >
          <aside
            style={{
              background: "#ffffff",
              borderRight: "1px solid #e1e8e2",
              padding: "28px 18px",
              position: "sticky",
              top: 0,
              height: "100vh",
              boxSizing: "border-box",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={logo}
                alt="CareFlow-Swiss"
                style={{ width: 38, height: 38, objectFit: "contain" }}
              />
              <div>
                <div style={{ fontWeight: 800 }}>CareFlow-Swiss</div>
                <div style={{ fontSize: 12, color: "#7a877e" }}>Demo</div>
              </div>
            </div>

            <nav style={{ marginTop: 34 }}>
              {navigationItems.map((item) => {
                const isActive = activePage === item.key;

                return (
                  <button
                    key={item.key}
                    type="button"
                    disabled={!item.isEnabled}
                    onClick={() => {
                      if (item.isEnabled) setActivePage(item.key);
                    }}
                    style={{
                      width: "100%",
                      border: "none",
                      borderRadius: 12,
                      padding: "12px 14px",
                      marginBottom: 8,
                      textAlign: "left",
                      fontSize: 14,
                      fontWeight: isActive ? 700 : 600,
                      color: item.isEnabled ? "#24362c" : "#a8b3ac",
                      background: isActive ? "#eef3ef" : "transparent",
                      cursor: item.isEnabled ? "pointer" : "default",
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          <main style={{ padding: "48px 56px" }}>{content}</main>
        </div>
      </div>
    );
  }

  function renderScenarioButtons() {
    return (
      <section
        style={{
          marginBottom: 34,
          display: "flex",
          justifyContent: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        {demoScenarios.map((scenario) => {
          const isSelected = scenario.key === selectedScenarioKey;

          return (
            <button
              key={scenario.key}
              type="button"
              onClick={() => {
                setSelectedScenarioKey(scenario.key);
                setSelectedDay(null);
              }}
              style={{
                padding: "14px 22px",
                borderRadius: 999,
                border: isSelected ? "1px solid #617468" : "1px solid #d6ded8",
                background: isSelected ? "#eef3ef" : "#ffffff",
                color: "#2f3b34",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {scenario.label}
            </button>
          );
        })}
      </section>
    );
  }

  function renderTimeline() {
    return (
      <section
        style={{
          background: "#f8faf8",
          border: "1px solid #e1e8e2",
          borderRadius: 20,
          padding: 40,
          marginBottom: 44,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          Rollierende 28-Tage-Sicht
        </div>

  <div
  style={{
    display: "flex",
    gap: 12,
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    overflowX: "auto",
    paddingBottom: 12,
  }}
>
  {visibleDays.map((day, index) => {
    const severity = getDemoSeverityForIndex(index, selectedScenarioKey);
    const timelineDay = { ...day, daySeverity: severity };
    const isSelected = currentSelectedDay?.date === day.date;

    return (
      <button
        key={day.date}
        type="button"
        aria-label={`Tagesansicht für ${new Date(day.date).toLocaleDateString(
          "de-CH",
        )}`}
        onClick={() => {
          setSelectedDay(timelineDay);
          setActivePage("day");
        }}
        title={`Tagesansicht ${new Date(day.date).toLocaleDateString("de-CH")}`}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: 34,
          flexShrink: 0,
          border: isSelected
            ? `1px solid ${severitySoftBorder(severity)}`
            : "1px solid transparent",
          background: isSelected ? severitySoftBackground(severity) : "transparent",
          borderRadius: 14,
          padding: "8px 4px",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: isSelected ? 22 : 18,
            height: isSelected ? 22 : 18,
            borderRadius: 999,
            backgroundColor:
              severity === "critical"
                ? "#d92d20"
                : severity === "attention"
                  ? "#d9a404"
                  : "#1f8f4e",
            marginBottom: 10,
            boxShadow: isSelected
              ? `0 0 0 4px ${severitySoftBackground(severity)}`
              : "none",
          }}
        />

        <div
          style={{
            fontSize: 10,
            color: isSelected ? "#26342c" : "#66736b",
            fontWeight: isSelected ? 700 : 500,
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          {new Date(day.date).toLocaleDateString("de-CH", {
            day: "2-digit",
            month: "2-digit",
          })}
        </div>
      </button>
    );
  })}
</div>
      </section>
    );
  }

  function renderRollingOverview() {
    const todayStatusLabel =
      selectedScenarioKey === "critical"
        ? "Kritische Lage"
        : selectedScenarioKey === "mixed"
          ? "Angespannte Lage"
          : "Stabile Lage";

    return (
      <>
        <header
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: 42,
          }}
        >
          <div
            style={{
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#66736b",
              marginBottom: 10,
            }}
          >
            CareFlow-Swiss
          </div>

          <h1 style={{ fontSize: 42, margin: 0, fontWeight: 700 }}>
            {copy.appTitle}
          </h1>

          <p
            style={{
              maxWidth: 920,
              marginTop: 24,
              lineHeight: 1.75,
              color: "#4f5d55",
              fontSize: 18,
            }}
          >
            {copy.appSubtitle}
          </p>
        </header>
        
           {activePage === "employee" && (
          <section
            style={{
              background: "#ffffff",
              borderRadius: 24,
              padding: 32,
              maxWidth: 900,
              margin: "0 auto 32px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >
            <h2>Mein CareFlow</h2>
            <h3>Anna Meier – FaGe</h3>
            <p style={{ color: "#66736b" }}>Meine nächsten 28 Tage</p>

            <ul>
              <li>22.06 Frühdienst</li>
              <li>23.06 Frühdienst</li>
              <li>24.06 Frei</li>
              <li>25.06 Spätdienst</li>
              <li>26.06 Nachtdienst</li>
            </ul>

            <hr />

            <p>
              Belastung:
              <strong style={{ color: "#d17c00" }}> erhöht nächste Woche</strong>
            </p>

            <p>Qualifikationen: FaGe / Wundmanagement</p>
            <p>Hinweis: Hohe Einsatzdichte nächste Woche</p>
          </section>
        )}
     
        <div
  
          style={{
            display: activePage === "employee" ? "none" : "block",
            background: "#ffffff",
            border: "1px solid #e1e8e2",
            borderRadius: 16,
            padding: "18px 22px",
            marginBottom: 30,
            color: "#4f5d55",
            textAlign: "center",
            fontWeight: 600,
          }}
        >
          Bestehende Dienstplanung bleibt führend. CareFlow verdichtet vorhandene
          Planungs- und Abwesenheitsdaten zu einer Führungssicht.
               </div>

                   <section
              style={{
            background: "#f7f9f7",
            border: "1px solid #e1e8e2",
            padding: 40,
            marginBottom: 34,
            borderRadius: 20,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#66736b",
              marginBottom: 14,
            }}
          >
            Führungslage – nächste 28 Tage
          </div>

          <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 28 }}>
            {formattedStartDate} – {formattedEndDate}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 36,
              flexWrap: "wrap",
            }}
          >
            <MetricCard value={stableDays} label="Tage mit stabiler Lage" color="#1f8f4e" />
            <MetricCard value={attentionDays} label="Tage mit erhöhter Aufmerksamkeit" color="#d9a404" />
            <MetricCard value={criticalDays} label="Kritische Tage" color="#d92d20" />
          </div>
        </section>

        {renderScenarioButtons()}

        {selectedScenario && (
          <section
            style={{
              marginBottom: 34,
              textAlign: "center",
              color: "#5f6f65",
              fontSize: 18,
              maxWidth: 980,
              marginLeft: "auto",
              marginRight: "auto",
              lineHeight: 1.75,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              {selectedScenario.title}
            </div>
            <div
              style={{
                padding: "18px 24px",
                background: "#f4f6f4",
                border: "1px solid #d8e2da",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 18,
                color: "#2f3f36",
              }}
            >
                      {selectedScenario.description}

{selectedScenario.intervention && (
  <div
    style={{
      marginTop: 16,
      paddingTop: 14,
      borderTop: "1px solid #d8e2da",
      fontWeight: 500,
      fontSize: 15,
      lineHeight: 1.5,
      color: "#3f5147",
    }}
  >
    <div style={{ fontWeight: 800, marginBottom: 8 }}>
      {selectedScenario.intervention.title}
    </div>

    <div>
      <strong>Intervention: </strong>
      {selectedScenario.intervention.action}
    </div>

    <div style={{ marginTop: 6 }}>
      <strong>Wirkung: </strong>
      {selectedScenario.intervention.effect}
    </div>
  </div>
)}
            </div>
          </section>
        )}

        <section
          style={{
            background:
              selectedScenarioKey === "critical"
                ? "#f8f4f4"
                : selectedScenarioKey === "mixed"
                  ? "#f8f6ef"
                  : "#eef3ef",
            border:
              selectedScenarioKey === "critical"
                ? "1px solid #e7c8c8"
                : selectedScenarioKey === "mixed"
                  ? "1px solid #e6d8aa"
                  : "1px solid #d8e2da",
            padding: 46,
            marginBottom: 42,
            borderRadius: 24,
            textAlign: "center",
            boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 16, marginBottom: 10, color: "#6b7a70" }}>
            {selectedScenario?.label}
          </div>

          <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 14 }}>
            {todayStatusLabel}
          </div>

          <div
            style={{
              fontSize: 18,
              color: "#5f6f65",
              maxWidth: 760,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            {selectedScenario?.description}
          </div>
        </section>

        {renderTimeline()}
      </>
    );
  }

  function renderDayView() {
    const selectedDate = currentSelectedDay?.date ?? today?.date ?? "2026-06-10";
    const severity = normalizeSeverity(currentSelectedDay?.daySeverity);
    const dayView = getDayViewModel(severity);

    return (
      <>
        {renderScenarioButtons()}

        <section
          style={{
            background: "#ffffff",
            border: `1px solid ${severitySoftBorder(severity)}`,
            borderRadius: 24,
            padding: 34,
            marginBottom: 26,
            boxShadow: "0 8px 24px rgba(0,0,0,0.05)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 24,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ color: "#66736b", marginBottom: 8 }}>Tagesansicht</div>
              <h1 style={{ margin: 0, fontSize: 34 }}>{formatLongDate(selectedDate)}</h1>
              <div style={{ marginTop: 10, color: "#4f5d55", fontSize: 18 }}>
                {dayView.statusText}
              </div>
            </div>

            <div
              style={{
                background: severitySoftBackground(severity),
                color: severityColor(severity),
                border: `1px solid ${severitySoftBorder(severity)}`,
                borderRadius: 999,
                padding: "12px 18px",
                fontWeight: 900,
                letterSpacing: "0.08em",
              }}
            >
              {severityBadgeLabel(severity)}
            </div>
          </div>
        </section>

        <div
          style={{
            display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: 16,
            marginBottom: 24,
            textAlign: "center",
              wordBreak: "break-word",
          }}
        >
          <SummaryTile label="Dienste geplant" value={dayView.summaryCounts.planned} color="#426b89" />
          <SummaryTile label="Stabil" value={dayView.summaryCounts.stable} color="#1f8f4e" />
          <SummaryTile label="Angespannt" value={dayView.summaryCounts.attention} color="#d9a404" />
          <SummaryTile label="Kritisch" value={dayView.summaryCounts.critical} color="#d92d20" />
        </div>

        <InfoCard title="Tagesüberblick">
          <p style={{ margin: 0, lineHeight: 1.75, color: "#4f5d55" }}>{dayView.overview}</p>
        </InfoCard>

        <InfoCard title="Dienste des Tages">
          <div style={{ display: "grid", gap: 10 }}>
            {dayView.shifts.map((shift) => (
              <div
                key={shift.name}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.2fr 0.8fr 0.8fr 0.9fr 2fr",
                  gap: 12,
                  alignItems: "center",
                  padding: "14px 16px",
                  borderRadius: 14,
                  background: severitySoftBackground(shift.status),
                  border: `1px solid ${severitySoftBorder(shift.status)}`,
                }}
              >
                <strong>{shift.name}</strong>
                <span style={{ color: severityColor(shift.status), fontWeight: 800 }}>
                  {severityLabel(shift.status)}
                </span>
                <span>Besetzung {shift.staffing}</span>
                <span>Fachpersonen {shift.qualified}</span>
                <span style={{ color: "#4f5d55" }}>{shift.note}</span>
              </div>
            ))}
          </div>
        </InfoCard>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22 }}>
          <InfoCard title={dayView.detailTitle}>
            <div style={{ display: "grid", gap: 10 }}>
              {dayView.detailLines.map((line) => (
                <div
                  key={line.label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 18,
                    borderBottom: "1px solid #edf2ee",
                    paddingBottom: 8,
                  }}
                >
                  <span style={{ color: "#66736b" }}>{line.label}</span>
                  <strong style={{ color: line.emphasis ? "#d92d20" : "#26342c" }}>
                    {line.value}
                  </strong>
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <strong>Grund der Abweichung:</strong> {dayView.reason}
              </div>
            </div>
          </InfoCard>

          <InfoCard title="Führungshinweis">
            <p style={{ lineHeight: 1.7, marginTop: 0 }}>{dayView.leadershipHint}</p>
            <div
              style={{
                marginTop: 20,
                padding: 18,
                borderRadius: 14,
                background: "#eef7f0",
                border: "1px solid #cfe3d4",
              }}
            >
              <strong>Nach Intervention</strong>
              <p style={{ marginBottom: 0, lineHeight: 1.7 }}>{dayView.afterIntervention}</p>
            </div>
          </InfoCard>
        </div>

        <div style={{ marginTop: 24, color: "#66736b", fontSize: 14 }}>
          Planungsgrundlage vorhanden · Datenlage vollständig · Entscheidungsstatus offen
        </div>
      </>
    );
  }

  function renderWeekView() {
    const weekDays = visibleDays.slice(0, 7);
    const weekStableDays = weekDays.filter(
      (day) => normalizeSeverity(day.daySeverity) === "stable",
    ).length;
    const weekAttentionDays = weekDays.filter(
      (day) => normalizeSeverity(day.daySeverity) === "attention",
    ).length;
    const weekCriticalDays = weekDays.filter(
      (day) => normalizeSeverity(day.daySeverity) === "critical",
    ).length;
    const relevantWeekDays = weekDays.filter(
      (day) => normalizeSeverity(day.daySeverity) !== "stable",
    );

    const interpretation =
      weekCriticalDays > 0
        ? "Die Woche ist insgesamt tragfähig, enthält aber mindestens einen kritischen Tag. Die Führung sollte die roten Signale frühzeitig prüfen und die betroffenen Dienste vorab absichern."
        : weekAttentionDays > 0
          ? "Die Woche wirkt grundsätzlich stabil, enthält aber beobachtungspflichtige Tage. Der Fokus liegt auf knappen Qualifikationen und möglichen Abwesenheitsfolgen."
          : "Die Woche zeigt eine stabile Führungslage. Es bestehen keine relevanten Abweichungen. Die Lage kann im normalen Rhythmus weiter beobachtet werden.";

    return (
      <>
        {renderScenarioButtons()}
        <PageHeader
          title="Wochenüberblick"
          subtitle={`${formatShortDate(weekDays[0]?.date ?? "")} – ${formatShortDate(
            weekDays[weekDays.length - 1]?.date ?? "",
          )}`}
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <SummaryTile label="Tage stabil" value={weekStableDays} color="#1f8f4e" />
          <SummaryTile label="Tage angespannt" value={weekAttentionDays} color="#d9a404" />
          <SummaryTile label="Tage kritisch" value={weekCriticalDays} color="#d92d20" />
          <SummaryTile label="Beobachtungspflichtige Dienste" value={weekAttentionDays * 2 + weekCriticalDays} color="#d9a404" />
          <SummaryTile label="Kritische Dienste" value={weekCriticalDays} color="#d92d20" />
        </div>

        <InfoCard title="7-Tage-Lage">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 12 }}>
            {weekDays.map((day) => {
              const severity = normalizeSeverity(day.daySeverity);
              return (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    setActivePage("day");
                  }}
                  style={{
                    border: `1px solid ${severitySoftBorder(severity)}`,
                    background: severitySoftBackground(severity),
                    borderRadius: 16,
                    padding: "18px 10px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontWeight: 800, color: severityColor(severity) }}>
                    {severityLabel(severity)}
                  </div>
                  <div style={{ marginTop: 8, color: "#4f5d55" }}>{formatShortDate(day.date)}</div>
                </button>
              );
            })}
          </div>
        </InfoCard>

        <InfoCard title="Führungsinterpretation">
          <p style={{ margin: 0, lineHeight: 1.75 }}>{interpretation}</p>
        </InfoCard>

        <InfoCard title="Beobachtungstage">
          {relevantWeekDays.length === 0 ? (
            <p style={{ margin: 0 }}>Keine beobachtungspflichtigen Tage in dieser Woche.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {relevantWeekDays.map((day) => {
                const severity = normalizeSeverity(day.daySeverity);
                return (
                  <div
                    key={day.date}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 2fr 2fr",
                      gap: 12,
                      padding: 14,
                      borderRadius: 14,
                      border: `1px solid ${severitySoftBorder(severity)}`,
                      background: severitySoftBackground(severity),
                    }}
                  >
                    <strong>{formatShortDate(day.date)}</strong>
                    <span style={{ color: severityColor(severity), fontWeight: 800 }}>
                      {severityLabel(severity)}
                    </span>
                    <span>
                      {severity === "critical" ? "Unterdeckung / Qualifikationslücke" : "Qualifikation knapp"}
                    </span>
                    <span>
                      {severity === "critical" ? "Intervention prüfen" : "Reserve beobachten"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </InfoCard>
      </>
    );
  }

  function renderDeviationsView() {
    const deviationDays = visibleDays
      .map((day, index) => ({ day, index, severity: normalizeSeverity(day.daySeverity) }))
      .filter((item) => item.severity !== "stable");

    return (
      <>
        {renderScenarioButtons()}
        <PageHeader
          title="Abweichungen"
          subtitle="Relevante Planungs- und Führungssignale der nächsten 28 Tage"
        />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            gap: 14,
            marginBottom: 24,
          }}
        >
          <SummaryTile label="Kritische Abweichungen" value={criticalDays} color="#d92d20" />
          <SummaryTile label="Beobachtungspflichtig" value={attentionDays} color="#d9a404" />
          <SummaryTile label="Qualifikationslücken" value={attentionDays + criticalDays} color="#d9a404" />
          <SummaryTile label="Unterdeckungen" value={criticalDays} color="#d92d20" />
          <SummaryTile label="Abwesenheitsrisiken" value={criticalDays > 0 ? 2 : attentionDays > 0 ? 1 : 0} color="#426b89" />
        </div>

        <InfoCard title="Relevante Abweichungen">
          {deviationDays.length === 0 ? (
            <p style={{ margin: 0 }}>Keine relevanten Abweichungen in den nächsten 28 Tagen.</p>
          ) : (
            <div style={{ display: "grid", gap: 10 }}>
              {deviationDays.map(({ day, index, severity }) => (
                <button
                  key={day.date}
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    setActivePage("day");
                  }}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1.6fr 2fr",
                    gap: 12,
                    alignItems: "center",
                    padding: 16,
                    borderRadius: 14,
                    border: `1px solid ${severitySoftBorder(severity)}`,
                    background: severitySoftBackground(severity),
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <strong>{formatShortDate(day.date)}</strong>
                  <span style={{ color: severityColor(severity), fontWeight: 900 }}>
                    {severityLabel(severity)}
                  </span>
                  <span>{severity === "critical" ? "Frühdienst" : index % 2 === 0 ? "Spätdienst" : "Frühdienst"}</span>
                  <span>
  <span>
    {severity === "critical"
      ? "Unterdeckung und Qualifikationslücke · Springerpool prüfen"
      : "Qualifikation knapp · Reserve prüfen"}
  </span>

  <span
  style={{
    display: "block",
    marginTop: 8,
    paddingTop: 6,
    borderTop: "1px solid rgba(80,90,80,0.12)",
    fontSize: 11,
    lineHeight: 1.4,
    fontStyle: "italic",
    color: "#607069",
    fontWeight: 600,
  }}
  >
    {severity === "critical"
      ? "→ Wirkung: Lage teilweise stabilisiert, weiter beobachten"
      : "→ Wirkung: Risiko reduziert, Reserve bleibt im Blick"}
  </span>
</span>
                </button>
              ))}
            </div>
          )}
        </InfoCard>
      </>
    );
  }

  function renderActivePage() {
    if (activePage === "rolling") return renderRollingOverview();
    if (activePage === "employee") return renderEmployeeView();
    if (activePage === "day") return renderDayView();
    if (activePage === "week") return renderWeekView();
    if (activePage === "deviations") return renderDeviationsView();

    return (
      <PageHeader
        title="In Vorbereitung"
        subtitle="Diese Sicht ist für eine spätere Ausbaustufe vorgesehen."
      />
    );
  }
    function renderEmployeeView() {
  return (
    <>
      <PageHeader
        title="Mein CareFlow"
        subtitle="Persönliche Einsatz- und Belastungsperspektive für die nächsten 28 Tage."
      />

      <section
        style={{
          background: "#ffffff",
          border: "1px solid #e1e8e2",
          borderRadius: 20,
          padding: 28,
          marginBottom: 28,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Anna Meier – FaGe</h2>

        <p style={{ color: "#4f5d55", lineHeight: 1.7 }}>
          Diese Sicht zeigt nur die eigene Planung, die eigene Belastung und persönliche Hinweise.
          Andere Mitarbeitende und Führungsindikatoren sind nicht sichtbar.
        </p>

        <div style={{ marginTop: 24, marginBottom: 24 }}>
          <strong style={{ color: "#2f3f36" }}>
            Belastungsverlauf – nächste 28 Tage
          </strong>

          <div
            style={{
              display: "flex",
              gap: 4,
              marginTop: 12,
              flexWrap: "wrap",
            }}
          >
            {[
              "stable", "stable", "stable", "stable",
              "attention", "attention",
              "stable", "stable", "stable",
              "critical",
              "stable", "stable", "stable", "stable",
              "attention",
              "stable", "stable", "stable",
              "stable", "stable", "stable", "stable",
              "stable", "attention",
              "stable", "stable", "stable", "stable",
            ].map((status, index) => (
              <div
                key={index}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 6,
                  background:
                    status === "critical"
                      ? "#d95c5c"
                      : status === "attention"
                      ? "#e1b24d"
                      : "#4ea56b",
                }}
              />
            ))}
          </div>
                    <div
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              marginTop: 10,
              fontSize: 12,
              color: "#66736b",
            }}
          >
            <span>🟢 stabil</span>
            <span>🟡 erhöht</span>
            <span>🔴 kritisch</span>
          </div>
        </div>

        <div
          style={{
            background: "#fff8ea",
            border: "1px solid #f0d99c",
            padding: 18,
            borderRadius: 14,
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 16,
            textAlign: "left",
          }}
        >
          <div style={{ fontSize: 28 }}>⚠️</div>

          <div>
            <strong>Hinweis</strong>
            <p style={{ margin: "6px 0 0", lineHeight: 1.5 }}>
              Hohe Einsatzdichte zwischen 24.06 und 27.06. Erholungszeit prüfen.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(120px, 1fr))",
            gap: 16,
            marginTop: 24,
            textAlign: "center",
            wordBreak: "break-word",
          }}
        >
          <div style={{ background: "#f7f9f7", padding: 18, borderRadius: 14 }}>
            <strong>Nächste Dienste</strong>
            <p>Früh · Früh · Frei · Spät · Nacht</p>
          </div>

          <div style={{ background: "#fff8ea", padding: 18, borderRadius: 14 }}>
            <strong>Belastung</strong>
            <p>Erhöht nächste Woche</p>
          </div>

          <div style={{ background: "#f7f9f7", padding: 18, borderRadius: 14 }}>
            <strong>Qualifikation</strong>
            <p style={{ lineHeight: 1.5 }}>
              FaGe
              <br />
              Wund-
              <br />
              management
            </p>
          </div>
<div style={{ background: "#f7f9f7", padding: 18, borderRadius: 14 }}>
  <strong>Präferenzen</strong>

  <p>
    Wunschdienst:
    <br />
    Frühdienst
    <br />
    Keine Nachtfolge
  </p>
</div>
           <div style={{ background: "#f7f9f7", padding: 18, borderRadius: 14 }}>
            <strong>Abwesenheit</strong>
            <p>
              Ferien geplant:
              <br />
              14.07 – 20.07
            </p>
          </div>

          <div
            style={{
              background: "#f7f9f7",
              padding: 18,
              borderRadius: 14,
              gridColumn: "span 2",
            }}
          >
            <strong>Weiterbildung</strong>
            <p>
              Geplant:
              <br />
              Demenzmodul
              <br />
              Juli 2026
            </p>
          </div>
        </div>

        <p
          style={{
            marginTop: 24,
            color: "#66736b",
            fontSize: 13,
          }}
        >
          Nicht sichtbar: andere Mitarbeitende · Teamrisiken · Führungsindikatoren
        </p>
      </section>
    </>
  );
}

  return renderShell(renderActivePage());
}

type MetricCardProps = {
  value: number;
  label: string;
  color: string;
};

function MetricCard({ value, label, color }: MetricCardProps) {
  return (
    <div>
      <div
        style={{
          fontSize: 44,
          fontWeight: 800,
          color,
          marginBottom: 8,
        }}
      >
        {value}
      </div>
      <div style={{ color: "#4f5d55" }}>{label}</div>
    </div>
  );
}

type SummaryTileProps = {
  label: string;
  value: number;
  color: string;
};

function SummaryTile({ label, value, color }: SummaryTileProps) {
  return (

    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e1e8e2",
        borderRadius: 18,
        padding: "18px 14px",
        minHeight: 110,
        boxShadow: "0 4px 14px rgba(0,0,0,0.035)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
      }}
    >
      <div
        style={{
          color: "#66736b",
          fontSize: 13,
          lineHeight: 1.35,
          minHeight: 38,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ color, fontSize: 34, fontWeight: 900 }}>{value}</div>
    </div>
  );
}

type InfoCardProps = {
  title: string;
  children: React.ReactNode;
};

function InfoCard({ title, children }: InfoCardProps) {
  return (
    <section
      style={{
        background: "#ffffff",
        border: "1px solid #e1e8e2",
        borderRadius: 20,
        padding: 26,
        marginBottom: 24,
        boxShadow: "0 4px 14px rgba(0,0,0,0.035)",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: 18, fontSize: 22 }}>{title}</h2>
      {children}
    </section>
  );
}

type PageHeaderProps = {
  title: string;
  subtitle: string;
};

function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header style={{ marginBottom: 28 }}>
      <div
        style={{
          color: "#66736b",
          fontSize: 13,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 8,
        }}
      >
        CareFlow-Swiss
      </div>
      <h1 style={{ margin: 0, fontSize: 38 }}>{title}</h1>
      <p style={{ marginTop: 12, color: "#4f5d55", fontSize: 18 }}>{subtitle}</p>
    </header>
  );
}

export default App;
