---
title: React Improvement Plans
description: "React Improvement Plans"
---

Plans generated from `/improve-react` audit on commit 605cf56.

See `../REACT_AUDIT_REPORT.md` for full findings and context.

## Execution Order

| #   | Plan                                                                                       | Category      | Severity | Status | Dependencies |
| --- | ------------------------------------------------------------------------------------------ | ------------- | -------- | ------ | ------------ |
| 001 | [Fix debounce timer leak](./001-fix-debounce-timer-leak.md)                                | Bugs          | HIGH     | TODO   | None         |
| 002 | [Fix ref mutation during render](./002-fix-ref-mutation-in-files-page.md)                  | Bugs          | MEDIUM   | TODO   | None         |
| 003 | [Optimize files listing filter](./003-optimize-files-filter-with-usememo.md)               | Performance   | HIGH     | TODO   | None         |
| 004 | [Extract inline functions to useCallback](./004-extract-inline-callbacks-in-files-page.md) | Performance   | HIGH     | TODO   | None         |
| 005 | [Add aria-labels to files page](./005-add-aria-labels-files-page.md)                       | Accessibility | MEDIUM   | TODO   | None         |

## Recommended Sequence

**Session 1** (2–3 hours, fixes top bugs):

1. Execute plan 001 (debounce timer leak)
2. Execute plan 003 (filter optimization)
3. Execute plan 004 (inline callbacks)
4. Run `npx react-doctor@latest --scope changed` and verify score improves

**Session 2** (1–2 hours, fixes render correctness):

1. Execute plan 002 (ref mutation)
2. Execute plan 005 (aria-labels)
3. Full test suite

## Quick Start

Each plan includes:

- **Problem**: Current code with exact line numbers
- **Target**: Exact end state (canonical fix)
- **Steps**: Ordered edits preserving behavior
- **Verification**: Mechanical (React Doctor, typecheck) + behavioral (what to test)

To execute a plan:

```bash
# Read the plan
cat plans/001-fix-debounce-timer-leak.md

# Follow the Steps section exactly
# Verify at the end
npx react-doctor@latest --scope changed
vp check
vp test
```

## Notes

- Plans are self-contained; executor has zero context from the audit conversation
- All fixes are behavior-preserving unless explicitly noted
- Mechanical verification uses `npx react-doctor@latest --scope changed`
- Behavioral verification uses browser testing or React DevTools Profiler
- If code has drifted from commit 605cf56, report the drift instead of improvising

## Related

- Audit report: `../REACT_AUDIT_REPORT.md`
- Full diagnostic run: `npx react-doctor@latest apps/web --verbose`
- React Doctor docs: https://react.doctor/docs
