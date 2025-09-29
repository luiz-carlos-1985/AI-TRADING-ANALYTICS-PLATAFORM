import OpenAI from 'openai';
import { logger } from '../utils/logger';

export interface SentimentAnalysisResult {
  score: number; // -1 to 1
  confidence: number; // 0 to 1
  keywords: string[];
  summary: string;
}

export interface PricePrediction {
  symbol: string;
  currentPrice: number;
  predictedPrice: number;
  confidence: number;
  timeframe: string;
  factors: string[];
}

export interface MarketInsight {
  type: 'bullish' | 'bearish' | 'neutral';
  confidence: number;
  reasoning: string;
  timeframe: string;
}

export class AIService {
  private openai!: OpenAI;
  private isConfigured: boolean = false;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (apiKey) {
      this.openai = new OpenAI({
        apiKey: apiKey,
      });
      this.isConfigured = true;
      logger.info('AI Service initialized with OpenAI');
    } else {
      logger.warn('OpenAI API key not provided - AI features will be limited');
    }
  }

  async analyzeSentiment(text: string, context?: string): Promise<SentimentAnalysisResult> {
    if (!this.isConfigured) {
      throw new Error('AI Service not properly configured');
    }

    try {
      const prompt = this.buildSentimentPrompt(text, context);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a financial sentiment analysis expert. Analyze the given text and return a JSON response with sentiment score (-1 to 1), confidence (0 to 1), keywords array, and summary.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 500,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const result = JSON.parse(content) as SentimentAnalysisResult;
      
      // Validate and sanitize the result
      result.score = Math.max(-1, Math.min(1, result.score));
      result.confidence = Math.max(0, Math.min(1, result.confidence));
      
      logger.debug(`Sentiment analysis completed: score=${result.score}, confidence=${result.confidence}`);
      return result;
      
    } catch (error) {
      logger.error('Error in sentiment analysis:', error);
      
      // Fallback to basic sentiment analysis
      return this.basicSentimentAnalysis(text);
    }
  }

  async predictPrice(
    symbol: string,
    historicalData: any[],
    marketData: any,
    newsData: any[]
  ): Promise<PricePrediction> {
    if (!this.isConfigured) {
      throw new Error('AI Service not properly configured');
    }

    try {
      const prompt = this.buildPredictionPrompt(symbol, historicalData, marketData, newsData);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency price prediction expert. Analyze the provided data and return a JSON response with price prediction, confidence level, and key factors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const result = JSON.parse(content) as PricePrediction;
      
      // Validate the result
      result.confidence = Math.max(0, Math.min(1, result.confidence));
      result.predictedPrice = Math.max(0, result.predictedPrice);
      
      logger.info(`Price prediction for ${symbol}: $${result.predictedPrice} (confidence: ${result.confidence})`);
      return result;
      
    } catch (error) {
      logger.error('Error in price prediction:', error);
      
      // Fallback to basic prediction
      return this.basicPricePrediction(symbol, historicalData);
    }
  }

  async generateMarketInsight(
    marketData: any,
    topCryptos: any[],
    newsData: any[]
  ): Promise<MarketInsight> {
    if (!this.isConfigured) {
      throw new Error('AI Service not properly configured');
    }

    try {
      const prompt = this.buildMarketInsightPrompt(marketData, topCryptos, newsData);
      
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency market analyst. Provide market insights based on the data and return a JSON response with type (bullish/bearish/neutral), confidence, reasoning, and timeframe.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.4,
        max_tokens: 600,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from OpenAI');
      }

      const result = JSON.parse(content) as MarketInsight;
      
      // Validate the result
      result.confidence = Math.max(0, Math.min(1, result.confidence));
      
      logger.info(`Market insight generated: ${result.type} (confidence: ${result.confidence})`);
      return result;
      
    } catch (error) {
      logger.error('Error generating market insight:', error);
      
      // Fallback to basic insight
      return this.basicMarketInsight(marketData);
    }
  }

  async summarizeNews(articles: any[]): Promise<string> {
    if (!this.isConfigured || articles.length === 0) {
      return 'No recent news available for analysis.';
    }

    try {
      const newsText = articles
        .slice(0, 5) // Limit to top 5 articles
        .map(article => `${article.title}: ${article.summary || article.content?.substring(0, 200)}`)
        .join('\n\n');

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a financial news summarizer. Create a concise summary of the key market trends and events from the provided news articles.'
          },
          {
            role: 'user',
            content: `Summarize these cryptocurrency news articles:\n\n${newsText}`
          }
        ],
        temperature: 0.3,
        max_tokens: 300,
      });

      const summary = response.choices[0]?.message?.content || 'Unable to generate news summary.';
      
      logger.debug('News summary generated successfully');
      return summary;
      
    } catch (error) {
      logger.error('Error summarizing news:', error);
      return 'Error generating news summary.';
    }
  }

  // Private helper methods
  private buildSentimentPrompt(text: string, context?: string): string {
    return `
Analyze the sentiment of this ${context || 'financial'} text:

"${text}"

Return a JSON object with:
- score: number between -1 (very negative) and 1 (very positive)
- confidence: number between 0 and 1
- keywords: array of important keywords
- summary: brief explanation of the sentiment

Focus on financial and market-related sentiment indicators.
`;
  }

  private buildPredictionPrompt(
    symbol: string,
    historicalData: any[],
    marketData: any,
    newsData: any[]
  ): string {
    const recentPrices = historicalData.slice(-10).map(d => d.price);
    const newsHeadlines = newsData.slice(0, 3).map(n => n.title);
    
    return `
Predict the price of ${symbol} based on this data:

Recent prices: ${recentPrices.join(', ')}
Current market cap: ${marketData.marketCap}
24h volume: ${marketData.volume24h}
Recent news: ${newsHeadlines.join('; ')}

Return a JSON object with:
- symbol: "${symbol}"
- currentPrice: current price
- predictedPrice: predicted price for next 24 hours
- confidence: confidence level (0-1)
- timeframe: "24h"
- factors: array of key factors influencing the prediction

Consider technical indicators, market sentiment, and news impact.
`;
  }

  private buildMarketInsightPrompt(
    marketData: any,
    topCryptos: any[],
    newsData: any[]
  ): string {
    const topPerformers = topCryptos.slice(0, 5).map(c => `${c.symbol}: ${c.changePercent24h}%`);
    const newsHeadlines = newsData.slice(0, 3).map(n => n.title);
    
    return `
Analyze the current cryptocurrency market:

Total market cap: ${marketData.totalMarketCap}
24h volume: ${marketData.total24hVolume}
BTC dominance: ${marketData.btcDominance}%
Top performers: ${topPerformers.join(', ')}
Recent news: ${newsHeadlines.join('; ')}

Return a JSON object with:
- type: "bullish", "bearish", or "neutral"
- confidence: confidence level (0-1)
- reasoning: explanation of the market outlook
- timeframe: relevant timeframe for the insight

Consider overall market trends, dominance patterns, and news sentiment.
`;
  }

  // Fallback methods for when AI is not available
  private basicSentimentAnalysis(text: string): SentimentAnalysisResult {
    const positiveWords = ['bullish', 'positive', 'growth', 'increase', 'profit', 'gain', 'up', 'rise'];
    const negativeWords = ['bearish', 'negative', 'decline', 'decrease', 'loss', 'down', 'fall', 'crash'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pw => word.includes(pw))) positiveCount++;
      if (negativeWords.some(nw => word.includes(nw))) negativeCount++;
    });
    
    const totalSentimentWords = positiveCount + negativeCount;
    const score = totalSentimentWords > 0 
      ? (positiveCount - negativeCount) / totalSentimentWords 
      : 0;
    
    return {
      score: Math.max(-1, Math.min(1, score)),
      confidence: Math.min(0.6, totalSentimentWords / 10),
      keywords: words.filter(w => 
        positiveWords.some(pw => w.includes(pw)) || 
        negativeWords.some(nw => w.includes(nw))
      ),
      summary: `Basic sentiment analysis: ${score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral'}`
    };
  }

  private basicPricePrediction(symbol: string, historicalData: any[]): PricePrediction {
    const recentPrices = historicalData.slice(-5).map(d => d.price);
    const currentPrice = recentPrices[recentPrices.length - 1];
    const avgPrice = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    
    // Simple moving average prediction
    const predictedPrice = (currentPrice + avgPrice) / 2;
    
    return {
      symbol,
      currentPrice,
      predictedPrice,
      confidence: 0.3, // Low confidence for basic prediction
      timeframe: '24h',
      factors: ['Simple moving average', 'Recent price trend']
    };
  }

  private basicMarketInsight(marketData: any): MarketInsight {
    const marketCapChange = marketData.marketCapChange || 0;
    
    let type: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    if (marketCapChange > 2) type = 'bullish';
    else if (marketCapChange < -2) type = 'bearish';
    
    return {
      type,
      confidence: 0.4,
      reasoning: `Market cap change of ${marketCapChange}% indicates ${type} sentiment`,
      timeframe: '24h'
    };
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return this.isConfigured;
  }

  isServiceConfigured(): boolean {
    return this.isConfigured;
  }
}