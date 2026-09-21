You are working on the frontend of my existing Bakery Distribution Management System (BDMS).

## IMPORTANT — DO NOT MODIFY THE BACKEND

The backend is already completed, tested, and working.

**Do NOT:**

* modify backend files
* rewrite backend services
* rewrite backend repositories
* modify Prisma schema
* create new database tables
* create new Sales models
* create new Report models
* change existing backend business logic
* change existing Sales or Reports API behavior
* add duplicate backend functionality

Your job is **frontend integration only**.

You may only inspect the backend to understand the existing API routes and response structures.

---

# Project Context

The system is a Bakery Distribution Management System.

Frontend stack:

* React
* TypeScript
* Vite
* React Router
* Tailwind CSS
* shadcn/ui / Base UI
* native `fetch`
* ESLint

The frontend already has an existing structure. **Do not unnecessarily restructure the frontend.** Follow the existing architecture and naming conventions.

The frontend should consume the existing backend API.

---

# SALES MODULE

The backend Sales module already exists.

The Sales module is based on **completed deliveries**.

There is intentionally NO separate `Sale` database model.

The business flow is:

```text
Order
  ↓
Delivery
  ↓
Delivery COMPLETED
  ↓
Inventory deducted
  ↓
StockMovement OUT / SALE
  ↓
Sales data
```

Therefore, the frontend must treat completed deliveries as the source of sales information.

## Existing Sales API

Base URL:

```text
/api/sales
```

Sales Summary endpoint:

```http
GET /api/sales/summary
```

The backend returns the sales summary.

Current response structure:

```json
{
  "success": true,
  "data": {
    "completedDeliveries": 6,
    "totalQuantitySold": 21,
    "totalSales": 470
  }
}
```

The frontend should display these values appropriately.

For example:

* Completed Deliveries
* Total Quantity Sold
* Total Sales

Format `totalSales` as Philippine Peso where appropriate.

Do NOT calculate a different sales total in the frontend if the backend already provides the calculated value.

The backend is the source of truth.

---

# REPORTS MODULE

The backend Reports module already exists.

There are currently **7 reports**.

Do NOT create an Order Report at this time.

The existing reports are:

1. Sales Summary
2. Sales Details
3. Product Sales
4. Customer Sales
5. Inventory
6. Stock Movement
7. Delivery

---

# Existing Reports Routes

Base URL:

```text
/api/reports
```

## 1. Sales Summary

```http
GET /api/reports/sales/summary
```

Optional date filters:

```http
GET /api/reports/sales/summary?from=2026-09-01&to=2026-09-30
```

This report is based on completed deliveries and provides sales totals.

---

## 2. Sales Details

```http
GET /api/reports/sales/details
```

Optional:

```http
GET /api/reports/sales/details?from=2026-09-01&to=2026-09-30
```

This provides detailed information about completed deliveries, including customer and delivery items.

The frontend can display this as a table.

---

## 3. Product Sales

```http
GET /api/reports/sales/products
```

Optional:

```http
GET /api/reports/sales/products?from=2026-09-01&to=2026-09-30
```

This report shows sales grouped/based on products from completed deliveries.

The frontend should make the product information easy to understand, such as:

* Product
* Quantity Sold
* Sales/Subtotal

Do not invent fields that the backend does not return.

---

## 4. Customer Sales

```http
GET /api/reports/sales/customers
```

Optional:

```http
GET /api/reports/sales/customers?from=2026-09-01&to=2026-09-30
```

This report provides completed delivery/sales information associated with customers.

Possible frontend columns include the actual fields returned by the backend, such as:

* Customer
* Number of deliveries
* Quantity
* Sales

Do not assume or fabricate fields. Inspect the actual response.

---

## 5. Inventory Report

```http
GET /api/reports/inventory
```

This report returns current inventory information.

It includes the related product.

The frontend can display:

* Product
* Current Quantity
* Minimum Stock
* Stock status/indicator

If a stock status is derived in the frontend, keep the calculation purely presentational and do not change backend inventory logic.

---

## 6. Stock Movement Report

```http
GET /api/reports/stock-movements
```

Optional:

```http
GET /api/reports/stock-movements?from=2026-09-01&to=2026-09-30
```

This report contains stock movements.

Relevant backend concepts include:

```text
IN
OUT
ADJUSTMENT
```

and reasons such as:

```text
PURCHASE
SALE
DAMAGE
RETURN
MANUAL_ADJUSTMENT
```

Display the actual values returned by the backend.

---

## 7. Delivery Report

```http
GET /api/reports/deliveries
```

Optional:

```http
GET /api/reports/deliveries?from=2026-09-01&to=2026-09-30
```

This report includes deliveries regardless of whether they are:

```text
DRAFT
COMPLETED
CANCELLED
```

The frontend should display the delivery status clearly.

It may include:

* Delivery ID
* Customer
* Delivery Date
* Status
* Order
* Items
* Product
* Quantity
* Unit Price
* Subtotal

Only display fields that are actually returned by the backend.

---

# IMPORTANT DATE FILTER RULE

Reports that support date filtering use:

```text
from
to
```

Example:

```text
/reports/sales/details?from=2026-09-01&to=2026-09-30
```

The frontend should provide a simple date-filter UI.

For example:

```text
From: [ date ]
To:   [ date ]

[Apply Filter]
```

Do not send invalid date formats.

Use:

```text
YYYY-MM-DD
```

The backend already handles the date range.

---

# FRONTEND ARCHITECTURE

Follow the existing frontend architecture.

Prefer something similar to:

```text
client/src/
├── pages/
│   ├── sales/
│   └── reports/
├── services/
│   ├── sales.service.ts
│   └── reports.service.ts
├── types/
│   ├── sales.ts
│   └── reports.ts
└── ...
```

However, **inspect the existing project first**.

If the project already has an appropriate structure, use it instead of creating a completely different architecture.

Do not create unnecessary folders.

---

# API SERVICE RULE

Use the existing frontend API/fetch pattern.

The project uses native `fetch`.

Do NOT install Axios.

If an existing API helper/service exists, reuse it.

For example, the frontend should have functions conceptually like:

```ts
getSalesSummary()
```

```ts
getSalesDetails(from?, to?)
```

```ts
getProductSales(from?, to?)
```

```ts
getCustomerSales(from?, to?)
```

```ts
getInventoryReport()
```

```ts
getStockMovementReport(from?, to?)
```

```ts
getDeliveryReport(from?, to?)
```

Do not create duplicate API clients if one already exists.

---

# AUTHENTICATION

These endpoints are protected by the backend.

The frontend must use the existing authentication mechanism already implemented in the project.

Do NOT modify backend authentication.

Do NOT bypass authentication.

Do NOT hardcode tokens.

If the existing frontend already has an API helper that attaches the JWT, reuse it.

---

# UI REQUIREMENTS

Create a clean business-management interface appropriate for BDMS.

The Sales page should provide a clear overview.

For example:

```text
Sales
────────────────────────────────

Completed Deliveries     6

Quantity Sold           21

Total Sales          ₱470.00
```

Then reports can be presented through a Reports section.

Possible structure:

```text
Reports
├── Sales Summary
├── Sales Details
├── Product Sales
├── Customer Sales
├── Inventory
├── Stock Movements
└── Deliveries
```

Use tables for detailed reports.

Use cards/statistics for summary information.

Use date filters where supported.

---

# LOADING / ERROR / EMPTY STATES

Every API request should properly handle:

### Loading

Example:

```text
Loading report...
```

### Error

Display a user-friendly message.

Do not expose raw stack traces.

### Empty data

Example:

```text
No sales data found for the selected date range.
```

Do not treat an empty report as an application error.

---

# IMPORTANT DATA RULES

The backend is the source of truth.

Do NOT:

* invent sales
* invent report fields
* calculate a different sales total
* create a second sales system
* modify inventory from the frontend
* modify delivery completion logic
* create a Sale database model
* create an Order Report
* modify Prisma
* modify backend routes
* modify backend services

The frontend is responsible only for:

```text
Fetch
  ↓
Receive
  ↓
Type
  ↓
Display
  ↓
Filter/present
```

---

# DEVELOPMENT PROCESS

Before writing code:

1. Inspect the existing frontend structure.
2. Inspect existing API/fetch utilities.
3. Inspect existing authentication handling.
4. Inspect existing routing.
5. Inspect existing UI components.
6. Identify where Sales and Reports naturally belong.
7. Do not restructure unrelated frontend code.

Then implement incrementally.

After implementation:

```text
npm run lint
```

Then:

```text
npm run build
```

Both should pass.

---

# MOST IMPORTANT RULE

The backend is already completed and tested.

Treat the backend as **read-only** for this task.

Only integrate the frontend with these existing endpoints:

```text
GET /api/sales/summary

GET /api/reports/sales/summary
GET /api/reports/sales/details
GET /api/reports/sales/products
GET /api/reports/sales/customers
GET /api/reports/inventory
GET /api/reports/stock-movements
GET /api/reports/deliveries
```

Do not change the backend to make the frontend easier.

If the response structure is unclear, inspect the actual API response and adapt the frontend to it.

Do not guess and do not modify the backend.
