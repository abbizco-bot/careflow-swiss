import { useEffect, useState } from "react";
import { fetchLeadershipDay, type LeadershipDayResponse } from "../api";
import type { DemoScenario } from "../demoScenarios";
import { describeSeverity, translateSeverity } from "../translations";
import { ShiftCard } from "./ShiftCard";

type LeadershipDayViewProps = {
  scenario: DemoScenario;
};

type LoadState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: LeadershipDayResponse };

function getDaySeverity(data: LeadershipDayResponse) {
  if (data.day.shifts.some((shift) => shift.gap.severity === "critical")) {
    return "critical";
  }

  if (data.day.shifts.some((shift) => shift.gap.severity === "attention")) {
    return "attention";
  }

  return "none";
}

export function LeadershipDayView({ scenario }: LeadershipDayViewProps) {
  const [loadState, setLoadState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    let isCancelled = false;

    setLoadState({ status: "loading" });

    fetchLeadershipDay(scenario.date)
      .then((data) => {
        if (!isCancelled) {
          setLoadState({ status: "success", data });
        }
      })
      .catch((error: unknown) => {
        if (!isCancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Leadership Day konnte nicht geladen werden.";
          setLoadState({ status: "error", message });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [scenario.date]);

  return (
    <section className="content-panel">
      <div className="scenario-summary">
        <p className="panel-kicker">{scenario.date}</p>
        <h2>{scenario.label}</h2>
        <p>{scenario.description}</p>
      </div>

      {loadState.status === "loading" && (
        <div className="state-card">Tageslage wird geladen...</div>
      )}

      {loadState.status === "error" && (
        <div className="state-card error">{loadState.message}</div>
      )}

      {loadState.status === "success" && (
        <LeadershipDaySuccess data={loadState.data} />
      )}
    </section>
  );
}

function LeadershipDaySuccess({ data }: { data: LeadershipDayResponse }) {
  const daySeverity = getDaySeverity(data);

  return (
    <>
      <section className={`headline-card severity-${daySeverity}`}>
        <div>
          <p className="panel-kicker">Tageslage</p>
          <h2>{data.day.headline.title}</h2>
          {data.day.headline.detail && <p>{data.day.headline.detail}</p>}
          {data.day.headline.contextLine && (
            <p className="context-line">{data.day.headline.contextLine}</p>
          )}
        </div>

        <div className="severity-badge">
          <span>{translateSeverity(daySeverity)}</span>
          <small>{describeSeverity(daySeverity)}</small>
        </div>
      </section>

      <section className="shift-grid" aria-label="Schichten">
        {data.day.shifts.map((shift) => (
          <ShiftCard key={`${data.date}-${shift.type}`} shift={shift} />
        ))}
      </section>
    </>
  );
}
