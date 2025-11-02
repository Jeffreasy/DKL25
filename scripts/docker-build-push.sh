#!/bin/bash

# ==============================================
# Docker Build & Push Script
# ==============================================
# Dit script bouwt en pusht Docker images naar Docker Hub
# 
# Gebruik: ./scripts/docker-build-push.sh [OPTIONS]
# 
# Options:
#   -u, --username    Docker Hub username (verplicht)
#   -t, --tag         Image tag (default: latest)
#   -p, --push        Push naar Docker Hub (default: false)
#   --no-cache        Build zonder cache
# ==============================================

set -e

# Colors voor output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default waarden
DOCKER_USERNAME=""
IMAGE_TAG="latest"
PUSH_IMAGES=false
NO_CACHE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -u|--username)
      DOCKER_USERNAME="$2"
      shift 2
      ;;
    -t|--tag)
      IMAGE_TAG="$2"
      shift 2
      ;;
    -p|--push)
      PUSH_IMAGES=true
      shift
      ;;
    --no-cache)
      NO_CACHE="--no-cache"
      shift
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      exit 1
      ;;
  esac
done

# Validatie
if [ -z "$DOCKER_USERNAME" ] && [ "$PUSH_IMAGES" = true ]; then
  echo -e "${RED}Error: Docker Hub username is verplicht voor push (-u of --username)${NC}"
  echo "Gebruik: ./scripts/docker-build-push.sh -u YOUR_USERNAME -p"
  exit 1
fi

# Functies
print_step() {
  echo -e "${GREEN}==>${NC} $1"
}

print_warning() {
  echo -e "${YELLOW}Warning:${NC} $1"
}

print_error() {
  echo -e "${RED}Error:${NC} $1"
}

# Start
echo "======================================"
echo "   DKL25 Docker Build & Push Script   "
echo "======================================"
echo ""

# Image namen
if [ -n "$DOCKER_USERNAME" ]; then
  FRONTEND_IMAGE="$DOCKER_USERNAME/dkl-frontend:$IMAGE_TAG"
else
  FRONTEND_IMAGE="dkl-frontend:$IMAGE_TAG"
fi

print_step "Configuratie:"
echo "  Frontend Image: $FRONTEND_IMAGE"
echo "  Tag: $IMAGE_TAG"
echo "  Push: $PUSH_IMAGES"
echo "  No Cache: $([ -n "$NO_CACHE" ] && echo "Yes" || echo "No")"
echo ""

# Check of .env bestaat voor build args
if [ ! -f .env ]; then
  print_warning ".env bestand niet gevonden. Gebruik .env.example als template."
  read -p "Wil je .env.example kopiëren naar .env? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    cp .env.example .env
    print_warning "Vul je credentials in .env in voordat je verder gaat!"
    exit 1
  fi
fi

# Laad environment variabelen
if [ -f .env ]; then
  print_step "Laden environment variabelen..."
  export $(cat .env | grep -v '^#' | xargs)
fi

# Build frontend image
print_step "Building frontend image..."
docker build $NO_CACHE \
  --build-arg VITE_SUPABASE_URL="${VITE_SUPABASE_URL}" \
  --build-arg VITE_SUPABASE_ANON_KEY="${VITE_SUPABASE_ANON_KEY}" \
  --build-arg VITE_GA_MEASUREMENT_ID="${VITE_GA_MEASUREMENT_ID}" \
  --build-arg VITE_EMAIL_SERVICE_URL="${VITE_EMAIL_SERVICE_URL}" \
  --build-arg VITE_CLOUDINARY_CLOUD_NAME="${VITE_CLOUDINARY_CLOUD_NAME}" \
  -t "$FRONTEND_IMAGE" \
  -f Dockerfile \
  .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Frontend image gebouwd: $FRONTEND_IMAGE"
else
  print_error "Frontend build mislukt!"
  exit 1
fi

# Tag als latest ook
if [ "$IMAGE_TAG" != "latest" ] && [ -n "$DOCKER_USERNAME" ]; then
  print_step "Taggen als latest..."
  docker tag "$FRONTEND_IMAGE" "$DOCKER_USERNAME/dkl-frontend:latest"
fi

# Push images
if [ "$PUSH_IMAGES" = true ]; then
  print_step "Inloggen bij Docker Hub..."
  docker login
  
  print_step "Pushen frontend image..."
  docker push "$FRONTEND_IMAGE"
  
  if [ "$IMAGE_TAG" != "latest" ]; then
    docker push "$DOCKER_USERNAME/dkl-frontend:latest"
  fi
  
  echo -e "${GREEN}✓${NC} Images gepusht naar Docker Hub"
  echo ""
  echo "Pull command:"
  echo "  docker pull $FRONTEND_IMAGE"
fi

# Image info
print_step "Image informatie:"
docker images | grep "dkl-frontend" | head -5

echo ""
echo -e "${GREEN}Klaar!${NC}"
echo ""
echo "Volgende stappen:"
if [ "$PUSH_IMAGES" = false ]; then
  echo "  1. Test lokaal: docker-compose up"
  echo "  2. Push images: ./scripts/docker-build-push.sh -u YOUR_USERNAME -p"
else
  echo "  1. Pull op server: docker pull $FRONTEND_IMAGE"
  echo "  2. Deploy: docker-compose up -d"
fi