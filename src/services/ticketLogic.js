const PM_KEYWORDS = ["rechnung", "zahlung", "abo", "kündigen", "vertrag"];
const CS_KEYWORDS = ["kostet", "preis", "angebot", "landingpage erstellen", "zusätzliche seite"];

export function detectRouting(ticket) {
    const text = (ticket.subject + " " + ticket.full).toLowerCase();

    const pmHit = PM_KEYWORDS.find(keyword => text.includes(keyword));
    if (pmHit) {
        return { team: "pm", routeReason: `Schlüsselwort „${pmHit}" erkannt` };
    }

    const csHit = CS_KEYWORDS.find(keyword => text.includes(keyword));
    if (csHit) {
        return { team: "cs", routeReason: `Schlüsselwort „${csHit}" erkannt` };
    }

    return { team: "helpdesk", routeReason: null };
}

const OUTAGE_PATTERNS = ["nicht mehr öffnen", "nicht mehr buchen", "funktioniert nicht mehr", "reagiert nicht mehr", "nicht mehr erreichbar", "nicht sicher", "blockiert"];
const TIME_SOON_PATTERNS = ["ab morgen", "morgen ", "übermorgen", "ab heute", "diese woche"];

export function computePriority(ticket) {
    const text = (ticket.subject + " " + ticket.full).toLowerCase();
    let level;
    const reasons = [];

    const outageHit = OUTAGE_PATTERNS.find(pattern => text.includes(pattern));
    if (outageHit) {
        level = "kritisch";
        reasons.push(`Meldet einen Totalausfall („${outageHit.trim()}") — Nutzer direkt betroffen`);
    } else if (ticket.category === "Website-Bug") {
        level = "hoch"
        reasons.push(`Meldet ein technisches Problem auf der Website`)
    } else if (ticket.category === "Rechnung/Abo" || ticket.category === "Preisanfrage") {
        level = "mittel"
        reasons.push(`Meldet geschäftliche relevanz aber nicht Zeitkritisch`);
    } else {
        level = "niedrig"
        reasons.push(`Redaktionelle Änderung ohne unmittelbare Dringlichkeit.`);
    }

    const timeHit = TIME_SOON_PATTERNS.find(pattern => text.includes(pattern));
    if (timeHit && level !== "kritisch" && level !== "hoch") {
        level = "hoch";
        reasons.push(`Zeitlich dringend („${timeHit.trim()}") — Priorität deshalb angehoben`);
    }

    return { priority: level, priorityReasons: reasons };
}