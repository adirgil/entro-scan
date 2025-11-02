// src/services/scanner.ts

import fs from "fs";
import { getcommitdetails } from "./githubService";
import { awsaccesskeypattern, awssecretkeypattern } from "../utils/patterns";

/**
 * סורק קומיט אחד ומחפש דליפות של AWS keys בתוך ה-diff שלו.
 */
export async function scancommit(owner: string, repo: string, sha: string) {
  const commitdata = await getcommitdetails(owner, repo, sha);
  const committer = commitdata.commit.committer?.name ?? "unknown";
  const commitmessage = commitdata.commit.message ?? "";
  const commitdate = commitdata.commit.committer?.date ?? "";

  const results: any[] = [];

  // עוברים על כל הקבצים בקומיט
  for (const file of commitdata.files || []) {
    if (!file.patch) continue; // לפעמים אין patch (למשל בקבצים בינאריים)

    const patch = file.patch;

    // חיפוש לפי שני regexים
    const accessmatches = patch.match(awsaccesskeypattern) || [];
    const secretmatches = patch.match(awssecretkeypattern) || [];

    // אם נמצא משהו, נוסיף למערך התוצאות
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

  // אם נמצאו תוצאות — נוסיף לקובץ results.json
  if (results.length > 0) {
    fs.appendFileSync("results.json", JSON.stringify(results, null, 2) + "\n");
  }

  return results;
}
