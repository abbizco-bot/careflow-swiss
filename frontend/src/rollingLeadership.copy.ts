export type Language = "de";

export type Severity = "stable" | "attention" | "critical";

export const currentLanguage: Language = "de";

export const rollingLeadershipCopy = {
  de: {
    appTitle: "Rollierende Führungslage",
appSubtitle:
  "Die nächsten 28 Tage werden als Führungshorizont dargestellt. CareFlow zeigt, welche Tage stabil sind, wo erhöhte Aufmerksamkeit nötig ist und wo Führungshandeln erforderlich wird.",

    periodLabel: "Rolling View",
    periodIntro: "In den nächsten",

    stableDays: "Tage mit stabiler Lage",
    attentionDays: "Tage mit erhöhter Aufmerksamkeit",
    criticalDays: "Tage mit kritischer Lage",

    today: "Heute",
    tomorrow: "Morgen",
    followingDay: "Folgetag",

    nextDaysTitle: "Nächste Tage",
    nextDaysSubtitle:
      "Eine verdichtete Übersicht der kurzfristigen Führungslage auf Basis bestehender Planungs- und Personaldaten.",

    planningBaseAvailable: "Planungsgrundlage vorhanden",
    planningBaseMissing: "Keine Planungsgrundlage hinterlegt",
    planningBaseMissingShort: "Ohne Planungsgrundlage",

    todayFocus: {
      stable: {
        title: "Heutige Lage: stabil",
        detail: "Aktuell besteht kein unmittelbarer Führungsbedarf.",
      },
      attention: {
        title: "Heutige Lage: angespannt",
        detail: "Einzelne Dienste sollten fachlich geprüft werden.",
      },
      critical: {
        title: "Heutige Lage: kritisch",
        detail: "Führungsentscheidung erforderlich.",
      },
    },

    daySentence: {
      stable: "Stabiler Betrieb erwartet",
      attention: "Einzelne Dienste benötigen Aufmerksamkeit",
      critical: "Kritische Unterdeckung erkennbar",
    },
  },
};