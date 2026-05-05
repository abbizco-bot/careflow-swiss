import { useEffect, useState } from "react";
import logo from "./assets/careflow-signet.png";

type Day = {
  date: string;
  daySeverity?: string;
  hasReferencePlan?: boolean;
  dataStatus?: string;
};

function leadershipSentence(daySeverity?: string) {
  if (daySeverity === "critical") return "Kritische Unterdeckung erkennbar";
  if (daySeverity === "attention")
    return "Einzelne Dienste benötigen Aufmerksamkeit";
  return "Stabiler Betrieb erwartet";
}

function todayFocusSentence(daySeverity?: string) {
  if (daySeverity === "critical") return "Heutige Lage: kritisch";
  if (daySeverity === "attention") return "Heutige Lage: angespannt";
  return "Heutige Lage: stabil";
}

function todayFocusDetail(daySeverity?: string) {
  if (daySeverity === "critical") return "Führungsentscheid erforderlich.";
  if (daySeverity === "attention") return "Einzelne Dienste sollten geprüft werden.";
  return "Aktuell besteht kein unmittelbarer Führungsbedarf.";
}
function dayBackground(daySeverity?: string) {
  if (daySeverity === "critical") return "#f3eaea";
  if (daySeverity === "attention") return "#f5f7f6";
  return "#ffffff";
}

function App() {
  const [days, setDays] = useState<Day[]>([]);

  const stableDays = days.filter(
    (day) => !day.daySeverity || day.daySeverity === "stable"
  ).length;

  const attentionDays = days.filter(
    (day) => day.daySeverity === "attention"
  ).length;

  const criticalDays = days.filter(
    (day) => day.daySeverity === "critical"
  ).length;

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
      const today = new Date().toISOString().slice(0, 10);

      const res = await fetch(
        "http://localhost:3001/rolling-planning/window?startDate=" +
          today +
          "&windowDays=28"
      );

      const data = await res.json();
      setDays(data.days || []);
    }

    load();
  }, []);

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

        <h1 style={{ fontSize: 30, margin: 0 }}>Rolling Leadership View</h1>
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
          Eine ruhige Führungsansicht für die nächsten 28 Tage. CareFlow zeigt
          keine Dienstplanung, sondern macht operative Lage und
          Führungsaufmerksamkeit sichtbar.
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
          Zeitraum
        </div>

        <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
          {days.length > 0
            ? `${formattedStartDate} – ${formattedEndDate}`
            : "Lade Zeitraum..."}
        </div>

        <div style={{ lineHeight: 1.7, color: "#36443c" }}>
          <strong>In den nächsten {days.length || 28} Tagen:</strong>
          <br />
          {stableDays} Tage stabil
          <br />
          {attentionDays} Tage mit erhöhter Aufmerksamkeit
          <br />
          {criticalDays} Tage mit kritischer Lage
        </div>
      </section>

      <section
        style={{
          background: "#f3f6f4",
          border: "1px solid #e1e8e2",
          padding: 28,
          marginBottom: 36,
          borderRadius: 18,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 12,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#66736b",
            marginBottom: 10,
          }}
        >
          Heute ·{" "}
          {days[0] ? new Date(days[0].date).toLocaleDateString("de-CH") : ""}
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          {days[0] ? todayFocusSentence(days[0].daySeverity) : "Lade Daten..."}
        </div>

        <div style={{ fontSize: 15, color: "#5f6f65", marginBottom: 8 }}>
          {days[0] ? todayFocusDetail(days[0].daySeverity) : ""}
        </div>

        <div style={{ fontSize: 13, color: "#6f7b72" }}>
          {days[0]?.hasReferencePlan
            ? "Planungsgrundlage vorhanden"
            : "Keine Planungsgrundlage hinterlegt"}
        </div>
      </section>

      <section style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 20, marginBottom: 6 }}>
          Nächste Tage
        </h2>
        <p style={{ color: "#66736b", margin: 0 }}>
          Übersicht der kurzfristigen Führungslage.
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
              {index === 0 ? "Heute" : index === 1 ? "Morgen" : "Folgetag"} ·{" "}
              {new Date(day.date).toLocaleDateString("de-CH")}
            </div>

            <div
              style={{
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              {leadershipSentence(day.daySeverity)}
            </div>

            <div style={{ fontSize: 13, color: "#66736b" }}>
              {day.hasReferencePlan
                ? "Planungsgrundlage vorhanden"
                : "Ohne Planungsgrundlage"}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default App;