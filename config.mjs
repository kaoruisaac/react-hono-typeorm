import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'yaml';
const changelog = parse(readFileSync('./CHANGELOG.yml', 'utf8'));
const APP_VERSION = changelog[0].version;

// update APP_VERSION to .env
let env;
try { env = readFileSync('.env', 'utf8'); } catch { env = ''; }

if (/APP_VERSION=.*/.test(env)) {
  env = env.replace(/APP_VERSION=.*/, `APP_VERSION=${APP_VERSION}`);
} else {
  env += `\nAPP_VERSION=${APP_VERSION}`;
}
writeFileSync('.env', env);