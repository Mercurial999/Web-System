# Frontend Recommendations

## Current Assessment

The frontend now has the main operational routes and service boundaries expected by the roadmap. The backend uses `customers` for bakery stores, so the UI should keep the technical name `Customers` while using business language such as bakery store in descriptions.

## Structure Decisions

- Keep one page per operational module under `src/pages`.
- Keep API calls in `src/services`; pages should only coordinate state and presentation.
- Keep all shared contracts in `src/types`, including products.
- Use `src/components/common` for repeated page headers, status badges, statistic cards, tables, and feedback states.
- Keep `DashboardLayout` for protected pages and `AuthLayouts` for public authentication pages.
- Keep each page beside its feature: `pages/dashboard`, `pages/products`, `pages/inventory`, `pages/customers`, `pages/deliveries`, `pages/reports`, `pages/users`, and `pages/roles`.
- Keep authentication pages under `pages/auth`.
- Avoid top-level page files. The top level of `pages` should contain only feature folders.

## UI Standards

- Use a warm bakery-inspired neutral palette with amber as the action color and green/red reserved for operational status.
- Keep page headers consistent: eyebrow, title, short description, and optional action.
- Use bordered surfaces for tables and forms, with one level of visual containment only.
- Use status badges instead of plain uppercase status text.
- Every API-backed page should expose loading, empty, error, and success states.
- Keep tables horizontally scrollable on small screens and preserve readable column spacing.
- Use whole-number quantity controls for delivery items because the business does not sell partial quantities.
- Use icons only when a familiar symbol improves scanning; keep text labels for important business actions.

## Recommended Next Improvements

1. Done: product editing is available from the Products page. User and role editing remains a later administrative refinement.
2. Deferred: add a dedicated multi-item order workspace before delivery creation when multi-item deliveries become common.
3. Done: recent stock movement history is available on the Inventory page.
4. Done: the backend exposes authenticated permissions and the sidebar filters navigation items accordingly.
5. Next: add browser-level smoke tests for login, customer creation, and delivery completion.
6. Next: replace broad page-level fetches with a small request-state helper if loading patterns continue to repeat.
7. Applied: reports remain focused on operational totals and delivery status rather than decorative charts.

## Local Connection

- Backend API: `http://localhost:5000`
- Frontend: `http://localhost:5174/` when port `5173` is already occupied
- Login route: `/login`
- The local PostgreSQL database is configured through the server `.env` file and was verified reachable on port `5432`.
- The administrator login and dashboard summary endpoint were verified successfully.

## Verification

Run these commands from `client` after meaningful UI changes:

```text
npm run lint
npm run build
```
