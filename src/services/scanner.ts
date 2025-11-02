// src/services/scanner.ts

import fs from "fs";
import { getcommitdetails } from "./githubService";
import { awsaccesskeypattern, awssecretkeypattern } from "../utils/patterns";

export async function scancommit(owner: string, repo: string, sha: string) {
  const commitdata = await getcommitdetails(owner, repo, sha);
  const committer = commitdata.commit.committer?.name ?? "unknown";
  const commitmessage = commitdata.commit.message ?? "";
  const commitdate = commitdata.commit.committer?.date ?? "";

  const results: any[] = [];

  for (const file of commitdata.files || []) {
    if (!file.patch) continue;

    const patch = file.patch;

    const accessmatches = patch.match(awsaccesskeypattern) || [];
    const secretmatches = patch.match(awssecretkeypattern) || [];

    for (const match of [...accessmatches, ...secretmatches]) {
      results.push({
        commitsha: sha,
        committer,
        commitmessage,
        commitdate,
        filename: file.filename,
        leakvalue: match,
      });
    }
  }

  // ✨ שינוי כאן — קריאה, מיזוג, וכתיבה חזרה
  if (results.length > 0) {
    const filePath = "results.json";
    let existing: any[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const content = fs.readFileSync(filePath, "utf8");
        existing = JSON.parse(content);
      } catch (e) {
        console.warn("⚠️ Couldn't parse results.json, starting fresh.");
        existing = [];
      }
    }

    const updated = [...existing, ...results];
    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  }

  return results;
}
