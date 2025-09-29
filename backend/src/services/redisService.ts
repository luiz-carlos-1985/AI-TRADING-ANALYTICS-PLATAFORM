import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  nx?: boolean; // Only set if key doesn't exist
}

export class RedisService {
  private client: RedisClientType;
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private isConnected: boolean = false;

  // Cache key prefixes
  public static readonly KEYS = {
    CRYPTO_PRICE: 'crypto:price:',
    CRYPTO_HISTORY: 'crypto:history:',
    USER_SESSION: 'user:session:',
    USER_PORTFOLIO: 'user:portfolio:',
    MARKET_DATA: 'market:data',
    SENTIMENT: 'sentiment:',
    NEWS: 'news:',
    RATE_LIMIT: 'rate_limit:',
    WEBSOCKET_ROOMS: 'ws:rooms:',
  };

  constructor() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    // Main client for general operations
    this.client = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
      },

    });

    // Subscriber client for pub/sub
    this.subscriber = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
      },
    });

    // Publisher client for pub/sub
    this.publisher = createClient({
      url: redisUrl,
      socket: {
        connectTimeout: 5000,
      },
    });

    this.setupErrorHandlers();
  }

  private setupErrorHandlers(): void {
    this.client.on('error', (err) => {
      logger.error('Redis client error:', err);
    });

    this.subscriber.on('error', (err) => {
      logger.error('Redis subscriber error:', err);
    });

    this.publisher.on('error', (err) => {
      logger.error('Redis publisher error:', err);
    });

    this.client.on('connect', () => {
      logger.info('Redis client connected');
    });

    this.client.on('ready', () => {
      logger.info('Redis client ready');
    });

    this.client.on('end', () => {
      logger.info('Redis client disconnected');
    });
  }

  async connect(): Promise<void> {
    try {
      await Promise.all([
        this.client.connect(),
        this.subscriber.connect(),
        this.publisher.connect(),
      ]);
      
      this.isConnected = true;
      logger.info('Redis service connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await Promise.all([
        this.client.disconnect(),
        this.subscriber.disconnect(),
        this.publisher.disconnect(),
      ]);
      
      this.isConnected = false;
      logger.info('Redis service disconnected');
    } catch (error) {
      logger.error('Error disconnecting from Redis:', error);
      throw error;
    }
  }

  // Basic cache operations
  async set(key: string, value: any, options?: CacheOptions): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      
      if (options?.ttl) {
        await this.client.setEx(key, options.ttl, serializedValue);
      } else if (options?.nx) {
        await this.client.setNX(key, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
      
      logger.debug(`Cached data for key: ${key}`);
    } catch (error) {
      logger.error(`Error setting cache for key ${key}:`, error);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.client.get(key);
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Error getting cache for key ${key}:`, error);
      return null;
    }
  }

  async del(key: string): Promise<void> {
    try {
      await this.client.del(key);
      logger.debug(`Deleted cache for key: ${key}`);
    } catch (error) {
      logger.error(`Error deleting cache for key ${key}:`, error);
      throw error;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Error checking existence for key ${key}:`, error);
      return false;
    }
  }

  async expire(key: string, seconds: number): Promise<void> {
    try {
      await this.client.expire(key, seconds);
    } catch (error) {
      logger.error(`Error setting expiration for key ${key}:`, error);
      throw error;
    }
  }

  // Hash operations
  async hSet(key: string, field: string, value: any): Promise<void> {
    try {
      await this.client.hSet(key, field, JSON.stringify(value));
    } catch (error) {
      logger.error(`Error setting hash field ${field} for key ${key}:`, error);
      throw error;
    }
  }

  async hGet<T>(key: string, field: string): Promise<T | null> {
    try {
      const value = await this.client.hGet(key, field);
      if (!value) return null;
      
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error(`Error getting hash field ${field} for key ${key}:`, error);
      return null;
    }
  }

  async hGetAll<T>(key: string): Promise<Record<string, T>> {
    try {
      const hash = await this.client.hGetAll(key);
      const result: Record<string, T> = {};
      
      for (const [field, value] of Object.entries(hash)) {
        result[field] = JSON.parse(value) as T;
      }
      
      return result;
    } catch (error) {
      logger.error(`Error getting all hash fields for key ${key}:`, error);
      return {};
    }
  }

  // List operations
  async lPush(key: string, ...values: any[]): Promise<void> {
    try {
      const serializedValues = values.map(v => JSON.stringify(v));
      await this.client.lPush(key, serializedValues);
    } catch (error) {
      logger.error(`Error pushing to list ${key}:`, error);
      throw error;
    }
  }

  async lRange<T>(key: string, start: number, stop: number): Promise<T[]> {
    try {
      const values = await this.client.lRange(key, start, stop);
      return values.map(v => JSON.parse(v) as T);
    } catch (error) {
      logger.error(`Error getting range from list ${key}:`, error);
      return [];
    }
  }

  async lTrim(key: string, start: number, stop: number): Promise<void> {
    try {
      await this.client.lTrim(key, start, stop);
    } catch (error) {
      logger.error(`Error trimming list ${key}:`, error);
      throw error;
    }
  }

  // Pub/Sub operations
  async publish(channel: string, message: any): Promise<void> {
    try {
      await this.publisher.publish(channel, JSON.stringify(message));
      logger.debug(`Published message to channel: ${channel}`);
    } catch (error) {
      logger.error(`Error publishing to channel ${channel}:`, error);
      throw error;
    }
  }

  async subscribe(
    channel: string,
    callback: (message: any) => void
  ): Promise<void> {
    try {
      await this.subscriber.subscribe(channel, (message) => {
        try {
          const parsedMessage = JSON.parse(message);
          callback(parsedMessage);
        } catch (error) {
          logger.error(`Error parsing message from channel ${channel}:`, error);
        }
      });
      
      logger.info(`Subscribed to channel: ${channel}`);
    } catch (error) {
      logger.error(`Error subscribing to channel ${channel}:`, error);
      throw error;
    }
  }

  async unsubscribe(channel: string): Promise<void> {
    try {
      await this.subscriber.unsubscribe(channel);
      logger.info(`Unsubscribed from channel: ${channel}`);
    } catch (error) {
      logger.error(`Error unsubscribing from channel ${channel}:`, error);
      throw error;
    }
  }

  // Specialized methods for trading platform
  async cacheCryptoPrice(symbol: string, priceData: any, ttl: number = 60): Promise<void> {
    const key = `${RedisService.KEYS.CRYPTO_PRICE}${symbol}`;
    await this.set(key, priceData, { ttl });
  }

  async getCachedCryptoPrice<T>(symbol: string): Promise<T | null> {
    const key = `${RedisService.KEYS.CRYPTO_PRICE}${symbol}`;
    return await this.get<T>(key);
  }

  async cacheUserSession(userId: string, sessionData: any, ttl: number = 3600): Promise<void> {
    const key = `${RedisService.KEYS.USER_SESSION}${userId}`;
    await this.set(key, sessionData, { ttl });
  }

  async getUserSession<T>(userId: string): Promise<T | null> {
    const key = `${RedisService.KEYS.USER_SESSION}${userId}`;
    return await this.get<T>(key);
  }

  async invalidateUserSession(userId: string): Promise<void> {
    const key = `${RedisService.KEYS.USER_SESSION}${userId}`;
    await this.del(key);
  }

  // Rate limiting
  async checkRateLimit(identifier: string, limit: number, windowSeconds: number): Promise<boolean> {
    const key = `${RedisService.KEYS.RATE_LIMIT}${identifier}`;
    
    try {
      const current = await this.client.incr(key);
      
      if (current === 1) {
        await this.client.expire(key, windowSeconds);
      }
      
      return current <= limit;
    } catch (error) {
      logger.error(`Error checking rate limit for ${identifier}:`, error);
      return true; // Allow request on error
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      return result === 'PONG';
    } catch (error) {
      logger.error('Redis health check failed:', error);
      return false;
    }
  }

  // Get connection status
  isServiceConnected(): boolean {
    return this.isConnected;
  }

  // Get Redis client for advanced operations
  getClient(): RedisClientType {
    return this.client;
  }
}