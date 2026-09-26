# Conventions & Ponytail Engineering Invariants

## Architecture & Code Organization
- **Next.js App Router**: Route segments located in `src/app/`.
  - `/` -> Landing / Citizen intake & dashboard (`src/app/page.tsx`)
  - `/chat` -> Legal Saathi interactive AI consultation workspace (`src/app/chat/page.tsx`)
  - `/cases/[caseId]` -> Deep-dive case workspace (`src/app/cases/[caseId]/page.tsx`)
  - `/complaints` -> Citizen filed complaints / case registry (`src/app/complaints/page.tsx`)
  - `/sources`, `/sources/[id]` -> Statutory grounding & authority catalog
  - `/cases/[caseId]/evidence` -> Dedicated evidence dossier
  - `/actions`, `/actions/efir` -> Practical action center & police reporting
  - `/draft/legal-notice`, `/draft/rti` -> Pre-litigation notice & RTI builders
  - `/dlsa`, `/voice` -> Free legal aid & multilingual speech assistant
- **Shared Components**: Kept in `src/components/`.
- **Domain State**: Managed via `LegalSaathiContext` (`src/context/LegalSaathiContext.tsx`) consuming mock data from `src/lib/mock-data.ts`.
- **Types**: Unified interfaces and enums defined in `src/lib/types.ts`.

## Core Development Workflow (Mandatory for Every Task)
1. **Understand**: Clarify requirements and trace real problem flow.
2. **Inspect**: Use Serena to discover existing symbols, classes, functions, and files.
3. **Trace**: Check symbol references (`find_referencing_symbols`) before touching anything.
4. **Consult External Docs**: Check Context7 (`resolve-library-id`, `query-docs`) when dealing with external libraries/framework APIs.
5. **Implement**: Smallest correct change; reuse existing utilities; avoid unnecessary abstractions.
6. **Re-Check**: Use Serena to verify modified and referencing symbols.
7. **Validate**: Run `npx tsc --noEmit` and `npm run lint`.
8. **Fix**: Address root causes, not symptoms.
9. **Verify**: Ensure build, responsiveness, and existing features work end-to-end.

## Ponytail Rules
- Prefer existing code over new code.
- Avoid unnecessary abstractions and dependencies.
- Make the smallest correct change.
- Fix root causes rather than symptoms.
- Do not modify unrelated code.
- Never guess when the project can be inspected.
