# XAMPP Setup for Nextcloud Development

Since Docker is having issues, let's use XAMPP for a reliable local development environment.

## Step 1: Install XAMPP

1. Download XAMPP from: https://www.apachefriends.org/download.html
2. Install with Apache, MySQL, and PHP 8.0+
3. Start XAMPP Control Panel
4. Start Apache and MySQL services

## Step 2: Download Nextcloud

1. Go to: https://nextcloud.com/install/
2. Download the latest Nextcloud server
3. Extract to: `C:\xampp\htdocs\nextcloud-dev`

## Step 3: Set Up Database

1. Open http://localhost/phpmyadmin
2. Create a new database called `nextcloud`
3. Create a user `nextcloud` with password `nextcloud123`

## Step 4: Install Nextcloud

1. Go to http://localhost/nextcloud-dev
2. Follow the installation wizard:
   - Database: MySQL/MariaDB
   - Username: nextcloud
   - Password: nextcloud123
   - Database: nextcloud
   - Admin username: admin
   - Admin password: admin123

## Step 5: Install Talk App

1. Go to Apps in Nextcloud admin
2. Search for "Talk"
3. Install and enable the Talk app

## Step 6: Install Your Dashboard Widget

1. Copy your widget to: `C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk`
2. Go to Apps in Nextcloud admin
3. Find "Dashboard Talk Widget"
4. Enable it

## Step 7: Test Your Widget

1. Go to Dashboard
2. Click "Customize"
3. Add "Talk Messages" widget
4. Test the functionality

## Development Workflow

1. Edit files in `C:\xampp\htdocs\nextcloud-dev\apps\dashboardtalk`
2. Run `npm run build` to rebuild
3. Refresh your browser

## Access URLs

- Nextcloud: http://localhost/nextcloud-dev
- Admin: admin/admin123
- phpMyAdmin: http://localhost/phpmyadmin
