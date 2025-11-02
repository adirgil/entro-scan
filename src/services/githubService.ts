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
  const perPage = 10;

  while (true) {
    try {
      const response = await octokit.repos.listCommits({
        owner,
        repo,
        per_page: perPage,
        page,
      });

      if (response.data.length === 0) break;

      commits.push(...response.data);

      // 🔹 הוסף את השורה הזו בדיוק כאן:
      if (page >= 3) {
        // עצור אחרי 5 עמודים בלבד לבדיקה
        console.log("🛑 stopping early for debug after", page, "pages");
        break;
      }

      if (response.data.length < perPage) break;

      page++;
    } catch (err: any) {
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
