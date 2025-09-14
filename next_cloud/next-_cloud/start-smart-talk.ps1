# Smart Talk Server Launcher
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    🚀 Smart Talk - Starting Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "Checking container status..." -ForegroundColor Yellow
docker ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "    ✅ Smart Talk Server Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "🌐 Access URLs:" -ForegroundColor Cyan
Write-Host "   Main Dashboard: http://localhost:8080" -ForegroundColor White
Write-Host "   Smart Talk API: http://localhost:8080/index.php/apps/dashboardtalk/api/" -ForegroundColor White
Write-Host ""

Write-Host "👥 Login Credentials:" -ForegroundColor Cyan
Write-Host "   admin / MyNextCloud2024!@#$%^" -ForegroundColor White
Write-Host "   aashu / AashuNextCloud2024!@#$%^" -ForegroundColor White
Write-Host "   adithya / AdithyaNextCloud2024!@#$%^" -ForegroundColor White
Write-Host "   dhanush / DhanushNextCloud2024!@#$%^" -ForegroundColor White
Write-Host ""

Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Open http://localhost:8080 in your browser" -ForegroundColor White
Write-Host "   2. Login with any of the credentials above" -ForegroundColor White
Write-Host "   3. Press F12 to open Developer Tools" -ForegroundColor White
Write-Host "   4. Go to Console tab" -ForegroundColor White
Write-Host "   5. Copy and paste the Smart Talk widget code" -ForegroundColor White
Write-Host ""

Write-Host "Opening dashboard in browser..." -ForegroundColor Yellow
Start-Process "http://localhost:8080"


