import { Router } from 'express';
import db from '../db/index.js';
import { computePriority } from '../services/ticketLogic.js';

const router = Router();

router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM tickets').all();

    const tickets = rows.map((row) => {
        return {
            ...row,
            history: JSON.parse(row.history),
            priorityReasons: computePriority(row).priorityReasons
        };
    });

    res.json(tickets);
});

router.get('/:id', (req, res) => {
    const row = db.prepare('SELECT * FROM tickets WHERE id = ?').get(req.params.id);

    if (!row) {
        return res.status(404).json({ error: 'Ticket nicht gefunden' });
    }

    const ticket = {
        ...row,
        history: JSON.parse(row.history),
        priorityReasons: computePriority(row).priorityReasons
    };

    res.json(ticket);
});

router.patch('/:id/status', (req, res) => {
    const { status } = req.body;

    const result = db.prepare(`UPDATE tickets SET status = ? WHERE id = ?`).run(status, req.params.id);

    if (result.changes === 0) {
        return res.status(404).json({ error: 'Ticket nicht gefunden' });
    }

    res.json({ id: req.params.id, status });
});

export default router;
