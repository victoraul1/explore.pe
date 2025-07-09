#!/bin/bash

# Deployment script for explore.pe

echo "Starting deployment..."

# Pull latest changes
echo "Pulling latest changes..."
git pull

# Install dependencies if package.json changed
echo "Installing dependencies..."
npm install

# Build the project
echo "Building project..."
npm run build

# Create logs directory if it doesn't exist
mkdir -p logs

# Stop the current PM2 process
echo "Stopping current PM2 process..."
pm2 stop explore-pe || true

# Delete the old process
pm2 delete explore-pe || true

# Start with ecosystem config
echo "Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Wait for application to start
echo "Waiting for application to start..."
sleep 10

# Check if application is running
pm2 status

# Check logs
echo "Recent logs:"
pm2 logs explore-pe --lines 20 --nostream

# Set up admin password
echo "Setting up admin password..."
curl -X POST http://localhost:3000/api/admin/setup-admin-password \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"

echo ""
echo "Deployment complete!"
echo "Check the application at https://explore.pe"
echo ""
echo "To view logs: pm2 logs explore-pe"
echo "To monitor: pm2 monit"