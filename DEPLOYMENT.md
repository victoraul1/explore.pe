# Deployment Guide for Explore.pe

## GitHub Setup

1. **Push to GitHub:**
```bash
# If you haven't authenticated, use GitHub CLI or personal access token
gh auth login
# OR configure git with your credentials
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"

# Push the code
git push -u origin main
```

## Digital Ocean Deployment

### Option 1: App Platform (Recommended for ease)

1. Go to Digital Ocean App Platform
2. Connect your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Run Command: `npm start`
4. Set environment variables:
   - `MONGODB_URI` - Your production MongoDB connection string
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key
   - `NEXT_PUBLIC_YOUTUBE_API_KEY` - Your YouTube API key

### Option 2: Droplet Deployment

1. **SSH into your droplet:**
```bash
ssh root@your-droplet-ip
```

2. **Install Node.js and PM2:**
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2
```

3. **Install MongoDB (or use MongoDB Atlas):**
```bash
# For local MongoDB
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

4. **Clone and setup the repository:**
```bash
cd /var/www
git clone https://github.com/victoraul1/explore.pe.git
cd explore.pe/explore-pe
npm install
```

5. **Create production environment file:**
```bash
cp .env.example .env
nano .env
# Add your production values
```

6. **Build the application:**
```bash
npm run build
```

7. **Start with PM2:**
```bash
pm2 start npm --name "explore-pe" -- start
pm2 save
pm2 startup
```

8. **Setup Nginx:**
```bash
sudo apt-get install nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/explore.pe
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name explore.pe www.explore.pe;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. **Enable the site:**
```bash
sudo ln -s /etc/nginx/sites-available/explore.pe /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

10. **Setup SSL with Let's Encrypt:**
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d explore.pe -d www.explore.pe
```

## Important Production Considerations

1. **MongoDB**: Use MongoDB Atlas for production instead of local MongoDB
2. **Environment Variables**: Never commit `.env.local` to git
3. **API Keys**: 
   - Add production domains to Google Maps API restrictions
   - Secure all API keys properly
4. **Domain**: Point your explore.pe domain to Digital Ocean nameservers

## Continuous Deployment

For automatic deployments when you push to GitHub:

1. Use Digital Ocean App Platform (automatic)
2. Or set up GitHub Actions with your droplet

## Monitoring

```bash
# View logs
pm2 logs explore-pe

# Monitor performance
pm2 monit
```