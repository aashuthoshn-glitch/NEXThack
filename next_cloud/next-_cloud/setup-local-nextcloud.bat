@echo off
echo ========================================
echo Setting up Local Nextcloud Development
echo ========================================

echo.
echo Step 1: Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not installed or not running!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    echo Then restart this script.
    pause
    exit /b 1
)
echo Docker is installed and running.

echo.
echo Step 2: Creating development directory...
if not exist "nextcloud-dev" mkdir nextcloud-dev
cd nextcloud-dev

echo.
echo Step 3: Copying dashboard widget to Nextcloud apps...
if not exist "custom_apps" mkdir custom_apps
xcopy "..\dashboardtalk" "custom_apps\dashboardtalk" /E /I /Y

echo.
echo Step 4: Starting Nextcloud with Docker Compose...
docker-compose up -d

echo.
echo Step 5: Waiting for Nextcloud to initialize...
timeout /t 30 /nobreak

echo.
echo Step 6: Installing Talk app...
docker exec nextcloud-dev php occ app:install spreed

echo.
echo Step 7: Enabling Talk app...
docker exec nextcloud-dev php occ app:enable spreed

echo.
echo Step 8: Enabling dashboard widget...
docker exec nextcloud-dev php occ app:enable dashboardtalk

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Nextcloud is now running at: http://localhost:8080
echo Admin username: admin
echo Admin password: admin123
echo.
echo Your dashboard widget is installed and ready for development!
echo.
echo To make changes:
echo 1. Edit files in the dashboardtalk folder
echo 2. Run: docker exec nextcloud-dev php occ app:update dashboardtalk
echo 3. Refresh your browser
echo.
echo To stop Nextcloud: docker-compose down
echo To restart: docker-compose up -d
echo.
pause
