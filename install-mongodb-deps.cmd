@echo off
echo ========================================
echo Installing MongoDB Dependencies
echo ========================================
echo.

echo [1/2] Installing Backend Dependencies...
echo.
cd /d "%~dp0backend"
if errorlevel 1 (
    echo ERROR: Could not navigate to backend folder!
    pause
    exit /b 1
)

call npm install
if errorlevel 1 (
    echo ERROR: Backend installation failed!
    cd ..
    pause
    exit /b 1
)

echo.
echo ✓ Backend dependencies installed!
echo.

cd ..

echo [2/2] Installing Frontend Dependencies...
echo.
cd frontend
if errorlevel 1 (
    echo ERROR: Could not navigate to frontend folder!
    pause
    exit /b 1
)

call npm install
if errorlevel 1 (
    echo ERROR: Frontend installation failed!
    cd ..
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo ✓ All Dependencies Installed!
echo ========================================
echo.
echo Next step: Edit backend\.env and add your MongoDB password
echo Then run: start-app.cmd
echo.
pause
