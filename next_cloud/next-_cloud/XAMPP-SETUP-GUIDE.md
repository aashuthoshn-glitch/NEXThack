# XAMPP Setup for Nextcloud Development

XAMPP is the easiest alternative to Docker for Windows development.

## Why XAMPP?
✅ **No Docker complexity** - Simple Windows installer
✅ **Familiar interface** - Easy to understand and manage
✅ **All-in-one** - Apache, MySQL, PHP in one package
✅ **Reliable** - No connectivity or daemon issues
✅ **Fast setup** - Get running in minutes

## Installation Steps

### 1. Download XAMPP
- Go to: https://www.apachefriends.org/download.html
- Download XAMPP for Windows
- Choose PHP 8.0+ version

### 2. Install XAMPP
- Run installer as Administrator
- Select: Apache, MySQL, PHP, phpMyAdmin
- Install to: `C:\xampp\`

### 3. Start Services
- Open XAMPP Control Panel
- Start Apache and MySQL
- Both should show green "Running" status

### 4. Download Nextcloud
- Go to: https://nextcloud.com/install/
- Download latest Nextcloud server
- Extract to: `C:\xampp\htdocs\nextcloud-dev\`

### 5. Set Up Database
- Open: http://localhost/phpmyadmin
- Create database: `nextcloud`
- Create user: `nextcloud` with password: `nextcloud123`
- Grant all privileges to the user

### 6. Install Nextcloud
- Go to: http://localhost/nextcloud-dev
- Follow installation wizard:
  - Admin: admin/admin123
  - Database: MySQL
  - Username: nextcloud
  - Password: nextcloud123
  - Database: nextcloud

### 7. Install Talk App
- Go to Apps in Nextcloud
- Search "Talk"
- Install and enable

### 8. Install Your Widget
- Copy `dashboardtalk` folder to: `C:\xampp\htdocs\nextcloud-dev\apps\`
- Go to Apps in Nextcloud
- Enable "Dashboard Talk Widget"

## Development Workflow

```bash
# Edit your widget
# Files are in: C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk\src\

# Build changes
cd C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk
npm run build

# Refresh browser to see changes
```

## Access URLs
- **Nextcloud**: http://localhost/nextcloud-dev
- **Admin**: admin/admin123
- **phpMyAdmin**: http://localhost/phpmyadmin
- **XAMPP Control**: C:\xampp\xampp-control.exe

## Benefits Over Docker
- ✅ No daemon issues
- ✅ No network connectivity problems
- ✅ Simple start/stop with GUI
- ✅ Easy to troubleshoot
- ✅ Familiar Windows environment
- ✅ No container management complexity
