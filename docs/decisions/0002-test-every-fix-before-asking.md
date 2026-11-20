# 0002: Test every fix before the owner sees it

**Status:** Accepted · 20 November 2026

## Context

Claude can propose a rewrite that still returns nothing. Sending those to the owner wastes their time and makes the whole list look unreliable.

## Decision

Every rewrite is run against the same search engine before the email is built. Rewrites that still return nothing are marked `fix_failed_test` and listed at the end of the email, without a review link. The email also shows how many products each fix finds and the first one.

## Consequences

- One extra search per proposal.
- The owner only reviews fixes that work at least technically.
- "Returns products" is not "returns the right products". The owner's review and the product shown in the email cover that until relevance scoring is added.
