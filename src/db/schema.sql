CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    company TEXT NOT NULL,
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    confidence INTEGER,
    priority TEXT,
    team TEXT,
    routeReason TEXT,
    summary TEXT,
    draft TEXT,
    full TEXT,
    history TEXT,
    created TEXT
);