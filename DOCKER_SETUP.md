# 🐳 Docker Setup Guide - DKL25

Quick start guide voor het draaien van DKL25 met Docker en Redis.

---

## 📋 Vereisten

- Docker Desktop 4.0+ geïnstalleerd
- Docker Compose 2.0+
- 4GB+ vrije RAM
- Git

**Installeer Docker:**
- Windows/Mac: [Docker Desktop](https://www.docker.com/products/docker-desktop)
- Linux: `sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin`

---

## 🚀 Quick Start (Development)

### 1. Clone Repository

```bash
git clone https://github.com/Jeffreasy/DKL25.git
cd DKL25
```

### 2. Environment Setup

```bash
# Kopieer .env.example naar .env
cp .env.example .env

# Vul je credentials in (verplicht):
# - VITE_SUPABASE_URL
# - VITE_SUPABASE_ANON_KEY
# - VITE_GA_MEASUREMENT_ID (optioneel)
```

### 3. Start Development Environment

```bash
# Start alles (frontend + Redis + Redis Commander)
docker-compose -f docker-compose.dev.yml up

# Of run in background
docker-compose -f docker-compose.dev.yml up -d
```

### 4. Open in Browser

- **Frontend:** http://localhost:5173
- **Redis Commander:** http://localhost:8081

### 5. Stop Services

```bash
# Stop alle services
docker-compose -f docker-compose.dev.yml down

# Stop en verwijder volumes (wist cache)
docker-compose -f docker-compose.dev.yml down -v
```

---

## 🏭 Production Build

### Build & Run

```bash
# Build production image
docker-compose build

# Start production containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop production
docker-compose down
```

### Access

- **Frontend:** http://localhost:3000
- **Redis:** localhost:6379
- **Redis Commander:** http://localhost:8081 (met --profile dev)

---

## 📊 Service Overview

### Development Setup (`docker-compose.dev.yml`)

| Service | Port | Description |
|---------|------|-------------|
| `frontend-dev` | 5173 | Vite dev server met hot reload |
| `redis` | 6379 | Redis cache server |
| `redis-commander` | 8081 | Redis management UI |

### Production Setup (`docker-compose.yml`)

| Service | Port | Description |
|---------|------|-------------|
| `frontend` | 3000 | Nginx serving optimized build |
| `redis` | 6379 | Redis cache server met persistentie |
| `redis-commander` | 8081 | Redis UI (alleen met --profile dev) |

---

## 🔧 Handige Commands

### Docker Compose

```bash
# Start services
docker-compose up                          # Foreground
docker-compose up -d                       # Background
docker-compose -f docker-compose.dev.yml up  # Development

# Stop services
docker-compose down                        # Stop containers
docker-compose down -v                     # Stop + remove volumes

# View logs
docker-compose logs                        # All services
docker-compose logs -f frontend            # Follow frontend logs
docker-compose logs --tail=100 redis       # Last 100 lines

# Rebuild
docker-compose build                       # Rebuild all
docker-compose build --no-cache            # Clean rebuild
docker-compose up --build                  # Rebuild + start

# Scale services (production only)
docker-compose up -d --scale frontend=2    # Run 2 frontend instances
```

### Docker Commands

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View container logs
docker logs dkl-frontend
docker logs -f dkl-redis                   # Follow logs

# Execute command in container
docker exec -it dkl-frontend sh            # Open shell
docker exec -it dkl-redis redis-cli        # Redis CLI

# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# View resource usage
docker stats

# Inspect container
docker inspect dkl-frontend
```

### Redis Commands

```bash
# Connect to Redis CLI
docker exec -it dkl-redis redis-cli

# With password (production)
docker exec -it dkl-redis redis-cli -a YOUR_PASSWORD

# Common Redis commands:
PING                    # Test connection
INFO                    # Server info
DBSIZE                  # Number of keys
KEYS *                  # List all keys (don't use in production!)
KEYS dkl:*              # List DKL keys
FLUSHDB                 # Clear current database
MONITOR                 # Watch real-time commands
```

---

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Vind proces dat port gebruikt
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5173
kill -9 <PID>

# Of wijzig port in docker-compose.yml
ports:
  - "5174:5173"  # Use 5174 instead
```

### Container Start Fails

```bash
# Check logs
docker-compose logs

# Remove containers en rebuild
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Hot Reload Not Working

```bash
# Zorg dat volumes correct zijn gemount
# In docker-compose.dev.yml:
volumes:
  - .:/app
  - /app/node_modules

# Restart container
docker-compose restart frontend-dev
```

### Redis Connection Issues

```bash
# Test Redis connectivity
docker exec -it dkl-redis redis-cli ping

# Check Redis logs
docker logs dkl-redis

# Verify network
docker network ls
docker network inspect dkl25_dkl-network
```

### Out of Memory

```bash
# Prune Docker system
docker system prune -a

# Increase Docker Desktop memory:
# Settings > Resources > Memory > 4GB+
```

### Permission Errors (Linux)

```bash
# Fix file ownership
sudo chown -R $USER:$USER .

# Or run Docker commands with sudo
sudo docker-compose up
```

---

## 📈 Performance Tips

### 1. Use BuildKit

```bash
# Enable BuildKit for faster builds
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1

# Or in docker-compose.yml:
COMPOSE_DOCKER_CLI_BUILD=1 docker-compose build
```

### 2. Layer Caching

```bash
# Dockerfiles are already optimized with:
# - Multi-stage builds
# - Dependency caching
# - Minimal base images
```

### 3. Volume Performance (Windows/Mac)

```bash
# Use named volumes instead of bind mounts for better performance
# Already implemented in docker-compose files
```

### 4. Clean Up Regularly

```bash
# Remove unused data
docker system prune -a --volumes

# Remove specific resources
docker container prune
docker image prune -a
docker volume prune
docker network prune
```

---

## 🔐 Security Best Practices

### 1. Environment Variables

```bash
# NEVER commit .env file
# Always use .env.example as template

# Generate secure Redis password:
openssl rand -base64 32
```

### 2. Redis Security

```bash
# Always use password in production
REDIS_PASSWORD=your_secure_password

# In docker-compose.yml, Redis is configured with:
# --requirepass ${REDIS_PASSWORD}
```

### 3. Container Security

```bash
# Containers run as non-root user
# Healthchecks enabled
# Minimal base images (Alpine)
# No unnecessary packages
```

---

## 📚 Advanced Usage

### Custom Network

```bash
# Create custom network
docker network create dkl-custom

# Use in docker-compose.yml:
networks:
  default:
    external:
      name: dkl-custom
```

### Persistent Volumes

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect dkl25_redis-data

# Backup Redis data
docker run --rm -v dkl25_redis-data:/data -v $(pwd):/backup alpine tar czf /backup/redis-backup.tar.gz /data

# Restore Redis data
docker run --rm -v dkl25_redis-data:/data -v $(pwd):/backup alpine tar xzf /backup/redis-backup.tar.gz -C /
```

### Multi-Stage Testing

```bash
# Build test image
docker build --target builder -t dkl-test .

# Run tests in container
docker run --rm dkl-test npm test
```

---

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: Docker Build

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Build Docker image
        run: docker-compose build
      
      - name: Run tests
        run: docker-compose run --rm frontend-dev npm test
```

### Build & Push to Registry

```bash
# Tag image
docker tag dkl-frontend:latest registry.example.com/dkl-frontend:latest

# Push to registry
docker push registry.example.com/dkl-frontend:latest

# Pull on production server
docker pull registry.example.com/dkl-frontend:latest
```

---

## 📖 Documentation References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Redis Docker Image](https://hub.docker.com/_/redis)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

**Project Docs:**
- Complete Implementation Guide: [`docs/infrastructure/DOCKER_REDIS_INTEGRATION_GUIDE.md`](docs/infrastructure/DOCKER_REDIS_INTEGRATION_GUIDE.md)
- Project Overview: [`docs/architecture/PROJECT_OVERVIEW.md`](docs/architecture/PROJECT_OVERVIEW.md)

---

## 💡 Tips & Tricks

### 1. Watch Mode for Logs

```bash
# Terminal 1: Watch frontend logs
docker-compose logs -f frontend-dev

# Terminal 2: Watch Redis logs
docker-compose logs -f redis
```

### 2. Quick Restart

```bash
# Restart specific service without rebuilding
docker-compose restart frontend-dev

# Restart all services
docker-compose restart
```

### 3. Shell Access

```bash
# Alpine-based containers
docker exec -it dkl-frontend sh

# Debian-based containers
docker exec -it container-name bash
```

### 4. Resource Monitoring

```bash
# Real-time stats
docker stats

# Container-specific stats
docker stats dkl-frontend dkl-redis
```

---

## ❓ FAQ

**Q: Moet ik Docker gebruiken voor development?**
A: Nee, je kunt ook gewoon `npm run dev` gebruiken. Docker is optioneel maar zorgt voor consistente environments.

**Q: Werken mijn changes met hot reload?**
A: Ja, in development mode zijn volumes gemount voor hot reload.

**Q: Hoe gebruik ik Redis in mijn code?**
A: Zie de backend implementatie voorbeelden in [`docs/infrastructure/DOCKER_REDIS_INTEGRATION_GUIDE.md`](docs/infrastructure/DOCKER_REDIS_INTEGRATION_GUIDE.md)

**Q: Kan ik dit deployen naar production?**
A: Ja, maar we raden aan Vercel te blijven gebruiken voor frontend. Docker is vooral handig voor development en backend services.

**Q: Hoeveel disk space heb ik nodig?**
A: Ongeveer 2-3GB voor images en containers.

---

## 🆘 Support

**Issues?**
- Check logs: `docker-compose logs`
- Check [Troubleshooting](#-troubleshooting) sectie
- Open een issue op GitHub

**Contact:**
- Email: info@dekoninklijkeloop.nl
- GitHub: https://github.com/Jeffreasy/DKL25

---

**Happy Coding! 🚀**