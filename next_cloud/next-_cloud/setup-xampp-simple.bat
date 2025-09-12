@echo off
echo ========================================
echo Simple XAMPP Setup for Nextcloud
echo ========================================

echo.
echo This will help you set up XAMPP for Nextcloud development.
echo.

echo Step 1: Download XAMPP
echo Please download XAMPP from: https://www.apachefriends.org/download.html
echo Choose PHP 8.0+ version
echo.
echo Press any key when download is complete...
pause

echo.
echo Step 2: Install XAMPP
echo 1. Run the XAMPP installer as Administrator
echo 2. Select: Apache, MySQL, PHP, phpMyAdmin
echo 3. Install to: C:\xampp\
echo.
echo Press any key when installation is complete...
pause

echo.
echo Step 3: Start XAMPP
echo 1. Open XAMPP Control Panel
echo 2. Start Apache and MySQL services
echo 3. Both should show green "Running" status
echo.
echo Press any key when services are running...
pause

echo.
echo Step 4: Download Nextcloud
echo Please download Nextcloud from: https://nextcloud.com/install/
echo Extract to: C:\xampp\htdocs\nextcloud-dev\
echo.
echo Press any key when Nextcloud is extracted...
pause

echo.
echo Step 5: Set up Database
echo 1. Open: http://localhost/phpmyadmin
echo 2. Create database: nextcloud
echo 3. Create user: nextcloud with password: nextcloud123
echo 4. Grant all privileges to the user
echo.
echo Press any key when database is ready...
pause

echo.
echo Step 6: Install Nextcloud
echo 1. Go to: http://localhost/nextcloud-dev
echo 2. Create admin account: admin/admin123
echo 3. Use database: MySQL/MariaDB
echo 4. Username: nextcloud, Password: nextcloud123
echo 5. Database: nextcloud, Host: localhost
echo.
echo Press any key when Nextcloud installation is complete...
pause

echo.
echo Step 7: Install Talk App
echo 1. Go to Apps in Nextcloud admin
echo 2. Search for "Talk"
echo 3. Install and enable Nextcloud Talk
echo.
echo Press any key when Talk app is installed...
pause

echo.
echo Step 8: Install Your Dashboard Widget
echo Copying widget files...
if not exist "C:\xampp\htdocs\nextcloud-dev\apps" mkdir "C:\xampp\htdocs\nextcloud-dev\apps"
xcopy "dashboardtalk" "C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk" /E /I /Y

echo.
echo Building widget...
cd "C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk"
call npm install
call npm run build
cd "%~dp0"

echo.
echo Step 9: Enable Widget
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
echo 1. Edit files in: C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk\src\
echo 2. Run: npm run build
echo 3. Refresh your browser
echo.
echo Press any key to open Nextcloud...
pause

start http://localhost/nextcloud-dev
