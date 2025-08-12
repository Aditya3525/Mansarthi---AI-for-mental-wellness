# Deployment Guide for Mansarthi

This guide covers various deployment options for the Mansarthi mental wellness application.

## Prerequisites

Before deploying, ensure you have:
- Node.js 14+ installed
- MongoDB instance (local or cloud)
- AI service API keys (OpenAI, Gemini, or Ollama setup)
- Domain name (for production)
- SSL certificate (for production)

## Environment Setup

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Configure environment variables:**
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/mental-wellbeing-app
   
   # AI Services (configure at least one)
   OPENAI_API_KEY=your_openai_key
   GEMINI_API_KEY=your_gemini_key
   OLLAMA_URL=http://localhost:11434
   
   # Server
   PORT=3000
   NODE_ENV=production
   
   # Security
   JWT_SECRET=your_secure_jwt_secret
   ```

## Local Development

```bash
# Install dependencies
npm install

# Start MongoDB (if local)
sudo service mongod start

# Run in development mode
npm run dev
```

## Production Deployment Options

### 1. Traditional VPS/Server Deployment

#### Step 1: Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Step 2: Application Deployment
```bash
# Clone repository
git clone https://github.com/Aditya3525/Mansarthi---AI-for-mental-wellness.git
cd Mansarthi---AI-for-mental-wellness

# Install dependencies
npm install --production

# Configure environment
cp .env.example .env
nano .env  # Edit with your configuration

# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start server.js --name "mansarthi"
pm2 startup
pm2 save
```

#### Step 3: Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/mansarthi
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

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
sudo ln -s /etc/nginx/sites-available/mansarthi /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 2. Docker Deployment

#### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 3000

CMD ["npm", "start"]
```

#### Step 2: Create docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/mental-wellbeing-app
    depends_on:
      - mongo
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  mongo:
    image: mongo:6
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: your_mongo_password

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mongo_data:
```

#### Step 3: Deploy with Docker
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Update application
git pull
docker-compose build app
docker-compose up -d app
```

### 3. Cloud Platform Deployment

#### Heroku Deployment

1. **Prepare application:**
   ```bash
   # Install Heroku CLI
   npm install -g heroku

   # Login and create app
   heroku login
   heroku create your-app-name
   ```

2. **Configure environment:**
   ```bash
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_uri
   heroku config:set OPENAI_API_KEY=your_openai_key
   heroku config:set JWT_SECRET=your_jwt_secret
   ```

3. **Deploy:**
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

#### DigitalOcean App Platform

1. **Create `app.yaml`:**
   ```yaml
   name: mansarthi
   services:
   - name: web
     source_dir: /
     github:
       repo: Aditya3525/Mansarthi---AI-for-mental-wellness
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: your_mongodb_uri
       type: SECRET
     - key: OPENAI_API_KEY
       value: your_openai_key
       type: SECRET
   ```

2. **Deploy via CLI:**
   ```bash
   doctl apps create --spec app.yaml
   ```

### 4. MongoDB Setup Options

#### MongoDB Atlas (Cloud)
1. Create account at https://www.mongodb.com/atlas
2. Create cluster and database
3. Get connection string
4. Update `MONGODB_URI` in environment

#### Local MongoDB
```bash
# Ubuntu/Debian
sudo apt-get install mongodb-org

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Create database and user
mongo
use mental-wellbeing-app
db.createUser({
  user: "appuser",
  pwd: "secure_password",
  roles: ["readWrite"]
})
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use secrets management in production
- Rotate keys regularly

### 2. Database Security
```bash
# Enable MongoDB authentication
sudo nano /etc/mongod.conf

# Add security section
security:
  authorization: enabled

# Restart MongoDB
sudo systemctl restart mongod
```

### 3. Application Security
- Enable HTTPS in production
- Use strong JWT secrets
- Implement rate limiting
- Regular security updates

### 4. Firewall Configuration
```bash
# UFW setup
sudo ufw enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3000  # Block direct access to app
```

## Monitoring and Maintenance

### 1. Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs mansarthi

# Restart application
pm2 restart mansarthi
```

### 2. Database Monitoring
```bash
# MongoDB status
sudo systemctl status mongod

# Database stats
mongo --eval "db.stats()"
```

### 3. Health Checks
Create a health check endpoint:
```javascript
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});
```

### 4. Backup Strategy
```bash
# Automated MongoDB backup
#!/bin/bash
BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --out $BACKUP_DIR/backup_$DATE
find $BACKUP_DIR -name "backup_*" -mtime +7 -delete
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB service status
   - Verify connection string
   - Check firewall settings

2. **AI Service Errors**
   - Verify API keys
   - Check service quotas
   - Test with fallback responses

3. **High Memory Usage**
   - Monitor with `pm2 monit`
   - Implement memory limits
   - Check for memory leaks

4. **Slow Response Times**
   - Enable caching
   - Optimize database queries
   - Use CDN for static files

### Log Management
```bash
# Rotate logs
sudo nano /etc/logrotate.d/mansarthi

# Content:
/path/to/app/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 nodejs nodejs
}
```

## Performance Optimization

1. **Database Indexing**
   ```javascript
   // Add indexes to User model
   userSchema.index({ email: 1 });
   userSchema.index({ 'assessments.completedAt': -1 });
   ```

2. **Caching**
   - Implement Redis for session storage
   - Cache AI responses for common queries
   - Use CDN for static assets

3. **Load Balancing**
   - Multiple application instances
   - Nginx load balancing
   - Database read replicas

This deployment guide provides comprehensive instructions for various deployment scenarios. Choose the option that best fits your infrastructure requirements and technical expertise.