@echo off
cd /d "%~dp0"
echo Starting Scrolling Effect Server at http://localhost:3000 ...
start http://localhost:3000
node server.js
pause
