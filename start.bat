@echo off
REM Clocker - Web Clock Application Launcher
REM Opens index.html in the default browser

echo Starting Clocker Web Clock...

REM Check if index.html exists
if not exist "index.html" (
    echo ERROR: index.html not found in current directory
    echo Make sure you're running this script from the clocker project folder
    pause
    exit /b 1
)

REM Open index.html in default browser
start "" "index.html"

echo Clocker launched successfully!
echo You can now close this window.

REM Optional: Keep window open for 3 seconds to show success message
timeout /t 3 /nobreak >nul

exit /b 0