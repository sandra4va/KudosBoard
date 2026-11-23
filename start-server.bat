@echo off
title KudosBoard Local Server
echo Starting KudosBoard on http://localhost:3000 ...
powershell -ExecutionPolicy Bypass -File "%~dp0server.ps1" 3000
pause
