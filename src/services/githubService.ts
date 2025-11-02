// src/services/githubService.ts

import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.githubtoken,
});

export async function getcommits(owner: string, repo: string, branch = "main") {
  const commits = [];

  let page = 1;
  const perPage = 10;

  while (true) {
    try {
      const response = await octokit.repos.listCommits({
        owner,
        repo,
        sha: branch,
        per_page: perPage,
        page,
      });

      if (response.data.length === 0) break;

      commits.push(...response.data);

      if (page >= 3) {
        // עצור אחרי 5 עמודים בלבד לבדיקה
        console.log("🛑 stopping early for debug after", page, "pages");
        break;
      }

      if (response.data.length < perPage) break;

      page++;
    } catch (err: any) {
      if (err.status === 404) {
        console.error(`⚠️ Branch '${branch}' not found in ${owner}/${repo}.`);
        break;
      }
      console.error(
        "❌ Error fetching commits:",
        err.status,
        err.message || err
      );
      break;
    }
  }

  return commits;
}

export async function getcommitdetails(
  owner: string,
  repo: string,
  sha: string
) {
  const response = await octokit.repos.getCommit({
    owner,
    repo,
    ref: sha,
  });

  return response.data;
}
