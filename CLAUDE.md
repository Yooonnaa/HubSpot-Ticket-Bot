# HubSpot Ticket-Bot

## Ziel
Persönliches Tool, das HubSpot-Support-Tickets ausliest, automatisch kategorisiert, priorisiert und Antwortentwürfe generiert — für den Helpdesk-Alltag bei Designery Health.

## Architektur
- Backend: Node.js + TypeScript + Express
- Datenbank: SQLite (lokal, better-sqlite3) — kein eigener DB-Server, läuft nur auf meinem Mac
- KI: Claude API für Kategorisierung/Priorität/Antwortentwürfe (Prompt-Engineering, kein Fine-Tuning)
- Frontend: eigenes Dashboard, Design bereits als Prototyp fertig (Referenz folgt)
- HubSpot-Anbindung kommt erst später — aktuell noch kein API-Zugriff, bis dahin Mock-Daten

## Wichtige Logik, die ins Backend übernommen werden muss
- Team-Routing per Keyword-Erkennung (z.B. "Rechnung"/"Abo" → Projekt Management, "kostet"/"Preis"/"Angebot" → Customer Success)
- Prioritäts-Engine mit 4 Stufen (Kritisch/Hoch/Mittel/Niedrig): Totalausfall-Formulierungen ("funktioniert nicht mehr" usw.) → immer kritisch; zeitkritische Formulierungen ("ab morgen" usw.) heben eine sonst niedrige Priorität an

## Arbeitsweise
Ich lerne hier aktiv mit, bitte deshalb:
- Kurz erklären, was du vorhast und warum, bevor du Code schreibst
- In kleinen Schritten vorgehen statt alles auf einmal
- Bei einfacheren Teilen fragen, ob ich sie selbst schreiben will, statt sie direkt zu übernehmen