# Laragon Setup for Nextcloud Development

Laragon is a modern, lightweight alternative to Docker.

## Why Laragon?
✅ **Lightweight** - Fast and minimal
✅ **Modern** - Latest PHP, MySQL versions
✅ **Portable** - Can run from USB
✅ **Auto-configuration** - Sets up everything automatically
✅ **No installation** - Just extract and run

## Installation Steps

### 1. Download Laragon
- Go to: https://laragon.org/download/
- Download Laragon Full (includes everything)
- Extract to: `C:\laragon\`

### 2. Start Laragon
- Run `laragon.exe` as Administrator
- Click "Start All" button
- Wait for services to start (green indicators)

### 3. Download Nextcloud
- Go to: https://nextcloud.com/install/
- Download latest Nextcloud server
- Extract to: `C:\laragon\www\nextcloud-dev\`

### 4. Set Up Database
- Click Laragon → Database → phpMyAdmin
- Create database: `nextcloud`
- Create user: `nextcloud` with password: `nextcloud123`


### 5. Install Nextcloud
- Go to: http://nextcloud-dev.test (Laragon auto-creates .test domains)
- Follow installation wizard
- Use same settings as other guides

## Development Workflow

```bash
# Edit files in: C:\laragon\www\nextcloud-dev\apps\dashboardtalk\src\
# Build: npm run build
# Access: http://nextcloud-dev.test
```

## Access URLs
- **Nextcloud**: http://nextcloud-dev.test
- **Laragon Home**: http://localhost/
- **phpMyAdmin**: http://localhost/phpmyadmin

## Benefits
- ✅ No installation required
- ✅ Auto-creates .test domains
- ✅ Latest software versions
- ✅ Very fast startup
- ✅ Easy to manage
