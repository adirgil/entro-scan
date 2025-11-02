import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.githubtoken,
});

/**
 * Fetches all commits from a given GitHub repository branch.
 * Handles pagination automatically.
 */
export async function getcommits(owner: string, repo: string, branch = "main") {
  const commits = [];
  let page = 1;
  const perPage = 50;

  while (true) {
    try {
      const response = await octokit.repos.listCommits({
        owner,
        repo,
        sha: branch,
        per_page: perPage,
        page,
      });

      if (response.data.length === 0) {
        break;
      }

      commits.push(...response.data);

      if (response.data.length < perPage) {
        break;
      }
      page++;
    } catch (err: any) {
      if (err.status === 404) {
        console.error(`⚠️ Branch '${branch}' not found in ${owner}/${repo}.`);
      } else {
        console.error("❌ Error fetching commits:", err.status, err.message);
      }
      break;
    }
  }

  return commits;
}

/**
 * Fetches details and file diffs for a specific commit.
 */
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
