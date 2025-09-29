import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import dotenv from 'dotenv';

// Import services and middleware
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import { validateRequest } from './middleware/validation';

// Import routes
import authRoutes from './controllers/authController';
import cryptoRoutes from './controllers/cryptoController';
import portfolioRoutes from './controllers/portfolioController';
import alertRoutes from './controllers/alertController';
import sentimentRoutes from './controllers/sentimentController';
import newsRoutes from './controllers/newsController';

// Import services
import { KafkaService } from './kafka/kafkaService';
import { RedisService } from './services/redisService';
import { WebSocketService } from './websocket/websocketService';
import { CryptoDataService } from './services/cryptoDataService';
import { AIService } from './services/aiService';

// Load environment variables
dotenv.config();

class TradingServer {
  private app: express.Application;
  private server: any;
  private io: SocketIOServer;
  private kafkaService!: KafkaService;
  private redisService!: RedisService;
  private webSocketService!: WebSocketService;
  private cryptoDataService!: CryptoDataService;
  private aiService!: AIService;

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
    this.setupErrorHandling();
  }

  private async initializeServices(): Promise<void> {
    try {
      // Initialize AI Service (no external dependencies)
      this.aiService = new AIService();

      // Initialize services that don't require external connections
      this.kafkaService = new KafkaService();
      this.redisService = new RedisService();
      
      // Initialize Crypto Data Service
      this.cryptoDataService = new CryptoDataService(
        this.kafkaService,
        this.redisService
      );

      // Initialize WebSocket Service
      this.webSocketService = new WebSocketService(
        this.io,
        this.kafkaService,
        this.redisService
      );

      logger.info('All services initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize services:', error);
      process.exit(1);
    }
  }

  private setupMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api/', limiter);

    // Body parsing middleware
    this.app.use(compression());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Logging middleware
    this.app.use((req, res, next) => {
      logger.info(`${req.method} ${req.path} - ${req.ip}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
      });
    });

    // API routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/crypto', cryptoRoutes);
    this.app.use('/api/portfolio', authMiddleware, portfolioRoutes);
    this.app.use('/api/alerts', authMiddleware, alertRoutes);
    this.app.use('/api/sentiment', sentimentRoutes);
    this.app.use('/api/news', newsRoutes);

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
      });
    });
  }

  private setupWebSocket(): void {
    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);
      this.webSocketService.handleConnection(socket);
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);

    // Graceful shutdown
    process.on('SIGTERM', () => this.gracefulShutdown());
    process.on('SIGINT', () => this.gracefulShutdown());

    // Unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      this.gracefulShutdown();
    });
  }

  private async gracefulShutdown(): Promise<void> {
    logger.info('Starting graceful shutdown...');

    try {
      // Close server
      this.server.close(() => {
        logger.info('HTTP server closed');
      });

      // Disconnect services
      await this.kafkaService.disconnect();
      await this.redisService.disconnect();

      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  }

  public async start(): Promise<void> {
    await this.initializeServices();
    
    const port = process.env.PORT || 3001;
    
    this.server.listen(port, () => {
      logger.info(`🚀 Trading Analytics Server running on port ${port}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 WebSocket server ready`);
      logger.info(`📈 Kafka streaming active`);
      logger.info(`💾 Redis cache connected`);
    });

    // Start data streaming
    await this.cryptoDataService.startPriceStreaming();
    
    logger.info('🎯 All systems operational - Ready for trading!');
  }
}

// Start the server
const server = new TradingServer();
server.start().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});

export default TradingServer;