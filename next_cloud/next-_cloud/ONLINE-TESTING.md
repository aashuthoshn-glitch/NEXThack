# Testing with Online Nextcloud

If you want to test your widget quickly without setting up a local environment, you can use online Nextcloud instances.

## Option 1: Nextcloud Demo

### 1. Access Demo Instance
- Go to: https://demo.nextcloud.com
- Create a free account or use existing credentials

### 2. Install Your Widget
Since you can't install custom apps on the demo, you can:
- Test the widget functionality in a browser
- Use the test.html file we created
- Verify the JavaScript works correctly

### 3. Test Widget
```bash
# Run the test server
cd dashboardtalk
npx http-server . -p 8080 -o test.html
```

## Option 2: Nextcloud All-in-One (Cloud)

### 1. Deploy to Cloud
- Use services like DigitalOcean, AWS, or Google Cloud
- Deploy Nextcloud All-in-One
- Install your widget there

### 2. Development Workflow
- Make changes locally
- Upload to your cloud instance
- Test in real environment

## Option 3: GitHub Codespaces

### 1. Create Repository
```bash
# Initialize git repository
git init
git add .
git commit -m "Initial Nextcloud dashboard widget"

# Push to GitHub
git remote add origin https://github.com/yourusername/nextcloud-dashboard-widget.git
git push -u origin main
```

### 2. Use Codespaces
- Go to your GitHub repository
- Click "Code" → "Codespaces" → "Create codespace"
- Use the cloud development environment

## Immediate Testing (Recommended)

For immediate testing, let's use the test environment we already created:
