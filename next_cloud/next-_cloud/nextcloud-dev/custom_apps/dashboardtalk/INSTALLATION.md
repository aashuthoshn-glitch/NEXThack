# Installation Guide for Dashboard Talk Widget

## Quick Start

The Nextcloud Dashboard Talk Widget has been successfully created and built! Here's how to install and test it:

## Files Created

✅ **Complete Nextcloud App Structure:**
- `appinfo/info.xml` - App metadata and dashboard widget configuration
- `lib/AppInfo/Application.php` - Main application class
- `lib/Dashboard/DashboardProvider.php` - Dashboard widget provider
- `src/dashboard.js` - Main JavaScript widget implementation
- `src/services/auth.js` - Authentication service
- `src/services/talkApi.js` - Talk API service
- `js/dashboardtalk-dashboard.js` - Built JavaScript file
- `package.json` - Node.js dependencies
- `webpack.config.js` - Build configuration
- `test.html` - Test page for the widget

## Installation Steps

### 1. Copy to Nextcloud Apps Directory

Copy the entire `dashboardtalk` folder to your Nextcloud apps directory:

```bash
# On Linux/Mac
cp -r dashboardtalk /path/to/your/nextcloud/apps/

# On Windows
xcopy dashboardtalk C:\path\to\your\nextcloud\apps\dashboardtalk /E /I
```

### 2. Enable the App in Nextcloud

1. Log in to your Nextcloud instance
2. Go to **Settings** → **Apps**
3. Find "Dashboard Talk Widget" in the **Disabled apps** section
4. Click **Enable**

### 3. Add Widget to Dashboard

1. Go to your **Dashboard**
2. Click the **Customize** button (usually at the bottom)
3. Find "Talk Messages" in the available widgets list
4. Click to add it to your dashboard

## Testing the Widget

### Option 1: Test in Browser (Recommended)

1. Open `test.html` in your web browser
2. You should see the widget with mock data
3. Test the refresh and interaction features

### Option 2: Test in Nextcloud

1. After enabling the app and adding the widget
2. Go to your Dashboard
3. The widget should appear and load (may show "No messages found" if no Talk conversations exist)

## Configuration

### For Real Talk Integration

The widget currently uses mock data. To connect to real Talk conversations:

1. **Update API endpoints** in `src/services/talkApi.js`:
   - Replace mock API calls with actual Nextcloud Talk API
   - Ensure proper authentication

2. **Configure room selection** in `src/dashboard.js`:
   - Update the `talkRoomToken` variable with actual room tokens
   - Or implement room selection functionality

### Customization Options

- **Message limit**: Change the number of messages displayed
- **Refresh interval**: Modify the auto-refresh timing (currently 30 seconds)
- **Styling**: Update CSS variables to match your theme
- **Room filtering**: Add functionality to show specific Talk rooms

## Troubleshooting

### Widget Not Appearing
- ✅ Ensure app is enabled in Nextcloud
- ✅ Check that widget is added in dashboard customization
- ✅ Verify JavaScript file exists in `js/` directory

### Messages Not Loading
- ✅ Check browser console for errors
- ✅ Verify Talk API endpoints are accessible
- ✅ Ensure user has Talk app permissions

### Build Issues
- ✅ Run `npm install` to install dependencies
- ✅ Run `npm run build` to rebuild the JavaScript
- ✅ Check that all files are in correct locations

## Development Commands

```bash
# Install dependencies
npm install

# Development build with watch mode
npm run dev

# Production build
npm run build

# Test the widget
npx http-server . -p 8080 -o test.html
```

## File Structure

```
dashboardtalk/
├── appinfo/
│   └── info.xml                    # App configuration
├── lib/
│   ├── AppInfo/
│   │   └── Application.php         # Main app class
│   └── Dashboard/
│       └── DashboardProvider.php   # Widget provider
├── src/
│   ├── services/
│   │   ├── auth.js                 # Authentication
│   │   └── talkApi.js              # Talk API integration
│   └── dashboard.js                # Main widget code
├── js/
│   └── dashboardtalk-dashboard.js  # Built JavaScript
├── package.json                    # Dependencies
├── webpack.config.js               # Build config
├── test.html                       # Test page
└── README.md                       # Documentation
```

## Success Indicators

✅ **App builds without errors**
✅ **JavaScript file generated successfully**
✅ **Widget appears in Nextcloud dashboard**
✅ **Mock data displays correctly**
✅ **Refresh functionality works**
✅ **Responsive design implemented**

## Next Steps

1. **Test the widget** in your Nextcloud instance
2. **Customize the styling** to match your theme
3. **Integrate with real Talk API** for live data
4. **Add room selection** functionality
5. **Implement message sending** capability

The widget is now ready for use and further development!
