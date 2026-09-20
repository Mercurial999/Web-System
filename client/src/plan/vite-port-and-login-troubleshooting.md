# Vite Port And Login Troubleshooting

## Short Answer

You do not need to change the port manually every time.

When Vite prints:

```text
Port 5173 is in use, trying another one...
Port 5174 is in use, trying another one...
Port 5175 is in use, trying another one...
```

it means another frontend development server is already running on those ports. Vite automatically chooses the next free port.

## Why Login Works On 5174 But Not 5175

The backend CORS configuration currently allows these frontend origins:

```text
http://localhost:5173
http://localhost:5174
```

If Vite starts on `http://localhost:5175`, the browser may block the API request. The browser then displays:

```text
Failed to fetch
```

This does not necessarily mean that the email or password is wrong. It can mean that the frontend origin is not allowed by the backend.

## Recommended Daily Workflow

Use one frontend terminal and one backend terminal.

### Terminal 1: Backend

```powershell
cd "C:\Users\RENZ\Desktop\Web System\server"
npm run dev
```

Keep this terminal running. The backend should be available at:

```text
http://localhost:5000
```

### Terminal 2: Frontend

```powershell
cd "C:\Users\RENZ\Desktop\Web System\client"
npm run dev
```

Open the exact URL printed by Vite, but preferably use `5173` or `5174` with the current backend configuration:

```text
http://localhost:5173/login
```

or:

```text
http://localhost:5174/login
```

## When Vite Reaches 5175 Or Higher

Usually this means an old Vite process is still running. Stop the old process instead of starting more frontend servers.

Find processes using the frontend ports:

```powershell
Get-NetTCPConnection -LocalPort 5173,5174,5175 -State Listen
```

Show the process details:

```powershell
Get-NetTCPConnection -LocalPort 5173,5174,5175 -State Listen |
  Select-Object LocalPort, OwningProcess
```

Stop a stale process using its process ID:

```powershell
Stop-Process -Id PROCESS_ID -Force
```

Replace `PROCESS_ID` with the value shown by the previous command.

After stopping the stale Vite process, start the frontend again:

```powershell
cd "C:\Users\RENZ\Desktop\Web System\client"
npm run dev
```

Vite should normally return to port `5173`.

## Important Rule

Do not run several copies of this command at the same time:

```powershell
npm run dev
```

Every copy occupies a port. After a few attempts, Vite may move to `5175`, `5176`, or another port.

## If You Accidentally Close The Terminal

Closing the visible terminal usually stops that server. If Vite still reports that the port is occupied, use the PowerShell commands above to find and stop the old process.

## Login Checklist

1. Start the backend first.
2. Confirm `http://localhost:5000/` responds.
3. Start only one frontend Vite server.
4. Open the exact frontend URL printed by Vite.
5. Prefer `5173` or `5174` with the current backend CORS configuration.
6. Use the local administrator email and password.
7. If the URL is `5175` or higher, stop the old Vite processes and restart the frontend.

## Expected Local URLs

```text
Backend:  http://localhost:5000
Frontend: http://localhost:5173
Login:    http://localhost:5173/login
```

The frontend may also use port `5174` when `5173` is occupied:

```text
Frontend: http://localhost:5174
Login:    http://localhost:5174/login
```

## Future Configuration Option

A future improvement would be to configure the backend to accept a controlled range of local development ports, or configure Vite to use one fixed port and fail clearly when that port is occupied. This is optional; for now, stopping stale Vite processes is the cleanest workflow.
