# Local Development And Login Instructions

## Why `Failed to fetch` Happened

The login credentials were correct. The browser blocked the request before the backend could return the login response.

The frontend was running on:

```text
http://localhost:5174
```

The backend previously allowed only:

```text
http://localhost:5173
```

That port mismatch caused a CORS failure. In the browser, CORS failures commonly appear as `Failed to fetch` instead of a normal HTTP error.

The backend now allows both local Vite ports: `5173` and `5174`.

## Start The Database

Make sure PostgreSQL is running and the database configured in `server/.env` exists.

The current server configuration uses:

```text
localhost:5432/bdms_db
```

## Start The Backend

Open a terminal in the `server` folder:

```powershell
cd "C:\Users\RENZ\Desktop\Web System\server"
npm run dev
```

Expected output:

```text
Server running at http://localhost:5000
```

Check the API in a browser:

```text
http://localhost:5000/
```

It should show that the backend is running.

## Start The Frontend

Open a second terminal in the `client` folder:

```powershell
cd "C:\Users\RENZ\Desktop\Web System\client"
npm run dev
```

Open the URL printed by Vite. It is usually one of these:

```text
http://localhost:5173/
http://localhost:5174/
```

## Login

Open:

```text
http://localhost:5173/login
```

or use the port shown by Vite.

Use the local administrator account you provided for this project. Do not commit its password to source control or documentation.

```text
Email: juan@gmail.com
Password: use your local admin password
```

After a successful login, the application should navigate to `/dashboard`.

## If Login Still Fails

1. Confirm the backend terminal is still running.
2. Open `http://localhost:5000/` and confirm it responds.
3. Confirm the frontend URL is `localhost`, not a different hostname or IP address.
4. Check that `client/.env` contains:

```text
VITE_API_URL=http://localhost:5000/api
```

5. Restart both servers after changing `.env` or backend CORS settings.
6. In the browser developer tools, inspect the Network tab. A failed CORS request usually shows no normal response body.
7. If the response is `401` with `Invalid email or password`, the network connection works and the credentials are the issue. `Failed to fetch` usually indicates server, port, CORS, or database availability instead.

## Verification Commands

Run from `client`:

```powershell
npm run lint
npm run build
```

Run from `server`:

```powershell
npm run build
```
