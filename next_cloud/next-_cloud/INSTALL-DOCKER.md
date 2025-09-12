# Installing Docker for Nextcloud Development

## Windows Installation

### 1. Download Docker Desktop
- Go to: https://www.docker.com/products/docker-desktop
- Click "Download for Windows"
- Run the installer as Administrator

### 2. System Requirements
- Windows 10 64-bit: Pro, Enterprise, or Education (Build 15063 or later)
- Windows 11 64-bit: Home or Pro version 21H2 or higher
- WSL 2 feature enabled
- Virtualization enabled in BIOS

### 3. Installation Steps
1. Run the Docker Desktop installer
2. Follow the installation wizard
3. Restart your computer when prompted
4. Start Docker Desktop
5. Wait for Docker to fully start (you'll see a whale icon in the system tray)

### 4. Verify Installation
Open PowerShell and run:
```bash
docker --version
docker-compose --version
```

### 5. Enable WSL 2 (if needed)
If you get WSL 2 errors:
1. Open PowerShell as Administrator
2. Run: `wsl --install`
3. Restart your computer
4. Start Docker Desktop again

## Alternative: Use Docker without Installation

If you can't install Docker, you can use online Docker services:

### 1. GitHub Codespaces
- Create a GitHub repository with your code
- Use GitHub Codespaces for cloud development
- Includes Docker pre-installed

### 2. GitPod
- Go to https://gitpod.io
- Connect your GitHub repository
- Use the cloud development environment

## After Docker Installation

Once Docker is installed, run:
```bash
setup-local-nextcloud.bat
```

This will automatically set up your local Nextcloud development environment!
