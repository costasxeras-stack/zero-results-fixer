// Scores Claude's rewrites against Search Relevance Lab's human relevance labels.
// Usage: clone search-relevance-lab next to this repo, then: node scripts/score-rewrites.mjs
import { load } from "../../search-relevance-lab/lib/search.js";
import fs from "node:fs";
const S = load();
const lines = fs.readFileSync(new URL("../docs/data/live-run-2026-11-20.csv", import.meta.url), "utf8").trim().split("\n");
const head = lines.shift().split(",");
const parse = (l) => { const out = []; let f = "", q = false; for (let i = 0; i < l.length; i++) { const c = l[i]; if (q) { if (c === '"') { if (l[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += c; } else if (c === '"') q = true; else if (c === ",") { out.push(f); f = ""; } else f += c; } out.push(f); return Object.fromEntries(head.map((h, i) => [h, out[i]])); };
const byText = new Map(S.queries.map((q) => [q.q.toLowerCase(), q]));
const top = (q, mode) => S.bm25(q, mode).ranked.slice(0, 10).map((x) => x[0]);
const rows = lines.map(parse).filter((r) => r.status === "pending");
let a = 0, b = 0, win = 0, lose = 0;
for (const r of rows) {
  const id = byText.get(r.search.toLowerCase()).id;
  const x = S.ndcg(top(r.claude_rewrite, "all"), id, 10), y = S.ndcg(top(r.search, "any"), id, 10);
  a += x; b += y; if (x > y + 1e-9) win++; else if (x < y - 1e-9) lose++;
}
console.log(`${rows.length} rewrites. Mean nDCG@10: Claude rewrite ${(a / rows.length).toFixed(3)}, any-word search ${(b / rows.length).toFixed(3)}. Rewrite wins ${win}, loses ${lose}, ties ${rows.length - win - lose}.`);
