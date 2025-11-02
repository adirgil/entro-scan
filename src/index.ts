// src/index.ts

import { getcommits } from "./services/githubService";
import { scancommit } from "./services/scanner";
import { getlastcommit, setlastcommit } from "./utils/storage";

async function main() {
  const args = process.argv.slice(2);
  const owner = args[0];
  const repo = args[1];

  if (!owner || !repo) {
    console.error("Usage: npm run dev <owner> <repo>");
    process.exit(1);
  }

  console.log(`Starting scan for ${owner}/${repo}...`);

  const lastcommit = getlastcommit();
  const commits = await getcommits(owner, repo);

  let continueScanning = !lastcommit;
  let scannedCount = 0;

  for (const commit of commits) {
    const sha = commit.sha;

    // אם יש commit אחרון שנסרק – נתחיל אחריו
    if (lastcommit && sha === lastcommit) {
      continueScanning = true;
      continue;
    }

    if (!continueScanning) continue;

    await scancommit(owner, repo, sha);
    setlastcommit(sha);
    scannedCount++;
  }

  console.log(`✅ Scan finished. Total commits scanned: ${scannedCount}`);
}

main().catch((err) => {
  console.error("❌ Error during scan:", err);
});
