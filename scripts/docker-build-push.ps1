# ==============================================
# Docker Build & Push Script (PowerShell)
# ==============================================
# Dit script bouwt en pusht Docker images naar Docker Hub
# 
# Gebruik: .\scripts\docker-build-push.ps1 -Username "YOUR_USERNAME" [-Tag "latest"] [-Push] [-NoCache]
# ==============================================

param(
    [Parameter(Mandatory=$false)]
    [string]$Username = "",
    
    [Parameter(Mandatory=$false)]
    [string]$Tag = "latest",
    
    [Parameter(Mandatory=$false)]
    [switch]$Push = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$NoCache = $false
)

# Colors
$Red = "`e[31m"
$Green = "`e[32m"
$Yellow = "`e[33m"
$Reset = "`e[0m"

function Write-Step {
    param([string]$Message)
    Write-Host "${Green}==>${Reset} $Message"
}

function Write-Warning {
    param([string]$Message)
    Write-Host "${Yellow}Warning:${Reset} $Message"
}

function Write-ErrorMsg {
    param([string]$Message)
    Write-Host "${Red}Error:${Reset} $Message"
}

# Validatie
if ($Push -and [string]::IsNullOrEmpty($Username)) {
    Write-ErrorMsg "Docker Hub username is verplicht voor push (-Username)"
    Write-Host "Gebruik: .\scripts\docker-build-push.ps1 -Username YOUR_USERNAME -Push"
    exit 1
}

# Header
Write-Host "======================================"
Write-Host "   DKL25 Docker Build & Push Script   "
Write-Host "======================================"
Write-Host ""

# Image namen
if (-not [string]::IsNullOrEmpty($Username)) {
    $FrontendImage = "$Username/dkl-frontend:$Tag"
} else {
    $FrontendImage = "dkl-frontend:$Tag"
}

Write-Step "Configuratie:"
Write-Host "  Frontend Image: $FrontendImage"
Write-Host "  Tag: $Tag"
Write-Host "  Push: $Push"
Write-Host "  No Cache: $NoCache"
Write-Host ""

# Check .env
if (-not (Test-Path .env)) {
    Write-Warning ".env bestand niet gevonden. Gebruik .env.example als template."
    $response = Read-Host "Wil je .env.example kopiëren naar .env? (y/n)"
    if ($response -eq 'y') {
        Copy-Item .env.example .env
        Write-Warning "Vul je credentials in .env in voordat je verder gaat!"
        exit 1
    }
}

# Laad environment variabelen
if (Test-Path .env) {
    Write-Step "Laden environment variabelen..."
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#].+?)=(.+)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            Set-Item -Path "env:$name" -Value $value
        }
    }
}

# Build command
$BuildArgs = @(
    "build"
)

if ($NoCache) {
    $BuildArgs += "--no-cache"
}

$BuildArgs += @(
    "--build-arg", "VITE_SUPABASE_URL=$env:VITE_SUPABASE_URL",
    "--build-arg", "VITE_SUPABASE_ANON_KEY=$env:VITE_SUPABASE_ANON_KEY",  
    "--build-arg", "VITE_GA_MEASUREMENT_ID=$env:VITE_GA_MEASUREMENT_ID",
    "--build-arg", "VITE_EMAIL_SERVICE_URL=$env:VITE_EMAIL_SERVICE_URL",
    "--build-arg", "VITE_CLOUDINARY_CLOUD_NAME=$env:VITE_CLOUDINARY_CLOUD_NAME",
    "-t", $FrontendImage,
    "-f", "Dockerfile",
    "."
)

# Build frontend image
Write-Step "Building frontend image..."
& docker @BuildArgs

if ($LASTEXITCODE -eq 0) {
    Write-Host "${Green}✓${Reset} Frontend image gebouwd: $FrontendImage"
} else {
    Write-ErrorMsg "Frontend build mislukt!"
    exit 1
}

# Tag als latest
if ($Tag -ne "latest" -and -not [string]::IsNullOrEmpty($Username)) {
    Write-Step "Taggen als latest..."
    docker tag $FrontendImage "$Username/dkl-frontend:latest"
}

# Push images
if ($Push) {
    Write-Step "Inloggen bij Docker Hub..."
    docker login
    
    Write-Step "Pushen frontend image..."
    docker push $FrontendImage
    
    if ($Tag -ne "latest") {
        docker push "$Username/dkl-frontend:latest"
    }
    
    Write-Host "${Green}✓${Reset} Images gepusht naar Docker Hub"
    Write-Host ""
    Write-Host "Pull command:"
    Write-Host "  docker pull $FrontendImage"
}

# Image info
Write-Step "Image informatie:"
docker images | Select-String "dkl-frontend" | Select-Object -First 5

Write-Host ""
Write-Host "${Green}Klaar!${Reset}"
Write-Host ""
Write-Host "Volgende stappen:"
if (-not $Push) {
    Write-Host "  1. Test lokaal: docker-compose up"
    Write-Host "  2. Push images: .\scripts\docker-build-push.ps1 -Username YOUR_USERNAME -Push"
} else {
    Write-Host "  1. Pull op server: docker pull $FrontendImage"
    Write-Host "  2. Deploy: docker-compose up -d"
}