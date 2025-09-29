# Real-Time AI Trading Analytics Platform

## 🚀 Overview
A cutting-edge fullstack application that combines real-time cryptocurrency data streaming, AI-powered sentiment analysis, and intelligent trading insights using modern technologies like Kafka, OpenAI, and WebSockets.

## 🏗️ Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │   Data Layer    │
│   (Next.js)     │◄──►│   (Node.js)      │◄──►│   PostgreSQL    │
│                 │    │                  │    │   Redis Cache   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         ▲                        ▲                       ▲
         │                        │                       │
         ▼                        ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   WebSockets    │    │   Apache Kafka   │    │   OpenAI API    │
│   Real-time UI  │    │   Event Stream   │    │   Sentiment AI  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **TailwindCSS** - Modern styling
- **Chart.js** - Real-time charts
- **Socket.io Client** - WebSocket connection

### Backend
- **Node.js + Express** - REST API server
- **TypeScript** - Type safety
- **Socket.io** - WebSocket server
- **Prisma ORM** - Database management
- **Kafka.js** - Event streaming
- **Redis** - Caching and pub/sub

### Data & AI
- **PostgreSQL** - Primary database
- **Apache Kafka** - Event streaming
- **OpenAI API** - Sentiment analysis
- **CoinGecko API** - Crypto data
- **News API** - Financial news

### DevOps
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD
- **Nginx** - Reverse proxy

## 🚀 Features

### Real-Time Data Streaming
- Live cryptocurrency price feeds
- Event-driven architecture with Kafka
- WebSocket connections for instant updates
- Redis caching for performance

### AI-Powered Analytics
- Sentiment analysis of financial news
- Price prediction algorithms
- Market trend analysis
- Intelligent alerts and notifications

### Interactive Dashboard
- Real-time price charts
- Portfolio tracking
- Risk assessment metrics
- Custom trading signals

### Advanced Architecture
- Microservices design
- Event sourcing patterns
- CQRS implementation
- Horizontal scalability

## 📦 Installation

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL
- Redis

### Quick Start
```bash
# Clone the repository
git clone <repository-url>
cd ai-trading-platform

# Start infrastructure services
docker-compose up -d

# Install dependencies
cd frontend && npm install
cd ../backend && npm install

# Setup database
cd backend && npx prisma migrate dev

# Start development servers
npm run dev:all
```

## 🔧 Configuration

### Environment Variables
Create `.env` files in both frontend and backend directories:

**Backend (.env)**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/trading_db"
REDIS_URL="redis://localhost:6379"
KAFKA_BROKERS="localhost:9092"
OPENAI_API_KEY="your-openai-key"
NEWS_API_KEY="your-news-api-key"
JWT_SECRET="your-jwt-secret"
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_WS_URL="http://localhost:3001"
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Token refresh

### Trading Data
- `GET /api/crypto/prices` - Current crypto prices
- `GET /api/crypto/history/:symbol` - Historical data
- `POST /api/alerts` - Create price alerts
- `GET /api/portfolio` - User portfolio

### AI Analytics
- `GET /api/sentiment/:symbol` - Sentiment analysis
- `GET /api/predictions/:symbol` - Price predictions
- `GET /api/news/analysis` - News sentiment

## 🔄 Event Streaming

### Kafka Topics
- `crypto-prices` - Real-time price updates
- `news-sentiment` - News sentiment analysis
- `user-alerts` - Trading alerts
- `portfolio-updates` - Portfolio changes

### Event Flow
1. External APIs → Kafka Producers
2. Kafka → Backend Consumers
3. Backend → WebSocket → Frontend
4. AI Processing → Kafka → Notifications

## 🧠 AI Features

### Sentiment Analysis
- Real-time news sentiment scoring
- Social media sentiment tracking
- Market mood indicators
- Correlation with price movements

### Predictive Analytics
- Price trend predictions
- Volatility forecasting
- Support/resistance levels
- Risk assessment metrics

## 🚀 Deployment

### Docker Deployment
```bash
# Build and deploy
docker-compose -f docker-compose.prod.yml up -d

# Scale services
docker-compose up --scale backend=3
```

### Cloud Deployment
- **Frontend**: Vercel/Netlify
- **Backend**: AWS ECS/Google Cloud Run
- **Database**: AWS RDS/Google Cloud SQL
- **Kafka**: Confluent Cloud/AWS MSK

## 📈 Performance

### Optimization Features
- Redis caching for API responses
- Database query optimization
- WebSocket connection pooling
- Kafka partition strategies
- CDN for static assets

### Monitoring
- Application metrics with Prometheus
- Real-time logging with Winston
- Error tracking with Sentry
- Performance monitoring

## 🔒 Security

### Implementation
- JWT authentication
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

## 🧪 Testing

### Test Coverage
- Unit tests with Jest
- Integration tests
- E2E tests with Playwright
- Load testing with Artillery
- API testing with Supertest

```bash
# Run tests
npm run test
npm run test:e2e
npm run test:load
```

## 📚 Documentation

### Available Docs
- [API Documentation](./docs/api.md)
- [Architecture Guide](./docs/architecture.md)
- [Deployment Guide](./docs/deployment.md)
- [Contributing Guide](./docs/contributing.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

Screenshots:
<img width="1846" height="955" alt="image" src="https://github.com/user-attachments/assets/6a231995-0fb3-48c8-9365-3c73a7bb0514" />

<img width="1834" height="1042" alt="image" src="https://github.com/user-attachments/assets/d2a9e166-d3ba-4482-8d91-dd85592db68f" />

<img width="1845" height="1036" alt="image" src="https://github.com/user-attachments/assets/85e552d8-3d0c-4084-8a62-6748b3f9ff0d" />

<img width="1844" height="1036" alt="image" src="https://github.com/user-attachments/assets/98017f96-f863-4fb2-8816-b757895d053a" />

<img width="1858" height="806" alt="image" src="https://github.com/user-attachments/assets/922dac6f-52f2-4c12-9a03-c454275fb55e" />

<img width="1848" height="928" alt="image" src="https://github.com/user-attachments/assets/b5769def-e591-4442-a6e7-3453dff240f9" />

**Built with ❤️ using modern technologies for the future of trading analytics.**
