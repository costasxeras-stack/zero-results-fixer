# 0004: Serve approved rules as an API instead of writing into the search engine

**Status:** Accepted · 20 November 2026

## Context

Approved rewrites have to reach the shop's search. The workflow could write them into a specific search engine (Elasticsearch synonyms, Algolia rules), or publish them for the search to read.

## Decision

Workflow 03 returns all approved, active rules as JSON at one URL. The search engine, or a small job next to it, reads and applies them.

## Consequences

- Works with any search engine, and the workflow never needs write access to the search system.
- Switching the whole thing off is one setting: stop reading the URL.
- The shop needs a small piece of code to apply the rules. In this demo nothing applies them yet.
