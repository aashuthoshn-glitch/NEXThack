#!/bin/bash

echo "========================================"
echo "Setting up Local Nextcloud Development"
echo "========================================"

echo ""
echo "Step 1: Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "ERROR: Docker is not installed!"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "ERROR: Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "Docker is installed and running."

echo ""
echo "Step 2: Creating development directory..."
mkdir -p nextcloud-dev
cd nextcloud-dev

echo ""
echo "Step 3: Copying dashboard widget to Nextcloud apps..."
mkdir -p custom_apps
cp -r ../dashboardtalk custom_apps/

echo ""
echo "Step 4: Starting Nextcloud with Docker Compose..."
docker-compose up -d

echo ""
echo "Step 5: Waiting for Nextcloud to initialize..."
sleep 30

echo ""
echo "Step 6: Installing Talk app..."
docker exec nextcloud-dev php occ app:install spreed

echo ""
echo "Step 7: Enabling Talk app..."
docker exec nextcloud-dev php occ app:enable spreed

echo ""
echo "Step 8: Enabling dashboard widget..."
docker exec nextcloud-dev php occ app:enable dashboardtalk

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Nextcloud is now running at: http://localhost:8080"
echo "Admin username: admin"
echo "Admin password: admin123"
echo ""
echo "Your dashboard widget is installed and ready for development!"
echo ""
echo "To make changes:"
echo "1. Edit files in the dashboardtalk folder"
echo "2. Run: docker exec nextcloud-dev php occ app:update dashboardtalk"
echo "3. Refresh your browser"
echo ""
echo "To stop Nextcloud: docker-compose down"
echo "To restart: docker-compose up -d"
echo ""
