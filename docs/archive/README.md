# Archive

This directory holds material that has been relocated out of the repository
root for organization, not deleted and not demoted in the sense of being
disowned.

Three things apply to everything under here:

- **Preserved for provenance and history.** Nothing here was removed because
  it was wrong; it was moved because it no longer belonged at the repository
  root. `git log --follow` recovers the full history of any file moved here.
- **Archive placement is not canonical research authority.** Being kept in
  this repository does not make a file's content current, endorsed, or
  authoritative. `MATH_CLAIMS.md` remains the sole authority for every
  mathematical claim, regardless of where any other file sits.
- **A file must not be treated as a current claim merely because it is
  retained.** If something here states a result, check whether that result
  has a corresponding row in `MATH_CLAIMS.md` before relying on it. If it
  does not, treat it as historical or exploratory, not as an active finding.

## Layout

```
dev-tools/                small ad-hoc scripts used during development,
                          never part of the tracked pipeline or test suite
extraction-2026-08-04/    files extracted from index.html during a specific
                          session; grouped by the date they were archived
```
