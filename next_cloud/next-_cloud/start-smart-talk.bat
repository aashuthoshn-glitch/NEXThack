@echo off
echo ========================================
echo    🚀 Smart Talk - Starting Server
echo ========================================
echo.

echo Starting Docker containers...
docker-compose up -d

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak > nul

echo.
echo Checking container status...
docker ps

echo.
echo ========================================
echo    ✅ Smart Talk Server Started!
echo ========================================
echo.
echo 🌐 Access URLs:
echo    Main Dashboard: http://localhost:8080
echo    Smart Talk API: http://localhost:8080/index.php/apps/dashboardtalk/api/
echo.
echo 👥 Login Credentials:
echo    admin / MyNextCloud2024!@#$%^
echo    aashu / AashuNextCloud2024!@#$%^
echo    adithya / AdithyaNextCloud2024!@#$%^
echo    dhanush / DhanushNextCloud2024!@#$%^
echo.
echo 📋 Next Steps:
echo    1. Open http://localhost:8080 in your browser
echo    2. Login with any of the credentials above
echo    3. Press F12 to open Developer Tools
echo    4. Go to Console tab
echo    5. Copy and paste the Smart Talk widget code
echo.
echo Press any key to open the dashboard...
pause > nul

start http://localhost:8080


