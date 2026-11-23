@echo off
title Push KudosBoard to GitHub
cd /d "%~dp0"
echo ========================================================
echo   Pushing KudosBoard to https://github.com/sandra4va/KudosBoard.git
echo ========================================================
echo.
"%LOCALAPPDATA%\Programs\Git\cmd\git.exe" push -u origin main
echo.
if %errorlevel% equ 0 (
    echo ========================================================
    echo   SUCCESS! Pushed to main branch successfully!
    echo ========================================================
) else (
    echo [ERROR] Push failed or was canceled.
)
echo.
pause
