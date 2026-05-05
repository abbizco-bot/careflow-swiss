import { Router } from "express";

const router = Router();

router.get("/leadership", (_req, res) => {
  res.type("html").send(`
<!doctype html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>CareFlow-Swiss – Rolling Leadership View</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, Helvetica, sans-serif;
      background: #f6f7f5;
      color: #1f2a24;
    }

    main {
      max-width: 1120px;
      margin: 48px auto;
      padding: 0 32px;
    }

    .brand {
      font-size: 14px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #5d6b61;
      margin-bottom: 24px;
    }

    h1 {
      font-size: 34px;
      font-weight: 500;
      margin: 0 0 12px 0;
    }

    .lead {
      max-width: 760px;
      font-size: 18px;
      line-height: 1.55;
      color: #47544c;
      margin-bottom: 36px;
    }

    .panel {
      background: #ffffff;
      border: 1px solid #dfe5df;
      border-radius: 18px;
      padding: 28px;
      box-shadow: 0 18px 45px rgba(31, 42, 36, 0.06);
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      gap: 24px;
      border-bottom: 1px solid #e7ece7;
      padding-bottom: 18px;
      margin-bottom: 18px;
    }

    .panel-title {
      font-size: 21px;
      font-weight: 600;
    }

    .range {
      font-size: 15px;
      color: #637067;
    }

    .day-row {
      display: grid;
      grid-template-columns: 140px 1fr 160px;
      gap: 20px;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #edf1ed;
    }

    .day-row:last-child {
      border-bottom: none;
    }

    .date {
      font-weight: 600;
    }

    .statement {
      color: #415047;
    }

    .status {
      justify-self: end;
      border-radius: 999px;
      padding: 7px 13px;
      font-size: 14px;
      border: 1px solid #d6ded7;
      background: #f7faf7;
    }

    .status.attention {
      background: #fff8e6;
      border-color: #ead79a;
    }

    .status.critical {
      background: #fff0ee;
      border-color: #e2aaa2;
    }

    .note {
      margin-top: 22px;
      font-size: 14px;
      color: #6b766e;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <main>
    <div class="brand">CareFlow-Swiss</div>
    <h1>Rolling Leadership View</h1>
    <p class="lead">
      Eine ruhige Führungsansicht für die nächsten 28 Tage. CareFlow zeigt keine Dienstplanung,
      sondern macht operative Lage, Abweichungen und Führungsaufmerksamkeit sichtbar.
    </p>

    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">Personelle Lage – nächster Planungshorizont</div>
          <div class="range">Echte Daten · 28 Tage · read-only</div>
        </div>
      </div>

      <div id="days"></div>

      <p class="note">
        Diese Oberfläche ist read-only. Sie zeigt die personelle Lage aus der bestehenden
        Rolling-Planning-API und verändert keine Planung.
      </p>
    </section>
  </main>

  <script>
    async function loadData() {
      const today = new Date().toISOString().slice(0, 10);
      const res = await fetch('/rolling-planning/window?startDate=' + today + '&windowDays=28');
      const data = await res.json();

      const container = document.getElementById("days");

      container.innerHTML = data.days.map(function(day) {
        const status = day.severity || "stable";

        let cssClass = "status";
        let label = "stabil";
        let statement = "Die Lage ist stabil.";

        if (status === "attention" || status === "warning") {
          cssClass += " attention";
          label = "angespannt";
          statement = "Die Lage ist angespannt. Aufmerksamkeit erforderlich.";
        }

        if (status === "critical") {
          cssClass += " critical";
          label = "kritisch";
          statement = "Die Lage ist kritisch. Unterdeckung oder Qualifikationslücke sichtbar.";
        }

        return ''
          + '<div class="day-row">'
          + '<div class="date">' + day.date + '</div>'
          + '<div class="statement">' + statement + '</div>'
          + '<div class="' + cssClass + '">' + label + '</div>'
          + '</div>';
      }).join("");
    }

    loadData();
  </script>
</body>
</html>
`);
});

export default router;