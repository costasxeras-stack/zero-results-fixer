# Testing: v0.2.0

**How:** the four changed workflows were updated in my n8n Cloud account and run there with test data pinned on the steps that call outside services (the search service, Claude, data table writes and email). Every n8n step in between ran for real. Date: 22 November 2026.

## Results: 9 of 9 scenarios passed

| # | Scenario | Expected | Result |
|---|---|---|---|
| V1 | Weekly scan with a mix of searches: one from the train split, one empty, one that finds products, one repeated, one seen before | Only the 4 new zero-result test searches reach Claude, each once | Pass |
| V2 | Same run, 4 different Claude outcomes | Statuses `pending`, `needs_review` (Claude error), `no_fix` (not a product search) and `fix_failed_test`. Confidence above 1 is capped at 1. The rewrite is trimmed and lower case | Pass |
| V3 | Same run | One email, fix to approve first with its review link, then the other three | Pass |
| V4 | First ever run, no past proposals | The new search is not skipped | Pass |
| V5 | Review: own rewrite typed with spaces and capitals | Saved as "bunk bed", rule added, "Approved" message | Pass |
| V6 | Review: wrong token | "This link is not valid". Nothing saved | Pass |
| V7 | Review: already approved | "Already decided (approved)". Nothing saved | Pass |
| V8 | Review: "own rewrite" left empty | Asked to type it. Nothing saved | Pass |
| V9 | Review: the save finds no pending row (second click at the same moment) | "Decided a moment ago". No rule added | Pass |

Also checked: the weekly report counts causes and statuses, the approval rate (67% of 3 in the test) and the "may not sell" list. The live rules API answered `{"count":0,"rules":[]}` after the update, which is right with no approvals yet.

**v0.3.0 live checks on n8n Cloud (22 November 2026, Gmail connected):**

| # | Check | Result |
|---|---|---|
| L1 | Weekly report (04) on the real data table | Email delivered to the owner's Gmail: 60 searches, 46 waiting, 5 "may not sell" searches. Numbers match the case study |
| L2 | Weekly scan (01) on real Search Relevance Lab data | 192 test searches run, 60 with no results, all 60 skipped as already handled. No duplicate email. Same counts as v0.1.1 |
| L3 | Same, first try | Failed: the free Render service was asleep and answered "Application loading" for all 5 tries (about 25 seconds). The second run worked. A real shop's search would not sleep, but a demo on a free host needs a warm-up call first |

Error alerts (99) are published and set as the error workflow of 01 to 04. They only fire for scheduled or live runs, not manual ones, so they are not tested yet.

**Not covered by v0.2.0 tests:** real Claude answers (the v0.1.1 live run covers those), real email delivery and a scheduled Monday run.

# Testing: v0.1.1

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

## First live run on n8n Cloud (20 November 2026)

The workflows were created in my n8n Cloud account and workflow 01 ran with the real Claude through n8n's built-in AI credits. Results are in the [case study](case-study.md).

What the live run found and what changed:

| Problem | Fix |
|---|---|
| Search Relevance Lab on Render's free plan was asleep. The first request got a "service unavailable" page and 3 tries were not enough | 5 tries for the first request |
| Under steady load some searches took over 30 and then 60 seconds, and one slow search failed the whole run | One request at a time, 60-second limit, and a search that still times out is skipped this week instead of stopping the run (decision 0005) |
| 5 of 60 searches came back as Claude failures, and the message said "Claude could not be reached" | The message now says Claude returned an error or an answer in the wrong format, which is what the node reports for both |
| The weekly email step fails until a Gmail credential is added | Expected. Proposals are saved before that step, so nothing is lost |

The review form (02) and rules API (03) are published on n8n Cloud. The rules API was called once and answered with an empty rule list, as expected with no approvals yet.

## Not yet tested

- Real email delivery through Gmail (needs the owner's Gmail app password)
- The review form on n8n Cloud with a real approval
- A scheduled Monday run
