@echo off
setlocal enabledelayedexpansion

REM AI Trading Analytics Platform - Windows Setup Script
REM This script automates the entire setup process for Windows

echo.
echo 🚀 AI Trading Analytics Platform - Windows Setup
echo ==================================================
echo.

REM Function to check if command exists
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18+ from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop from https://www.docker.com/
    pause
    exit /b 1
)

where docker-compose >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Desktop from https://www.docker.com/
    pause
    exit /b 1
)

echo ✅ All prerequisites are installed!
echo.

REM Setup environment files
echo 📝 Setting up environment files...

if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env" >nul
    echo ✅ Created backend\.env from template
    echo ⚠️  Please edit backend\.env with your API keys and configuration
) else (
    echo ⚠️  backend\.env already exists, skipping...
)

if not exist "frontend\.env.local" (
    echo NEXT_PUBLIC_API_URL="http://localhost:3001" > "frontend\.env.local"
    echo NEXT_PUBLIC_WS_URL="http://localhost:3001" >> "frontend\.env.local"
    echo ✅ Created frontend\.env.local
) else (
    echo ⚠️  frontend\.env.local already exists, skipping...
)

echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    pause
    exit /b 1
)

REM Start infrastructure services
echo 🐳 Starting infrastructure services (PostgreSQL, Redis, Kafka)...
docker-compose up -d postgres redis zookeeper kafka kafka-ui

echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Check if services are running
docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Infrastructure services started successfully!
) else (
    echo ❌ Failed to start infrastructure services
    docker-compose logs
    pause
    exit /b 1
)

echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Backend dependencies installed!

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..
echo ✅ Frontend dependencies installed!

echo.

REM Setup database
echo 🗄️  Setting up database...
cd backend

echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

REM Generate Prisma client
call npx prisma generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    pause
    exit /b 1
)

REM Run database migrations
call npx prisma migrate dev --name init
if %errorlevel% neq 0 (
    echo ❌ Failed to run database migrations
    pause
    exit /b 1
)

cd ..
echo ✅ Database setup completed!

echo.

REM Create startup scripts
echo 📜 Creating startup scripts...

REM Create start-backend.bat
echo @echo off > start-backend.bat
echo echo Starting backend server... >> start-backend.bat
echo cd backend >> start-backend.bat
echo npm run dev >> start-backend.bat

REM Create start-frontend.bat
echo @echo off > start-frontend.bat
echo echo Starting frontend server... >> start-frontend.bat
echo cd frontend >> start-frontend.bat
echo npm run dev >> start-frontend.bat

REM Create start-all.bat
echo @echo off > start-all.bat
echo setlocal enabledelayedexpansion >> start-all.bat
echo echo Starting all services... >> start-all.bat
echo. >> start-all.bat
echo REM Start infrastructure if not running >> start-all.bat
echo docker-compose ps ^| findstr "Up" ^>nul >> start-all.bat
echo if %%errorlevel%% neq 0 ^( >> start-all.bat
echo     echo Starting infrastructure services... >> start-all.bat
echo     docker-compose up -d postgres redis zookeeper kafka kafka-ui >> start-all.bat
echo     echo Waiting for services to be ready... >> start-all.bat
echo     timeout /t 10 /nobreak ^>nul >> start-all.bat
echo ^) >> start-all.bat
echo. >> start-all.bat
echo echo. >> start-all.bat
echo echo 🚀 AI Trading Analytics Platform is starting up! >> start-all.bat
echo echo. >> start-all.bat
echo echo 📊 Frontend: http://localhost:3000 >> start-all.bat
echo echo 🔧 Backend API: http://localhost:3001 >> start-all.bat
echo echo 📈 Kafka UI: http://localhost:8080 >> start-all.bat
echo echo. >> start-all.bat
echo echo Starting backend and frontend... >> start-all.bat
echo start "Backend" cmd /k "cd backend && npm run dev" >> start-all.bat
echo timeout /t 3 /nobreak ^>nul >> start-all.bat
echo start "Frontend" cmd /k "cd frontend && npm run dev" >> start-all.bat
echo echo. >> start-all.bat
echo echo ✅ All services are starting! Check the opened windows. >> start-all.bat
echo pause >> start-all.bat

echo ✅ Startup scripts created!

echo.

REM Run health checks
echo 🔍 Running health checks...

docker-compose ps | findstr "Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Infrastructure services are running
) else (
    echo ⚠️  Some infrastructure services may not be running
)

netstat -an | findstr ":3000" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3000 is already in use
) else (
    echo ✅ Port 3000 is available
)

netstat -an | findstr ":3001" | findstr "LISTENING" >nul
if %errorlevel% equ 0 (
    echo ⚠️  Port 3001 is already in use
) else (
    echo ✅ Port 3001 is available
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit backend\.env with your API keys (OpenAI, CoinGecko, etc.)
echo 2. Start the application:
echo    start-all.bat    # Start everything
echo    OR
echo    start-backend.bat and start-frontend.bat    # Start separately
echo.
echo 🌐 Access URLs:
echo    Frontend:  http://localhost:3000
echo    Backend:   http://localhost:3001
echo    Kafka UI:  http://localhost:8080
echo.
echo 📚 Documentation:
echo    Installation: INSTALLATION.md
echo    README:       README.md
echo.
echo 🆘 Need help? Check the troubleshooting section in INSTALLATION.md
echo.

pause