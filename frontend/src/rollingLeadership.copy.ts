export type Language = "de";

export type Severity = "stable" | "attention" | "critical";

export const currentLanguage: Language = "de";

export const rollingLeadershipCopy = {
  de: {
    appTitle: "Rolling Leadership View",
    appSubtitle:
      "Eine ruhige Führungsansicht für die nächsten 28 Tage. CareFlow zeigt keine Dienstplanung, sondern macht operative Lage und Führungsaufmerksamkeit sichtbar.",

    periodLabel: "Zeitraum",
    periodIntro: "In den nächsten",

    stableDays: "Tage stabil",
    attentionDays: "Tage mit erhöhter Aufmerksamkeit",
    criticalDays: "Tage mit kritischer Lage",

    today: "Heute",
    tomorrow: "Morgen",
    followingDay: "Folgetag",

    nextDaysTitle: "Nächste Tage",
    nextDaysSubtitle: "Übersicht der kurzfristigen Führungslage.",

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
        detail: "Einzelne Dienste sollten geprüft werden.",
      },
      critical: {
        title: "Heutige Lage: kritisch",
        detail: "Führungsentscheid erforderlich.",
      },
    },

    daySentence: {
      stable: "Stabiler Betrieb erwartet",
      attention: "Einzelne Dienste benötigen Aufmerksamkeit",
      critical: "Kritische Unterdeckung erkennbar",
    },
  },
};