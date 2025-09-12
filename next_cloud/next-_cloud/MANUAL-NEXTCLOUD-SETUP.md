# Manual Nextcloud Setup (Without Docker)

If you prefer not to use Docker, you can set up Nextcloud manually using XAMPP or similar.

## Prerequisites

### 1. Install XAMPP
- Download from: https://www.apachefriends.org/download.html
- Install with Apache, MySQL, and PHP
- Make sure PHP 8.0+ is selected

### 2. Install Node.js
- Download from: https://nodejs.org/
- Install the LTS version

## Setup Steps

### 1. Download Nextcloud
```bash
# Create a web directory
mkdir C:\xampp\htdocs\nextcloud-dev
cd C:\xampp\htdocs\nextcloud-dev

# Download Nextcloud (or use the latest version)
# Go to https://nextcloud.com/install/ and download the latest version
# Extract to C:\xampp\htdocs\nextcloud-dev
```

### 2. Set Up Database
1. Start XAMPP Control Panel
2. Start Apache and MySQL
3. Go to http://localhost/phpmyadmin
4. Create a new database called `nextcloud`

### 3. Install Nextcloud
1. Go to http://localhost/nextcloud-dev
2. Follow the installation wizard:
   - Database: MySQL/MariaDB
   - Username: root
   - Password: (leave empty)
   - Database: nextcloud
   - Admin username: admin
   - Admin password: admin123

### 4. Install Talk App
1. Go to Apps in Nextcloud admin
2. Search for "Talk"
3. Install and enable the Talk app

### 5. Install Your Dashboard Widget
```bash
# Copy your widget to Nextcloud apps directory
xcopy "C:\path\to\your\dashboardtalk" "C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk" /E /I

# Build the widget
cd C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk
npm install
npm run build
```

### 6. Enable Your Widget
1. Go to Apps in Nextcloud admin
2. Find "Dashboard Talk Widget"
3. Enable it

## Development Workflow

### Making Changes
1. Edit files in `C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk`
2. Run `npm run build` to rebuild
3. Refresh your browser

### Access Your Nextcloud
- URL: http://localhost/nextcloud-dev
- Admin: admin/admin123

## Alternative: Use Online Nextcloud

### 1. Nextcloud Demo
- Go to: https://demo.nextcloud.com
- Use the demo environment for testing

### 2. Nextcloud All-in-One
- Use the official Nextcloud All-in-One installer
- Download from: https://github.com/nextcloud/all-in-one

## Pros and Cons

### Manual Setup
✅ No Docker required
✅ Full control over configuration
❌ More complex setup
❌ Manual dependency management

### Docker Setup (Recommended)
✅ Easy setup and management
✅ Isolated environment
✅ Easy to reset and recreate
✅ Production-like environment
