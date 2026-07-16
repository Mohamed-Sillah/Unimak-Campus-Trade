#!/usr/bin/env node
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'ucampt.db');

async function main() {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  // Trim leading/trailing whitespace for admin users
  const res = await db.run("UPDATE users SET email = TRIM(email), name = TRIM(name) WHERE role = 'ADMIN'");
  console.log('Rows updated:', res.changes);
  const admin = await db.get("SELECT id, email, name, role FROM users WHERE role = 'ADMIN'");
  console.log('Admin after trim:', admin);
  await db.close();
}

main().catch(err => { console.error(err); process.exit(1); });
