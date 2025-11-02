// src/services/githubService.ts

import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

// יוצרים מופע של Octokit עם הטוקן שלנו
const octokit = new Octokit({
  auth: process.env.githubtoken,
});

/**
 * מביא רשימת קומיטים של ריפו נתון.
 * סורק בסדר יורד לפי תאריך (מהחדש לישן).
 */
export async function getcommits(owner: string, repo: string) {
  const commits = [];

  let page = 1;
  const perPage = 50; // אפשר לשנות לפי הצורך

  while (true) {
    const response = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: perPage,
      page,
    });

    if (response.data.length === 0) break;

    commits.push(...response.data);

    // אם קיבלנו פחות מהכמות המבוקשת - זה אומר שהגענו לסוף
    if (response.data.length < perPage) break;

    page++;
  }

  return commits;
}

/**
 * מביא את כל פרטי הקומיט (כולל הדיפים של הקבצים ששונו).
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
