@echo off
setlocal
echo ========================================================
echo   KudosBoard — GitHub Repository Setup
echo ========================================================
echo.

where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not detected in your PATH.
    echo Please install Git via:
    echo   1. winget install --id Git.Git -e --source winget
    echo   2. Or download from: https://git-scm.com/download/win
    echo After installing, restart your terminal and run this script again.
    echo.
    pause
    exit /b 1
)

echo Initializing local Git repository...
git init
git branch -M main

echo Staging all project files...
git add .

echo Creating initial commit...
git commit -m "feat: complete KudosBoard real-time collaborative celebration wall"

echo.
echo ========================================================
echo   Repository initialized successfully!
echo ========================================================
echo.
echo Next, create a new empty repository on https://github.com/new
echo Then run the following two commands:
echo.
echo   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
echo   git push -u origin main
echo.
pause
