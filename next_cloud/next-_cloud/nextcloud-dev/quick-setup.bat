@echo off
echo ========================================
echo Quick Nextcloud Setup (Alternative)
echo ========================================

echo.
echo Since Docker is having issues, let's try a different approach.
echo.
echo Option 1: Use XAMPP (Recommended for Windows)
echo - Download XAMPP from https://www.apachefriends.org/download.html
echo - Install with Apache, MySQL, and PHP
echo - Follow the XAMPP-SETUP.md guide
echo.
echo Option 2: Try Docker with different approach
echo - Restart Docker Desktop completely
echo - Try running: docker system prune -a
echo - Then run: docker-compose -f docker-compose-simple.yml up -d
echo.
echo Option 3: Use online Nextcloud for testing
echo - Go to https://demo.nextcloud.com
echo - Test your widget with the test.html file
echo.
echo For now, let's test your widget locally:
echo.

cd ..
cd dashboardtalk
echo Starting test server...
echo Your widget is available at: http://localhost:8080/test.html
echo.
npx http-server . -p 8080 -o test.html

pause
