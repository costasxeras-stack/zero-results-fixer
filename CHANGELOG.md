# Changelog

## 0.1.0 (20 November 2026)

### Added
- Six n8n workflows: setup, weekly scan, review form, rules API, weekly report and error alerts.
- Claude explains each zero-result search and proposes one rewrite. Every rewrite is tested before the owner sees it.
- Review form with approve, own rewrite or reject, protected by a one-off token. One decision per link.
- Setup guide, case study, product brief, four decision records and 19 test scenarios (all passed).

### Fixed (before release)
- Two submissions of the same review link at the same moment could both be saved. The save now only happens if the proposal is still pending.
