#!/bin/bash

# AI Trading Analytics Platform - Automated Setup Script
# This script automates the entire setup process

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists node; then
        missing_deps+=("Node.js (v18+)")
    else
        node_version=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            missing_deps+=("Node.js v18+ (current: $(node -v))")
        fi
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists docker; then
        missing_deps+=("Docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_deps+=("Docker Compose")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing prerequisites:"
        for dep in "${missing_deps[@]}"; do
            echo "  - $dep"
        done
        echo ""
        echo "Please install the missing prerequisites and run this script again."
        echo "Visit: https://nodejs.org/, https://www.docker.com/"
        exit 1
    fi
    
    print_success "All prerequisites are installed!"
}

# Function to setup environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        cp backend/.env.example backend/.env
        print_success "Created backend/.env from template"
        print_warning "Please edit backend/.env with your API keys and configuration"
    else
        print_warning "backend/.env already exists, skipping..."
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env.local" ]; then
        cat > frontend/.env.local << EOF
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
EOF
        print_success "Created frontend/.env.local"
    else
        print_warning "frontend/.env.local already exists, skipping..."
    fi
}

# Function to start infrastructure services
start_infrastructure() {
    print_status "Starting infrastructure services (PostgreSQL, Redis, Kafka)..."
    
    # Check if Docker is running
    if ! docker info >/dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Start infrastructure services
    docker-compose up -d postgres redis zookeeper kafka kafka-ui
    
    print_status "Waiting for services to be ready..."
    sleep 10
    
    # Check if services are running
    if docker-compose ps | grep -q "Up"; then
        print_success "Infrastructure services started successfully!"
    else
        print_error "Failed to start infrastructure services"
        docker-compose logs
        exit 1
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    print_success "Backend dependencies installed!"
    
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    print_success "Frontend dependencies installed!"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    cd backend
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 5
    
    # Generate Prisma client
    npx prisma generate
    
    # Run database migrations
    npx prisma migrate dev --name init
    
    cd ..
    print_success "Database setup completed!"
}

# Function to create startup scripts
create_startup_scripts() {
    print_status "Creating startup scripts..."
    
    # Create start-backend script
    cat > start-backend.sh << 'EOF'
#!/bin/bash
echo "Starting backend server..."
cd backend
npm run dev
EOF
    chmod +x start-backend.sh
    
    # Create start-frontend script
    cat > start-frontend.sh << 'EOF'
#!/bin/bash
echo "Starting frontend server..."
cd frontend
npm run dev
EOF
    chmod +x start-frontend.sh
    
    # Create start-all script
    cat > start-all.sh << 'EOF'
#!/bin/bash
echo "Starting all services..."

# Start infrastructure if not running
if ! docker-compose ps | grep -q "Up"; then
    echo "Starting infrastructure services..."
    docker-compose up -d postgres redis zookeeper kafka kafka-ui
    echo "Waiting for services to be ready..."
    sleep 10
fi

# Start backend in background
echo "Starting backend..."
cd backend && npm run dev &
BACKEND_PID=$!

# Wait a bit for backend to start
sleep 5

# Start frontend in background
echo "Starting frontend..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo ""
echo "🚀 AI Trading Analytics Platform is starting up!"
echo ""
echo "📊 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3001"
echo "📈 Kafka UI: http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for user to stop
trap 'echo "Stopping services..."; kill $BACKEND_PID $FRONTEND_PID; docker-compose stop; exit' INT
wait
EOF
    chmod +x start-all.sh
    
    print_success "Startup scripts created!"
}

# Function to run health checks
run_health_checks() {
    print_status "Running health checks..."
    
    # Check Docker services
    if docker-compose ps | grep -q "Up"; then
        print_success "✓ Infrastructure services are running"
    else
        print_warning "⚠ Some infrastructure services may not be running"
    fi
    
    # Check if ports are available
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "⚠ Port 3000 is already in use"
    else
        print_success "✓ Port 3000 is available"
    fi
    
    if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
        print_warning "⚠ Port 3001 is already in use"
    else
        print_success "✓ Port 3001 is available"
    fi
}

# Function to display final instructions
display_final_instructions() {
    echo ""
    echo "🎉 Setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Edit backend/.env with your API keys (OpenAI, CoinGecko, etc.)"
    echo "2. Start the application:"
    echo "   ./start-all.sh    # Start everything"
    echo "   OR"
    echo "   ./start-backend.sh & ./start-frontend.sh    # Start separately"
    echo ""
    echo "🌐 Access URLs:"
    echo "   Frontend:  http://localhost:3000"
    echo "   Backend:   http://localhost:3001"
    echo "   Kafka UI:  http://localhost:8080"
    echo ""
    echo "📚 Documentation:"
    echo "   Installation: ./INSTALLATION.md"
    echo "   README:       ./README.md"
    echo ""
    echo "🆘 Need help? Check the troubleshooting section in INSTALLATION.md"
    echo ""
}

# Main execution
main() {
    echo "🚀 AI Trading Analytics Platform - Automated Setup"
    echo "=================================================="
    echo ""
    
    check_prerequisites
    setup_environment
    start_infrastructure
    install_dependencies
    setup_database
    create_startup_scripts
    run_health_checks
    display_final_instructions
}

# Run main function
main "$@"