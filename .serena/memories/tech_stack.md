# Tech Stack

- **Framework**: Next.js 16.3.5 (App Router, Turbopack for dev)
- **UI Library**: React 19.2.8 / React-DOM 19.2.8
- **Language**: TypeScript 5 (strict mode enabled, bundler module resolution, path alias `@/*` -> `./src/*`)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss` 4.x, PostCSS 8) with CSS variable color tokens in `src/app/globals.css`
- **Typography & Icons**: Google Fonts (`Inter`, `Manrope`), Google Material Symbols Outlined
- **State Management**: React Context (`LegalSaathiProvider` in `src/context/LegalSaathiContext.tsx`)
- **Package Manager / Runtime**: Node.js v20+ / npm (see `package-lock.json`)
- **Linting**: ESLint 9 with `eslint-config-next`
