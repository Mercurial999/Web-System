# Frontend Sales and Reports Suggestions

These are follow-up improvements that can be added without changing the backend contracts or introducing new database models.

## Recommended next steps

- Add CSV export for the currently selected report, using the rows already loaded by the report page.
- Add a shared report table component when another report needs the same sorting or pagination behavior.
- Add route-level permission checks for Sales and Reports if the backend exposes separate permissions in the future.
- Add focused tests for date-range query construction, currency formatting, and empty/error states.
- Add request cancellation with `AbortController` if users commonly switch report tabs while a request is still loading.
- Consider server pagination before reports grow large; the current UI intentionally renders the complete response because the existing endpoints do not expose pagination parameters.

## Current integration boundaries

- Sales reads `GET /api/sales/summary` and treats completed deliveries as the source of truth.
- Reports reads the seven existing report endpoints under `/api/reports`.
- Date filters send only valid `YYYY-MM-DD` input as `from` and `to` query parameters.
- The client does not calculate or mutate sales, inventory, delivery, or stock movement data.