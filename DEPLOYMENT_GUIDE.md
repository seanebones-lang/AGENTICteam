# Agent Marketplace Deployment Guide

**Version:** 2.0.0  
**Last Updated:** October 21, 2025

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Database Configuration](#database-configuration)
5. [Application Deployment](#application-deployment)
6. [Production Configuration](#production-configuration)
7. [Security Hardening](#security-hardening)
8. [Monitoring Setup](#monitoring-setup)
9. [Load Balancing](#load-balancing)
10. [Backup & Recovery](#backup--recovery)
11. [Troubleshooting](#troubleshooting)

## Overview

The Agent Marketplace is a production-ready platform that requires careful deployment to ensure security, scalability, and reliability. This guide covers deployment for various environments from development to enterprise production.

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   Web Server    │    │   Database      │
│   (Nginx/ALB)   │────│   (FastAPI)     │────│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Cache/Queue   │    │   Monitoring    │
                       │   (Redis)       │    │   (Prometheus)  │
                       └─────────────────┘    └─────────────────┘
```

### Deployment Options

1. **Development**: Local development with SQLite
2. **Staging**: Single server with PostgreSQL and Redis
3. **Production**: Multi-server with load balancing
4. **Enterprise**: Kubernetes cluster with auto-scaling

## Prerequisites

### System Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- OS: Ubuntu 20.04+ / CentOS 8+ / Amazon Linux 2

**Recommended for Production:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 100GB+ SSD
- OS: Ubuntu 22.04 LTS

### Software Dependencies

```bash
# Python 3.9+
python3 --version

# PostgreSQL 13+
psql --version

# Redis 6+
redis-server --version

# Nginx (for reverse proxy)
nginx -v

# Docker (optional)
docker --version

# Git
git --version
```

## Environment Setup

### 1. System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv \
  postgresql postgresql-contrib redis-server nginx \
  git curl wget htop

# Create application user
sudo useradd -m -s /bin/bash agentmarket
sudo usermod -aG sudo agentmarket
```

### 2. Python Environment

```bash
# Switch to application user
sudo su - agentmarket

# Create virtual environment
python3 -m venv /home/agentmarket/venv
source /home/agentmarket/venv/bin/activate

# Upgrade pip
pip install --upgrade pip setuptools wheel
```

### 3. Application Code

```bash
# Clone repository
cd /home/agentmarket
git clone https://github.com/your-org/agent-marketplace.git
cd agent-marketplace

# Install dependencies
pip install -r backend/requirements.txt
```

## Database Configuration

### PostgreSQL Setup

```bash
# Switch to postgres user
sudo su - postgres

# Create database and user
createdb agentmarketplace
createuser agentmarket_user

# Set password and permissions
psql -c "ALTER USER agentmarket_user PASSWORD 'secure_password_here';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE agentmarketplace TO agentmarket_user;"
psql -c "ALTER DATABASE agentmarketplace OWNER TO agentmarket_user;"
```

### Database Migration

```bash
# Switch back to application user
sudo su - agentmarket
cd /home/agentmarket/agent-marketplace/backend

# Set database URL
export DATABASE_URL="postgresql://agentmarket_user:secure_password_here@localhost:5432/agentmarketplace"

# Run migrations (if using Alembic)
alembic upgrade head

# Or initialize database
python3 database_setup.py
```

### Redis Configuration

```bash
# Configure Redis
sudo nano /etc/redis/redis.conf

# Key settings:
# bind 127.0.0.1
# requirepass your_redis_password
# maxmemory 256mb
# maxmemory-policy allkeys-lru

# Restart Redis
sudo systemctl restart redis-server
sudo systemctl enable redis-server
```

## Application Deployment

### 1. Environment Variables

Create production environment file:

```bash
# Create environment file
sudo nano /home/agentmarket/.env
```

```env
# Environment
ENVIRONMENT=production
DEBUG=false

# Database
DATABASE_URL=postgresql://agentmarket_user:secure_password@localhost:5432/agentmarketplace

# Redis
REDIS_URL=redis://:your_redis_password@localhost:6379/0

# Security
SECRET_KEY=your_super_secret_key_here_32_chars_min
JWT_SECRET_KEY=your_jwt_secret_key_here_32_chars_min

# API Keys
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key
GROQ_API_KEY=your_groq_api_key

# Stripe
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# Server
HOST=0.0.0.0
PORT=8000
WORKERS=4

# CORS
CORS_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Monitoring
LOG_LEVEL=INFO
METRICS_ENABLED=true
```

### 2. Systemd Service

Create systemd service file:

```bash
sudo nano /etc/systemd/system/agentmarket.service
```

```ini
[Unit]
Description=Agent Marketplace API
After=network.target postgresql.service redis.service
Requires=postgresql.service redis.service

[Service]
Type=exec
User=agentmarket
Group=agentmarket
WorkingDirectory=/home/agentmarket/agent-marketplace/backend
Environment=PATH=/home/agentmarket/venv/bin
EnvironmentFile=/home/agentmarket/.env
ExecStart=/home/agentmarket/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
ExecReload=/bin/kill -HUP $MAINPID
Restart=always
RestartSec=5
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

### 3. Start Services

```bash
# Reload systemd
sudo systemctl daemon-reload

# Enable and start service
sudo systemctl enable agentmarket
sudo systemctl start agentmarket

# Check status
sudo systemctl status agentmarket

# View logs
sudo journalctl -u agentmarket -f
```

## Production Configuration

### Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/agentmarket
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';";

    # Rate Limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    # Proxy Configuration
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health Check
    location /health {
        proxy_pass http://127.0.0.1:8000/health;
        access_log off;
    }

    # Metrics (restrict access)
    location /metrics {
        allow 10.0.0.0/8;
        allow 172.16.0.0/12;
        allow 192.168.0.0/16;
        deny all;
        proxy_pass http://127.0.0.1:8000/metrics;
    }

    # Logging
    access_log /var/log/nginx/agentmarket_access.log;
    error_log /var/log/nginx/agentmarket_error.log;
}
```

### SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d api.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Enable Nginx

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/agentmarket /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

## Security Hardening

### 1. Firewall Configuration

```bash
# Install UFW
sudo apt install ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Allow PostgreSQL (local only)
sudo ufw allow from 127.0.0.1 to any port 5432

# Allow Redis (local only)
sudo ufw allow from 127.0.0.1 to any port 6379

# Enable firewall
sudo ufw enable
```

### 2. PostgreSQL Security

```bash
# Edit PostgreSQL configuration
sudo nano /etc/postgresql/13/main/postgresql.conf

# Key settings:
# listen_addresses = 'localhost'
# ssl = on
# log_connections = on
# log_disconnections = on

# Edit pg_hba.conf
sudo nano /etc/postgresql/13/main/pg_hba.conf

# Ensure only local connections:
# local   all             all                                     md5
# host    all             all             127.0.0.1/32            md5
```

### 3. Application Security

```bash
# Set proper file permissions
sudo chown -R agentmarket:agentmarket /home/agentmarket/agent-marketplace
sudo chmod -R 755 /home/agentmarket/agent-marketplace
sudo chmod 600 /home/agentmarket/.env

# Secure log files
sudo mkdir -p /var/log/agentmarket
sudo chown agentmarket:agentmarket /var/log/agentmarket
sudo chmod 755 /var/log/agentmarket
```

### 4. System Hardening

```bash
# Disable root login
sudo passwd -l root

# Configure SSH
sudo nano /etc/ssh/sshd_config

# Key settings:
# PermitRootLogin no
# PasswordAuthentication no
# PubkeyAuthentication yes
# AllowUsers agentmarket

# Restart SSH
sudo systemctl restart ssh

# Install fail2ban
sudo apt install fail2ban

# Configure fail2ban
sudo nano /etc/fail2ban/jail.local
```

```ini
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5

[sshd]
enabled = true

[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
```

## Monitoring Setup

### 1. Application Monitoring

The application includes built-in monitoring. Configure external monitoring:

```bash
# Create monitoring configuration
sudo nano /home/agentmarket/monitoring.yml
```

```yaml
monitoring:
  enabled: true
  metrics_port: 9090
  health_check_interval: 30
  log_level: INFO
  
prometheus:
  enabled: true
  scrape_interval: 15s
  
alerts:
  email: admin@yourdomain.com
  webhook: https://hooks.slack.com/services/YOUR/SLACK/WEBHOOK
```

### 2. Log Management

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/agentmarket
```

```
/var/log/agentmarket/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 agentmarket agentmarket
    postrotate
        systemctl reload agentmarket
    endscript
}
```

### 3. System Monitoring

```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Set up basic monitoring script
sudo nano /usr/local/bin/system-monitor.sh
```

```bash
#!/bin/bash
# Basic system monitoring

LOG_FILE="/var/log/system-monitor.log"
DATE=$(date '+%Y-%m-%d %H:%M:%S')

# CPU and Memory
CPU=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
MEM=$(free | grep Mem | awk '{printf("%.2f", $3/$2 * 100.0)}')

# Disk usage
DISK=$(df -h / | awk 'NR==2 {print $5}' | cut -d'%' -f1)

# Service status
SERVICE_STATUS=$(systemctl is-active agentmarket)

echo "$DATE - CPU: ${CPU}%, Memory: ${MEM}%, Disk: ${DISK}%, Service: $SERVICE_STATUS" >> $LOG_FILE

# Alert if thresholds exceeded
if (( $(echo "$CPU > 80" | bc -l) )); then
    echo "HIGH CPU USAGE: $CPU%" | mail -s "System Alert" admin@yourdomain.com
fi
```

## Load Balancing

### Multi-Server Setup

For high-availability production deployments:

```bash
# Application servers: app1.internal, app2.internal
# Load balancer: lb.yourdomain.com
# Database: db.internal
# Redis: redis.internal
```

### Nginx Load Balancer Configuration

```nginx
upstream agentmarket_backend {
    least_conn;
    server app1.internal:8000 max_fails=3 fail_timeout=30s;
    server app2.internal:8000 max_fails=3 fail_timeout=30s;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL configuration...

    location / {
        proxy_pass http://agentmarket_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Health checks
        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
        proxy_connect_timeout 5s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://agentmarket_backend/health;
        access_log off;
    }
}
```

### Database Replication

```bash
# Master-slave PostgreSQL setup
# Master: db-master.internal
# Slave: db-slave.internal

# On master server
sudo nano /etc/postgresql/13/main/postgresql.conf
```

```
# Replication settings
wal_level = replica
max_wal_senders = 3
wal_keep_segments = 64
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/13/main/archive/%f'
```

## Backup & Recovery

### Database Backup

```bash
# Create backup script
sudo nano /usr/local/bin/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/postgresql"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="agentmarketplace"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -h localhost -U agentmarket_user -d $DB_NAME | gzip > $BACKUP_DIR/agentmarket_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "agentmarket_*.sql.gz" -mtime +7 -delete

# Upload to S3 (optional)
# aws s3 cp $BACKUP_DIR/agentmarket_$DATE.sql.gz s3://your-backup-bucket/
```

### Application Backup

```bash
# Create application backup script
sudo nano /usr/local/bin/backup-app.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/backup/application"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/home/agentmarket/agent-marketplace"

mkdir -p $BACKUP_DIR

# Backup application code and configuration
tar -czf $BACKUP_DIR/agentmarket_app_$DATE.tar.gz \
    $APP_DIR \
    /home/agentmarket/.env \
    /etc/systemd/system/agentmarket.service \
    /etc/nginx/sites-available/agentmarket

# Keep only last 7 days
find $BACKUP_DIR -name "agentmarket_app_*.tar.gz" -mtime +7 -delete
```

### Automated Backups

```bash
# Add to crontab
sudo crontab -e
```

```cron
# Database backup every 6 hours
0 */6 * * * /usr/local/bin/backup-db.sh

# Application backup daily at 2 AM
0 2 * * * /usr/local/bin/backup-app.sh

# System monitoring every 5 minutes
*/5 * * * * /usr/local/bin/system-monitor.sh
```

## Troubleshooting

### Common Issues

#### 1. Service Won't Start

```bash
# Check service status
sudo systemctl status agentmarket

# Check logs
sudo journalctl -u agentmarket -n 50

# Check configuration
python3 -c "import main; print('Config OK')"

# Check database connection
python3 -c "from database_setup import DatabaseManager; db = DatabaseManager(); print('DB OK')"
```

#### 2. High Memory Usage

```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Restart service if needed
sudo systemctl restart agentmarket

# Check for memory leaks
python3 -c "
import psutil
import time
for i in range(10):
    print(f'Memory: {psutil.virtual_memory().percent}%')
    time.sleep(1)
"
```

#### 3. Database Connection Issues

```bash
# Test database connection
psql -h localhost -U agentmarket_user -d agentmarketplace -c "SELECT 1;"

# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Check logs
sudo tail -f /var/log/postgresql/postgresql-13-main.log
```

#### 4. Redis Connection Issues

```bash
# Test Redis connection
redis-cli ping

# Check Redis status
sudo systemctl status redis-server

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log

# Check memory usage
redis-cli info memory
```

#### 5. SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Test SSL configuration
openssl s_client -connect api.yourdomain.com:443 -servername api.yourdomain.com

# Renew certificate
sudo certbot renew

# Check Nginx configuration
sudo nginx -t
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Analyze table statistics
ANALYZE;

-- Check index usage
SELECT schemaname, tablename, attname, n_distinct, correlation 
FROM pg_stats 
WHERE tablename = 'your_table';
```

#### 2. Application Optimization

```bash
# Enable production optimizations
export PYTHONOPTIMIZE=1
export PYTHONDONTWRITEBYTECODE=1

# Use production ASGI server
pip install gunicorn[gevent]

# Update systemd service
ExecStart=/home/agentmarket/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

#### 3. Nginx Optimization

```nginx
# Add to nginx.conf
worker_processes auto;
worker_connections 1024;

# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

# Enable caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Monitoring Commands

```bash
# System resources
htop
iotop
nethogs

# Application logs
sudo journalctl -u agentmarket -f

# Database activity
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Redis monitoring
redis-cli monitor

# Nginx logs
sudo tail -f /var/log/nginx/agentmarket_access.log
sudo tail -f /var/log/nginx/agentmarket_error.log

# Check API health
curl -s https://api.yourdomain.com/health | jq

# Load testing
curl -s https://api.yourdomain.com/api/v1/packages
```

## Deployment Checklist

### Pre-Deployment

- [ ] System requirements met
- [ ] Dependencies installed
- [ ] Database configured
- [ ] Redis configured
- [ ] Environment variables set
- [ ] SSL certificates obtained
- [ ] Firewall configured
- [ ] Backup strategy implemented

### Deployment

- [ ] Application code deployed
- [ ] Database migrations run
- [ ] Services configured and started
- [ ] Nginx configured and started
- [ ] Health checks passing
- [ ] Monitoring configured
- [ ] Logs accessible

### Post-Deployment

- [ ] Load testing completed
- [ ] Security scan completed
- [ ] Backup tested
- [ ] Monitoring alerts configured
- [ ] Documentation updated
- [ ] Team notified

### Production Readiness

- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Disaster recovery plan tested
- [ ] Support procedures documented
- [ ] Monitoring dashboards configured

---

**Support**: For deployment assistance, contact [support@agentmarketplace.com](mailto:support@agentmarketplace.com)

**Documentation**: [https://docs.agentmarketplace.com](https://docs.agentmarketplace.com)
