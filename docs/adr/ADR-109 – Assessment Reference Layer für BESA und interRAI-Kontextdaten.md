# ADR-109 – Assessment Reference Layer für BESA/interRAI-Kontextdaten

**Status:** Vorgeschlagen
**Datum:** 08.06.2026
**Projekt:** CareFlow-Swiss
**Bereich:** Architektur, Pflegekomplexität, Integrationen, Führungslage, Qualitätskontext
**Entscheidungstyp:** Fachlich-technische Architekturentscheidung
**Bezug:** MVP, Pilotphase, spätere Integrationsarchitektur

---

## 1. Kontext

CareFlow-Swiss versteht sich nicht als Pflegedokumentationssystem, nicht als Dienstplanersatz und nicht als Pflegebedarfserfassungs- oder Abrechnungssystem. Der fachliche Kern von CareFlow liegt in der Verdichtung operativer Führungslagen: Dienstlage, Abweichungen, Qualifikationslage, Personaldruck, Interventionen, rollierende Planung, Wohnbereichslage, QM-Kontext und Führungsentscheidungen.

In der stationären Langzeitpflege existieren etablierte Systeme zur Pflegebedarfserfassung und Assessmentlogik, insbesondere **BESA** und **interRAI LTCF**. Diese Systeme erfassen Pflegebedarf, Pflegeintensität, Bewohnerstruktur, Ressourcen, Risiken und teilweise Qualitätsindikatoren. Sie sind für CareFlow fachlich relevant, weil Personalunterdeckung, Qualifikationslücken oder Interventionsbedarf nicht isoliert beurteilt werden können. Eine Unterdeckung in einem Wohnbereich mit hoher Pflegekomplexität ist führungsrelevanter als dieselbe Unterdeckung in einem stabileren Wohnbereich.

Gleichzeitig unterscheiden sich BESA/interRAI grundlegend von der CareFlow-Zeitlogik. CareFlow arbeitet tages- und wochenaktuell. BESA/interRAI-Daten sind dagegen periodische oder anlassbezogene Assessmentdaten. Sie bilden nicht die operative Tageslage ab, sondern einen mittelfristigen Pflegekomplexitäts- und Belastungskontext.

Daraus ergibt sich die Notwendigkeit, BESA/interRAI fachlich zu berücksichtigen, ohne CareFlow in Richtung eines Assessment-, Pflegecontrolling- oder Abrechnungssystems zu verschieben.

---

## 2. Problem

Ohne Berücksichtigung von Pflegekomplexität besteht das Risiko, dass CareFlow eine Unterdeckung primär quantitativ interpretiert: Anzahl fehlender Mitarbeitender, Anzahl offener Dienste, Qualifikationslücken oder Abweichungen vom Plan.

Das reicht für eine echte Führungslage jedoch nicht aus.

Ein Wohnbereich mit hoher Pflegeintensität, mehreren komplexen Pflegesituationen, erhöhter Demenzbelastung, Palliative-Care-Situationen oder erhöhtem Sturzrisiko hat eine andere Belastungsrealität als ein Wohnbereich mit stabiler Bewohnerstruktur. Dieselbe personelle Abweichung kann daher unterschiedlich kritisch sein.

Das Problem lautet:

**Wie kann CareFlow Pflegebedarfs- und Assessmentinformationen aus Systemen wie BESA oder interRAI berücksichtigen, ohne selbst ein Assessment-, Abrechnungs- oder Pflegedokumentationssystem zu werden?**

Zusätzlich bestehen technische und organisatorische Herausforderungen:

* BESA/interRAI-Daten sind nicht zwingend tagesaktuell.
* Die Periodizität der Assessments unterscheidet sich von der operativen CareFlow-Logik.
* Daten können in unterschiedlichen Primärsystemen liegen: Pflegedokumentation, Heimadministration, BESA/interRAI-System, Exportdateien oder Schnittstellen.
* Bewohnerbezogene Detaildaten sind datenschutzsensibel.
* Für den MVP wäre eine echte Integration fachlich und technisch zu schwergewichtig.
* CareFlow darf keine falsche fachliche Autorität über Pflegeeinstufungen oder Assessmentbewertungen beanspruchen.

---

## 3. Entscheidung

CareFlow führt einen **Assessment Reference Layer** als vorbereitete Architektur- und Datenlogik ein.

Dieser Layer dient dazu, Pflegebedarfs-, Assessment- und Pflegekomplexitätsinformationen aus bestehenden Systemen wie BESA, interRAI LTCF, Pflegedokumentation oder Heimverwaltungssoftware aufzunehmen, zu datieren, zu aggregieren und als Kontext für die Führungslage bereitzustellen.

CareFlow übernimmt dabei keine eigene Pflegebedarfserfassung und berechnet keine eigenen BESA-/interRAI-Einstufungen.

Die Entscheidung lautet:

**CareFlow verwendet BESA/interRAI-Daten ausschließlich als aggregierte Kontextdaten für Führungslage, Belastungseinschätzung, Qualifikationsplausibilisierung, Interventionspriorisierung und QM-Kontextualisierung.**

Für den MVP wird keine echte BESA-/interRAI-Schnittstelle umgesetzt. Stattdessen wird die Pflegekomplexität in der Demo und im frühen MVP als einfacher, statischer oder manuell gepflegter Kontextindikator auf Wohnbereichsebene sichtbar gemacht.

Eine technische Integration erfolgt erst in späteren Phasen, beginnend mit CSV-/Excel-Importen aggregierter Wohnbereichsdaten. API- oder systemnahe Schnittstellen werden erst für Pilot- oder Produktphasen vorgesehen.

---

## 4. Geltungsbereich

Diese ADR gilt für alle zukünftigen CareFlow-Funktionen, die Pflegebedarf, Pflegekomplexität, Bewohnerstruktur, Assessmentdaten oder Qualitätskontext aus bestehenden Pflegebedarfssystemen berücksichtigen.

Sie betrifft insbesondere:

* Wohnbereichslage
* rollierende Führungssicht
* Tages- und Wochenlage
* Abweichungsbewertung
* Interventionspriorisierung
* Qualifikationslogik
* QM-Lagebild
* Lageberichte
* spätere Statistik-, KI- und RAG-gestützte Auswertungen
* spätere Schnittstellen zu Pflegedokumentations- oder Heimadministrationssystemen

---

## 5. Architekturprinzip

Der Assessment Reference Layer wird nicht als operatives Primärsystem verstanden, sondern als **kontextuelle Referenzschicht**.

Die Grundstruktur lautet:

```text
BESA / interRAI / Pflegedokumentation / Heimadministration
        ↓
Assessment Reference Layer
        ↓
CareFlow-Führungslage
```

CareFlow verarbeitet aus dieser Schicht nicht die vollständige Bewohnerdokumentation, sondern bevorzugt aggregierte Informationen auf Wohnbereichsebene.

Beispielhafte Aggregation:

```text
Wohnbereich A
Pflegekomplexität: hoch
Assessment-System: interRAI
Letzte Aktualisierung: 01.06.2026
Aktualität: aktuell
Verwendung: Führungskontext
```

Nicht vorgesehen ist im MVP:

```text
Bewohner X
Diagnose
Assessment-Items
BESA-Punktzahl
interRAI-Einzelmerkmale
abrechnungsrelevante Einstufung
```

---

## 6. Datenmodell auf konzeptioneller Ebene

Für den Assessment Reference Layer werden perspektivisch folgende Felder vorgesehen:

```text
facility_id
unit_id
unit_name
assessment_system
assessment_date
last_imported_at
valid_until
care_complexity_level
care_complexity_score_optional
aggregation_level
source_system
data_status
complexity_reason_codes_optional
notes_optional
```

### Minimales MVP-/Demo-Modell

Für den MVP genügt folgendes reduzierte Modell:

```text
unit_id
unit_name
care_complexity_level
assessment_source_label
assessment_date
assessment_status
```

Beispiel:

```text
unit_id: WBA
unit_name: Wohnbereich A
care_complexity_level: erhöht
assessment_source_label: bestehendes Pflegebedarfssystem
assessment_date: 01.06.2026
assessment_status: aktuell
```

---

## 7. Periodizitätslogik

CareFlow unterscheidet ausdrücklich zwischen operativen Echtzeit- oder Tagesdaten und periodischen Assessmentdaten.

### Operative CareFlow-Daten

Diese Daten sind tagesaktuell oder laufend relevant:

* Krankmeldungen
* Dienstplanänderungen
* offene Dienste
* Qualifikationslücken
* Schichtbesetzung
* Interventionen
* Eskalationen
* kurzfristige Abweichungen

### Assessment-Kontextdaten

Diese Daten sind periodisch, mittelfristig oder anlassbezogen relevant:

* Pflegekomplexität
* Pflegebedarf
* Bewohnerstruktur
* Assessment-System
* letzte Erfassung
* Gültigkeit
* aggregierte Risikokontexte
* Pflegeintensität pro Wohnbereich

CareFlow interpretiert Assessmentdaten nie als tagesaktuelle operative Lage. Jeder importierte oder gesetzte Assessment-Kontext muss mit einem Aktualitätsdatum versehen sein.

---

## 8. Aktualitätsstatus

CareFlow führt für Assessment-Kontextdaten einen einfachen Aktualitätsstatus ein:

```text
aktuell
alternd
prüfbedürftig
unbekannt
```

### Aktuell

Die Assessmentdaten sind für die Führungslage ausreichend aktuell.

### Alternd

Die Assessmentdaten sind noch verwendbar, sollten aber bei nächster Gelegenheit überprüft werden.

### Prüfbedürftig

Die Assessmentdaten könnten fachlich überholt sein, etwa nach relevanten Ereignissen.

### Unbekannt

Es liegt kein belastbares Datum oder keine eindeutige Quelle vor.

---

## 9. Anlassbezogene Prüfung

CareFlow soll perspektivisch erkennen können, wenn ein Assessment-Kontext möglicherweise nicht mehr belastbar ist.

Auslösende Ereignisse können sein:

* Neueintritt
* Austritt
* Rückkehr aus Spital oder Rehabilitation
* deutliche Verschlechterung des Allgemeinzustands
* Palliative-Care-Situation
* erheblicher Mobilitätsverlust
* Sturzereignis mit Folgen
* auffällige Zunahme von Verhaltenssymptomen
* deutliche Veränderung der Bewohnerstruktur
* gehäufte Krisenereignisse im Wohnbereich

CareFlow nimmt in solchen Fällen keine neue Einstufung vor, sondern erzeugt nur einen Hinweis:

```text
Assessment-Kontext möglicherweise prüfbedürftig.
Pflegefachliche Aktualisierung im führenden System prüfen.
```

---

## 10. Integrationsstrategie

Die Integration erfolgt gestuft.

### Stufe 1 – Demo-Kontext

Für die aktuelle Demo wird Pflegekomplexität statisch modelliert.

Beispiel:

```text
Wohnbereich A: Pflegekomplexität erhöht
Wohnbereich B: Pflegekomplexität normal
```

Ziel ist nicht die technische Integration, sondern die fachliche Demonstration, dass CareFlow Pflegekomplexität als Führungskontext berücksichtigt.

### Stufe 2 – MVP-nahe Vorbereitung

Im MVP wird die Datenstruktur so vorbereitet, dass ein späterer Import möglich ist. Es erfolgt jedoch keine produktive BESA-/interRAI-Schnittstelle.

Die Demo darf zeigen:

```text
Diese Information kann später aus BESA, interRAI oder der Pflegedokumentation übernommen werden.
```

### Stufe 3 – Pilotimport via CSV/Excel

In einer Pilotphase kann ein Heim aggregierte Assessment- oder Pflegekomplexitätsdaten periodisch exportieren.

Beispielhafte CSV-Struktur:

```csv
facility_id,unit_id,unit_name,assessment_system,assessment_date,care_complexity_level,data_valid_until
CF001,WBA,Wohnbereich A,interRAI,2026-06-01,high,2026-12-01
CF001,WBB,Wohnbereich B,BESA,2026-06-01,medium,2026-12-01
```

Dieser Import ist bewusst einfach, prüfbar und pilotgeeignet.

### Stufe 4 – Kontrollierter Systemimport

In einer späteren Phase können strukturierte Exporte aus Pflegedokumentation, Heimadministration oder Pflegebedarfssystemen übernommen werden. Dafür werden Mapping-Profile definiert.

Zu klären sind dann:

* führendes System
* Exportformat
* Feldbedeutungen
* Aktualitätslogik
* Importfrequenz
* Datenqualität
* Datenschutz
* Berechtigung
* Auditierbarkeit

### Stufe 5 – API-/Schnittstellenbetrieb

Eine API-Integration wird erst für spätere Produktphasen vorgesehen. Sie setzt voraus:

* technische Schnittstellendokumentation
* Authentifizierung
* Rollen- und Berechtigungskonzept
* Datenverarbeitungsvertrag
* Mandantenfähigkeit
* Fehlerbehandlung
* Importprotokoll
* Mapping-Versionierung
* Audit-Log

---

## 11. Verwendung in der Führungslage

CareFlow verwendet Assessment-Kontextdaten nicht isoliert, sondern in Kombination mit operativen Daten.

Beispielhafte Logik:

```text
Unterdeckung normal + Pflegekomplexität normal = angespannt
Unterdeckung normal + Pflegekomplexität hoch = kritisch
Unterdeckung hoch + Pflegekomplexität hoch = Eskalationslage
```

Diese Logik ist keine automatische Pflegebewertung, sondern eine Führungsgewichtung.

Beispielhafte Anzeige:

```text
Wohnbereich A weist eine erhöhte Pflegekomplexität auf.
Die aktuelle Unterdeckung im Spätdienst ist deshalb höher zu priorisieren.
```

Oder:

```text
Die personelle Lage wäre isoliert betrachtet angespannt.
Aufgrund erhöhter Pflegekomplexität wird die Lage als kritisch markiert.
```

---

## 12. Abgrenzung

CareFlow tut nicht:

* keine BESA-Einstufung
* keine interRAI-Bewertung
* keine Pflegebedarfserfassung
* keine Abrechnung
* keine Bewohnerdiagnostik
* keine automatische Qualitätsbewertung
* keine pflegefachliche Neubeurteilung einzelner Bewohner
* keine Ersetzung des führenden Pflege- oder Assessmentsystems

CareFlow tut:

* Pflegekomplexität als Kontext sichtbar machen
* operative Unterdeckung fachlich gewichten
* Qualifikationslage im Verhältnis zur Belastung plausibilisieren
* Interventionsbedarf priorisieren
* QM-relevante Führungslagen kontextualisieren
* Aktualität von Assessmentinformationen markieren
* auf prüfbedürftige Kontexte hinweisen

---

## 13. Darstellung in der Demo

Für die Demo wird eine kleine Box in der Wohnbereichs- oder Führungssicht vorgesehen.

### Beispiel: Wohnbereich A

```text
Assessment-Kontext

Pflegekomplexität: erhöht
Quelle: bestehendes Pflegebedarfssystem
Letzte Aktualisierung: 01.06.2026
Status: aktuell

Diese Information dient der Führungseinschätzung.
CareFlow erstellt keine Pflegeeinstufung und keine automatische Qualitätsbewertung.
```

### Beispiel: Kritisches Szenario

```text
Hinweis zur Lagebewertung

Die reduzierte Fachpersonenabdeckung trifft auf eine erhöhte Pflegekomplexität.
Die Lage wird deshalb höher priorisiert als bei stabiler Bewohnerstruktur.
```

### Beispiel: Prüfbedürftiger Kontext

```text
Assessment-Aktualität prüfen

Die letzte Pflegekomplexitätsinformation ist älter oder könnte durch relevante Ereignisse überholt sein.
Bitte Aktualität im führenden Pflegebedarfssystem prüfen.
```

---

## 14. Konsequenzen für den MVP

Der MVP enthält keine produktive BESA-/interRAI-Integration.

Der MVP darf jedoch eine einfache Pflegekomplexitätslogik sichtbar machen:

```text
normal
erhöht
hoch
```

Diese Information wird zunächst statisch, manuell oder als Demo-Kontext gepflegt.

Die eigentliche MVP-Funktion bleibt:

* Führungslage
* rollierende Übersicht
* Tageslage
* Wochenlage
* Abweichungen
* Interventionen
* Qualifikationen
* Wohnbereichssicht
* QM-Lage
* einfache Lageberichte

Assessment-Kontext ist im MVP ergänzend, nicht zentral.

---

## 15. Konsequenzen für spätere Phasen

In späteren Phasen kann der Assessment Reference Layer ausgebaut werden.

Mögliche Erweiterungen:

* CSV-Import pro Wohnbereich
* Importprotokoll
* Mapping-Profile
* Aktualitätsampel
* anlassbezogene Prüfhinweise
* Pflegekomplexitätsgewichtung in Simulationen
* Einbindung in Risikoprognosen
* QM-Kontextanalyse
* RAG-gestützte Erklärung von Lageberichten
* API-Integration über Pflegedokumentation oder Heimadministration

Wichtig bleibt: CareFlow verarbeitet bevorzugt aggregierte Wohnbereichsdaten, nicht personenbezogene Assessmentdetails.

---

## 16. Risiken

### Risiko 1: CareFlow wird als weiteres Pflegesystem missverstanden

Wenn BESA/interRAI zu prominent eingebaut werden, könnte CareFlow als Assessment- oder Dokumentationssystem wahrgenommen werden.

**Gegenmaßnahme:** Klare Bezeichnung als Führungskontext, nicht als Pflegebewertung.

### Risiko 2: Zu frühe technische Komplexität

Eine echte Schnittstelle im MVP würde Entwicklungsaufwand, Datenschutzfragen und Anbieterabhängigkeiten stark erhöhen.

**Gegenmaßnahme:** MVP nur mit statischem Kontextindikator; echte Integration erst später.

### Risiko 3: Falsche Aktualität

Assessmentdaten könnten als tagesaktuell missverstanden werden.

**Gegenmaßnahme:** Jedes Assessment-Kontextdatum erhält `assessment_date`, `last_imported_at` und Aktualitätsstatus.

### Risiko 4: Datenschutz und Bewohnerdaten

Einzelne Bewohnerdaten wären sensibel und für die Führungslage nicht zwingend erforderlich.

**Gegenmaßnahme:** Aggregation auf Wohnbereichsebene; keine personenbezogenen Assessmentdetails im MVP.

### Risiko 5: Fachliche Überinterpretation

CareFlow könnte aus Assessmentdaten Aussagen ableiten, die pflegefachlich nicht validiert sind.

**Gegenmaßnahme:** CareFlow formuliert nur Führungs- und Prüfhinweise, keine Pflegeeinstufungen.

---

## 17. Positive Konsequenzen

Die Entscheidung stärkt CareFlow fachlich erheblich.

CareFlow kann zeigen, dass es nicht nur Dienstplandaten visualisiert, sondern die reale Belastungsstruktur der Pflege berücksichtigt.

Die Demo wird anschlussfähiger für:

* Heimleitungen
* Pflegeleitungen
* Qualitätsmanagement
* Trägerorganisationen
* Bereichsleitungen
* Systemverantwortliche
* Pilotpartner

Zugleich bleibt CareFlow architektonisch schlank und vermeidet eine zu frühe Überfrachtung des MVP.

Die Kernformel lautet:

**BESA/interRAI beschreiben Pflegebedarf. CareFlow beschreibt die Führungslage, die entsteht, wenn Pflegebedarf, Personalrealität, Qualifikationen und Abweichungen zusammenwirken.**

---

## 18. Entscheidungssatz

CareFlow integriert BESA/interRAI im MVP nicht als produktive Schnittstelle und nicht als eigenes Assessmentmodul. CareFlow führt jedoch einen vorbereiteten Assessment Reference Layer ein, der Pflegekomplexität auf Wohnbereichsebene als datierten, aggregierten Führungskontext sichtbar machen kann. Die erste technische Integrationsstufe erfolgt später über einfache CSV-/Excel-Importe; API-Integrationen werden erst für Pilot- oder Produktphasen vorgesehen.

---

## 19. Kurzfassung für Implementation Index

**ADR-109 legt fest, dass CareFlow BESA/interRAI nicht ersetzt und im MVP keine produktive Assessment-Schnittstelle enthält. Pflegebedarfs- und Assessmentinformationen werden perspektivisch über einen Assessment Reference Layer als aggregierter, datierter Führungskontext auf Wohnbereichsebene verwendet. Für die Demo genügt ein statischer Pflegekomplexitätsindikator; spätere Integrationen erfolgen gestuft über CSV/Excel und erst danach über API-/System-Schnittstellen.**
