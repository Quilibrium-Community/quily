#!/usr/bin/env tsx
/**
 * Version bump script for Quily Chat.
 *
 * Usage:
 *   yarn version:bump patch   # 0.1.0 -> 0.1.1
 *   yarn version:bump minor   # 0.1.0 -> 0.2.0
 *   yarn version:bump major   # 0.1.0 -> 1.0.0
 *
 * Writes package.json, which is the single source of truth. src/lib/version.ts
 * reads the value back through NEXT_PUBLIC_APP_VERSION, injected by
 * next.config.js at build time, so the UI follows automatically.
 */

import * as fs from 'fs';
import * as path from 'path';

const PACKAGE_FILE = path.join(__dirname, '../package.json');

type BumpType = 'major' | 'minor' | 'patch';

function parseVersion(version: string): [number, number, number] {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return parts as [number, number, number];
}

function bumpVersion(current: string, type: BumpType): string {
  const [major, minor, patch] = parseVersion(current);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
  }
}

function getCurrentVersion(): string {
  const pkg = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf-8'));
  if (typeof pkg.version !== 'string') {
    throw new Error('Could not find "version" in package.json');
  }
  return pkg.version;
}

/**
 * Rewrites just the version line rather than re-serialising the parsed object,
 * so key order, indentation and the trailing newline survive untouched. A
 * JSON.stringify round-trip would reformat the whole file and bury a one-line
 * bump in noise.
 */
function updateVersionFile(newVersion: string): void {
  const content = fs.readFileSync(PACKAGE_FILE, 'utf-8');
  const updated = content.replace(
    /("version"\s*:\s*")[^"]+(")/,
    `$1${newVersion}$2`
  );

  if (updated === content) {
    throw new Error('Version line in package.json did not match — nothing written');
  }

  fs.writeFileSync(PACKAGE_FILE, updated);
}

function main() {
  const bumpType = process.argv[2] as BumpType;

  if (!['major', 'minor', 'patch'].includes(bumpType)) {
    console.error('Usage: yarn version:bump <major|minor|patch>');
    console.error('');
    console.error('Examples:');
    console.error('  yarn version:bump patch   # 0.1.0 -> 0.1.1');
    console.error('  yarn version:bump minor   # 0.1.0 -> 0.2.0');
    console.error('  yarn version:bump major   # 0.1.0 -> 1.0.0');
    process.exit(1);
  }

  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersion(currentVersion, bumpType);

  updateVersionFile(newVersion);

  console.log(`✓ Version bumped: ${currentVersion} → ${newVersion}`);
}

main();
