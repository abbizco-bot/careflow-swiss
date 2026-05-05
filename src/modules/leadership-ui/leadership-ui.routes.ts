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
      margin-top: 4px;
    }

    .headline {
      background: #f0f4f1;
      border: 1px solid #d9e2db;
      border-radius: 14px;
      padding: 18px 20px;
      margin-bottom: 20px;
    }

    .headline-title {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b766e;
      margin-bottom: 6px;
    }

    .headline-main {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 4px;
    }

    .headline-sub {
      font-size: 14px;
      color: #4a574f;
    }

    .section-divider {
      margin-top: 28px;
      margin-bottom: 12px;
      font-size: 13px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #7a867f;
    }

    .day-row {
      display: grid;
      grid-template-columns: 180px 1fr 140px;
      gap: 20px;
      align-items: center;
      padding: 16px 0;
      border-bottom: 1px solid #edf1ed;
    }

    .date {
      font-weight: 600;
    }

    .statement {
      color: #415047;
    }

    .context {
      font-size: 13px;
      color: #6b766e;
      margin-top: 4px;
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
        <div class="panel-title">Personelle Lage – nächster Planungshorizont</div>
        <div class="range">Echte Daten · 28 Tage · read-only</div>
      </div>

      <div id="headline"></div>
      <div id="days-main"></div>

      <div class="section-divider">Weiterer Planungshorizont</div>
      <div id="days-rest"></div>

      <p class="note">
        Diese Oberfläche ist read-only. Sie zeigt die personelle Lage aus der bestehenden
        Rolling-Planning-API und verändert keine Planung.
      </p>
    </section>
  </main>

  <script>
    async function loadData() {
      const startDate = new Date().toISOString().slice(0, 10);
      const res = await fetch('/rolling-planning/window?startDate=' + startDate + '&windowDays=28');
      const data = await res.json();

      const headlineContainer = document.getElementById("headline");
      const mainContainer = document.getElementById("days-main");
      const restContainer = document.getElementById("days-rest");

      const today = data.days[0];
      const headlineStatus = today?.severity || "stable";

      let main = "Die Lage ist stabil.";
      let sub = "Keine unmittelbare Führungsintervention erforderlich.";

      if (headlineStatus === "attention" || headlineStatus === "warning") {
        main = "Die Lage ist angespannt.";
        sub = "Einzelne Schichten benötigen Aufmerksamkeit.";
      }

      if (headlineStatus === "critical") {
        main = "Die Lage ist kritisch.";
        sub = "Unterdeckung oder Qualifikationslücke erfordert Intervention.";
      }

      headlineContainer.innerHTML =
        '<div class="headline">' +
        '<div class="headline-title">Lage heute</div>' +
        '<div class="headline-main">' + main + '</div>' +
        '<div class="headline-sub">' + sub + '</div>' +
        '</div>';

      function renderRow(day, index) {
        const d = new Date(day.date);
        const formatted = d.toLocaleDateString("de-CH");

        let labelDate = formatted;
        if (index === 0) labelDate = "Heute · " + formatted;
        if (index === 1) labelDate = "Morgen · " + formatted;

        const status = day.severity || "stable";

        let cssClass = "status";
        let label = "stabil";
        let statement = "Die Lage ist stabil.";
        let context = "Referenzplan vorhanden · operative Lage lesbar";

        if (status === "attention" || status === "warning") {
          cssClass += " attention";
          label = "angespannt";
          statement = "Die Lage ist angespannt. Aufmerksamkeit erforderlich.";
          context = "Abweichungen sichtbar · einzelne Schichten betroffen";
        }

        if (status === "critical") {
          cssClass += " critical";
          label = "kritisch";
          statement = "Die Lage ist kritisch. Unterdeckung oder Qualifikationslücke sichtbar.";
          context = "Unterdeckung oder Qualifikationslücke · Führungsintervention erforderlich";
        }

        return (
          '<div class="day-row">' +
          '<div class="date">' + labelDate + '</div>' +
          '<div>' +
          '<div class="statement">' + statement + '</div>' +
          '<div class="context">' + context + '</div>' +
          '</div>' +
          '<div class="' + cssClass + '">' + label + '</div>' +
          '</div>'
        );
      }

      const mainDays = data.days.slice(0, 7);
      const restDays = data.days.slice(7);

      mainContainer.innerHTML = mainDays.map(function(day, index) {
        return renderRow(day, index);
      }).join("");

      restContainer.innerHTML = restDays.map(function(day, index) {
        return renderRow(day, index + 7);
      }).join("");
    }

    loadData();
  </script>
</body>
</html>
`);
});

export default router;