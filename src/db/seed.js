import db from './index.js';

const MOCK_TICKETS = [
    {
        id: "48213", subject: "Terminbuchung-Formular lädt nicht", company: "Zahnarztpraxis Dr. Keller",
        category: "Website-Bug", status: "offen", confidence: 92, priority: "kritisch", team: "helpdesk", routeReason: null,
        created: "17.09. 08:12",
        full: "Hallo, seit heute Morgen lässt sich das Terminbuchungs-Formular auf unserer Praxis-Website nicht mehr öffnen. Patienten können keine Termine mehr online buchen. Könnt ihr das bitte schnell prüfen?",
        summary: "Terminbuchungsformular lädt nicht mehr — vermutlich Plugin-Fehler nach letztem Update. Patienten können aktuell keine Termine online buchen.",
        draft: "Hallo Frau Keller,\n\ndanke für die schnelle Meldung! Wir prüfen das Formular sofort und melden uns, sobald die Buchung wieder funktioniert.\n\nViele Grüße\nIhr Designery-Team",
        history: [["08:12","Ticket in HubSpot erstellt"],["08:13","Webhook empfangen"],["08:13","Kategorisiert (92%)"],["08:14","Antwortentwurf generiert"]]
    },
    {
        id: "48214", subject: "Rechnung für September fehlt", company: "Physiotherapie Wagner",
        category: "Rechnung/Abo", status: "offen", confidence: 88, priority: "mittel", team: "pm", routeReason: "Schlüsselwort „rechnung“ erkannt",
        created: "17.09. 09:03",
        full: "Guten Tag, wir haben für September noch keine Rechnung von euch erhalten. Könnt ihr die bitte nochmal zuschicken?",
        summary: "Rechnung für September wurde nicht zugestellt, Kunde bittet um erneuten Versand. Rechnungsthemen laufen nicht über den Helpdesk.",
        draft: "Hallo Herr Wagner,\n\nvielen Dank für Ihre Nachricht. Rechnungsanfragen bearbeitet bei uns das Projekt Management — ich leite Ihr Ticket direkt weiter, Sie erhalten zeitnah eine Rückmeldung mit der fehlenden Rechnung.\n\nViele Grüße\nIhr Designery-Team",
        history: [["09:03","Ticket in HubSpot erstellt"],["09:04","Webhook empfangen"],["09:04","Kategorisiert (88%) — Rechnungsthema erkannt"],["09:05","Weiterleitungs-Notiz generiert"]]
    },
    {
        id: "48215", subject: "Leistungen-Text auf Startseite ändern", company: "Hautzentrum Lindenallee",
        category: "Inhalte ändern", status: "beantwortet", confidence: 95, priority: "niedrig", team: "helpdesk", routeReason: null,
        created: "16.09. 14:21",
        full: "Bitte den Absatz zu unseren Leistungen auf der Startseite aktualisieren, wir bieten seit Oktober auch Laserbehandlungen an.",
        summary: "Textänderung auf der Startseite: neue Leistung (Laserbehandlungen) ergänzen.",
        draft: "Hallo Team Lindenallee,\n\nder Leistungstext wurde angepasst, Laserbehandlungen sind jetzt auf der Startseite gelistet. Schaut gerne mal drüber.\n\nViele Grüße\nIhr Designery-Team",
        history: [["14:21","Ticket erstellt"],["14:22","Kategorisiert (95%)"],["14:23","Entwurf generiert"],["15:40","Als beantwortet markiert"]]
    },
    {
        id: "48216", subject: "Google-Maps-Eintrag zeigt alte Adresse", company: "Kieferorthopädie Nowak",
        category: "Allgemeine Frage", status: "geschlossen", confidence: 81, priority: "niedrig", team: "helpdesk", routeReason: null,
        created: "15.09. 11:05",
        full: "Unser Google-Maps-Eintrag zeigt noch die alte Praxisadresse an, obwohl wir schon vor 2 Monaten umgezogen sind. Könnt ihr da helfen, oder ist das nicht euer Bereich?",
        summary: "Frage zu veraltetem Google-Maps-Eintrag — liegt außerhalb des Website-Supports, an Kunde zurückgemeldet.",
        draft: "Hallo Frau Nowak,\n\nder Google-Maps-Eintrag läuft über Google Business Profile, nicht über die Website — dort können Sie die Adresse direkt selbst korrigieren. Bei Bedarf helfen wir gerne beim Schritt-für-Schritt.\n\nViele Grüße\nIhr Designery-Team",
        history: [["11:05","Ticket erstellt"],["11:06","Kategorisiert (81%)"],["11:07","Entwurf generiert"],["13:00","Beantwortet"],["16:02","Geschlossen"]]
    },
    {
        id: "48217", subject: "Cookie-Banner blockiert Kontaktformular", company: "Augenzentrum Berger",
        category: "Website-Bug", status: "bearbeitung", confidence: 90, priority: "kritisch", team: "helpdesk", routeReason: null,
        created: "17.09. 07:48",
        full: "Das Kontaktformular reagiert nicht mehr, sobald der Cookie-Banner erscheint. Mehrere Patienten haben sich schon beschwert, dass sie uns nicht erreichen können.",
        summary: "Cookie-Banner überlagert/blockiert das Kontaktformular — vermutlich Z-Index- oder Skript-Konflikt nach Banner-Update.",
        draft: "Hallo Herr Berger,\n\ndanke für den Hinweis, wir sind bereits an der Behebung dran und melden uns, sobald das Formular wieder normal funktioniert.\n\nViele Grüße\nIhr Designery-Team",
        history: [["07:48","Ticket erstellt"],["07:49","Kategorisiert (90%)"],["07:50","Entwurf generiert"],["09:10","In Bearbeitung genommen"]]
    },
    {
        id: "48218", subject: "Neues Teamfoto einbinden", company: "Praxis am Rathaus",
        category: "Inhalte ändern", status: "offen", confidence: 97, priority: "niedrig", team: "helpdesk", routeReason: null,
        created: "17.09. 10:30",
        full: "Anbei ein neues Teamfoto, bitte auf der Über-uns-Seite austauschen.",
        summary: "Bild-Austausch auf der Über-uns-Seite (neues Teamfoto beigefügt).",
        draft: "Hallo Praxis-Team,\n\ndas neue Teamfoto ist eingebunden. Schaut gerne mal auf der Über-uns-Seite vorbei.\n\nViele Grüße\nIhr Designery-Team",
        history: [["10:30","Ticket erstellt"],["10:31","Kategorisiert (97%)"],["10:32","Entwurf generiert"]]
    },
    {
        id: "48219", subject: "SSL-Warnung im Browser", company: "Zahnarztpraxis Dr. Keller",
        category: "Website-Bug", status: "offen", confidence: 85, priority: "kritisch", team: "helpdesk", routeReason: null,
        created: "17.09. 12:02",
        full: "Wenn man unsere Website aufruft, zeigt der Browser eine Warnung 'Verbindung ist nicht sicher' an. Das verunsichert Patienten.",
        summary: "SSL-Zertifikat läuft vermutlich ab oder ist fehlerhaft eingebunden — Browser zeigt Sicherheitswarnung.",
        draft: "Hallo Frau Keller,\n\nwir prüfen das Zertifikat sofort und kümmern uns um die Erneuerung. Wir melden uns, sobald die Warnung verschwunden ist.\n\nViele Grüße\nIhr Designery-Team",
        history: [["12:02","Ticket erstellt"],["12:03","Kategorisiert (85%)"],["12:04","Entwurf generiert"]]
    },
    {
        id: "48220", subject: "Öffnungszeiten falsch angezeigt", company: "Physiotherapie Wagner",
        category: "Inhalte ändern", status: "beantwortet", confidence: 93, priority: "niedrig", team: "helpdesk", routeReason: null,
        created: "16.09. 16:44",
        full: "Auf der Startseite stehen noch die alten Öffnungszeiten (bis 18 Uhr), seit letztem Monat haben wir aber bis 19 Uhr geöffnet.",
        summary: "Öffnungszeiten auf der Startseite veraltet, müssen von 18 auf 19 Uhr korrigiert werden.",
        draft: "Hallo Herr Wagner,\n\ndie Öffnungszeiten wurden auf 19 Uhr aktualisiert. Danke für den Hinweis!\n\nViele Grüße\nIhr Designery-Team",
        history: [["16:44","Ticket erstellt"],["16:45","Kategorisiert (93%)"],["16:46","Entwurf generiert"],["17:20","Als beantwortet markiert"]]
    },
    {
        id: "48221", subject: "Was kostet eine zusätzliche Landingpage?", company: "Kardiologie Zentrum Süd",
        category: "Preisanfrage", status: "offen", confidence: 89, priority: "mittel", team: "cs", routeReason: "Schlüsselwort „kostet“ erkannt",
        created: "18.09. 09:15",
        full: "Wir überlegen, für unser neues MVZ eine zusätzliche Landingpage erstellen zu lassen. Was würde das ungefähr kosten und wie lange würde das dauern?",
        summary: "Preisanfrage für eine zusätzliche Landingpage — Neugeschäft, kein Support-Fall, gehört zu Customer Success.",
        draft: "Hallo Kardiologie-Zentrum-Team,\n\nvielen Dank für Ihr Interesse! Für Preisanfragen zu neuen Seiten ist unser Customer-Success-Team zuständig — ich leite Ihre Anfrage weiter, Sie hören in Kürze mit einem unverbindlichen Angebot von uns.\n\nViele Grüße\nIhr Designery-Team",
        history: [["09:15","Ticket in HubSpot erstellt"],["09:16","Webhook empfangen"],["09:16","Kategorisiert (89%) — Preisanfrage erkannt"],["09:17","Weiterleitungs-Notiz generiert"]]
    },
    {
        id: "48222", subject: "Praxis ab morgen im Urlaub", company: "MVZ Sonnenallee",
        category: "Inhalte ändern", status: "offen", confidence: 94, priority: "hoch", team: "helpdesk", routeReason: null,
        created: "18.09. 08:05",
        full: "Wir sind ab morgen für zwei Wochen im Urlaub. Könnt ihr das bitte schnell noch als Hinweis auf der Startseite ergänzen, damit Patienten heute noch Bescheid wissen?",
        summary: "Urlaubshinweis für die Startseite — betrifft bereits morgen, sollte deshalb kurzfristig umgesetzt werden.",
        draft: "Hallo Team Sonnenallee,\n\nder Urlaubshinweis ist auf der Startseite eingetragen, sodass Patienten noch heute Bescheid wissen. Gute Erholung!\n\nViele Grüße\nIhr Designery-Team",
        history: [["08:05","Ticket erstellt"],["08:06","Kategorisiert (94%) — zeitkritisch, betrifft morgen"],["08:07","Entwurf generiert"]]
    },
    {
        id: "48223", subject: "Weihnachtsurlaub schon jetzt ankündigen", company: "Kinderarztpraxis Dr. Els",
        category: "Inhalte ändern", status: "offen", confidence: 96, priority: "niedrig", team: "helpdesk", routeReason: null,
        created: "16.09. 13:10",
        full: "Wir sind über Weihnachten drei Wochen im Urlaub. Das könnt ihr schon mal für Dezember auf der Website vormerken, hat noch Zeit.",
        summary: "Urlaubshinweis für Dezember — liegt noch weit in der Zukunft, keine Eile.",
        draft: "Hallo Praxis Dr. Els,\n\nnotiert! Wir tragen den Weihnachtsurlaub rechtzeitig vor Dezember auf der Website ein.\n\nViele Grüße\nIhr Designery-Team",
        history: [["13:10","Ticket erstellt"],["13:11","Kategorisiert (96%)"],["13:12","Entwurf generiert"]]
    }
];

const insert = db.prepare(`
    INSERT INTO tickets (id, subject, company, category, status, confidence, priority, team, routeReason, created, full, summary, draft, history)
    VALUES (@id, @subject, @company, @category, @status, @confidence, @priority, @team, @routeReason, @created, @full, @summary, @draft, @history)
`);

for (let i = 0; i < MOCK_TICKETS.length; i++) {
    const ticket = MOCK_TICKETS[i];
    const ticketToInsert = { ...ticket, history: JSON.stringify(ticket.history) };
    insert.run(ticketToInsert);
}