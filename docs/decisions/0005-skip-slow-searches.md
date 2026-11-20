# 0005: Skip a search that times out instead of failing the run

**Status:** Accepted · 20 November 2026

## Context

In the first live run, the demo search service (on Render's free plan) slowed down under steady load. One search took longer than 60 seconds, and because the request step stopped on errors, the whole weekly run failed and nothing was saved.

## Decision

The "Run each search" step continues when a request fails after its retries. A search with no answer is treated as unknown, not as a zero-result search, so it is skipped this week and checked again next week. Requests are also sent one at a time.

## Consequences

- One slow search cannot cost the owner a whole week of proposals.
- A search that always times out would never be checked. The run history shows these, and a real shop's search should answer much faster than a free demo service.
