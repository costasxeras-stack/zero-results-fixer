# Changelog

## [0.1.1] (20 November 2026)

### Added
- Results of the first live run with Claude on n8n Cloud: all 60 searches, in `docs/data/live-run-2026-11-20.csv`, and a script that scores the fixes against Search Relevance Lab's relevance labels.
- Case study section with the live results. Claude's fixes scored lower than a simple any-word search (mean nDCG@10 0.566 against 0.642).

### Fixed
- One slow search no longer fails the whole weekly run. It is skipped and checked again next week.
- Searches are sent one at a time with a 60-second limit, and the first request retries 5 times while the free search service wakes up.
- The message for a failed Claude answer no longer claims Claude was unreachable when it answered in the wrong format.

## [0.1.0] (20 November 2026)

### Added
- Six n8n workflows: setup, weekly scan, review form, rules API, weekly report and error alerts.
- Claude explains each zero-result search and proposes one rewrite. Every rewrite is tested before the owner sees it.
- Review form with approve, own rewrite or reject, protected by a one-off token. One decision per link.
- Setup guide, case study, product brief, four decision records and 19 test scenarios (all passed).

### Fixed (before release)
- Two submissions of the same review link at the same moment could both be saved. The save now only happens if the proposal is still pending.
