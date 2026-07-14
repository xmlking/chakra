---
title: 001 — Fix debounce timer leak in useSearch hook
description: 001 — Fix debounce timer leak in useSearch hook
---

- **Status**: TODO
- **Commit**: 605cf56
- **Severity**: HIGH
- **Category**: Bugs & correctness
- **Rule**: react-doctor/no-impure-state-updater
- **Estimated scope**: 1 file, ~20 LOC change

## Problem

The `handleSearch` callback returns a cleanup function but the cleanup is never called by the onChange handler. When a user types rapidly, timers accumulate without being cleaned up, causing multiple stale debounced values to be set after the user has moved on. This breaks debounce behavior and causes race conditions.

Current code at `src/features/files/hooks/useSearch.ts:9-16`:

```typescript
const handleSearch = useCallback((value: string) => {
  setQuery(value);

  const timer = setTimeout(() => {
    setDebouncedQuery(value);
  }, DEBOUNCE_DELAY);

  return () => clearTimeout(timer); // Never called!
}, []);
```

Impact: Per-keystroke during search. Each keystroke leaves an orphaned timer. With 100 chars/sec, accumulates 30+ uncleaned timers during debounce period, causing stale state updates.

## Target

Move timer and debounce logic into a `useEffect` that runs when `query` changes. The effect cleanup will properly cancel stale timers:

```typescript
const [query, setQuery] = useState("");
const [debouncedQuery, setDebouncedQuery] = useState("");

const handleSearch = useCallback((value: string) => {
  setQuery(value);
}, []);

useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedQuery(query);
  }, DEBOUNCE_DELAY);

  return () => clearTimeout(timer);
}, [query]);
```

## Repo conventions to follow

- Use `useCallback` for handlers that don't have dependencies (handleSearch takes the value directly from the event)
- Use `useEffect` for side effects like timers; effect cleanup always runs on unmount or dependency change
- Follow the naming: `useSearch` is a data hook that returns state and handlers
- Preserve the exported API: `{ query, debouncedQuery, handleSearch, clear }`

Exemplar: Look at `src/lib/auth.middleware.ts` for similar effect cleanup patterns with timers.

## Steps

1. Open `src/features/files/hooks/useSearch.ts`
2. Replace the `handleSearch` callback definition (lines 9-17) with a pure callback that only calls `setQuery`:
   ```typescript
   const handleSearch = useCallback((value: string) => {
     setQuery(value);
   }, []);
   ```
3. Add a new `useEffect` after state declarations (after line 7) that handles debouncing:

   ```typescript
   useEffect(() => {
     const timer = setTimeout(() => {
       setDebouncedQuery(query);
     }, DEBOUNCE_DELAY);

     return () => clearTimeout(timer);
   }, [query]);
   ```

4. Verify the `clear` function still works (it should; it just resets both states).
5. Delete the old `useEffect` if one exists; the new one replaces it.

## Boundaries

- Do NOT change the exported API (`query`, `debouncedQuery`, `handleSearch`, `clear`)
- Do NOT add dependencies beyond `[query]`
- Do NOT change `DEBOUNCE_DELAY`
- Keep the callback in `useCallback` so handlers don't get recreated

## Verification

- **Mechanical**:
  - `npx react-doctor@latest --scope changed` clears the `no-impure-state-updater` diagnostic for this file
  - `vp check` (typecheck, lint, format) passes
  - Run `vp test` if tests exist for this hook
- **Behavior check**:
  - Navigate to `/files` in the app
  - Type in the search box (type at normal speed, then pause)
  - Open React DevTools → Profiler → Record a session while typing
  - Confirm: Only ONE `setDebouncedQuery` call fires after the debounce delay (300ms), not multiple stale ones
  - Search results update correctly and don't show flickering or stale results
- **Done when**: The diagnostic clears, typecheck passes, and the Profiler shows only one debounced update per pause
