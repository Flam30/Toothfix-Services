@echo off
setlocal enabledelayedexpansion

set "projectPath=%~dp0"
set "folders[1]=availability-service"
set "folders[2]=booking-service"
set "folders[3]=notification-service"

for /l %%i in (1,1,3) do (
        start cmd /k "cd !projectPath!!folders[%%i]! && npm install && npm run dev"
)

endlocal