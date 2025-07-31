@echo off
echo Starting RideMatch...
echo.

REM Try to find and run Next.js directly
if exist "node_modules\next\dist\bin\next" (
    echo Found Next.js binary, starting server...
    node node_modules\next\dist\bin\next dev
) else if exist "node_modules\.bin\next" (
    echo Found Next.js in .bin, starting server...
    node_modules\.bin\next dev
) else (
    echo Next.js not found, trying npx...
    npx next dev
)

pause 