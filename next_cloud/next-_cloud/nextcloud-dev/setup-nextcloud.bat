@echo off
echo ========================================
echo Setting up Local Nextcloud with Docker
echo ========================================

echo.
echo Step 1: Waiting for Docker to start...
timeout /t 10 /nobreak

echo.
echo Step 2: Testing Docker connection...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is not ready yet. Please wait for Docker Desktop to fully start.
    echo You can check the Docker Desktop icon in your system tray.
    echo.
    echo Press any key to retry...
    pause
    goto :retry
)

echo Docker is ready!

echo.
echo Step 3: Pulling Nextcloud image...
docker pull nextcloud:28

echo.
echo Step 4: Pulling MariaDB image...
docker pull mariadb:10.11

echo.
echo Step 5: Starting Nextcloud containers...
docker-compose -f docker-compose-simple.yml up -d

echo.
echo Step 6: Waiting for Nextcloud to initialize...
timeout /t 30 /nobreak

echo.
echo Step 7: Installing Talk app...
docker exec nextcloud-dev php occ app:install spreed

echo.
echo Step 8: Enabling Talk app...
docker exec nextcloud-dev php occ app:enable spreed

echo.
echo Step 9: Enabling dashboard widget...
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
echo Your dashboard widget is installed and ready!
echo.
echo To access Nextcloud:
echo 1. Open http://localhost:8080 in your browser
echo 2. Log in with admin/admin123
echo 3. Go to Dashboard and add your widget
echo.
echo To stop Nextcloud: docker-compose -f docker-compose-simple.yml down
echo To restart: docker-compose -f docker-compose-simple.yml up -d
echo.
pause
exit /b 0

:retry
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo Docker is still not ready. Please check Docker Desktop.
    pause
    goto :retry
)
goto :eof
