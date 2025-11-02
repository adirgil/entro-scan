# Entro Security – GitHub Secret Scanner

A lightweight backend application that scans a given GitHub repository’s commits for potential AWS secret leaks.

---

## 🚀 Features

- Scans commit diffs **in descending order by time**.
- Detects AWS `access keys` and `secret keys` using regex patterns.
- Stores each finding with:
  - Commit SHA
  - Committer name
  - Commit message
  - Commit date
  - File name
  - The suspicious value
- **Resume support:** continues scanning from the last scanned commit if stopped.
- (Bonus) Supports scanning a specific branch.
- (Bonus) Exposes a simple REST API server.

> 🧩 _This project can run either as a standalone CLI module or as a lightweight Web API server._

---

## ⚙️ Quick Start

| 🧠 **CLI (module mode)** | `npm run dev <owner> <repo> [branch]` | Run the scanner directly from the terminal.<br>Example: `npm run dev vercel turbo` |
| 🌐 **Web API (server mode)** | `npm run server` | Start a local Express server at [`http://localhost:3000`](http://localhost:3000) and trigger scans via `/scan?owner=<org>&repo=<name>[&branch=<branch>]` |
| 🔁 **Reset scan** | Delete `lastcommit.json` or add `?reset=true` in the API query | Start a fresh scan from the beginning. |

---

### 🧠 Examples

**CLI mode**

```bash
npm run dev vercel turbo
npm run dev vercel turbo canary
```
