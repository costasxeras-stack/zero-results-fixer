# 0006: Use n8n's own nodes instead of Code nodes

**Status:** Accepted · 22 November 2026

## Context

Version 0.1 had 10 Code nodes across workflows 01 to 04. They filtered searches, skipped searches seen before, shaped Claude's answer, decided each proposal's status, checked review links and built the emails. Each one worked, but on the canvas it was a black box. To see what "Skip searches seen before" did, you had to open it and read JavaScript.

The people who would run this in a shop are owners and ops staff, not developers. They should be able to open a step and see the rule.

## Decision

Replace every Code node with n8n's own nodes, keeping the same behaviour:

- Filter for "keep test searches", "keep zero-result searches" and "real rows"
- Compare Datasets to skip searches already handled, then Remove Duplicates and Limit
- Edit Fields (Set) to read Claude's answer, shape each proposal and decide its status
- Merge to join each proposal with its test result by position
- Sort and Aggregate to build one email with fixes to approve first
- Summarize to count causes and statuses for the weekly report
- If nodes for each check on a review link, with one message step per problem

Short expressions inside these nodes are fine (a ternary for the status, a `map` to write a list). The test is that the step's purpose can be read on the canvas without opening it.

## Consequences

- Workflow 01 grew from 18 to 26 steps. Grouping the canvas into three stages (find searches, ask Claude and test, email the owner) keeps it readable.
- Every Code node is gone from this project. The run history now shows the data after each rule, which makes debugging easier.
- One behaviour changed: "Skip searches seen before" now matches the exact search text. Version 0.1 ignored upper and lower case. The demo searches are all lower case, so the results are the same.
- When there is nothing new, workflow 01 sends no email, as before. The "Anything new?" check could never be false, so it was removed.
- Anyone using v0.1 needs to re-import workflows 01 to 04. Data tables and settings do not change.
