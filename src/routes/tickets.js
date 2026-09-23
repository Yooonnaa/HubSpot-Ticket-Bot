import { Router } from 'express';
import db from '../db/index.js';

const router = Router();

router.get('/', (req, res) => {
    const rows = db.prepare('SELECT * FROM tickets').all();

    const tickets = rows.map((row) => {
        return {
            ...row,
            history: JSON.parse(row.history)
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
        history: JSON.parse(row.history)
};

    res.json(ticket);
});

export default router;
