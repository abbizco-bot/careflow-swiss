import type { DemoScenario } from "../demoScenarios";

type ScenarioSwitcherProps = {
  activeScenarioId: string;
  scenarios: DemoScenario[];
  onSelect: (scenarioId: string) => void;
};

export function ScenarioSwitcher({
  activeScenarioId,
  scenarios,
  onSelect,
}: ScenarioSwitcherProps) {
  return (
    <aside className="scenario-panel" aria-label="Demo-Szenarien">
      <div>
        <p className="panel-kicker">Szenarien</p>
        <h2>Demo-Fokus</h2>
      </div>

      <div className="scenario-list">
        {scenarios.map((scenario) => {
          const isActive = scenario.id === activeScenarioId;

          return (
            <button
              className={isActive ? "scenario-button active" : "scenario-button"}
              key={scenario.id}
              onClick={() => onSelect(scenario.id)}
              type="button"
            >
              <span>{scenario.label}</span>
              <small>{scenario.date}</small>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
