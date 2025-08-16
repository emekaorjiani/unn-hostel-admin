# UNN Hostel Admin - Deployment Guide

This guide provides comprehensive instructions for deploying the UNN Hostel Admin Next.js application to your server using Yarn.

## 📋 Prerequisites

Before deploying, ensure your server has the following installed:

- **Node.js** (v18 or higher)
- **Yarn** (latest stable version)
- **Nginx** (for reverse proxy)
- **PM2** (for process management) - optional
- **SSL Certificate** (for HTTPS)

## 🚀 Quick Deployment

### 1. Prepare Your Local Environment

```bash
# Clone or prepare your project
cd /path/to/your/project

# Make the deployment script executable
chmod +x deploy.sh

# Run the deployment preparation script
./deploy.sh
```

### 2. Transfer Files to Server

```bash
# Transfer the entire project to your server
scp -r . user@your-server-ip:/var/www/unn-hostel-admin

# Or use rsync for better performance
rsync -avz --exclude 'node_modules' --exclude '.git' . user@your-server-ip:/var/www/unn-hostel-admin/
```

### 3. Server Setup

SSH into your server and run:

```bash
# Navigate to the project directory
cd /var/www/unn-hostel-admin

# Make deployment script executable
chmod +x deploy.sh

# Run the deployment script
./deploy.sh
```

## 🔧 Detailed Server Configuration

### 1. Install Dependencies

```bash
# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Yarn
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor | sudo tee /usr/share/keyrings/yarnkey.gpg >/dev/null
echo "deb [signed-by=/usr/share/keyrings/yarnkey.gpg] https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
sudo apt install yarn

# Verify installations
node --version
yarn --version
```

### 2. Environment Configuration

Create and configure your production environment file:

```bash
# Create production environment file
nano .env.local
```

Add the following configuration (update values as needed):

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

### 3. Build and Deploy

```bash
# Install dependencies
yarn install --frozen-lockfile

# Build the application
yarn build

# Test the build
yarn start
```

## 🚀 Process Management Options

### Option A: Using PM2 (Recommended)

PM2 provides advanced process management, monitoring, and auto-restart capabilities.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start the application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup

# Monitor the application
pm2 monit

# View logs
pm2 logs unn-hostel-admin
```

### Option B: Using Systemd

Systemd provides native Linux service management.

```bash
# Copy the service file
sudo cp unn-hostel-admin.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable the service
sudo systemctl enable unn-hostel-admin

# Start the service
sudo systemctl start unn-hostel-admin

# Check status
sudo systemctl status unn-hostel-admin

# View logs
sudo journalctl -u unn-hostel-admin -f
```

## 🌐 Nginx Configuration

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Configure Nginx

```bash
# Copy the Nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/unn-hostel-admin

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/unn-hostel-admin /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3. SSL Certificate Setup

For production, you should use SSL certificates. You can use Let's Encrypt:

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🔒 Security Considerations

### 1. Firewall Configuration

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### 2. File Permissions

```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/unn-hostel-admin

# Set proper permissions
sudo chmod -R 755 /var/www/unn-hostel-admin
sudo chmod 600 /var/www/unn-hostel-admin/.env.local
```

### 3. Environment Variables

- Never commit `.env.local` to version control
- Use strong, unique JWT secrets
- Regularly rotate secrets
- Use environment-specific configurations

## 📊 Monitoring and Maintenance

### 1. Application Monitoring

```bash
# PM2 monitoring
pm2 monit

# System monitoring
htop
df -h
free -h
```

### 2. Log Management

```bash
# Application logs
pm2 logs unn-hostel-admin

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u unn-hostel-admin -f
```

### 3. Backup Strategy

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/unn-hostel-admin"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/backup_$DATE.tar.gz /var/www/unn-hostel-admin

# Keep only last 7 days of backups
find $BACKUP_DIR -name "backup_*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh
```

## 🔄 Deployment Updates

### 1. Zero-Downtime Deployment

```bash
# Pull latest changes
git pull origin main

# Install dependencies
yarn install --frozen-lockfile

# Build application
yarn build

# Restart application (PM2)
pm2 reload unn-hostel-admin

# Or restart service (systemd)
sudo systemctl restart unn-hostel-admin
```

### 2. Rollback Strategy

```bash
# PM2 rollback
pm2 rollback unn-hostel-admin

# Manual rollback
git checkout <previous-commit>
yarn install
yarn build
pm2 reload unn-hostel-admin
```

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using port 3000
   sudo lsof -i :3000
   
   # Kill the process
   sudo kill -9 <PID>
   ```

2. **Permission Denied**
   ```bash
   # Fix ownership
   sudo chown -R www-data:www-data /var/www/unn-hostel-admin
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
   # Test configuration
   sudo nginx -t
   
   # Check syntax
   sudo nginx -T
   ```

### Performance Optimization

1. **Enable Gzip Compression** (already in nginx.conf)
2. **Configure Caching Headers**
3. **Use CDN for Static Assets**
4. **Monitor Memory Usage**
5. **Optimize Database Queries**

## 📞 Support

For deployment issues:

1. Check application logs: `pm2 logs unn-hostel-admin`
2. Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify environment configuration
4. Test API connectivity
5. Check firewall settings

## 🔄 Continuous Deployment

Consider setting up CI/CD pipelines using:
- GitHub Actions
- GitLab CI
- Jenkins
- Docker containers

This will automate the deployment process and ensure consistent deployments.

---

**Note**: Always test your deployment in a staging environment before deploying to production. Keep backups of your application and database before making any changes.
