# 0001: The AI suggests, a person approves every fix

**Status:** Accepted · 20 November 2026

## Context

Claude could apply its rewrites directly. That would be faster, but a wrong rewrite changes what every shopper sees for that search, and nobody would notice until sales dropped.

## Decision

No fix reaches the shop without a person's approval. Claude's confidence only sets the order of the list in the email. It never decides on its own.

## Consequences

- The owner spends a few minutes a week on approvals.
- The approval rate becomes a measure of how good the AI's suggestions are.
- Once the approval rate is known to be high for one cause (for example spelling), auto-approval for that cause could be a later decision with its own record.
