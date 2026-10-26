#!/usr/bin/env node
// Builds index.html from app.html with the password check baked in: a known
// string encrypted with AES-256-GCM under a key from PBKDF2-SHA256. The same key
// encrypts the schedule data, so the password itself is never stored.
// Usage: HCS_PASSWORD='...' node build.mjs [out.html ...]
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname } from 'node:path';
import { webcrypto as crypto } from 'node:crypto';

const pw = process.env.HCS_PASSWORD;
if (!pw) { console.error("usage: HCS_PASSWORD='...' node build.mjs [out.html ...]"); process.exit(1); }
const outs = process.argv.slice(2);
if (!outs.length) outs.push(new URL('index.html', import.meta.url).pathname);

// Keep the salt from the last build: a new salt would make existing data unreadable.
const saltFile = new URL('salt.txt', import.meta.url);
const ITER = 600000;
const salt = existsSync(saltFile) ? Buffer.from(readFileSync(saltFile, 'utf8').trim(), 'base64') : crypto.getRandomValues(new Uint8Array(16));
writeFileSync(saltFile, Buffer.from(salt).toString('base64') + '\n');

const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
const key = await crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const iv = crypto.getRandomValues(new Uint8Array(12));
const ct = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode('pines-hc-ok')));
const b64 = (u) => Buffer.from(u).toString('base64');
const LOCK = JSON.stringify({ iter: ITER, salt: b64(salt), iv: b64(iv), ct: b64(ct) });

const page = readFileSync(new URL('app.html', import.meta.url), 'utf8').replace('/*__LOCK__*/null', () => LOCK);
for (const out of outs) {
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, page);
  console.log(`wrote ${out}`);
}
