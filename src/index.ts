// src/index.ts

import { getcommits } from "./services/githubService";
import { scancommit } from "./services/scanner";
import { getlastcommit, setlastcommit } from "./utils/storage";

async function main(ownerArg?: string, repoArg?: string, branchArg?: string) {
  const args = process.argv.slice(2);
  const owner = ownerArg || args[0];
  const repo = repoArg || args[1];
  const branch = branchArg || args[2] || "main";

  if (!owner || !repo) {
    console.error("Usage: npm run dev <owner> <repo>");
    process.exit(1);
  }

  const lastcommit = getlastcommit();
  const commits = await getcommits(owner, repo, branch);

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
    console.log("scanning commit", sha);

    await scancommit(owner, repo, sha);
    setlastcommit(sha);
    scannedCount++;
  }

  console.log(`✅ Scan finished. Total commits scanned: ${scannedCount}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error("❌ Error during scan:", err);
  });
}

export { main };
