# Case study: fixing "No results found" searches with Claude and a human approval step

Version 0.1.0 · 20 November 2026

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

## What is not measured yet

The stand-in for Claude is a few simple rules. It shows that the workflow runs correctly, not that Claude's answers are good. The first live run with Claude will answer:

| Question | Result |
|---|---|
| Of the 60 searches, how many get a rewrite that returns products? | [to fill after the first live run] |
| How many of those rewrites would I approve? | [to fill] |
| Which causes are most common? | [to fill] |
| How often does Claude call something "not sold" that the shop does sell? | [to fill] |

## Hypotheses

- Most zero-result searches in this catalogue are brand, collection or model names, not products the shop lacks. Search Relevance Lab's own analysis points this way, but this workflow has not measured it yet.
- "Not sold" searches are a demand signal worth sending to the buying team, the same way the Garage Quote Agent lists requests that match no price.
- A rewrite that returns products can still return the wrong products. The owner's review is the guard for that, so the approval rate is the first number to watch.

## What I learned as a PM

- Testing the AI's suggestion before a person sees it saves that person's time and makes them trust the list more.
- "One decision per link" sounds trivial until two clicks arrive at once. Testing the race found a real bug.
- Keeping the rules outside the search engine (an API the search reads) makes the workflow easy to adopt and easy to switch off.

## Known limitations

- The review form cannot show which search it belongs to. The owner relies on the email, where each link sits under its search.
- Rules match a search exactly. "Gurney Slade 56" and "gurney slade 56 pillow" are different searches.
- The demo checks only whether a rewrite returns products, not whether they are the right products.

## What I would do next

1. Run it live with Claude on the 60 searches and fill in the table above.
2. Score rewrites against Search Relevance Lab's relevance labels, so "returns the right products" is measured, not just "returns products".
3. Show the search and proposed fix on the review form itself.
4. Group near-identical searches so one approval covers them all.
