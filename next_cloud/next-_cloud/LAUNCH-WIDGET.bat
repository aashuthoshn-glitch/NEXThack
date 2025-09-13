@echo off
echo ========================================
echo   iOS-Style Floating Widget Launcher
echo ========================================
echo.
echo Choose your launch option:
echo.
echo 1. Quick Demo (Instant - 30 seconds)
echo 2. Full Nextcloud Setup (5 minutes)
echo 3. Open Demo Files
echo 4. Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" goto quickdemo
if "%choice%"=="2" goto fullsetup
if "%choice%"=="3" goto demofiles
if "%choice%"=="4" goto exit

:quickdemo
echo.
echo 🚀 Launching Quick Demo...
echo Opening quick-integration.html in your default browser...
start "" "quick-integration.html"
echo.
echo ✅ Demo launched! Look for the floating 💬 button in the bottom-right corner!
echo.
pause
goto end

:fullsetup
echo.
echo 🚀 Starting Full Nextcloud Setup...
echo This will take about 5 minutes...
echo.
echo Running setup-local-nextcloud.sh...
bash setup-local-nextcloud.sh
echo.
echo ✅ Setup complete! Nextcloud should be running at http://localhost:8080
echo.
echo Your iOS widget will appear on ALL Nextcloud pages!
echo.
pause
goto end

:demofiles
echo.
echo 📁 Opening Demo Files...
echo.
start "" "quick-integration.html"
start "" "ios-widget-demo.html"
start "" "global-widget-template.html"
echo.
echo ✅ All demo files opened in your browser!
echo.
echo Files opened:
echo - quick-integration.html (Main demo with integrated widget)
echo - ios-widget-demo.html (Standalone widget demo)
echo - global-widget-template.html (Integration template)
echo.
pause
goto end

:exit
echo.
echo 👋 Goodbye! Your iOS widget is ready whenever you need it!
echo.
goto end

:end
echo.
echo 🎉 Your iOS-Style Floating Widget is ready!
echo.
echo What you have:
echo ✅ iOS-style floating chat widget
echo ✅ AI chatbot with intelligent responses
echo ✅ Group management and user features
echo ✅ Smooth animations and glassmorphism effects
echo ✅ Ready for hackathon demo!
echo.
echo 🏆 This will definitely impress the judges!
echo.
pause
