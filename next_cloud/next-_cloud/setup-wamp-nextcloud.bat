@echo off
echo ========================================
echo WAMP Setup for Nextcloud Development
echo ========================================

echo.
echo Since you're familiar with WAMP, let's set up Nextcloud quickly!
echo.

echo Step 1: Verify WAMP is running
echo Please ensure WAMP Server is running (green icon in system tray)
echo.
echo Press any key when WAMP is running...
pause

echo.
echo Step 2: Download Nextcloud
echo Please download Nextcloud from: https://nextcloud.com/install/
echo Extract to: C:\wamp64\www\nextcloud-dev\
echo.
echo Press any key when Nextcloud is extracted...
pause

echo.
echo Step 3: Set up Database
echo 1. Click WAMP icon in system tray
echo 2. Go to phpMyAdmin
echo 3. Create database: nextcloud
echo 4. Create user: nextcloud with password: nextcloud123
echo 5. Grant all privileges to the user
echo.
echo Press any key when database is ready...
pause

echo.
echo Step 4: Install Nextcloud
echo 1. Go to: http://localhost/nextcloud-dev
echo 2. Create admin account: admin/admin123
echo 3. Use database: MySQL/MariaDB
echo 4. Username: nextcloud, Password: nextcloud123
echo 5. Database: nextcloud, Host: localhost
echo.
echo Press any key when Nextcloud installation is complete...
pause

echo.
echo Step 5: Install Talk App
echo 1. Go to Apps in Nextcloud admin
echo 2. Search for "Talk"
echo 3. Install and enable Nextcloud Talk
echo.
echo Press any key when Talk app is installed...
pause

echo.
echo Step 6: Install Your Dashboard Widget
echo Copying widget files...
if not exist "C:\wamp64\www\nextcloud-dev\apps" mkdir "C:\wamp64\www\nextcloud-dev\apps"
xcopy "dashboardtalk" "C:\wamp64\www\nextcloud-dev\apps\dashboardtalk" /E /I /Y

echo.
echo Building widget...
cd "C:\wamp64\www\nextcloud-dev\apps\dashboardtalk"
call npm install
call npm run build
cd "%~dp0"

echo.
echo Step 7: Enable Widget
echo 1. Go to Apps in Nextcloud admin
echo 2. Find "Dashboard Talk Widget"
echo 3. Enable it
echo 4. Go to Dashboard and add the widget
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Your Nextcloud is now running at: http://localhost/nextcloud-dev
echo Admin username: admin
echo Admin password: admin123
echo.
echo Your dashboard widget is installed and ready!
echo.
echo To make changes:
echo 1. Edit files in: C:\wamp64\www\nextcloud-dev\apps\dashboardtalk\src\
echo 2. Run: npm run build
echo 3. Refresh your browser
echo.
echo Press any key to open Nextcloud...
pause

start http://localhost/nextcloud-dev
