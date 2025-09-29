# 🚀 AI Trading Analytics Platform - Installation Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Docker & Docker Compose** - [Download here](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download here](https://git-scm.com/)
- **PostgreSQL** (optional, can use Docker) - [Download here](https://www.postgresql.org/)

## 🛠️ Quick Start (Recommended)

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd ai-trading-platform
```

### 2. Start Infrastructure Services
```bash
# Start PostgreSQL, Redis, Kafka, and Zookeeper
docker-compose up -d postgres redis kafka zookeeper kafka-ui
```

### 3. Setup Environment Variables

**Backend Environment:**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` with your configuration:
```env
DATABASE_URL="postgresql://trading_user:trading_pass@localhost:5432/trading_db"
REDIS_URL="redis://localhost:6379"
KAFKA_BROKERS="localhost:9092"
OPENAI_API_KEY="your-openai-api-key"
JWT_SECRET="your-super-secret-jwt-key"
```

**Frontend Environment:**
```bash
cd ../frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

### 4. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ../frontend
npm install
```

### 5. Setup Database
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 6. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 7. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Kafka UI:** http://localhost:8080

## 🐳 Docker Development (Alternative)

### Full Docker Setup
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### Individual Service Management
```bash
# Start only infrastructure
docker-compose up -d postgres redis kafka zookeeper

# Start backend
docker-compose up backend

# Start frontend
docker-compose up frontend
```

## 🔧 Manual Installation (Advanced)

### 1. PostgreSQL Setup
```bash
# Create database
createdb trading_db

# Create user
psql -c "CREATE USER trading_user WITH PASSWORD 'trading_pass';"
psql -c "GRANT ALL PRIVILEGES ON DATABASE trading_db TO trading_user;"
```

### 2. Redis Setup
```bash
# Install Redis (Ubuntu/Debian)
sudo apt update
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 3. Kafka Setup
```bash
# Download Kafka
wget https://downloads.apache.org/kafka/2.13-3.6.0/kafka_2.13-3.6.0.tgz
tar -xzf kafka_2.13-3.6.0.tgz
cd kafka_2.13-3.6.0

# Start Zookeeper
bin/zookeeper-server-start.sh config/zookeeper.properties

# Start Kafka (in another terminal)
bin/kafka-server-start.sh config/server.properties
```

## 🔑 API Keys Setup

### 1. OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account or sign in
3. Go to API Keys section
4. Create a new API key
5. Add to your `.env` file

### 2. CoinGecko API Key (Optional)
1. Visit [CoinGecko API](https://www.coingecko.com/en/api)
2. Sign up for a free account
3. Get your API key
4. Add to your `.env` file

### 3. News API Key (Optional)
1. Visit [NewsAPI](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key
4. Add to your `.env` file

## 🧪 Testing the Installation

### 1. Health Checks
```bash
# Backend health check
curl http://localhost:3001/health

# Check Kafka topics
docker exec -it trading-kafka kafka-topics --bootstrap-server localhost:9092 --list

# Check Redis connection
redis-cli ping
```

### 2. Run Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Production Deployment

### 1. Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### 2. Production Docker
```bash
# Use production docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

### 3. Environment Variables for Production
Update your production `.env` files with:
- Secure JWT secrets
- Production database URLs
- Production API keys
- CORS origins
- SSL certificates

## 🔍 Troubleshooting

### Common Issues

**1. Port Already in Use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**2. Database Connection Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Reset database
cd backend
npx prisma migrate reset
```

**3. Kafka Connection Issues**
```bash
# Restart Kafka services
docker-compose restart kafka zookeeper

# Check Kafka logs
docker logs trading-kafka
```

**4. Redis Connection Issues**
```bash
# Restart Redis
docker-compose restart redis

# Check Redis logs
docker logs trading-redis
```

**5. Node Modules Issues**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

**1. Increase Node.js Memory**
```bash
export NODE_OPTIONS="--max-old-space-size=4096"
```

**2. Kafka Performance**
```bash
# Increase Kafka heap size
export KAFKA_HEAP_OPTS="-Xmx1G -Xms1G"
```

**3. PostgreSQL Optimization**
```sql
-- Increase shared_buffers in postgresql.conf
shared_buffers = 256MB
effective_cache_size = 1GB
```

## 📊 Monitoring & Logs

### View Logs
```bash
# Backend logs
cd backend && npm run dev

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f kafka

# Kafka UI
# Visit http://localhost:8080 for Kafka monitoring
```

### Health Monitoring
```bash
# Check all services
docker-compose ps

# Check resource usage
docker stats
```

## 🆘 Getting Help

If you encounter any issues:

1. Check the logs for error messages
2. Verify all environment variables are set correctly
3. Ensure all required services are running
4. Check the [troubleshooting section](#troubleshooting)
5. Create an issue in the repository with:
   - Error messages
   - System information
   - Steps to reproduce

## 📚 Next Steps

After successful installation:

1. **Explore the Dashboard** - Navigate to http://localhost:3000
2. **Check API Documentation** - Visit http://localhost:3001/api/docs
3. **Monitor Kafka** - Use Kafka UI at http://localhost:8080
4. **Review Architecture** - Read the [Architecture Guide](./docs/architecture.md)
5. **Customize Configuration** - Modify settings in `.env` files

---

**🎉 Congratulations! Your AI Trading Analytics Platform is now running!**

For more detailed information, check out:
- [API Documentation](./docs/api.md)
- [Architecture Guide](./docs/architecture.md)
- [Contributing Guide](./docs/contributing.md)