import { test } from 'node:test';
import assert from 'node:assert';
import { computePriority, detectRouting } from './ticketLogic.js';

test('meldet kritisch bei Totalausfall-Formulierung', () => {
    const ticket = {
        subject: 'Terminbuchung-Formular lädt nicht',
        full: 'seit heute Morgen lässt sich das Formular nicht mehr öffnen',
        category: 'Website-Bug'
    };

    const result = computePriority(ticket);

    assert.strictEqual(result.priority, 'kritisch');
});

test(`meldet Priority bei Zeitlichen Tickets`, () => {
    const ticket = {
        subject: `Urlaubsmeldung`,
        full: `Wir sind ab morgen im Urlaub`,
        category: 'Inhalt ändern'
    };

    const result = computePriority(ticket);

    assert.strictEqual(result.priority, 'hoch');
})

test(`Ticket wird weitergegeben`, () => {
    const ticket = {
        subject: `Rechnung`,
        full: `Wir haben eine Rückfrage zu einer Rechnung`,
        category: 'Rechnung'
    }

    const result = detectRouting(ticket);

    assert.strictEqual(result.team, 'pm');
})
