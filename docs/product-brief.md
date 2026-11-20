# Product brief

## Users

- **Shop owner or e-commerce manager:** approves fixes once a week from an email, in a few minutes.
- **Search or merchandising team:** reads the approved rules through the API and the "not sold" list as demand signals.
- **Hiring managers reading this portfolio:** want to see how I combine AI with human control in a real workflow.

## Goal

Turn "No results found" searches into tested fixes a person can approve in one click, without letting the AI change the shop on its own.

## In scope for 0.1.0

- Weekly scan of zero-result searches, with cause and rewrite from Claude.
- Each rewrite tested against the real search before the owner sees it.
- Review form with approve, own rewrite or reject. One decision per link.
- Approved rules served as JSON. Weekly report. Error alerts.

## Not in scope

- Applying rules inside a search engine (the search reads them from the API).
- Checking that rewrites return the right products, not just some products (planned).
- Grouping similar searches.
