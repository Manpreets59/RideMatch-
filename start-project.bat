@echo off
echo ========================================
echo    RideMatch Project Starter
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm is not installed or not in PATH
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install --legacy-peer-deps
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if Next.js binary exists
if exist "node_modules\next\dist\bin\next" (
    echo Next.js found! Starting development server...
    echo.
    echo Server will be available at: http://localhost:3000
    echo Press Ctrl+C to stop the server
    echo.
    node node_modules\next\dist\bin\next dev
) else (
    echo ERROR: Next.js binary not found
    echo Trying to reinstall dependencies...
    npm install --legacy-peer-deps --force
    if exist "node_modules\next\dist\bin\next" (
        echo Next.js found after reinstall! Starting server...
        node node_modules\next\dist\bin\next dev
    ) else (
        echo ERROR: Could not find Next.js after reinstall
        pause
        exit /b 1
    )
)

pause 