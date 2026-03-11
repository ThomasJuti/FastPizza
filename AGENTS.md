# Agent Guide for fast-pizza

This file is for coding agents working in this repository. It summarizes how to
build, lint, test, and the local code style that should be preserved.

## Project Snapshot
- Stack: Ionic 8 + Angular 20 (standalone components) + Firebase.
- Language: TypeScript (strict) + SCSS.
- App type: Angular application (not a library).

## Commands
Install:
- `npm install`

Dev server:
- `npm run start` (alias for `ng serve`)
- `ionic serve` also works (documented in README).

Build:
- `npm run build` (production build via `ng build`)
- `npm run watch` (dev build with watch)

Lint:
- `npm run lint` (Angular ESLint)

Tests:
- `npm run test` (Karma + Jasmine, Chrome)
- CI-style run: `ng test --configuration=ci` (watch off)

Single test / focused test:
- `ng test --include=src/app/path/to/file.spec.ts`
- `ng test --include=**/login.page.spec.ts`

Notes:
- The test runner is Karma with Jasmine (`karma.conf.js`).
- Coverage is enabled by default and outputs to `coverage/app`.

## Repository Rules (Cursor/Copilot)
- No Cursor rules found in `.cursor/rules/` or `.cursorrules`.
- No Copilot rules found in `.github/copilot-instructions.md`.

## TypeScript and Angular Style
General:
- Use TypeScript strict mode; avoid `any` unless unavoidable.
- Use `async/await` for Firebase calls and keep return types explicit.
- Prefer `inject()` for DI over constructor injection (existing pattern).
- Standalone components are the default; include `standalone: true`.
- Component classes end with `Page` or `Component` (enforced by ESLint).

Selectors and naming:
- Component selectors: `app-...` in kebab-case.
- Directive selectors: `app...` in camelCase.
- Files: kebab-case (e.g., `login.page.ts`, `auth.service.ts`).
- Classes: PascalCase; variables and methods: camelCase.

Imports:
- Prefer single-quoted imports.
- Group imports by origin: Angular, Ionic/third-party, then local `../`.
- Keep import lists tidy; avoid unused imports.
- VS Code auto-import excludes `@ionic/angular` and `@ionic/angular/common`.

Formatting:
- Preserve the existing indentation style (4 spaces in TS files).
- Use semicolons and trailing commas where already used.
- Keep object literals and arrays vertically aligned when long.

## Component Patterns
- Standalone pages declare `imports` explicitly in `@Component`.
- Use Ionic standalone modules from `@ionic/angular/standalone`.
- Prefer property initialization in the class body (not in constructor).
- Keep UI state (loading, error messages) local to the page component.

## Services and Data Access
- Services are provided in root via `@Injectable({ providedIn: 'root' })`.
- Firebase Auth/Firestore calls are made in services.
- Expose RxJS `Observable` streams when it benefits component reactivity.
- When using `Observable`, keep `.pipe()` chains readable and typed.

## Error Handling
- Catch async errors, map them to user-friendly messages, and display in UI.
- For Firebase errors, use `error.code` when available.
- Always reset loading flags in `finally` blocks.

## Types and Models
- Use explicit interfaces in `src/app/models` for domain data.
- Avoid inline type literals for shared shapes; reuse models instead.
- Use union types for roles or statuses (e.g., `'user' | 'admin'`).

## Routing and Guards
- Routes are defined in `src/app/app.routes.ts` and `src/app/tabs/tabs.routes.ts`.
- Guards live in `src/app/guards` and should stay small and focused.
- Prefer early returns for guard failures.

## SCSS and Styling
- Global styles: `src/global.scss` and `src/theme/variables.scss`.
- Page-level styles live alongside the page (`*.page.scss`).
- Keep CSS variables in theme files; do not scatter new globals.

## Testing Guidelines
- Specs live next to the file under test as `*.spec.ts`.
- Use Jasmine expectations and keep tests deterministic.
- If a test needs async Firebase behavior, mock services in TestBed.

## Environment Configuration
- Sensitive config lives in `src/environments/environment.ts`.
- `environment.prod.ts` is used for production builds.
- Do not commit real secrets; use placeholders for API keys.

## File Layout
- Pages: `src/app/pages/...` (standalone components).
- Services: `src/app/services/...`.
- Models: `src/app/models/...`.
- Guards: `src/app/guards/...`.

## Quick Do / Avoid
Do:
- Match existing patterns for `inject()`, `user$`/`userProfile$` observables.
- Keep UI state changes localized and predictable.
- Use `Partial<T>` for update payloads in Firestore.

Avoid:
- Introducing new formatting tools (no Prettier setup exists).
- Changing selectors or suffix conventions (ESLint will fail).
- Mixing tabs and spaces or changing indentation style.

## Helpful References
- Lint config: `.eslintrc.json`.
- Angular config: `angular.json`.
- Test runner: `karma.conf.js`.
