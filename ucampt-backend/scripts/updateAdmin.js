#!/usr/bin/env node
import bcrypt from 'bcryptjs';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', '..', 'ucampt.db');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2);
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[i+1] : true;
      out[key] = val;
    }
  }
  return out;
}

async function main() {
  const opts = parseArgs();
  const newEmail = opts.email;
  const newName = opts.name;
  const newPassword = opts.password;

  if (!newEmail && !newName && !newPassword) {
    console.error('Usage: node updateAdmin.js --email new@... --name "New Name" --password newpass');
    process.exit(1);
  }

  const db = await open({ filename: DB_PATH, driver: sqlite3.Database });

  const admin = await db.get("SELECT * FROM users WHERE role = ?", ['ADMIN']);
  if (!admin) {
    console.error('No admin user found in database.');
    process.exit(1);
  }

  const updates = [];
  const params = [];

  if (newEmail) {
    updates.push('email = ?');
    params.push(newEmail);
  }
  if (newName) {
    updates.push('name = ?');
    params.push(newName);
  }
  if (newPassword) {
    const hashed = await bcrypt.hash(newPassword, 10);
    updates.push('password = ?');
    params.push(hashed);
  }

  params.push(admin.id);

  const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
  await db.run(sql, params);

  console.log('Admin user updated successfully.');
  await db.close();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
