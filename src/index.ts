import express from 'express';
import ticketsRouter from './routes/tickets.js';

const app = express();
app.use(express.json());
const port = process.env.PORT ?? 3000;

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});

app.use('/tickets', ticketsRouter);
