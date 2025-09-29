'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, BarChart3, Activity, Target } from 'lucide-react';
import { toast } from 'react-hot-toast';

const analyticsData = {
  sentiment: {
    overall: 78,
    bitcoin: 85,
    ethereum: 65,
    news: [
      { title: 'Bitcoin ETF approval boosts market confidence', sentiment: 92, source: 'CoinDesk' },
      { title: 'Ethereum upgrade shows promising results', sentiment: 78, source: 'CryptoNews' },
      { title: 'Market volatility expected this week', sentiment: 45, source: 'Bloomberg' },
    ]
  },
  predictions: [
    { symbol: 'BTC', current: 67420, predicted: 72500, confidence: 87, timeframe: '7d' },
    { symbol: 'ETH', current: 3840, predicted: 4200, confidence: 73, timeframe: '7d' },
    { symbol: 'SOL', current: 198, predicted: 220, confidence: 65, timeframe: '7d' },
  ],
  marketMetrics: {
    fearGreed: 72,
    volatility: 34,
    volume: 2.4,
    dominance: 52.3
  }
};

export default function AnalyticsPage() {
  const [data, setData] = useState(analyticsData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        sentiment: {
          ...prev.sentiment,
          overall: Math.max(0, Math.min(100, prev.sentiment.overall + (Math.random() - 0.5) * 5))
        },
        marketMetrics: {
          ...prev.marketMetrics,
          fearGreed: Math.max(0, Math.min(100, prev.marketMetrics.fearGreed + (Math.random() - 0.5) * 3))
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* AI Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-sm">AI Confidence</p>
              <p className="text-lg md:text-2xl font-bold truncate">{data.sentiment.overall}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div className="bg-purple-400 h-2 rounded-full" style={{ width: `${data.sentiment.overall}%` }}></div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-sm">Fear & Greed</p>
              <p className="text-lg md:text-2xl font-bold truncate">{data.marketMetrics.fearGreed}</p>
            </div>
          </div>
          <p className="text-sm text-green-400">Greed Zone</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-sm">Volatility</p>
              <p className="text-lg md:text-2xl font-bold truncate">{data.marketMetrics.volatility}%</p>
            </div>
          </div>
          <p className="text-sm text-blue-400">Low</p>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-orange-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-gray-400 text-sm">BTC Dominance</p>
              <p className="text-lg md:text-2xl font-bold truncate">{data.marketMetrics.dominance}%</p>
            </div>
          </div>
          <p className="text-sm text-orange-400">Stable</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* AI Predictions */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6">AI Price Predictions</h3>
          
          <div className="space-y-6">
            {data.predictions.map((pred) => (
              <div key={pred.symbol} className="bg-gray-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center font-bold text-black text-sm">
                      {pred.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{pred.symbol}</h4>
                      <p className="text-gray-400 text-sm">{pred.timeframe} forecast</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Confidence</div>
                    <div className="text-lg font-bold">{pred.confidence}%</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Current</div>
                    <div className="text-xl font-bold">${pred.current.toLocaleString()}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Predicted</div>
                      <div className="text-xl font-bold text-green-400">${pred.predicted.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Upside Potential</span>
                    <span className="text-green-400 font-semibold">
                      +{(((pred.predicted - pred.current) / pred.current) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: `${pred.confidence}%` }}></div>
                  </div>
                  <button 
                    onClick={() => {
                      toast.success(`Trade signal generated for ${pred.symbol} based on AI prediction!`);
                    }}
                    className="w-full mt-3 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Generate Signal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6">Market Sentiment</h3>
          
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h4 className="text-lg font-bold mb-4">Overall Market Sentiment</h4>
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-300">Bullish Sentiment</span>
                <span className="text-green-400 font-semibold">{data.sentiment.overall}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div className="bg-green-400 h-3 rounded-full" style={{ width: `${data.sentiment.overall}%` }}></div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h4 className="text-lg font-bold mb-4">Asset Sentiment</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Bitcoin</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full" style={{ width: `${data.sentiment.bitcoin}%` }}></div>
                    </div>
                    <span className="text-sm text-green-400 font-semibold">{data.sentiment.bitcoin}%</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Ethereum</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-700 rounded-full h-2">
                      <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${data.sentiment.ethereum}%` }}></div>
                    </div>
                    <span className="text-sm text-yellow-400 font-semibold">{data.sentiment.ethereum}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-6">
              <h4 className="text-lg font-bold mb-4">Recent News Analysis</h4>
              <div className="space-y-3">
                {data.sentiment.news.map((news, index) => (
                  <div key={index} className="border-l-4 border-blue-400 pl-4">
                    <p className="text-sm font-medium">{news.title}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">{news.source}</span>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        news.sentiment > 70 ? 'bg-green-500/20 text-green-400' :
                        news.sentiment > 50 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {news.sentiment}% positive
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}