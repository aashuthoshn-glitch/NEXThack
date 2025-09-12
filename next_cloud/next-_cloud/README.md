# Dashboard Talk Widget

A Nextcloud dashboard widget that displays recent messages from Nextcloud Talk conversations, allowing users to quickly view and interact with their Talk messages directly from the dashboard.

## Features

- Display recent messages from Nextcloud Talk conversations
- Real-time message updates (refreshes every 30 seconds)
- Click to open conversations in Talk app
- Responsive design that fits well in the Nextcloud dashboard
- Clean, modern UI following Nextcloud design guidelines

## Installation

### Prerequisites

- Nextcloud server (version 25 or higher)
- Node.js and npm for building the frontend assets
- PHP 8.0 or higher

### Setup Instructions

1. **Copy the app to your Nextcloud apps directory:**
   ```bash
   cp -r dashboardtalk /path/to/your/nextcloud/apps/
   ```

2. **Install dependencies and build the frontend:**
   ```bash
   cd /path/to/your/nextcloud/apps/dashboardtalk
   npm install
   npm run build
   ```

3. **Enable the app in Nextcloud:**
   - Log in to your Nextcloud instance
   - Go to Apps section
   - Find "Dashboard Talk Widget" in the disabled apps
   - Click "Enable"

4. **Add the widget to your dashboard:**
   - Go to your Dashboard
   - Click the "Customize" button
   - Select "Talk Messages" from the available widgets
   - The widget will appear on your dashboard

## Configuration

### Setting up Talk API Integration

The widget currently uses mock data for demonstration. To integrate with the actual Nextcloud Talk API:

1. **Update the API service** in `src/services/talkApi.js`:
   - Replace the mock API calls with actual Nextcloud Talk API endpoints
   - Ensure proper authentication is handled
   - Update the base URL to match your Nextcloud instance

2. **Configure authentication** in `src/services/auth.js`:
   - The service uses Nextcloud's built-in authentication
   - Make sure the user is properly authenticated before making API calls

### Customizing the Widget

- **Styling**: Modify the CSS in `src/dashboard.js` to match your theme
- **Message limit**: Change the number of messages displayed by modifying the `limit` parameter
- **Refresh interval**: Adjust the auto-refresh timing (currently 30 seconds)
- **Room selection**: Add functionality to select specific Talk rooms

## Development

### Building the Frontend

```bash
# Development build with watch mode
npm run dev

# Production build
npm run build
```

### Testing

Open `test.html` in your browser to test the widget functionality outside of Nextcloud.

### File Structure

```
dashboardtalk/
├── appinfo/
│   └── info.xml              # App metadata and configuration
├── lib/
│   ├── AppInfo/
│   │   └── Application.php   # Main app class
│   └── Dashboard/
│       └── DashboardProvider.php  # Dashboard widget provider
├── src/
│   ├── components/
│   │   └── TalkWidget.vue    # Vue component (alternative implementation)
│   ├── services/
│   │   ├── auth.js           # Authentication service
│   │   └── talkApi.js        # Talk API service
│   ├── views/
│   │   └── Dashboard.vue     # Main dashboard view
│   └── dashboard.js          # Main JavaScript implementation
├── js/
│   └── dashboardtalk-dashboard.js  # Built JavaScript file
├── package.json              # Node.js dependencies
├── webpack.config.js         # Webpack configuration
└── README.md                 # This file
```

## API Integration

The widget integrates with the Nextcloud Talk API using the following endpoints:

- `GET /ocs/v2.php/apps/spreed/api/v4/room` - Get all conversations
- `GET /ocs/v2.php/apps/spreed/api/v4/chat/{token}` - Get messages from a conversation
- `GET /ocs/v2.php/apps/spreed/api/v4/room/{token}` - Get conversation details

## Troubleshooting

### Common Issues

1. **Widget not appearing on dashboard:**
   - Ensure the app is enabled in Nextcloud
   - Check that the widget is added in dashboard customization
   - Verify the JavaScript file is built and accessible

2. **Messages not loading:**
   - Check browser console for JavaScript errors
   - Verify Talk API endpoints are accessible
   - Ensure user has proper permissions for Talk conversations

3. **Styling issues:**
   - Check that Nextcloud CSS variables are available
   - Verify the widget container has proper dimensions

### Debug Mode

Enable debug mode by opening browser developer tools and checking the console for error messages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the AGPL-3.0 License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the project repository
- Check Nextcloud documentation for Talk API details
- Review Nextcloud app development guidelines