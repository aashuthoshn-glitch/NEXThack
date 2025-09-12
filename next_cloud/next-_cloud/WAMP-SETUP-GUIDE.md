# WAMP Setup for Nextcloud Development

WAMP is another excellent alternative to Docker for Windows.

## Why WAMP?
✅ **Windows-optimized** - Built specifically for Windows
✅ **Easy management** - Simple start/stop interface
✅ **Professional** - Used by many developers
✅ **Stable** - Reliable and well-maintained

## Installation Steps

### 1. Download WAMP
- Go to: https://www.wampserver.com/en/
- Download WAMP Server 64-bit
- Choose PHP 8.0+ version

### 2. Install WAMP
- Run installer as Administrator
- Install to: `C:\wamp64\`
- Start WAMP Server

### 3. Verify Installation
- WAMP icon should be green in system tray
- Open: http://localhost/
- Should see WAMP welcome page

### 4. Download Nextcloud
- Go to: https://nextcloud.com/install/
- Download latest Nextcloud server
- Extract to: `C:\wamp64\www\nextcloud-dev\`

### 5. Set Up Database
- Click WAMP icon → phpMyAdmin
- Create database: `nextcloud`
- Create user: `nextcloud` with password: `nextcloud123`

### 6. Install Nextcloud
- Go to: http://localhost/nextcloud-dev
- Follow installation wizard
- Use same settings as XAMPP guide

## Development Workflow

```bash
# Edit files in: C:\wamp64\www\nextcloud-dev\apps\dashboardtalk\src\
# Build: npm run build
# Access: http://localhost/nextcloud-dev
```

## Access URLs
- **Nextcloud**: http://localhost/nextcloud-dev
- **WAMP Home**: http://localhost/
- **phpMyAdmin**: http://localhost/phpmyadmin
