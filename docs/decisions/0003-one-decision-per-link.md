# 0003: One-off tokens and one decision per link

**Status:** Accepted · 20 November 2026

## Context

The review form is a public URL. Anyone who guesses a proposal ID could approve a fix. An owner could also double-click or open the same link twice.

## Decision

- Each proposal gets a random token, and the link must carry both the ID and the token.
- A decision is saved only if the proposal is still `pending`. The update itself checks the status, so two submissions arriving at the same moment cannot both count.

## Consequences

- A forwarded email lets the recipient decide too. Acceptable for a small shop, and the decision is logged with a time.
- The first build checked the status before saving, in a separate step. A test with two simultaneous submissions saved both decisions. Moving the check into the update fixed it.
