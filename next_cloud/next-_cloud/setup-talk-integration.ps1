# Setup Script for Nextcloud Talk Integration
Write-Host "🚀 Setting up Nextcloud Talk Integration for Smart Talk..." -ForegroundColor Green

# Check if Docker is running
Write-Host "`n📋 Checking Docker status..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker first." -ForegroundColor Red
    exit 1
}

# Start the containers
Write-Host "`n🐳 Starting Nextcloud containers..." -ForegroundColor Yellow
docker-compose up -d

# Wait for Nextcloud to be ready
Write-Host "`n⏳ Waiting for Nextcloud to initialize..." -ForegroundColor Yellow
$maxAttempts = 30
$attempt = 0

do {
    $attempt++
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8080" -Method Head -TimeoutSec 5
        if ($response.StatusCode -eq 200) {
            Write-Host "✅ Nextcloud is ready!" -ForegroundColor Green
            break
        }
    } catch {
        Write-Host "⏳ Attempt $attempt/$maxAttempts - Waiting for Nextcloud..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    }
} while ($attempt -lt $maxAttempts)

if ($attempt -eq $maxAttempts) {
    Write-Host "❌ Nextcloud failed to start within the expected time." -ForegroundColor Red
    exit 1
}

# Enable the app
Write-Host "`n🔧 Enabling Smart Talk app..." -ForegroundColor Yellow
try {
    docker exec nextcloud_main php occ app:enable dashboardtalk
    Write-Host "✅ Smart Talk app enabled" -ForegroundColor Green
} catch {
    Write-Host "⚠️  App may already be enabled or there was an issue" -ForegroundColor Yellow
}

# Seed sample data
Write-Host "`n🌱 Seeding sample Nextcloud Talk data..." -ForegroundColor Yellow
try {
    $seedUrl = "http://localhost:8080/index.php/apps/dashboardtalk/api/talk/seed"
    $response = Invoke-WebRequest -Uri $seedUrl -Method POST -UseBasicParsing
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Sample data created successfully" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Sample data seeding failed, but integration should still work" -ForegroundColor Yellow
}

# Display access information
Write-Host "`n🎉 Nextcloud Talk Integration Setup Complete!" -ForegroundColor Green
Write-Host "`n📋 Access Information:" -ForegroundColor Cyan
Write-Host "🌐 Nextcloud URL: http://localhost:8080" -ForegroundColor White
Write-Host "`n👤 Login Credentials:" -ForegroundColor Cyan
Write-Host "   admin / MyNextCloud2024!@#`$%^" -ForegroundColor White
Write-Host "   aashu / AashuNextCloud2024!@#`$%^" -ForegroundColor White
Write-Host "   adithya / AdithyaNextCloud2024!@#`$%^" -ForegroundColor White
Write-Host "   dhanush / DhanushNextCloud2024!@#`$%^" -ForegroundColor White

Write-Host "`n🚀 Features Available:" -ForegroundColor Cyan
Write-Host "   🤖 AI Chat Assistant" -ForegroundColor White
Write-Host "   💬 Nextcloud Talk Integration" -ForegroundColor White
Write-Host "   👥 Group Management" -ForegroundColor White
Write-Host "   📞 Video/Audio Calls" -ForegroundColor White
Write-Host "   🔄 Real-time Messaging" -ForegroundColor White
Write-Host "   📱 Mobile Support" -ForegroundColor White

Write-Host "`n📖 How to Use:" -ForegroundColor Cyan
Write-Host "1. Login to Nextcloud at http://localhost:8080" -ForegroundColor White
Write-Host "2. Look for the floating chat button in the bottom-right corner" -ForegroundColor White
Write-Host "3. Click the button to open Smart Talk" -ForegroundColor White
Write-Host "4. Switch between AI mode and Nextcloud Talk conversations" -ForegroundColor White
Write-Host "5. Select any conversation to start real-time messaging" -ForegroundColor White

Write-Host "`n🔧 Troubleshooting:" -ForegroundColor Cyan
Write-Host "• If the widget doesn't appear, refresh the page" -ForegroundColor White
Write-Host "• Check browser console (F12) for any errors" -ForegroundColor White
Write-Host "• Ensure all containers are running: docker ps" -ForegroundColor White

Write-Host "`n✨ Enjoy your integrated Smart Talk experience!" -ForegroundColor Green
Read-Host "`nPress Enter to continue..."
