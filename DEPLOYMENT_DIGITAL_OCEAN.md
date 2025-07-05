# Digital Ocean Deployment Instructions for Explore.pe

## Prerequisites
- Digital Ocean account
- Domain name (explore.pe)
- MongoDB Atlas account (or self-hosted MongoDB)
- SendGrid account for email services

## Step 1: Create a Digital Ocean Droplet

1. Log in to Digital Ocean
2. Create a new Droplet:
   - Choose Ubuntu 22.04 LTS
   - Select plan: Basic (minimum 2GB RAM recommended)
   - Choose datacenter region (preferably closest to Peru)
   - Add SSH keys for secure access
   - Enable monitoring and backups (recommended)
   - Create droplet

## Step 2: Initial Server Setup

SSH into your droplet:
```bash
ssh root@your-droplet-ip
```

Create a new user:
```bash
adduser deploy
usermod -aG sudo deploy
```

Set up firewall:
```bash
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

## Step 3: Install Required Software

```bash
# Update system
apt update && apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
apt install -y nodejs

# Install PM2 globally
npm install -g pm2

# Install Nginx
apt install -y nginx

# Install Certbot for SSL
apt install -y certbot python3-certbot-nginx
```

## Step 4: Clone and Setup Application

Switch to deploy user:
```bash
su - deploy
```

Clone repository:
```bash
git clone https://github.com/victoraul1/explore.pe.git
cd explore.pe
```

## Step 5: Configure Environment Variables

Create `.env.local` file:
```bash
nano .env.local
```

Add the following variables:
```
# Database
MONGODB_URI=your-mongodb-connection-string

# NextAuth
NEXTAUTH_URL=https://explore.pe
NEXTAUTH_SECRET=your-generated-secret

# SendGrid
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_FROM_EMAIL=noreply@explore.pe
SENDGRID_VERIFIED_SENDER=your-verified-email

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Geocoding
OPENCAGE_API_KEY=your-opencage-api-key
```

Generate NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

## Step 6: Build and Install Application

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Create uploads directory
mkdir -p public/uploads/guides
chmod 755 public/uploads/guides
```

## Step 7: Setup PM2

Create PM2 ecosystem file:
```bash
nano ecosystem.config.js
```

Add:
```javascript
module.exports = {
  apps: [{
    name: 'explore-pe',
    script: 'npm',
    args: 'start',
    cwd: '/home/deploy/explore.pe',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
```

Start application:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy
```

## Step 8: Configure Nginx

Create Nginx configuration:
```bash
sudo nano /etc/nginx/sites-available/explore.pe
```

Add:
```nginx
server {
    listen 80;
    server_name explore.pe www.explore.pe;

    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /uploads {
        alias /home/deploy/explore.pe/public/uploads;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/explore.pe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 9: Setup SSL Certificate

```bash
sudo certbot --nginx -d explore.pe -d www.explore.pe
```

## Step 10: Setup Automatic Deployment (Optional)

The repository already includes GitHub Actions workflow for automatic deployment.

To enable it:
1. Go to your GitHub repository settings
2. Add the following secrets:
   - `DROPLET_IP`: Your Digital Ocean droplet IP
   - `SSH_PRIVATE_KEY`: Your SSH private key for the deploy user

## Step 11: Monitoring and Maintenance

View application logs:
```bash
pm2 logs explore-pe
```

Monitor application:
```bash
pm2 monit
```

Update application:
```bash
cd /home/deploy/explore.pe
git pull
npm install
npm run build
pm2 restart explore-pe
```

## Step 12: Backup Strategy

1. **Database Backup**: Set up automated MongoDB backups
2. **Upload Directory**: Regular backup of `/home/deploy/explore.pe/public/uploads`
3. **Server Snapshots**: Use Digital Ocean's backup feature

## Security Recommendations

1. Keep system updated:
   ```bash
   apt update && apt upgrade -y
   ```

2. Configure fail2ban:
   ```bash
   apt install fail2ban -y
   ```

3. Disable root SSH login:
   ```bash
   nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   systemctl restart ssh
   ```

4. Regular security audits
5. Monitor server resources and logs

## Troubleshooting

Common issues:

1. **502 Bad Gateway**: Check if PM2 process is running
2. **Permission errors**: Ensure deploy user owns all application files
3. **Upload issues**: Check directory permissions and disk space
4. **Memory issues**: Monitor with `pm2 monit` and consider upgrading droplet

For logs:
- Application logs: `pm2 logs`
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -xe`

## Performance Optimization

1. Enable Nginx caching for static assets
2. Use CDN for images (Cloudflare recommended)
3. Enable gzip compression in Nginx
4. Consider using Redis for session storage
5. Implement image optimization pipeline

## Contact Support

For issues specific to the application, check the GitHub repository issues or contact the development team.