import type { LeadershipDayShift } from "../api";
import { translatePrimaryCause, translateSeverity } from "../translations";

type ShiftCardProps = {
  shift: LeadershipDayShift;
};

export function ShiftCard({ shift }: ShiftCardProps) {
  return (
    <article className={`shift-card severity-${shift.gap.severity}`}>
      <header className="shift-card-header">
        <div>
          <p className="panel-kicker">{shift.type}</p>
          <h3>{shift.label}</h3>
        </div>
        <span className="status-pill">{translateSeverity(shift.gap.severity)}</span>
      </header>

      <dl className="metric-grid">
        <div>
          <dt>Geplant</dt>
          <dd>{shift.plannedCount}</dd>
        </div>
        <div>
          <dt>Wirksam</dt>
          <dd>{shift.actualCount}</dd>
        </div>
        <div>
          <dt>Coverage Gap</dt>
          <dd>{shift.gap.effectiveCoverageGap}</dd>
        </div>
        <div>
          <dt>Qualification Gap</dt>
          <dd>{shift.gap.effectiveQualificationGap}</dd>
        </div>
      </dl>

      <div className="cause-block">
        <span>Ursache</span>
        <strong>{translatePrimaryCause(shift.gap.primaryCause)}</strong>
      </div>

      <div className="qualification-line">
        Qualifikation: <strong>{shift.qualification.status}</strong>
      </div>

      {shift.gap.signals.length > 0 && (
        <div className="technical-codes">
          <span>Technische Signale</span>
          <ul>
            {shift.gap.signals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
