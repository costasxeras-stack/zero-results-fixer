# Case study: fixing "No results found" searches with Claude and a human approval step

Version 0.1.1 · 20 November 2026

## The question

Can an AI explain why a shop search returned nothing and propose a fix that works, so that a person only has to approve or reject it? And what guardrails does that need before a shop would trust it?

## Starting point (confirmed)

Search Relevance Lab runs strict keyword search over 42,994 products from the open WANDS dataset. Of its 192 held-out test searches, **60 (31%) return no products**. Examples include "gurney slade 56" (a collection name and a number), "twin over full bunk beds cool desins" (a misspelling), "promo codes or discounts" (not a product search) and "minnestrista" (a single unknown name).

Source: Search Relevance Lab v0.1.0, test split, 20 November 2026.

## Approach

- **The AI suggests, a person decides.** Claude proposes a cause and one rewrite per search. Nothing reaches the shop until the owner approves it (decision 0001).
- **Test before asking.** Every rewrite is run against the same search before the owner sees it. If it still returns nothing, it is dropped and listed separately (decision 0002).
- **Safe links.** Each review link carries a one-off token, and a proposal can only be decided once, even if the link is submitted twice at the same moment (decision 0003).
- **Rules as an API.** Approved rules are served as JSON, so any search engine can read them without the workflow touching the search system (decision 0004).

## What is confirmed

These come from the 19 test scenarios in [testing.md](testing.md), run in a local n8n with stand-ins for Claude and email:

- The workflow finds all 60 zero-result searches, handles 30 per run, and skips searches it has already handled.
- Every fix the owner sees has been re-run and returns products.
- If Claude fails for one search, that search is marked for manual review and the rest of the run continues.
- A wrong or reused link changes nothing, and two simultaneous submissions of one link produce only one decision. The first build failed this test (both decisions were saved), and the fix is now part of workflow 02.
- When the search service is down, the run stops and the owner gets an email naming the failed step.

## First live run with Claude (confirmed)

On 20 November 2026 the workflow ran on n8n Cloud with the real Claude (Claude Haiku 5.5, through n8n's built-in AI credits) over all 60 searches, in two runs of 30. Every row is in [data/live-run-2026-11-20.csv](data/live-run-2026-11-20.csv).

| Result | Count |
|---|---|
| Searches handled | 60 |
| Fix proposed and tested, returns products (sent for approval) | 46 |
| Fix proposed but still returns nothing (not sent) | 2 |
| No fix: not sold (5) or not a product search (2) | 7 |
| Claude returned an error or an unusable answer (sent for manual review) | 5 |

Causes Claude gave: brand or collection 23, too specific 18, wording 5, not sold 5, spelling 2, not a product search 2.

### Do the fixes return the right products?

"Returns products" is a low bar. Search Relevance Lab has human relevance labels for these exact searches, so I scored each of the 46 fixes with nDCG@10 against the labels of the original search ([scripts/score-rewrites.mjs](../scripts/score-rewrites.mjs)). As a baseline I used the simple fix from Search Relevance Lab: keep the shopper's words but let any word match instead of all of them.

| Fix | Mean nDCG@10 (46 searches) | Top-10 results with a label |
|---|---|---|
| Claude's rewrite (every word must match) | 0.566 | 68% |
| Original search, any word may match | 0.642 | 83% |

Claude's rewrite scored higher on 9 searches, lower on 18, and the same on 19.

What I take from it:

- **Confirmed:** on this catalogue, an AI rewrite per search did not beat a cheap change to the match rule. It lost more often than it won.
- **Confirmed:** 4 approved-looking fixes scored 0, for example "star wars rug" to "rug" and "donaldson teak couch" to "teak couch" (the first results were a console table and a coffee table).
- **Hypothesis:** part of the gap is measurement. Claude's rewrites return more products nobody labelled (68% labelled against 83%), and unlabelled results count as zero. The same bias was found for semantic search in Search Relevance Lab.
- **Hypothesis:** Claude's confidence carries some signal. Fixes with confidence 0.7 or more averaged 0.590, fixes at 0.4 or less 0.497. With 18 and 7 searches, that is too few to rely on.

## Hypotheses

- Claude's causes suggest most zero-result searches in this catalogue are brand, collection or model names (23 of 55 answered) or too specific (18), not products the shop lacks (5). These are Claude's labels, not checked by hand yet.
- "Not sold" searches are a demand signal worth sending to the buying team, the same way the Garage Quote Agent lists requests that match no price.
- A rewrite that returns products can still return the wrong products, as the live run showed. The owner's review is the guard for that, so the approval rate is the next number to watch.
- The best design may be both: relax the match rule for every search, and use Claude only for the searches that still fail, such as spelling and not-sold.

## What I learned as a PM

- Testing the AI's suggestion before a person sees it saves that person's time and makes them trust the list more.
- "One decision per link" sounds trivial until two clicks arrive at once. Testing the race found a real bug.
- Keeping the rules outside the search engine (an API the search reads) makes the workflow easy to adopt and easy to switch off.
- Compare an AI feature with the cheapest non-AI fix before shipping it. Here the cheap fix won, which I would not have known from the AI output alone. Every rewrite looked reasonable when read one by one.

## Known limitations

- The review form cannot show which search it belongs to. The owner relies on the email, where each link sits under its search.
- Rules match a search exactly. "Gurney Slade 56" and "gurney slade 56 pillow" are different searches.
- The demo checks only whether a rewrite returns products, not whether they are the right products.

## What I would do next

1. Test the combined design: any-word matching for every search, Claude only for the searches that still return nothing.
2. Ask Claude to keep the product type in every rewrite, and re-score.
3. Label a sample of the unlabelled results by hand, to put a number on the measurement gap.
4. Review the 46 fixes myself to get a first approval rate.
5. Show the search and proposed fix on the review form itself.
