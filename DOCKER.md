# Docker Deployment Guide for FlyView

This guide provides instructions for building and running the FlyView application using Docker.

## Prerequisites

- Docker installed (version 20.10 or higher)
- Docker Compose installed (version 2.0 or higher)
- Firebase configuration file (`firebaseConfig.js`)

## Quick Start

### 1. Build and Run with Docker Compose

The easiest way to run the application is using Docker Compose:

```bash
# Build and start the container
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the container
docker-compose down
```

The application will be available at `http://localhost:3000`

### 2. Build Docker Image Manually

If you prefer to build the Docker image manually:

```bash
# Build the image
docker build -t flyview:latest .

# Run the container
docker run -d \
  --name flyview-app \
  -p 3000:3000 \
  flyview:latest

# View logs
docker logs -f flyview-app

# Stop and remove container
docker stop flyview-app
docker rm flyview-app
```

## Configuration

### Environment Variables

Before building, ensure your Firebase configuration is properly set up in `firebaseConfig.js`.

For production deployments, you may want to use environment variables. Create a `.env.local` file (not committed to git):

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then modify the docker-compose.yml to include these variables:

```yaml
services:
  flyview:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
      - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}
      - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}
      - NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}
    env_file:
      - .env.local
```

### Custom Port

To run on a different port, modify the port mapping in `docker-compose.yml`:

```yaml
ports:
  - "8080:3000"  # Host:Container
```

## Docker Commands Reference

### Docker Compose Commands

```bash
# Build images
docker-compose build

# Start services in detached mode
docker-compose up -d

# Start services with build
docker-compose up -d --build

# View logs
docker-compose logs -f flyview

# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Stop and remove containers, volumes, and images
docker-compose down -v --rmi all

# Restart services
docker-compose restart
```

### Docker Commands

```bash
# List running containers
docker ps

# List all containers
docker ps -a

# View container logs
docker logs flyview-app
docker logs -f flyview-app  # Follow logs

# Execute command in container
docker exec -it flyview-app sh

# View container resource usage
docker stats flyview-app

# Inspect container
docker inspect flyview-app

# Remove container
docker rm flyview-app

# Remove image
docker rmi flyview:latest
```

## Multi-Stage Build Explanation

The Dockerfile uses a multi-stage build process for optimization:

1. **Stage 1 (deps)**: Installs production dependencies
2. **Stage 2 (builder)**: Builds the Next.js application
3. **Stage 3 (runner)**: Creates the final lightweight image with only necessary files

This approach results in:
- Smaller final image size
- Better security (fewer dependencies in production)
- Faster deployment

## Production Deployment

### Using Docker Hub

1. **Tag your image:**
```bash
docker tag flyview:latest your-dockerhub-username/flyview:latest
docker tag flyview:latest your-dockerhub-username/flyview:v1.0.0
```

2. **Push to Docker Hub:**
```bash
docker login
docker push your-dockerhub-username/flyview:latest
docker push your-dockerhub-username/flyview:v1.0.0
```

3. **Pull and run on production server:**
```bash
docker pull your-dockerhub-username/flyview:latest
docker run -d \
  --name flyview-app \
  --restart unless-stopped \
  -p 3000:3000 \
  your-dockerhub-username/flyview:latest
```

### Using Docker Registry

For private deployments, you can use a private Docker registry:

```bash
# Tag for private registry
docker tag flyview:latest registry.example.com/flyview:latest

# Push to private registry
docker push registry.example.com/flyview:latest

# Pull and run from private registry
docker pull registry.example.com/flyview:latest
docker run -d -p 3000:3000 registry.example.com/flyview:latest
```

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs flyview
```

### Port already in use

Change the host port in docker-compose.yml or stop the conflicting service:
```bash
# Find process using port 3000
lsof -i :3000
# or
netstat -tulpn | grep 3000
```

### Build fails

Clear Docker cache and rebuild:
```bash
docker-compose build --no-cache
```

### Container restarts repeatedly

Check if Firebase configuration is valid:
```bash
docker logs flyview-app
```

## Health Check

To add a health check to your container, modify the Dockerfile:

```dockerfile
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"
```

## Backup and Restore

Since FlyView uses Firebase, your data is stored in the cloud. However, to backup configuration:

```bash
# Backup configuration files
docker cp flyview-app:/app/firebaseConfig.js ./backup/
```

## Security Considerations

1. **Don't commit secrets**: Never commit `.env.local` or files containing API keys
2. **Use secrets management**: For production, use Docker secrets or a secrets manager
3. **Run as non-root**: The Dockerfile already creates and uses a non-root user
4. **Keep images updated**: Regularly update base images and dependencies
5. **Scan for vulnerabilities**: Use `docker scan flyview:latest`

## Performance Tuning

### Increase Node.js memory

Add to docker-compose.yml:

```yaml
environment:
  - NODE_OPTIONS=--max-old-space-size=4096
```

### Use CDN for static assets

For production deployments, consider using a CDN for the `/public` directory.

## Support

For issues specific to Docker deployment, check:
- Docker logs: `docker-compose logs -f`
- Container stats: `docker stats flyview-app`
- Next.js documentation: https://nextjs.org/docs/deployment

For application-specific issues, refer to the main README.md file.
