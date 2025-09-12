# 🚀 Local Nextcloud Development Setup

This guide will help you set up a complete local Nextcloud development environment with your dashboard widget.

## Prerequisites

### 1. Install Docker Desktop
- **Windows**: Download from [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
- **Mac**: Download from [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
- **Linux**: Follow [Docker installation guide](https://docs.docker.com/engine/install/)

### 2. Verify Docker Installation
```bash
docker --version
docker-compose --version
```

## Quick Setup (Automated)

### Windows
```bash
# Run the automated setup script
setup-local-nextcloud.bat
```

### Linux/Mac
```bash
# Make script executable and run
chmod +x setup-local-nextcloud.sh
./setup-local-nextcloud.sh
```

## Manual Setup

### 1. Create Development Directory
```bash
mkdir nextcloud-dev
cd nextcloud-dev
```

### 2. Copy Docker Compose Configuration
Copy the `docker-compose.yml` file to your development directory.

### 3. Copy Your Widget
```bash
# Copy your dashboard widget to Nextcloud apps
mkdir -p custom_apps
cp -r ../dashboardtalk custom_apps/
```

### 4. Start Nextcloud
```bash
docker-compose up -d
```

### 5. Wait for Initialization
Wait about 30 seconds for Nextcloud to fully initialize.

### 6. Install and Enable Talk App
```bash
# Install Talk app
docker exec nextcloud-dev php occ app:install spreed

# Enable Talk app
docker exec nextcloud-dev php occ app:enable spreed
```

### 7. Enable Your Widget
```bash
# Enable your dashboard widget
docker exec nextcloud-dev php occ app:enable dashboardtalk
```

## Access Your Local Nextcloud

- **URL**: http://localhost:8080
- **Admin Username**: admin
- **Admin Password**: admin123

## Development Workflow

### Making Changes to Your Widget

1. **Edit your widget files** in the `dashboardtalk` directory
2. **Build the frontend**:
   ```bash
   cd dashboardtalk
   npm run build
   cd ..
   ```
3. **Update the widget in Nextcloud**:
   ```bash
   docker exec nextcloud-dev php occ app:update dashboardtalk
   ```
4. **Refresh your browser** to see changes

### Using the Development Script

Run the development workflow script for easy management:

**Windows**:
```bash
dev-workflow.bat
```

This provides a menu with options to:
- Build and update widget
- Restart Nextcloud
- View logs
- Access Nextcloud
- Enable/disable widget

## Testing Your Widget

### 1. Access the Dashboard
- Go to http://localhost:8080
- Log in with admin/admin123
- Click on the Dashboard icon in the top navigation

### 2. Add Your Widget
- Click "Customize" at the bottom of the dashboard
- Find "Talk Messages" in the available widgets
- Click to add it to your dashboard

### 3. Test Functionality
- The widget should display mock messages
- Test the refresh button
- Test clicking on messages
- Test the "New Message" button

## Real Talk Integration

### 1. Create Test Conversations
- Go to the Talk app in Nextcloud
- Create some test conversations
- Send some test messages

### 2. Update API Integration
Edit `dashboardtalk/src/services/talkApi.js` to use real API calls:

```javascript
// Replace mock data with real API calls
static async getRecentMessages(limit = 5) {
  try {
    const conversations = await this.getConversations()
    // ... real implementation
  } catch (error) {
    console.error('Error fetching recent messages:', error)
    return []
  }
}
```

### 3. Test with Real Data
- Rebuild and update your widget
- Refresh the dashboard
- You should now see real Talk messages

## Useful Commands

### Docker Management
```bash
# Start Nextcloud
docker-compose up -d

# Stop Nextcloud
docker-compose down

# View logs
docker logs nextcloud-dev

# Restart Nextcloud
docker-compose restart
```

### Nextcloud Management
```bash
# List installed apps
docker exec nextcloud-dev php occ app:list

# Enable an app
docker exec nextcloud-dev php occ app:enable appname

# Disable an app
docker exec nextcloud-dev php occ app:disable appname

# Update an app
docker exec nextcloud-dev php occ app:update appname

# Check Nextcloud status
docker exec nextcloud-dev php occ status
```

### Widget Development
```bash
# Build widget
cd dashboardtalk && npm run build

# Watch for changes (development mode)
cd dashboardtalk && npm run dev

# Update widget in Nextcloud
docker exec nextcloud-dev php occ app:update dashboardtalk
```

## Troubleshooting

### Common Issues

1. **Docker not running**
   - Start Docker Desktop
   - Wait for it to fully start

2. **Port 8080 already in use**
   - Change the port in `docker-compose.yml`
   - Update the port mapping: `"8081:80"`

3. **Widget not appearing**
   - Check if the app is enabled: `docker exec nextcloud-dev php occ app:list`
   - Enable the widget: `docker exec nextcloud-dev php occ app:enable dashboardtalk`

4. **Build errors**
   - Check Node.js version: `node --version`
   - Reinstall dependencies: `cd dashboardtalk && npm install`

5. **Permission issues**
   - On Linux/Mac, you might need to run with `sudo`
   - Check Docker permissions

### Reset Everything
```bash
# Stop and remove all containers
docker-compose down -v

# Remove all volumes (this will delete all data!)
docker volume prune

# Start fresh
docker-compose up -d
```

## Production Deployment

Once your widget is working perfectly locally, you can deploy it to your production Nextcloud:

1. **Package your widget**:
   ```bash
   cd dashboardtalk
   tar -czf dashboardtalk.tar.gz --exclude=node_modules --exclude=.git .
   ```

2. **Upload to production Nextcloud**:
   - Copy the widget to your production Nextcloud's `apps` directory
   - Enable the app in the admin panel
   - Add the widget to your dashboard

## Benefits of Local Development

✅ **Real Nextcloud Environment**: Test with actual Nextcloud APIs
✅ **Talk Integration**: Test with real Talk conversations
✅ **Dashboard Integration**: See how your widget fits in the dashboard
✅ **Easy Iteration**: Make changes and see results immediately
✅ **No Risk**: Test without affecting production data
✅ **Full Control**: Modify Nextcloud settings as needed

This setup gives you a complete development environment that mirrors your production Nextcloud, allowing you to develop, test, and refine your dashboard widget with confidence!
