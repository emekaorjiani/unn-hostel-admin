# UNN Hostel Admin - HestiaCP Deployment Guide

This guide provides step-by-step instructions for deploying the UNN Hostel Admin Next.js application to your HestiaCP server.

## 📋 Prerequisites

Your HestiaCP server should have:
- ✅ Node.js (v18 or higher) - Already installed
- ✅ Yarn package manager - Already installed  
- ✅ Nginx - Already installed via HestiaCP
- ✅ PM2 (for process management) - Will install if needed
- ✅ A domain name configured in HestiaCP

## 🚀 Quick Deployment

### Step 1: Prepare Your Local Environment

```bash
# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment preparation script
./deploy.sh
```

### Step 2: Deploy to HestiaCP

```bash
# Run the HestiaCP deployment helper
./hestiacp-deploy.sh
```

The helper script will:
- Ask for your domain name
- Ask for your HestiaCP username (usually 'admin')
- Copy files to the correct directory
- Set proper permissions
- Install dependencies and build the app
- Configure Nginx

## 🔧 Manual Deployment (Alternative)

If you prefer manual deployment:

### 1. Transfer Files to Server

```bash
# Transfer files to your server
scp -r . user@your-server-ip:/tmp/unn-hostel-admin

# SSH into your server
ssh user@your-server-ip
```

### 2. Setup Directory Structure

```bash
# Create web directory (replace 'yourdomain.com' with your actual domain)
DOMAIN="yourdomain.com"
WEB_DIR="/home/admin/web/$DOMAIN/public_html"

# Create directory
sudo mkdir -p "$WEB_DIR"

# Copy files
sudo cp -r /tmp/unn-hostel-admin/* "$WEB_DIR/"

# Set ownership
sudo chown -R admin:admin "$WEB_DIR"

# Set permissions
sudo chmod -R 755 "$WEB_DIR"
sudo chmod 600 "$WEB_DIR/.env.local"
```

### 3. Install Dependencies and Build

```bash
# Navigate to web directory
cd "$WEB_DIR"

# Install dependencies
yarn install --frozen-lockfile

# Build the application
yarn build
```

## 🌐 HestiaCP Nginx Configuration

### Method 1: Using HestiaCP Control Panel

1. **Login to HestiaCP Control Panel**
2. **Go to Web > your-domain.com > Edit**
3. **Add the following Nginx configuration:**

```nginx
# Handle Next.js static files
location /_next/static {
    alias /home/admin/web/your-domain.com/public_html/.next/static;
    expires 365d;
    access_log off;
    add_header Cache-Control "public, immutable";
}

# Handle public files
location /public {
    alias /home/admin/web/your-domain.com/public_html/public;
    expires 30d;
    access_log off;
}

# Handle API routes
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}

# Handle all other routes (Next.js will handle routing)
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

4. **Save the configuration**
5. **Restart Nginx**

### Method 2: Direct File Edit

```bash
# Edit the Nginx configuration file
sudo nano /home/admin/conf/web/your-domain.com.nginx.ssl.conf

# Add the configuration above to the server block
# Save and exit (Ctrl+X, Y, Enter)

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## 🚀 Process Management with PM2

### Install PM2 (if not already installed)

```bash
# Install PM2 globally
sudo npm install -g pm2
```

### Start the Application

```bash
# Navigate to your application directory
cd /home/admin/web/your-domain.com/public_html

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Follow the instructions provided by pm2 startup
```

### PM2 Management Commands

```bash
# View all processes
pm2 list

# Monitor processes
pm2 monit

# View logs
pm2 logs unn-hostel-admin

# Restart application
pm2 restart unn-hostel-admin

# Stop application
pm2 stop unn-hostel-admin

# Delete application from PM2
pm2 delete unn-hostel-admin
```

## 🔒 SSL Configuration

### Using HestiaCP SSL

1. **In HestiaCP Control Panel:**
   - Go to Web > your-domain.com > Edit
   - Enable SSL
   - Choose Let's Encrypt or upload your own certificate

### Manual SSL Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal (already configured by HestiaCP)
```

## 🔧 Environment Configuration

### Production Environment File

Create/update `.env.local` in your web directory:

```env
# Backend API Configuration
NEXT_PUBLIC_BACKEND_API_URL=https://api.unnaccomodation.com/api
BACKEND_API_URL=https://api.unnaccomodation.com/api

# Frontend Configuration
NEXT_PUBLIC_APP_NAME="UNN Hostel Admin"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# API Configuration
API_TIMEOUT=30000
API_RETRY_ATTEMPTS=3

# Authentication Configuration
JWT_SECRET=your-secure-production-jwt-secret
JWT_EXPIRES_IN=24h

# Production Configuration
NODE_ENV=production
NEXT_PUBLIC_DEBUG_MODE=false

# Dashboard Configuration
DASHBOARD_REFRESH_INTERVAL=30000
DASHBOARD_MAX_RETRIES=3
```

## 📊 Monitoring and Maintenance

### Application Monitoring

```bash
# PM2 monitoring dashboard
pm2 monit

# View application logs
pm2 logs unn-hostel-admin

# System resource usage
htop
df -h
free -h
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Domain-specific logs (if configured)
sudo tail -f /home/admin/logs/web/your-domain.com.log
```

### Backup Strategy

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/admin/backup/unn-hostel-admin"
DATE=$(date +%Y%m%d_%H%M%S)
DOMAIN="your-domain.com"

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz /home/admin/web/$DOMAIN/public_html

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh
```

## 🔄 Deployment Updates

### Zero-Downtime Updates

```bash
# Navigate to application directory
cd /home/admin/web/your-domain.com/public_html

# Pull latest changes (if using git)
git pull origin main

# Install dependencies
yarn install --frozen-lockfile

# Build application
yarn build

# Reload application (zero-downtime)
pm2 reload unn-hostel-admin
```

### Rollback Strategy

```bash
# PM2 rollback (if using PM2 ecosystem)
pm2 rollback unn-hostel-admin

# Manual rollback
cd /home/admin/web/your-domain.com/public_html
git checkout <previous-commit>
yarn install
yarn build
pm2 reload unn-hostel-admin
```

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 Already in Use**
   ```bash
   # Check what's using port 3000
   sudo lsof -i :3000
   
   # Kill the process
   sudo kill -9 <PID>
   ```

2. **Permission Denied**
   ```bash
   # Fix ownership
   sudo chown -R admin:admin /home/admin/web/your-domain.com/public_html
   
   # Fix permissions
   sudo chmod -R 755 /home/admin/web/your-domain.com/public_html
   sudo chmod 600 /home/admin/web/your-domain.com/public_html/.env.local
   ```

3. **Build Failures**
   ```bash
   # Clear cache and rebuild
   rm -rf .next node_modules
   yarn install
   yarn build
   ```

4. **Nginx Configuration Errors**
   ```bash
   # Test Nginx configuration
   sudo nginx -t
   
   # Check HestiaCP Nginx config
   sudo cat /home/admin/conf/web/your-domain.com.nginx.ssl.conf
   ```

5. **PM2 Issues**
   ```bash
   # Reset PM2
   pm2 kill
   pm2 start ecosystem.config.js
   pm2 save
   ```

### Performance Optimization

1. **Enable Gzip Compression** (already in Nginx config)
2. **Configure Caching Headers**
3. **Monitor Memory Usage**
4. **Optimize Database Queries**
5. **Use CDN for Static Assets**

## 🔧 HestiaCP-Specific Commands

### HestiaCP CLI Commands

```bash
# List all web domains
v-list-web-domains admin

# List domain configuration
v-list-web-domain admin your-domain.com

# Restart web services
v-restart-web

# Update HestiaCP
v-update-sys-hestia
```

### File Locations

- **Web Directory**: `/home/admin/web/your-domain.com/public_html/`
- **Nginx Config**: `/home/admin/conf/web/your-domain.com.nginx.ssl.conf`
- **SSL Certificates**: `/home/admin/conf/web/ssl/your-domain.com/`
- **Logs**: `/home/admin/logs/web/your-domain.com.log`

## 📞 Support

For deployment issues:

1. **Check application logs**: `pm2 logs unn-hostel-admin`
2. **Check Nginx logs**: `sudo tail -f /var/log/nginx/error.log`
3. **Verify environment configuration**
4. **Test API connectivity**
5. **Check HestiaCP web domain settings**

## 🔄 Continuous Deployment

Consider setting up automated deployment:

1. **GitHub Actions** with SSH deployment
2. **Webhook-based deployment**
3. **Scheduled backups**
4. **Health monitoring**

---

**Note**: Always test your deployment in a staging environment before deploying to production. Keep backups of your application and database before making any changes.
