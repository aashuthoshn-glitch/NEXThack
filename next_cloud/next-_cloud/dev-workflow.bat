@echo off
echo ========================================
echo Nextcloud Dashboard Widget Development
echo ========================================

:menu
echo.
echo Choose an option:
echo 1. Build and update widget
echo 2. Restart Nextcloud
echo 3. View logs
echo 4. Access Nextcloud
echo 5. Enable/Disable widget
echo 6. Exit
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" goto build
if "%choice%"=="2" goto restart
if "%choice%"=="3" goto logs
if "%choice%"=="4" goto access
if "%choice%"=="5" goto toggle
if "%choice%"=="6" goto exit
goto menu

:build
echo.
echo Building dashboard widget...
cd dashboardtalk
call npm run build
cd ..
echo.
echo Updating widget in Nextcloud...
docker exec nextcloud-dev php occ app:update dashboardtalk
echo.
echo Widget updated! Refresh your browser to see changes.
pause
goto menu

:restart
echo.
echo Restarting Nextcloud...
docker-compose down
docker-compose up -d
echo.
echo Nextcloud restarted!
pause
goto menu

:logs
echo.
echo Viewing Nextcloud logs...
docker logs nextcloud-dev --tail 50
pause
goto menu

:access
echo.
echo Opening Nextcloud in browser...
start http://localhost:8080
goto menu

:toggle
echo.
echo Current widget status:
docker exec nextcloud-dev php occ app:list | findstr dashboardtalk
echo.
set /p action="Enable (e) or Disable (d) widget? "
if /i "%action%"=="e" (
    docker exec nextcloud-dev php occ app:enable dashboardtalk
    echo Widget enabled!
) else if /i "%action%"=="d" (
    docker exec nextcloud-dev php occ app:disable dashboardtalk
    echo Widget disabled!
) else (
    echo Invalid choice!
)
pause
goto menu

:exit
echo.
echo Goodbye!
exit /b 0
