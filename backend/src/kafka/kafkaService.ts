import { Kafka, Producer, Consumer, KafkaMessage } from 'kafkajs';
import { logger } from '../utils/logger';

export interface CryptoPriceEvent {
  symbol: string;
  price: number;
  marketCap?: number;
  volume24h?: number;
  change24h?: number;
  changePercent24h?: number;
  timestamp: string;
}

export interface SentimentEvent {
  symbol: string;
  score: number;
  confidence: number;
  source: string;
  title?: string;
  content?: string;
  timestamp: string;
}

export interface AlertEvent {
  userId: string;
  alertId: string;
  symbol: string;
  type: string;
  message: string;
  timestamp: string;
}

export class KafkaService {
  private kafka: Kafka;
  private producer: Producer;
  private consumers: Map<string, Consumer> = new Map();
  private isConnected: boolean = false;

  // Topic names
  public static readonly TOPICS = {
    CRYPTO_PRICES: 'crypto-prices',
    NEWS_SENTIMENT: 'news-sentiment',
    USER_ALERTS: 'user-alerts',
    PORTFOLIO_UPDATES: 'portfolio-updates',
    MARKET_DATA: 'market-data',
    AI_PREDICTIONS: 'ai-predictions'
  };

  constructor() {
    this.kafka = new Kafka({
      clientId: 'trading-platform',
      brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
      retry: {
        initialRetryTime: 100,
        retries: 8
      },
      connectionTimeout: 3000,
      requestTimeout: 30000,
    });

    this.producer = this.kafka.producer({
      maxInFlightRequests: 1,
      idempotent: true,
      transactionTimeout: 30000,
    });
  }

  async connect(): Promise<void> {
    try {
      await this.producer.connect();
      await this.createTopics();
      this.isConnected = true;
      logger.info('Kafka service connected successfully');
    } catch (error) {
      logger.error('Failed to connect to Kafka:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      // Disconnect all consumers
      for (const [groupId, consumer] of this.consumers) {
        await consumer.disconnect();
        logger.info(`Disconnected consumer: ${groupId}`);
      }
      this.consumers.clear();

      // Disconnect producer
      await this.producer.disconnect();
      this.isConnected = false;
      logger.info('Kafka service disconnected');
    } catch (error) {
      logger.error('Error disconnecting from Kafka:', error);
      throw error;
    }
  }

  private async createTopics(): Promise<void> {
    const admin = this.kafka.admin();
    
    try {
      await admin.connect();
      
      const topics = Object.values(KafkaService.TOPICS).map(topic => ({
        topic,
        numPartitions: 3,
        replicationFactor: 1,
        configEntries: [
          { name: 'cleanup.policy', value: 'delete' },
          { name: 'retention.ms', value: '604800000' }, // 7 days
          { name: 'segment.ms', value: '86400000' }, // 1 day
        ]
      }));

      await admin.createTopics({
        topics,
        waitForLeaders: true,
      });

      logger.info('Kafka topics created/verified successfully');
    } catch (error) {
      logger.error('Error creating Kafka topics:', error);
      throw error;
    } finally {
      await admin.disconnect();
    }
  }

  async publishCryptoPrice(data: CryptoPriceEvent): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka service not connected');
    }

    try {
      await this.producer.send({
        topic: KafkaService.TOPICS.CRYPTO_PRICES,
        messages: [{
          key: data.symbol,
          value: JSON.stringify(data),
          timestamp: new Date(data.timestamp).getTime().toString(),
          headers: {
            'content-type': 'application/json',
            'source': 'crypto-data-service'
          }
        }]
      });

      logger.debug(`Published price update for ${data.symbol}: $${data.price}`);
    } catch (error) {
      logger.error('Error publishing crypto price:', error);
      throw error;
    }
  }

  async publishSentiment(data: SentimentEvent): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka service not connected');
    }

    try {
      await this.producer.send({
        topic: KafkaService.TOPICS.NEWS_SENTIMENT,
        messages: [{
          key: data.symbol,
          value: JSON.stringify(data),
          timestamp: new Date(data.timestamp).getTime().toString(),
          headers: {
            'content-type': 'application/json',
            'source': 'ai-service'
          }
        }]
      });

      logger.debug(`Published sentiment for ${data.symbol}: ${data.score}`);
    } catch (error) {
      logger.error('Error publishing sentiment:', error);
      throw error;
    }
  }

  async publishAlert(data: AlertEvent): Promise<void> {
    if (!this.isConnected) {
      throw new Error('Kafka service not connected');
    }

    try {
      await this.producer.send({
        topic: KafkaService.TOPICS.USER_ALERTS,
        messages: [{
          key: data.userId,
          value: JSON.stringify(data),
          timestamp: new Date(data.timestamp).getTime().toString(),
          headers: {
            'content-type': 'application/json',
            'source': 'alert-service'
          }
        }]
      });

      logger.info(`Published alert for user ${data.userId}: ${data.message}`);
    } catch (error) {
      logger.error('Error publishing alert:', error);
      throw error;
    }
  }

  async createConsumer(
    groupId: string,
    topics: string[],
    messageHandler: (topic: string, message: KafkaMessage) => Promise<void>
  ): Promise<Consumer> {
    const consumer = this.kafka.consumer({ 
      groupId,
      sessionTimeout: 30000,
      heartbeatInterval: 3000,
    });

    try {
      await consumer.connect();
      await consumer.subscribe({ topics, fromBeginning: false });

      await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
          try {
            logger.debug(`Received message from ${topic}:${partition}`);
            await messageHandler(topic, message);
          } catch (error) {
            logger.error(`Error processing message from ${topic}:`, error);
          }
        },
      });

      this.consumers.set(groupId, consumer);
      logger.info(`Consumer created for group: ${groupId}, topics: ${topics.join(', ')}`);
      
      return consumer;
    } catch (error) {
      logger.error(`Error creating consumer for group ${groupId}:`, error);
      throw error;
    }
  }

  async getConsumer(groupId: string): Promise<Consumer | undefined> {
    return this.consumers.get(groupId);
  }

  isServiceConnected(): boolean {
    return this.isConnected;
  }

  // Utility method to parse Kafka message
  static parseMessage<T>(message: KafkaMessage): T | null {
    try {
      if (!message.value) return null;
      return JSON.parse(message.value.toString()) as T;
    } catch (error) {
      logger.error('Error parsing Kafka message:', error);
      return null;
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      const admin = this.kafka.admin();
      await admin.connect();
      await admin.listTopics();
      await admin.disconnect();
      return true;
    } catch (error) {
      logger.error('Kafka health check failed:', error);
      return false;
    }
  }
}