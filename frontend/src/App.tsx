import { useEffect, useState } from "react";
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

function normalizeSeverity(daySeverity?: string): Severity {
  if (daySeverity === "critical") return "critical";
  if (daySeverity === "attention") return "attention";
  return "stable";
}

function severityColor(severity: Severity) {
  if (severity === "critical") return "#d92d20";
  if (severity === "attention") return "#d9a404";
  return "#1f8f4e";
}

function applyDemoScenarioToDays(
  days: Day[],
  scenario?: DemoScenario
): Day[] {
  if (!scenario) return days;

  return days.map((day, index) => {
    const newDay = { ...day };

    if (scenario.key === "stable") {
      newDay.daySeverity = "stable";
    }

    if (scenario.key === "mixed") {
      if (index >= 4 && index <= 8) {
        newDay.daySeverity = "attention";
      } else {
        newDay.daySeverity = "stable";
      }
    }

    if (scenario.key === "critical") {
      if (index === 9) {
        newDay.daySeverity = "critical";
      } else if (index >= 4 && index <= 8) {
        newDay.daySeverity = "attention";
      } else {
        newDay.daySeverity = "stable";
      }
    }

    return newDay;
  });
}

function createFallbackDemoDays(scenario?: DemoScenario): Day[] {
  const startDate = scenario?.date ?? "2026-06-10";

  const baseDays = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + index);

    return {
      date: date.toISOString().slice(0, 10),
      daySeverity: "stable",
      hasReferencePlan: true,
    };
  });

  return applyDemoScenarioToDays(baseDays, scenario);
}

function App() {
  const [days, setDays] = useState<Day[]>([]);

  const [selectedScenarioKey, setSelectedScenarioKey] =
    useState<DemoScenarioKey>("stable");

  const selectedScenario = demoScenarios.find(
    (scenario) => scenario.key === selectedScenarioKey
  );

  const visibleDays =
    days.length > 0 ? days : createFallbackDemoDays(selectedScenario);

  const stableDays = visibleDays.filter(
    (day) => normalizeSeverity(day.daySeverity) === "stable"
  ).length;

  const attentionDays = visibleDays.filter(
    (day) => normalizeSeverity(day.daySeverity) === "attention"
  ).length;

  const criticalDays = visibleDays.filter(
    (day) => normalizeSeverity(day.daySeverity) === "critical"
  ).length;

  const today = visibleDays[0];

  const todaySeverity =
    selectedScenario?.severity ?? normalizeSeverity(today?.daySeverity);

  const todayStatusLabel =
    todaySeverity === "critical"
      ? "Kritische Lage"
      : todaySeverity === "attention"
        ? "Angespannte Lage"
        : "Stabile Lage";

  const startDate = visibleDays[0]?.date;
  const endDate = visibleDays[visibleDays.length - 1]?.date;

  const formattedStartDate = startDate
    ? new Date(startDate).toLocaleDateString("de-CH")
    : "";

  const formattedEndDate = endDate
    ? new Date(endDate).toLocaleDateString("de-CH")
    : "";

  useEffect(() => {
    async function load() {
      const startDate =
        selectedScenario?.date ?? new Date().toISOString().slice(0, 10);

      const res = await fetch(
        "http://localhost:3001/rolling-planning/window?startDate=" +
          startDate +
          "&windowDays=28"
      );

      const data = await res.json();
      const baseDays = data.days || [];

      const demoDays = applyDemoScenarioToDays(baseDays, selectedScenario);

      setDays(demoDays);
    }

    load();
  }, [selectedScenario]);

  return (
    <main
      style={{
        maxWidth: 1280,
        margin: "72px auto",
        fontFamily: "Arial",
        color: "#1f2a24",
        padding: "0 32px",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        <img
          src={logo}
          alt="CareFlow-Swiss"
          style={{
            width: 70,
            height: 70,
            objectFit: "contain",
            marginBottom: 12,
          }}
        />

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

        <h1 style={{ fontSize: 42, margin: 0, fontWeight: 600 }}>
          {copy.appTitle}
        </h1>

        <p
          style={{
            maxWidth: 920,
            marginTop: 26,
            lineHeight: 1.8,
            color: "#4f5d55",
            fontSize: 18,
          }}
        >
          {copy.appSubtitle}
        </p>
      </header>

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

        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            marginBottom: 28,
          }}
        >
          {formattedStartDate} – {formattedEndDate}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 28,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: "#1f8f4e",
              }}
            >
              {stableDays}
            </div>

            <div style={{ color: "#4f5d55" }}>
              Tage mit stabiler Lage
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: "#d9a404",
              }}
            >
              {attentionDays}
            </div>

            <div style={{ color: "#4f5d55" }}>
              Tage mit erhöhter Aufmerksamkeit
            </div>
          </div>

          <div>
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: "#d92d20",
              }}
            >
              {criticalDays}
            </div>

            <div style={{ color: "#4f5d55" }}>
              Kritische Tage
            </div>
          </div>
        </div>
      </section>

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
              onClick={() => setSelectedScenarioKey(scenario.key)}
              style={{
                padding: "14px 22px",
                borderRadius: 999,
                border: isSelected
                  ? "1px solid #617468"
                  : "1px solid #d6ded8",
                background: isSelected ? "#eef3ef" : "#ffffff",
                color: "#2f3b34",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {scenario.label}
            </button>
          );
        })}
      </section>

      {selectedScenario && (
        <div
          style={{
            marginBottom: 30,
            textAlign: "center",
            color: "#5f6f65",
            fontSize: 16,
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 8 }}>
            {selectedScenario.title}
          </div>

          <div>{selectedScenario.description}</div>
        </div>
      )}

      <section
        style={{
          background: "#eef3ef",
          border: "1px solid #d8e2da",
          padding: 56,
          marginBottom: 42,
          borderRadius: 24,
          textAlign: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontSize: 16, marginBottom: 10, color: "#6b7a70" }}>
          {selectedScenario?.label}
        </div>

        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            marginBottom: 14,
          }}
        >
          {todayStatusLabel}
        </div>

        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#7a8880",
            marginBottom: 16,
          }}
        >
          {copy.today} · {new Date(today.date).toLocaleDateString("de-CH")}
        </div>

        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          {copy.todayFocus[normalizeSeverity(today.daySeverity)].title}
        </div>

        <div
          style={{
            fontSize: 18,
            color: "#5f6f65",
            marginBottom: 12,
          }}
        >
          {copy.todayFocus[normalizeSeverity(today.daySeverity)].detail}
        </div>

        <div style={{ fontSize: 14, color: "#6f7b72" }}>
          {today.hasReferencePlan
            ? copy.planningBaseAvailable
            : copy.planningBaseMissing}
        </div>
      </section>

      <section
        style={{
          background: "#f8faf8",
          border: "1px solid #e1e8e2",
          borderRadius: 20,
          padding: 40,
          marginBottom: 60,
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 30,
            textAlign: "center",
          }}
        >
          Rollierende 28-Tage-Sicht
        </div>

        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "center",
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          {visibleDays.map((day) => {
            const severity = normalizeSeverity(day.daySeverity);

            return (
              <div
                key={day.date}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 28,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 999,
                    background: severityColor(severity),
                    marginBottom: 10,
                  }}
                />

                <div
                  style={{
                    fontSize: 10,
                    color: "#66736b",
                    writingMode: "vertical-rl",
                    transform: "rotate(180deg)",
                  }}
                >
                  {new Date(day.date).toLocaleDateString("de-CH", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 30,
            flexWrap: "wrap",
            color: "#4f5d55",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#1f8f4e",
              }}
            />

            <span>Stabile Lage</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#d9a404",
              }}
            />

            <span>Erhöhte Aufmerksamkeit</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 999,
                background: "#d92d20",
              }}
            />

            <span>Kritische Lage</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;