@echo off
echo 🚀 AI Trading Platform - Quick Start
echo ====================================

REM Use new Docker Compose syntax
docker compose up -d postgres redis zookeeper kafka kafka-ui

echo ⏳ Waiting for services...
timeout /t 10 /nobreak >nul

REM Setup backend
cd backend
if not exist ".env" copy ".env.example" ".env"
call npm install
call npx prisma generate
call npx prisma migrate dev --name init
cd ..

REM Setup frontend  
cd frontend
if not exist ".env.local" (
    echo NEXT_PUBLIC_API_URL="http://localhost:3001" > ".env.local"
    echo NEXT_PUBLIC_WS_URL="http://localhost:3001" >> ".env.local"
)
call npm install
cd ..

echo.
echo ✅ Setup complete! Now run:
echo.
echo   Backend:  cd backend && npm run dev
echo   Frontend: cd frontend && npm run dev
echo.
echo 🌐 URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo   Kafka UI: http://localhost:8080
echo.

pause