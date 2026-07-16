#!/usr/bin/env node
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'ucampt.db');

async function main() {
  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });
  const users = await db.all('SELECT id, email, name, role, createdAt, password FROM users');
  console.log('DB Path:', DB_PATH);
  if (!users || users.length === 0) {
    console.log('No users found');
    await db.close();
    return;
  }
  console.table(users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.createdAt, passwordHash: u.password })));
  await db.close();
}

main().catch(err => { console.error(err); process.exit(1); });
