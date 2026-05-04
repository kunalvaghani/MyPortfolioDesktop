@echo off
setlocal

cd /d "%~dp0"

echo.
echo KunalOS Portfolio Launcher
echo ==========================
echo Project: %CD%
echo.

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm.cmd was not found. Install Node.js, then run this again.
  pause
  exit /b 1
)

if not exist package.json (
  echo ERROR: package.json was not found in this folder.
  pause
  exit /b 1
)

if not exist node_modules\next\dist\bin\next (
  echo ERROR: Dependencies are missing.
  echo Run: npm install
  pause
  exit /b 1
)

if not exist .next\BUILD_ID (
  echo Production build missing. Building now...
  call npm run build
  if errorlevel 1 (
    echo.
    echo ERROR: Build failed. Read the messages above.
    pause
    exit /b 1
  )
)

set PORT=
for %%P in (3000 3001 3002 3003 3004 3005) do (
  netstat -ano | findstr /R /C:":%%P .*LISTENING" >nul
  if errorlevel 1 (
    set PORT=%%P
    goto :port_found
  )
)

echo ERROR: Ports 3000-3005 are busy. Close another dev server and try again.
pause
exit /b 1

:port_found
echo Starting portfolio at http://127.0.0.1:%PORT%
echo Leave this window open while viewing the site.
echo Press Ctrl+C to stop the server.
echo.

call npm run start -- -p %PORT%

echo.
echo Server stopped.
pause
