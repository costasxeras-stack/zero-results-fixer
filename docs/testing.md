# Testing: v0.1.0

**How:** the six workflow files were imported into a local n8n **2.47.7** and published. Search Relevance Lab v0.1.0 ran locally, so every search was real. Claude and email (SMTP) were replaced by local stand-ins that record every request. A test-only webhook was added to the workflows that normally start by hand or on a schedule, so they could be started from a script. Those webhooks are not in the files in this repo. Date: 20 November 2026.

**What the stand-ins mean:** the n8n side (triggers, forms, data tables, routing, retries, error handling) and the searches ran for real. Claude's answers came from a simple rule-based stand-in, so these tests say nothing about how well Claude explains or fixes real searches.

## Results: 19 of 19 scenarios passed

| # | Scenario | Expected | Result |
|---|---|---|---|
| S1 | Setup run twice | Three data tables, exactly one settings row | Pass |
| A1 | First weekly scan | 192 searches run, the empty ones found, 30 handled (the per-run limit) | Pass |
| A2 | Same | Every fix sent for approval was re-run and returns products | Pass |
| A3 | Same | Fixes that still return nothing are marked `fix_failed_test` and not sent for approval | Pass |
| A4 | Same | "Not sold" and "not a product search" have no rewrite and are listed as demand signals | Pass |
| A5 | Same | One email to the owner, one review link per pending fix | Pass |
| B1 | Second scan | Searches already handled are skipped. The other 30 are added | Pass |
| B2 | Claude fails for one search | That search is marked `needs_review`. The rest of the run continues | Pass (after the node's retries, about 2 minutes) |
| B3 | Third scan, nothing new | No email | Pass |
| C1 | Owner approves | Status `approved`, one rule added | Pass |
| C2 | Same link used again | "Already decided". Nothing changes | Pass |
| C3 | Wrong token | "Link not valid". Nothing changes | Pass |
| C4 | "Own rewrite" chosen but left empty | Asked to fill it in. Nothing changes | Pass |
| C5 | Owner types their own rewrite | Saved in lowercase and used in the rule | Pass |
| C6 | Owner rejects | Status `rejected`, no rule | Pass |
| C7 | One link submitted twice at the same moment | Only one decision counts | Pass (failed in the first build, fixed in workflow 02) |
| D1 | Search asks for the rules | Every approved rule returned as JSON | Pass |
| E1 | Weekly report | Email with causes, statuses, approval rate and demand signals | Pass |
| X1 | Search service down | Run fails after 3 tries. Owner gets an email naming the failed step and the run link | Pass |

## Not yet tested

- Claude on the real 60 searches (quality of causes and rewrites)
- n8n Cloud specifics (credential screens, the published form URL)
- Real email delivery through Gmail
- Search Relevance Lab on Render's free plan waking up from sleep during a run (the first request has 3 tries with a 90-second limit each)
