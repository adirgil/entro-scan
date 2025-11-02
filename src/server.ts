import express from "express";
import { main as runscan } from "./index";

const app = express();

app.get("/scan", async (req, res) => {
  const { owner, repo } = req.query;
  if (!owner || !repo) {
    return res.status(400).json({ error: "Missing owner or repo" });
  }

  try {
    await runscan(String(owner), String(repo));
    res.json({ message: "Scan completed" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
  res.send(`
    <h2>🔍 Entro Security Scanner</h2>
    <p>Use the <code>/scan</code> endpoint:</p>
    <pre>/scan?owner=&lt;org&gt;&repo=&lt;name&gt;[&branch=&lt;branch&gt;]</pre>
  `);
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
