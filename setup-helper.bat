@echo off
echo ========================================
echo Connect First - Installation Helper
echo ========================================
echo.

echo Checking system requirements...
echo.

REM Check Node.js
echo [1/3] Checking Node.js...
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js is installed
    node --version
    npm --version
) else (
    echo [MISSING] Node.js is not installed
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version and run the installer.
    echo Make sure to check "Add to PATH" during installation.
    echo.
)

echo.

REM Check MariaDB/MySQL
echo [2/3] Checking MariaDB/MySQL...
where mysql >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] MariaDB/MySQL is installed
    mysql --version
) else (
    echo [MISSING] MariaDB is not installed
    echo.
    echo Please install MariaDB from: https://mariadb.org/download/
    echo OR install XAMPP from: https://www.apachefriends.org/
    echo.
)

echo.

REM Check if we're in the right directory
echo [3/3] Checking project structure...
if exist "backend\package.json" (
    echo [OK] Backend directory found
) else (
    echo [WARNING] Backend directory not found
)

if exist "frontend\package.json" (
    echo [OK] Frontend directory found
) else (
    echo [WARNING] Frontend directory not found
)

if exist "database\schema.sql" (
    echo [OK] Database schema found
) else (
    echo [WARNING] Database schema not found
)

echo.
echo ========================================
echo Next Steps:
echo ========================================
echo.

where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 1. Install Node.js from https://nodejs.org/
    echo    - Download the LTS version
    echo    - Run installer, check "Add to PATH"
    echo    - Restart this script after installation
    echo.
)

where mysql >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 2. Install MariaDB from https://mariadb.org/download/
    echo    OR XAMPP from https://www.apachefriends.org/
    echo    - Set root password during installation
    echo    - Enable networking on port 3306
    echo.
)

where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    where mysql >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Both Node.js and MariaDB are installed!
        echo.
        echo To complete setup:
        echo 1. Open a NEW terminal as Administrator
        echo 2. Run: mysql -u root -p
        echo 3. Execute the SQL commands from INSTALLATION_GUIDE.md
        echo 4. Run: cd backend
        echo 5. Run: npm install
        echo 6. Run: cd ..\frontend
        echo 7. Run: npm install
        echo 8. Start the application with: npm start (in both directories)
        echo.
    )
)

echo.
echo See INSTALLATION_GUIDE.md for detailed instructions.
echo.
pause
