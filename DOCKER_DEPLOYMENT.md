# Docker Deployment Guide

This guide explains how to deploy the UNN Hostel Admin application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose installed
- Git (to clone the repository)

## Quick Deployment

### Option 1: Using the Deployment Script (Recommended)

1. **Make sure Docker is running**
   ```bash
   docker --version
   docker-compose --version
   ```

2. **Run the deployment script**
   ```bash
   ./deploy.sh
   ```

   This script will:
   - Check if Docker is running
   - Stop any existing containers
   - Build a fresh Docker image
   - Start the application
   - Show the status and logs

### Option 2: Manual Deployment

1. **Build the Docker image**
   ```bash
   docker-compose build
   ```

2. **Start the application**
   ```bash
   docker-compose up -d
   ```

3. **Check the status**
   ```bash
   docker-compose ps
   ```

## Accessing the Application

Once deployed, you can access the application at:
- **Main Application**: http://localhost:3000
- **Health Check**: http://localhost:3000/api/health

## Useful Commands

### View Logs
```bash
# Follow logs in real-time
docker-compose logs -f

# View recent logs
docker-compose logs --tail=50

# View logs for specific service
docker-compose logs unn-hostel-admin
```

### Stop the Application
```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

### Restart the Application
```bash
# Restart all services
docker-compose restart

# Restart specific service
docker-compose restart unn-hostel-admin
```

### Update the Application
```bash
# Pull latest changes and rebuild
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

## Container Management

### View Running Containers
```bash
docker ps
```

### View All Containers (including stopped)
```bash
docker ps -a
```

### Access Container Shell
```bash
docker exec -it unn-hostel-admin sh
```

### View Container Resources
```bash
docker stats
```

## Environment Variables

The application uses the following environment variables:

- `NODE_ENV`: Set to `production` in Docker
- `PORT`: Set to `3000` (default)
- `NEXT_TELEMETRY_DISABLED`: Set to `1` to disable telemetry

You can add custom environment variables by modifying the `docker-compose.yml` file:

```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
  - YOUR_CUSTOM_VAR=value
```

## Troubleshooting

### Application Won't Start
1. Check if Docker is running
2. Check the logs: `docker-compose logs`
3. Ensure port 3000 is not in use by another application
4. Try rebuilding: `docker-compose build --no-cache`

### Health Check Failing
1. Check if the application is responding: `curl http://localhost:3000/api/health`
2. View container logs: `docker-compose logs unn-hostel-admin`
3. Check container status: `docker ps`

### Port Already in Use
If port 3000 is already in use, modify the `docker-compose.yml` file:

```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Out of Memory
If the build fails due to memory issues:
1. Increase Docker memory limit in Docker Desktop settings
2. Use the `--memory` flag: `docker-compose build --memory=4g`

## Production Considerations

For production deployment, consider:

1. **Environment Variables**: Use `.env` files or Docker secrets for sensitive data
2. **Reverse Proxy**: Add nginx or traefik for SSL termination and load balancing
3. **Database**: Connect to external database services
4. **Monitoring**: Add monitoring and logging solutions
5. **Backup**: Implement backup strategies for persistent data

## File Structure

```
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Docker Compose configuration
├── .dockerignore          # Files to exclude from Docker build
├── deploy.sh              # Automated deployment script
└── src/
    └── app/
        └── api/
            └── health/
                └── route.ts  # Health check endpoint
```

## Support

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify Docker is running: `docker info`
3. Check system resources: `docker system df`
4. Clean up unused resources: `docker system prune`



