# Deployment Guide

This guide covers the deployment process for RiyaSaviya in production environments.

## 🚀 Production Deployment

### Prerequisites
- Production server (Ubuntu 20.04+ recommended)
- Node.js 18+
- MySQL 8.0+
- Nginx (for reverse proxy)
- SSL certificate
- AWS S3 bucket
- Domain name

### 1. Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PNPM
npm install -g pnpm

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 2. Database Setup

```sql
-- Create database
CREATE DATABASE riyasaviya CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user
CREATE USER 'riyasaviya'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON riyasaviya.* TO 'riyasaviya'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Application Setup

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/RajanthaR/web-manus-riyasaviya.git
sudo chown -R $USER:$USER /var/www/web-manus-riyasaviya
cd web-manus-riyasaviya

# Install dependencies
pnpm install

# Set up environment
cp .env.example .env
nano .env
```

Configure production environment variables:
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://riyasaviya:strong_password@localhost:3306/riyasaviya
JWT_SECRET=your-production-jwt-secret
AWS_ACCESS_KEY_ID=your-production-aws-key
AWS_SECRET_ACCESS_KEY=your-production-aws-secret
S3_BUCKET_NAME=your-production-bucket
OPENAI_API_KEY=your-production-openai-key
```

### 4. Build Application

```bash
# Build for production
pnpm build

# Run database migrations
pnpm db:push
```

### 5. PM2 Setup (Process Manager)

```bash
# Install PM2
npm install -g pm2

# Create PM2 config file
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'riyasaviya',
    script: 'dist/index.js',
    cwd: '/var/www/web-manus-riyasaviya',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Create logs directory
mkdir logs

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6. Nginx Configuration

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/riyasaviya
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Client max body size for file uploads
    client_max_body_size 50M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript;

    # Static files
    location /uploads/ {
        alias /var/www/web-manus-riyasaviya/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Proxy to Node.js app
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
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/riyasaviya /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL Certificate

```bash
# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Set up auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 8. Monitoring & Logging

```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs riyasaviya

# System log rotation
sudo nano /etc/logrotate.d/riyasaviya
```

```
/var/www/web-manus-riyasaviya/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 🔄 CI/CD Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install pnpm
      run: npm install -g pnpm
    
    - name: Install dependencies
      run: pnpm install
    
    - name: Run tests
      run: pnpm test
    
    - name: Build application
      run: pnpm build
      env:
        NODE_ENV: production
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/web-manus-riyasaviya
          git pull origin main
          pnpm install --prod
          pnpm build
          pm2 reload riyasaviya
```

## 🐳 Docker Deployment

### Dockerfile

```dockerfile
# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

# Production stage
FROM node:18-alpine AS production

RUN apk add --no-cache dumb-init

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=mysql://root:password@db:3306/riyasaviya
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: riyasaviya
    volumes:
      - mysql_data:/var/lib/mysql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

## 🔧 Environment-Specific Configurations

### Development
- Hot reload enabled
- Debug logs
- Local database
- Mock APIs for testing

### Staging
- Production-like environment
- Staging database
- Test data
- Performance monitoring

### Production
- Optimized build
- Clustered deployment
- Production database
- Full monitoring
- Error tracking (Sentry)
- Analytics (Google Analytics)

## 📊 Performance Optimization

### Database
- Enable query cache
- Add proper indexes
- Use connection pooling
- Regular backups

### Application
- Enable gzip compression
- Implement caching (Redis)
- Use CDN for static assets
- Optimize images
- Lazy loading

### Security
- Regular security updates
- Firewall configuration
- Rate limiting
- Input validation
- SQL injection prevention

## 🔍 Monitoring

### Application Monitoring
```bash
# PM2 monitoring
pm2 install pm2-server-monit

# Health check endpoint
curl https://your-domain.com/api/health
```

### System Monitoring
- Use UptimeRobot or Pingdom
- Set up alerts for downtime
- Monitor resource usage
- Track error rates

## 🚨 Troubleshooting

### Common Issues

1. **Application won't start**
   ```bash
   # Check logs
   pm2 logs riyasaviya
   
   # Check configuration
   pm2 show riyasaviya
   ```

2. **Database connection failed**
   ```bash
   # Test connection
   mysql -u riyasaviya -p riyasaviya
   
   # Check credentials
   # Verify firewall settings
   ```

3. **High memory usage**
   ```bash
   # Check memory
   pm2 monit
   
   # Restart if needed
   pm2 restart riyasaviya
   ```

4. **SSL certificate issues**
   ```bash
   # Check certificate
   sudo certbot certificates
   
   # Renew manually
   sudo certbot renew
   ```

### Backup Strategy

```bash
# Database backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u root -p riyasaviya > backup_$DATE.sql
gzip backup_$DATE.sql

# Upload to S3
aws s3 cp backup_$DATE.sql.gz s3://your-backup-bucket/
```

## 📞 Support

For deployment issues:
- Email: rajantha.rc@gmail.com
- GitHub: https://github.com/RajanthaR/
- Documentation: Check this guide and API.md

---

Remember to regularly update dependencies and security patches!
