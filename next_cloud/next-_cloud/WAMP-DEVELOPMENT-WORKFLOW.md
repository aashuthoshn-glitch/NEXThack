# WAMP Development Workflow for Nextcloud

Since you're familiar with WAMP, here's your complete development workflow.

## Quick Setup

### 1. Start WAMP
- Ensure WAMP Server is running (green icon in system tray)
- If not running, start it from Start Menu

### 2. Run Setup Script
```bash
setup-wamp-nextcloud.bat
```

This will guide you through the complete setup process.

## Development Workflow

### Making Changes to Your Widget

1. **Edit your widget files**:
   ```
   C:\wamp64\www\nextcloud-dev\apps\dashboardtalk\src\
   ```

2. **Build the changes**:
   ```bash
   cd C:\wamp64\www\nextcloud-dev\apps\dashboardtalk
   npm run build
   ```

3. **Refresh your browser** to see changes

### File Structure in WAMP
```
C:\wamp64\www\nextcloud-dev\
├── apps\
│   └── dashboardtalk\          # Your widget
│       ├── src\               # Source files
│       ├── js\                # Built files
│       └── package.json       # Dependencies
├── config\                    # Nextcloud config
├── data\                      # Nextcloud data
└── index.php                  # Nextcloud entry point
```

## Access URLs

- **Nextcloud**: http://localhost/nextcloud-dev
- **Admin**: admin/admin123
- **WAMP Home**: http://localhost/
- **phpMyAdmin**: http://localhost/phpmyadmin

## Useful WAMP Commands

### Start/Stop Services
- **Start**: Click WAMP icon → Start All Services
- **Stop**: Click WAMP icon → Stop All Services
- **Restart**: Click WAMP icon → Restart All Services

### Database Management
- **phpMyAdmin**: Click WAMP icon → phpMyAdmin
- **MySQL Console**: Click WAMP icon → MySQL → MySQL Console

### Logs
- **Apache Logs**: Click WAMP icon → Apache → Apache Error Log
- **MySQL Logs**: Click WAMP icon → MySQL → MySQL Error Log

## Development Tips

### 1. Enable Error Reporting
In `C:\wamp64\www\nextcloud-dev\config\config.php`:
```php
'debug' => true,
'loglevel' => 0,
```

### 2. Clear Nextcloud Cache
```bash
# In Nextcloud admin
Settings → Administration → Logging → Clear log
```

### 3. Restart Services After Changes
- Restart Apache if you modify PHP files
- Restart MySQL if you change database settings

### 4. Backup Your Work
```bash
# Backup your widget
xcopy "C:\wamp64\www\nextcloud-dev\apps\dashboardtalk" "C:\backup\dashboardtalk" /E /I

# Backup database
# Use phpMyAdmin → Export
```

## Troubleshooting

### Common Issues

1. **WAMP not starting**
   - Check if port 80 is free
   - Run as Administrator
   - Check Windows Firewall

2. **Nextcloud not loading**
   - Check Apache is running
   - Check PHP version (8.0+)
   - Check file permissions

3. **Database connection failed**
   - Check MySQL is running
   - Verify database credentials
   - Check phpMyAdmin access

4. **Widget not appearing**
   - Check app is enabled in Nextcloud
   - Verify JavaScript files are built
   - Check browser console for errors

### Quick Fixes

```bash
# Restart WAMP services
# Click WAMP icon → Restart All Services

# Clear browser cache
# Ctrl + F5 to hard refresh

# Check file permissions
# Ensure www folder is writable
```

## Production Deployment

When ready to deploy to production:

1. **Package your widget**:
   ```bash
   cd C:\wamp64\www\nextcloud-dev\apps\dashboardtalk
   tar -czf dashboardtalk.tar.gz --exclude=node_modules --exclude=.git .
   ```

2. **Upload to production Nextcloud**:
   - Copy to production apps directory
   - Enable in admin panel
   - Add to dashboard

## Benefits of WAMP for Development

✅ **Familiar environment** - You already know WAMP
✅ **Fast setup** - Get running in minutes
✅ **Easy management** - Simple start/stop
✅ **Local development** - No internet required
✅ **Full control** - Modify any settings
✅ **Real environment** - Actual Nextcloud instance
✅ **Easy debugging** - Access to all logs and configs

Your WAMP-based Nextcloud development environment is ready to go!
