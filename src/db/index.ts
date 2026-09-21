import Database from 'better-sqlite3';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDir, '..', '..');

const dbPath = path.join(projectRoot, 'data.sqlite');
const schemaPath = path.join(currentDir, 'schema.sql');

const db = new Database(dbPath);

const schema = readFileSync(schemaPath, 'utf-8');
db.exec(schema);

export default db;
