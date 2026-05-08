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

function dayBackground(daySeverity?: string) {
  if (daySeverity === "critical") return "#f3eaea";
  if (daySeverity === "attention") return "#f5f7f6";
  return "#ffffff";
}

// DEMO ONLY:
// This function overrides backend data to simulate leadership scenarios
// for pilot presentations. Not part of production logic.

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
      newDay.daySeverity = index === 3 ? "attention" : "stable";
    }

    if (scenario.key === "critical") {
      if (index === 0) {
        newDay.daySeverity = "critical";
      } else if (index === 2) {
        newDay.daySeverity = "attention";
      } else {
        newDay.daySeverity = "stable";
      }
    }

    return newDay;
  });
}

function App() {
  const [days, setDays] = useState<Day[]>([]);
  
  const [selectedScenarioKey, setSelectedScenarioKey] =
    useState<DemoScenarioKey>("stable");

  const selectedScenario = demoScenarios.find(
    (scenario) => scenario.key === selectedScenarioKey
  );

  const stableDays = days.filter(
    (day) => normalizeSeverity(day.daySeverity) === "stable"
  ).length;

  const attentionDays = days.filter(
    (day) => normalizeSeverity(day.daySeverity) === "attention"
  ).length;

  const criticalDays = days.filter(
    (day) => normalizeSeverity(day.daySeverity) === "critical"
  ).length;

  const today = days[0];

  const todaySeverity = selectedScenario?.severity ?? normalizeSeverity(today?.daySeverity);

  const todayStatusLabel =
    todaySeverity === "critical"
      ? "Kritische Lage"
      : todaySeverity === "attention"
        ? "Angespannte Lage"
        : "Stabile Lage";

  const startDate = days[0]?.date;
  const endDate = days[days.length - 1]?.date;

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
      
      // DEMO ONLY: apply visual scenario overlay
     
      const demoDays = applyDemoScenarioToDays(baseDays, selectedScenario);

      setDays(demoDays);
    }

    load();
  }, [selectedScenario]);
 
 return (
    <main
      style={{
        maxWidth: 980,
        margin: "48px auto",
        fontFamily: "Arial",
        color: "#1f2a24",
        padding: "0 24px",
      }}
    >
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: 40,
        }}
      >
        <img
          src={logo}
          alt="CareFlow-Swiss"
          style={{
            width: 64,
            height: 64,
            objectFit: "contain",
            marginBottom: 10,
          }}
        />

        <div
          style={{
            fontSize: 13,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#66736b",
            marginBottom: 6,
          }}
        >
          CareFlow-Swiss
        </div>

        <h1 style={{ fontSize: 30, margin: 0 }}>{copy.appTitle}</h1>
      </header>

      <section style={{ marginBottom: 28, textAlign: "center" }}>
        <p
          style={{
            maxWidth: 760,
            margin: "0 auto",
            lineHeight: 1.55,
            color: "#526158",
          }}
        >
          {copy.appSubtitle}
        </p>
      </section>

      <section
        style={{
          background: "#f7f9f7",
          border: "1px solid #e1e8e2",
          padding: 24,
          marginBottom: 28,
          borderRadius: 16,
          textAlign: "center",
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
          {copy.periodLabel}
        </div>

        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          {days.length > 0
            ? `${formattedStartDate} – ${formattedEndDate}`
            : "Lade Zeitraum..."}
        </div>

        <div style={{ lineHeight: 1.7, color: "#36443c" }}>
          <strong>
            {copy.periodIntro} {days.length || 28} Tagen:
          </strong>
          <br />
          {stableDays} {copy.stableDays}
          <br />
          {attentionDays} {copy.attentionDays}
          <br />
          {criticalDays} {copy.criticalDays}
        </div>
      </section>

<section
  style={{
    marginBottom: 28,
    display: "flex",
    justifyContent: "center",
    gap: 8,
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
          padding: "8px 14px",
          borderRadius: 999,
          border: isSelected ? "1px solid #617468" : "1px solid #d6ded8",
          background: isSelected ? "#eef3ef" : "#ffffff",
          color: "#2f3b34",
          fontSize: 13,
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
      marginBottom: 20,
      textAlign: "center",
      color: "#5f6f65",
      fontSize: 14,
    }}
  >
    <div style={{ fontWeight: 500, marginBottom: 4 }}>
      {selectedScenario.title}
    </div>
    <div>{selectedScenario.description}</div>
  </div>
)}
      <section
        style={{
          background: "#eef3ef",
          border: "1px solid #d8e2da",
          padding: 36,
          marginBottom: 42,
          borderRadius: 20,
          textAlign: "center",
          boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ fontSize: 14, marginBottom: 6, color: "#6b7a70" }}>
          {selectedScenario?.label}
        </div>

        <div style={{ fontSize: 32, fontWeight: 600, marginBottom: 12 }}>
          {todayStatusLabel}
        </div>

        <div
          style={{
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "#7a8880",
            marginBottom: 12,
          }}
        >
          {copy.today} ·{" "}
          {days[0] ? new Date(days[0].date).toLocaleDateString("de-CH") : ""}
        </div>

        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          {days[0]
            ? copy.todayFocus[normalizeSeverity(days[0].daySeverity)].title
            : "Lade Daten..."}
        </div>

        <div style={{ fontSize: 15, color: "#5f6f65", marginBottom: 8 }}>
          {days[0]
            ? copy.todayFocus[normalizeSeverity(days[0].daySeverity)].detail
            : ""}
        </div>

        <div style={{ fontSize: 13, color: "#6f7b72" }}>
          {days[0]?.hasReferencePlan
            ? copy.planningBaseAvailable
            : copy.planningBaseMissing}
        </div>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>{copy.nextDaysTitle}</h2>
        <p style={{ color: "#66736b", margin: 0 }}>
          {copy.nextDaysSubtitle}
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        {days.slice(0, 7).map((day, index) => (
          <div
            key={day.date}
            style={{
              background: dayBackground(day.daySeverity),
              padding: "18px 22px",
              marginBottom: 10,
              border: "1px solid #e2e8e2",
              borderRadius: 14,
              textAlign: "left",
            }}
          >
            <div
              style={{
                fontSize: 13,
                color: "#66736b",
                marginBottom: 6,
              }}
            >
              {index === 0
                ? copy.today
                : index === 1
                  ? copy.tomorrow
                  : copy.followingDay}{" "}
              · {new Date(day.date).toLocaleDateString("de-CH")}
            </div>

            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {copy.daySentence[normalizeSeverity(day.daySeverity)]}
            </div>

            <div style={{ fontSize: 13, color: "#66736b" }}>
              {day.hasReferencePlan
                ? copy.planningBaseAvailable
                : copy.planningBaseMissingShort}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;