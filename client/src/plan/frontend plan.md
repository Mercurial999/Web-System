I am building a Bakery Distribution Management System (BDMS) frontend for a real medium-sized bakery-ingredient distribution business.

Project

Project path:

C:\Users\RENZ\Desktop\Web System\

Frontend:

C:\Users\RENZ\Desktop\Web System\client

Backend:

C:\Users\RENZ\Desktop\Web System\server

The frontend is a medium-sized React + TypeScript application. I want it to be clean, maintainable, scalable, and practical without unnecessary enterprise-level complexity.

Technology Stack

Frontend:

React
TypeScript
Vite
React Router
Tailwind CSS v4
shadcn/ui
Base UI
Lucide icons through the shadcn ecosystem
Native fetch
ESLint

Important decisions:

Do NOT use Axios.
Use native fetch through a centralized API helper.
Use shadcn/ui for reusable UI components.
Use Tailwind CSS for page/layout styling.
Keep the architecture medium-sized and understandable.
Avoid over-engineering.
Prefer lesson-style implementation rather than dumping entire modules.
Explain WHY something is being done before introducing it.
Give exact file paths and exact code when implementing something.
After each major step, run npm run build and verify it before proceeding.
Current Frontend Structure

The intended structure is:

client/

client/
├── public/
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   └── card.tsx
│   │   │
│   │   └── common/
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── AuthProvider.tsx
│   │   └── useAuth.ts
│   │
│   ├── layouts/
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── lib/
│   │   ├── api.ts
│   │   ├── storage.ts
│   │   └── utils.ts
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Products.tsx
│   │   ├── Inventory.tsx
│   │   ├── Customers.tsx
│   │   └── Deliveries.tsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── services/
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   ├── inventoryService.ts
│   │   ├── customerService.ts
│   │   └── deliveryService.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── product.ts
│   │   ├── inventory.ts
│   │   ├── customer.ts
│   │   └── delivery.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .env
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts
Styling/UI Architecture

Tailwind CSS v4 is configured through Vite.

vite.config.ts contains:

React plugin
React compiler
Tailwind Vite plugin
@ alias pointing to src

The alias is:

@/* → src/*

Therefore imports should use:

import { Button } from "@/components/ui/button";

instead of long relative paths.

shadcn/ui is configured with:

Base UI
Nova preset
Tailwind v4
@ import alias

Installed shadcn components:

Button
Input
Label
Card

Required dependencies currently include:

@base-ui/react
class-variance-authority
Authentication Architecture

Authentication is already partially implemented.

Backend endpoint:

POST /api/auth/login

The backend returns:

{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "...",
    "user": {
      "id": 1,
      "roleId": 1,
      "firstName": "Juan",
      "lastName": "Dela Cruz",
      "email": "juan@gmail.com",
      "phone": "09123456789",
      "status": "ACTIVE",
      "createdAt": "...",
      "updatedAt": "...",
      "role": {
        "id": 1,
        "name": "Administrator",
        "description": "Full system access",
        "createdAt": "...",
        "updatedAt": "..."
      }
    }
  }
}

Frontend auth types are in:

src/types/auth.types.ts

Current main types:

AuthRole
AuthUser
LoginCredentials
LoginResponse
Auth Context

AuthContext.tsx defines:

user
token
isAuthenticated
login()
logout()

AuthProvider.tsx is responsible for maintaining authentication state.

Important architectural decision:

AuthProvider should NOT directly call the login API.

Instead:

Login.tsx
   ↓
authService.login()
   ↓
backend
   ↓
LoginResponse
   ↓
AuthProvider.login(token, user)

This keeps API communication separate from authentication state management.

Storage

Authentication data is stored through:

src/lib/storage.ts

Current storage keys:

bdms_token
bdms_user

The storage helper provides:

getToken()
setToken()
removeToken()

getStoredUser()
setStoredUser()
removeStoredUser()

clearAuthStorage()

The AuthProvider restores the token/user from localStorage when the application starts.

API Layer

Central API communication is located at:

src/lib/api.ts

The API base URL is:

VITE_API_URL=http://localhost:5000/api

The API helper uses native fetch.

It automatically:

Adds Content-Type: application/json
Reads the JWT from localStorage
Adds:
Authorization: Bearer <token>

when a token exists

Parses the JSON response
Throws an error when the HTTP response is not successful

Services such as:

authService.ts
productService.ts
inventoryService.ts
customerService.ts
deliveryService.ts

should use the centralized API helper rather than calling fetch independently everywhere.

Current Login Page

The Login page is:

src/pages/auth/Login.tsx

It currently has:

BDMS Login heading
Description
Email input
Password input
Login button
shadcn Card
shadcn Input
shadcn Label
shadcn Button

The UI currently works visually.

The next task is to make the form functional.

Authentication Flow We Want

The final login flow should be:

User visits /login
        ↓
Login page displayed
        ↓
User enters email/password
        ↓
Submit form
        ↓
Login.tsx calls authService.login()
        ↓
POST /api/auth/login
        ↓
Backend validates credentials
        ↓
Backend returns token + user
        ↓
Login.tsx calls AuthProvider.login()
        ↓
Token/user saved to localStorage
        ↓
Auth state becomes authenticated
        ↓
Navigate to dashboard

Failed login:

Backend returns error
        ↓
Login.tsx catches error
        ↓
Display user-friendly error message
        ↓
Stay on login page
Routing Architecture

We will use React Router.

Public route:

/login

Protected routes:

/
 /dashboard
 /products
 /inventory
 /customers
 /deliveries

The architecture should eventually be:

AppRoutes
│
├── Public
│   └── /login
│
└── ProtectedRoute
    │
    └── MainLayout
        ├── Dashboard
        ├── Products
        ├── Inventory
        ├── Customers
        └── Deliveries

Unauthenticated users attempting to access protected pages should be redirected to:

/login

Authenticated users visiting /login should eventually be redirected to the dashboard.

Layout Architecture
AuthLayout

Used for authentication pages:

/login

Purpose:

Center authentication content
Provide consistent authentication page styling
Keep authentication UI separate from the main application
MainLayout

Used for authenticated application pages.

Expected structure:

┌──────────────────────────────────────────────┐
│                  Header                      │
├───────────────┬──────────────────────────────┤
│               │                              │
│   Sidebar     │       Page Content           │
│               │                              │
│ Dashboard     │                              │
│ Products      │                              │
│ Inventory     │                              │
│ Customers     │                              │
│ Deliveries    │                              │
│               │                              │
│               │                              │
│ Logout        │                              │
└───────────────┴──────────────────────────────┘

The existing dashboard CSS is currently still present in index.css. It should not be unnecessarily deleted while we transition toward the new Tailwind/shadcn layout.

Planned Frontend Development Roadmap
Phase 1 — Authentication Foundation

Current progress:

Auth types

AuthContext

AuthProvider

useAuth hook

Local storage helper

API helper

authService

Tailwind

shadcn

Login UI

Next:

Login form state

Login API integration

Error handling

Loading state

AuthLayout

React Router setup

ProtectedRoute

Redirect after login

Logout flow

Restore authentication after page refresh

Phase 2 — Main Application Layout

Build:

MainLayout

Sidebar

Header

Navigation

User information

Logout button

Responsive layout

Active navigation state

Pages:

Dashboard

Products

Inventory

Customers

Deliveries

Phase 3 — Products Frontend

Connect to the existing backend.

Features:

Product list

Product search

Product creation

Product editing

Product status

Validation

Loading states

Error states

Success feedback

Use:

productService.ts
product.ts
Phase 4 — Inventory Frontend

Features:

Inventory list

Current quantity

Minimum stock

Stock status

Product information

Inventory detail

Low-stock indicators

Backend inventory logic is already implemented and should remain the source of truth.

Phase 5 — Customers Frontend

Features:

Customer list

Create customer

Edit customer

Activate/deactivate customer

Customer details

Customer status

Use:

customerService.ts
customer.ts
Phase 6 — Deliveries Frontend

Features:

Delivery list

Create delivery

Select customer

Add delivery items

Product selection

Quantity

Notes

Draft delivery

Complete delivery

Cancel delivery

Delivery details

Important business rule:

The business does not sell partial quantities.

Therefore delivery quantities should remain integers.

Example:

1 sack
5 sacks
30 sacks

not:

0.5 sack
2.5 sacks

The backend already handles transactional delivery completion and inventory locking.

Phase 7 — Dashboard

Dashboard should eventually provide useful operational information such as:

Total products
Low-stock products
Total customers
Pending deliveries
Completed deliveries
Recent delivery activity
Inventory overview

Avoid building unnecessary charts unless they provide useful business information.

Phase 8 — Permissions / Role-Based UI

The backend already has roles/permissions groundwork.

Frontend will eventually use the authenticated user's role/permissions to control UI access.

For example:

Administrator
Manager
Staff

Possible behavior:

Administrator
→ full access

Manager
→ operational management

Staff
→ daily operational tasks

Do not hard-code complicated permission logic prematurely.

First make authentication and the main system work.

Important Business Decisions

This is a real business-oriented system.

Prioritize:

Correct business operations
Reliable data
Clear workflows
Maintainable code
Usable interface
Business reports

Do not over-engineer the frontend.

The system should be operational first and enhanced later.

The backend Phase 1 was intentionally designed so the business can operate without requiring a full user/customer account system for customers. Staff can input operational data.

Receipt functionality is currently deferred because the business's receipt requirements are still being clarified.

Development Style

Teach me incrementally.

For every new feature:

Explain the purpose.
Explain the architecture.
Show the exact file to create/change.
Give the code for that specific step.
Explain important lines.
Ask me to run the appropriate check.
Fix errors before proceeding.
Only then move to the next step.

Do NOT dump an entire module or complete application at once.

When I provide a terminal error, diagnose the exact error first. Do not randomly change unrelated files.

Always preserve the existing architecture unless there is a concrete reason to change it.

Use:

npm run lint
npm run build

to verify the frontend after meaningful changes.

The goal is a clean, practical, medium-sized production-style React frontend, not an unnecessarily complicated enterprise architecture.