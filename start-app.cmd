@echo off
echo ========================================
echo Starting Connect First Application
echo ========================================
echo.

echo This will start both the backend and frontend servers.
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:3000
echo.
echo Press Ctrl+C in each terminal window to stop the servers.
echo.
pause

echo Starting Backend Server...
start "Connect First - Backend" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Connect First - Frontend" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Two terminal windows should have opened.
echo If they didn't, run these commands manually in separate terminals:
echo   Terminal 1: cd backend && npm start
echo   Terminal 2: cd frontend && npm start
echo.
