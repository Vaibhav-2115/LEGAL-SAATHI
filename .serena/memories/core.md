# Legal Saathi — Core Architecture

- **Project Root**: `E:\Rox\LegalSaathi`
- **Application Goal**: AI-powered civic legal assistant for Indian citizens, providing statutory guidance, fact & evidence curation, timeline tracking, and case preparation under Indian laws (Consumer Protection Act 2019, RERA 2016, Motor Vehicles Act, Digital Personal Data Protection Act 2023, Bharatiya Nyaya Sanhita).
- **Core Memories**:
  - `mem:tech_stack` — framework, tools, styling, and dependencies.
  - `mem:conventions` — routes, code organization, naming conventions.
  - `mem:suggested_commands` — development, build, and shell commands.
  - `mem:task_completion` — verification and lint commands.

## Architecture Map
- `src/app/`: Next.js 16 App Router pages
  - `/` (`page.tsx`): Citizen Dashboard, quick intake, active case cards, legal domains.
  - `/chat` (`chat/page.tsx`): AI Chat consultation, voice/text intake, statutory citation panel, evidence checklist.
  - `/cases/[caseId]` (`cases/[caseId]/page.tsx`): Case Workspace, evidence locker, timeline, facts, statutory references, document generator.
  - `/complaints` (`complaints/page.tsx`): Citizen complaint registry, filtering, tracking.
- `src/components/`: Reusable UI elements (`Header`, `Footer`, `CaseJourney`, `CaseStatusBadge`).
- `src/context/`: Centralized reactive state (`LegalSaathiContext`).
- `src/lib/`: Domain data contracts (`types.ts`) and mock database (`mock-data.ts`).
