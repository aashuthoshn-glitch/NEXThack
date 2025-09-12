@echo off
echo ========================================
echo WAMP Nextcloud Development Helper
echo ========================================

:menu
echo.
echo Choose an option:
echo 1. Build and update widget
echo 2. Open Nextcloud
echo 3. Open phpMyAdmin
echo 4. Open WAMP Control Panel
echo 5. View widget files
echo 6. Restart WAMP services
echo 7. Exit
echo.
set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto build
if "%choice%"=="2" goto open_nextcloud
if "%choice%"=="3" goto open_phpmyadmin
if "%choice%"=="4" goto open_wamp
if "%choice%"=="5" goto view_files
if "%choice%"=="6" goto restart_wamp
if "%choice%"=="7" goto exit
goto menu

:build
echo.
echo Building dashboard widget...
cd "C:\wamp64\www\nextcloud-dev\apps\dashboardtalk"
call npm run build
echo.
echo Widget built successfully! Refresh your browser to see changes.
pause
goto menu

:open_nextcloud
echo.
echo Opening Nextcloud...
start http://localhost/nextcloud-dev
goto menu

:open_phpmyadmin
echo.
echo Opening phpMyAdmin...
start http://localhost/phpmyadmin
goto menu

:open_wamp
echo.
echo Opening WAMP Control Panel...
start "C:\wamp64\wampmanager.exe"
goto menu

:view_files
echo.
echo Opening widget files in Explorer...
start "C:\wamp64\www\nextcloud-dev\apps\dashboardtalk"
goto menu

:restart_wamp
echo.
echo Restarting WAMP services...
echo Please use WAMP Control Panel to restart services.
start "C:\wamp64\wampmanager.exe"
pause
goto menu

:exit
echo.
echo Goodbye!
exit /b 0
