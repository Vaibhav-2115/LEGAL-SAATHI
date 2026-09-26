# Task Completion Checklist & Commands

Run from `E:\Rox\LegalSaathi`:
1. `npm run lint` — ESLint validation must pass with zero critical errors.
2. `npx tsc --noEmit` — Type-checker must pass with no type errors.
3. Check Serena symbol references:
   - Verify modified/created symbols with `find_referencing_symbols` to prevent broken references.
4. Verify application build or dev server responsiveness if modifying core routes or layouts.
