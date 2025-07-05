# Deployment Checklist for Email Verification Update

## Pre-Deployment Steps

### 1. Environment Variables on Digital Ocean
SSH into your droplet and update `/var/www/explore.pe/.env.local`:

```bash
# Add these new variables:
NEXTAUTH_URL=https://explore.pe
NEXTAUTH_SECRET=your-generated-secret-here

# Email configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@explore.pe
SMTP_PASS=your-app-password
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 2. Ensure HTTPS is Working
NextAuth requires HTTPS in production. Verify your SSL certificate is active.

### 3. Update Google Maps API Restrictions
Add your production domain to allowed referrers in Google Cloud Console.

## Deployment Steps

The GitHub Actions workflow will automatically:
1. Pull latest code
2. Run `npm install` (installs new dependencies)
3. Run `npm run build`
4. Restart PM2 process

## Post-Deployment Verification

1. **Test Registration Flow**
   - Register a new guide
   - Check email delivery
   - Verify email link works

2. **Test Login**
   - Login with verified account
   - Access dashboard
   - Test logout

3. **Check Logs**
   ```bash
   pm2 logs explore-pe
   ```

4. **Monitor for Errors**
   - Check for email sending failures
   - Verify database connections
   - Monitor memory usage

## Troubleshooting

### If emails aren't sending:
- Check SMTP credentials
- Verify app password is correct
- Check PM2 logs for errors

### If login isn't working:
- Ensure NEXTAUTH_URL matches your domain exactly
- Check NEXTAUTH_SECRET is set
- Verify HTTPS is working

### If build fails:
- Check npm install completed
- Verify all environment variables are set
- Check disk space