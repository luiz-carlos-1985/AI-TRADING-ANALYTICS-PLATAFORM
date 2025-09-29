import { KafkaService } from '../kafka/kafkaService';
import { RedisService } from './redisService';

export class CryptoDataService {
  constructor(
    private kafkaService: KafkaService,
    private redisService: RedisService
  ) {}

  async startPriceStreaming() {
    console.log('Starting crypto price streaming...');
  }
}