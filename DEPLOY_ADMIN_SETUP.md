# Admin Setup Deployment Instructions

To set up the admin account with the credentials info@explore.pe / Nicolas#77, follow these steps on your production server:

## 1. Pull the latest changes
```bash
cd /var/www/explore-pe
git pull
```

## 2. Build the project
```bash
npm run build
```

## 3. Restart the application
```bash
pm2 restart explore-pe
```

## 4. Set up the admin password
Once the application is running, execute this command:
```bash
curl -X POST https://explore.pe/api/admin/setup-admin-password \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

You should see a response like:
```json
{"message":"Admin password updated successfully","email":"info@explore.pe"}
```

## 5. Test the admin login
- Go to https://explore.pe/login
- Enter email: info@explore.pe
- Enter password: Nicolas#77
- You should be redirected to /admin (the admin dashboard)

## Notes
- The admin user will NOT appear in public guide listings
- The admin can access /admin routes
- Regular users are redirected to /dashboard, admins to /admin