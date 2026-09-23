# HubSpot-Ticket-Bot

# HubSpot Ticket-Bot

Ein Tool zur automatisierten Kategorisierung, Priorisierung und Weiterleitung von Support-Tickets für medizinische Praxis-Kunden von Designery GmbH. Aktuell ein persönliches Lern-/Portfolio-Projekt, das später an die echte HubSpot-API angebunden werden soll.

## Ziel

Eingehende Support-Anfragen (Website-Bugs, Content-Änderungen, Rechnungsfragen, etc.) automatisch:
- kategorisieren
- nach Priorität und zuständigem Team einordnen
- mit einem Antwortentwurf versehen

statt das manuell im Helpdesk zu sortieren.

## Tech-Stack

- **Node.js** + **Express** – Backend-Server
- **TypeScript** und **JavaScript** gemischt (Grundgerüst in TS, API-Routen bewusst in JS, um die Konzepte von Grund auf zu lernen)
- **better-sqlite3** – lokale SQLite-Datenbank
- **tsx** – Ausführung von TS/JS im Dev-Betrieb

## Setup

```bash
npm install
npm run dev
```

Server läuft danach standardmäßig auf `http://localhost:3000`.

Health-Check: `GET /health`

## API (in Arbeit)

| Methode | Route | Beschreibung |
|---|---|---|
| GET | `/tickets` | Alle Tickets abrufen |
| GET | `/tickets/:id` | Einzelnes Ticket per ID abrufen |
| PATCH | `/tickets/:id/status` | Status eines Tickets ändern (in Arbeit) |

## Status

Aktuell in Entwicklung. Datenbank-Schema und Mock-Daten stehen, die Backend-API wird gerade aufgebaut. Noch offen: Prioritäts-/Routing-Logik im Backend, Frontend, KI-Integration, echte HubSpot-Anbindung.