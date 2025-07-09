#!/bin/bash

# Script to set up admin user with specified credentials
# Run this on the production server after pulling the latest code

echo "Setting up admin user..."

# Make the API call to set up admin password
curl -X POST https://explore.pe/api/admin/setup-admin-password \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"

echo ""
echo "Admin setup complete!"
echo "You can now log in at https://explore.pe/login with:"
echo "Email: info@explore.pe"
echo "Password: Nicolas#77"