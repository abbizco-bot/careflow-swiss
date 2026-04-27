import { useState } from "react";
import { LeadershipDayView } from "./components/LeadershipDayView";
import { ScenarioSwitcher } from "./components/ScenarioSwitcher";
import { demoScenarios } from "./demoScenarios";

export function App() {
  const [activeScenarioId, setActiveScenarioId] = useState(demoScenarios[0].id);
  const activeScenario =
    demoScenarios.find((scenario) => scenario.id === activeScenarioId) ??
    demoScenarios[0];

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Lokale MVP-Demo</p>
        <h1>CareFlow MVP Demo</h1>
        <p className="subtitle">
          Fuehrungs- und Decision-Layer fuer operative Personallage
        </p>
      </header>

      <section className="layout">
        <ScenarioSwitcher
          activeScenarioId={activeScenario.id}
          scenarios={demoScenarios}
          onSelect={setActiveScenarioId}
        />

        <LeadershipDayView scenario={activeScenario} />
      </section>
    </main>
  );
}
