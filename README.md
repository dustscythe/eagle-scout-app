# Eagle Scout App

This monorepo contains the source code for the Eagle Scout mobile application and its supporting services.

## Packages

- `apps/mobile` – React Native (Expo) application for scouts, leaders, and project providers. Built with TypeScript.
- `apps/functions` – Supabase Edge Functions written in TypeScript for backend logic and signature processing.
- `packages/shared` – Shared code and Zod schemas used across apps and functions.

## Getting Started

This project uses PNPM for dependency management with a monorepo structure. To install dependencies:

```sh
pnpm install
```

See the individual package README files for more details.
