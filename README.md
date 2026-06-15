# SEITA — Web (React + TS + MUI + Vite)

Modernized front-end for **SEITA**, InterTech Americas' event-control & logistics
platform for the paper / pulp / tissue / packaging industry. Rewrite of the legacy
Nuxt 2 + Vuetify app. UI is **Spanish**; code identifiers are **English**.

Derived from the `Design System/` in this repo (tokens, components, assets) and
its `PROMPT_React_MUI.md` spec.

## Stack

React 18 · TypeScript · Vite · React Router v6 · MUI v5 (Emotion) ·
TanStack Query · Zustand · React Hook Form + Zod · Axios · Material Design Icons.

## Run

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
npm run preview    # serve the production build
```

Demo login: any credentials work. `julia.marin@intertech.com` / `demo1234` is
pre-filled. All data is seeded into **localStorage** on first run.

## Architecture — feature-modular Clean Architecture

```
src/
├── app/            # bootstrap: providers, router, RequireAuth, ProtectedLayout, error boundaries
├── theme/          # MUI theme + design tokens (tokens.ts ↔ styles/global.css)
├── lib/            # transversal: config, http (axios), queryClient, format, db (seeded localStorage engine)
├── components/ui/  # transversal MUI wrappers (no domain logic)
├── layouts/        # AppShell (TopNav) + AuthLayout
├── styles/         # global.css — design tokens as CSS vars + base reset
└── modules/<name>/ # one module per domain, three layers:
    ├── domain/           # models + Zustand store + Gateway INTERFACE — no React/MUI/HTTP
    ├── infrastructure/   # StorageGateway (demo) + HttpGateway (prod) + DTO mapping
    ├── presentation/     # React/MUI: pages, components, hooks, routes
    └── index.ts          # public API — import modules ONLY from here
```

**Dependency rule:** `presentation → domain ← infrastructure`. The domain layer
imports nothing from React/MUI/Axios. Import alias: `@` → `src` (e.g. `@/lib`,
`@/modules/auth`).

### Gateway swap (demo ↔ production)

Each module defines a `Gateway` interface in `domain/` and two implementations in
`infrastructure/`: a `StorageGateway` (localStorage) and an `HttpGateway` (Axios).
The binding (`infrastructure/index.ts`) picks one based on `VITE_GATEWAY`
(`storage` default, or `http`). `domain/` and `presentation/` never change.

```bash
# .env
VITE_GATEWAY=http
VITE_API_BASE_URL=https://api.example.com
```

### Demo persistence

`lib/db.ts` is a single seeded localStorage database (mirrors the legacy data
store) with realistic paper-industry congress data. Each module's
`StorageGateway` reads its slice and maps the raw rows → its own domain models, so
the domain layer never sees the persistence shape. `db.reset()` re-seeds.

## Status

Foundation + all core modules are built and the production build is green
(`npm run build`). Modules:

- **auth** — `/login` (session bootstrap + route guard), `/perfil` (edit profile + change password)
- **dashboard** — `/panel` (greeting, próximo-evento banner, notes)
- **events** — `/eventos` (list + delete), `/eventos/crear` (2-step wizard), `/eventos/:id` (detail with 9 nested-route tabs: Inicio, Registro, Productos, Paquetes, Campañas, Habitaciones, Hoteles, Proveedores, Facturas)
- **plants** — `/plantas` (directory) + `/plantas/:id` (Ver más, duplicar, Contactos / Historial)
- **catalogs** — `/catalogos` (tabbed CRUD: países, industrias, tipos, fuentes, asociaciones)
- **users** — `/usuarios`; **productTypes** — `/tipos-producto`; **settings** — `/configuracion`

Every module ships both a `StorageGateway` (localStorage demo) and an `HttpGateway`
(Axios), swapped by `VITE_GATEWAY`.

**Pending:** wire a real backend (`VITE_GATEWAY=http`), inline edit for
products/packages/campaigns (create + delete exist today), and optional
code-splitting (single bundle is ~800 kB).
