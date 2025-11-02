// src/utils/storage.ts

import fs from "fs";

const LAST_COMMIT_FILE = "lastcommit.json";

/**
 * Returns the last scanned commit SHA (if exists).
 */
export function getlastcommit(): string | null {
  if (!fs.existsSync(LAST_COMMIT_FILE)) return null;

  try {
    const data = JSON.parse(fs.readFileSync(LAST_COMMIT_FILE, "utf-8"));
    return data.lastcommit || null;
  } catch {
    return null;
  }
}

/**
 * Saves the last successfully scanned commit SHA.
 */
export function setlastcommit(sha: string): void {
  const data = { lastcommit: sha };
  fs.writeFileSync(LAST_COMMIT_FILE, JSON.stringify(data, null, 2));
}
