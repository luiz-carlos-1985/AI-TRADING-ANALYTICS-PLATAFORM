'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Brain, AlertTriangle, BarChart3 } from 'lucide-react';
import { toast } from 'react-hot-toast';

const mockData = {
  portfolio: { value: 245680.50, change: 8.24, dayChange: 18420.30 },
  trades: { active: 12, completed: 1247, winRate: 87.3 },
  alerts: 3,
  aiSignals: { bullish: 15, bearish: 3, neutral: 7 },
  topCoins: [
    { symbol: 'BTC', price: 67420.50, change: 3.24, position: 2.5 },
    { symbol: 'ETH', price: 3840.75, change: -1.12, position: 1.8 },
    { symbol: 'SOL', price: 198.32, change: 5.43, position: 0.9 },
    { symbol: 'ADA', price: 0.485, change: 2.87, position: 0.3 },
  ]
};

export default function OverviewPage() {
  const [liveData, setLiveData] = useState(mockData);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        portfolio: {
          ...prev.portfolio,
          value: prev.portfolio.value + (Math.random() - 0.5) * 2000,
          dayChange: prev.portfolio.dayChange + (Math.random() - 0.5) * 500
        }
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Portfolio Overview */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Portfolio Overview</h2>
            <p className="text-gray-400">Your trading performance at a glance</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold mb-1">
              ${liveData.portfolio.value.toLocaleString()}
            </div>
            <div className="flex items-center justify-end space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">+${liveData.portfolio.dayChange.toLocaleString()}</span>
              <span className="text-green-400">({liveData.portfolio.change}%)</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Trades</p>
                <p className="text-2xl font-bold">{liveData.trades.active}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">Win Rate: {liveData.trades.winRate}%</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">AI Signals</p>
                <p className="text-2xl font-bold">{liveData.aiSignals.bullish + liveData.aiSignals.bearish + liveData.aiSignals.neutral}</p>
              </div>
            </div>
            <div className="flex space-x-2 text-xs">
              <span className="text-green-400">{liveData.aiSignals.bullish} Bullish</span>
              <span className="text-red-400">{liveData.aiSignals.bearish} Bearish</span>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Trades</p>
                <p className="text-2xl font-bold">{liveData.trades.completed}</p>
              </div>
            </div>
            <p className="text-sm text-gray-500">This month: +127</p>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Active Alerts</p>
                <p className="text-2xl font-bold">{liveData.alerts}</p>
              </div>
            </div>
            <p className="text-sm text-orange-400">2 high priority</p>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Your Positions</h3>
              <button 
                onClick={() => {
                  toast('Redirecting to full portfolio view...', {
                    icon: '📈',
                    duration: 2000,
                  });
                  window.location.href = '/dashboard/portfolio';
                }}
                className="text-blue-400 hover:text-blue-300 font-semibold"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {liveData.topCoins.map((coin) => (
                <div key={coin.symbol} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-2xl hover:bg-gray-800/70 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center font-bold text-black text-sm">
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{coin.symbol}</h4>
                      <p className="text-gray-400 text-sm">{coin.position} BTC position</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold">${coin.price.toLocaleString()}</div>
                    <div className={`text-sm font-semibold flex items-center justify-end space-x-1 ${
                      coin.change > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {coin.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                      <span>{coin.change > 0 ? '+' : ''}{coin.change}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">AI Market Sentiment</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Overall Market</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <span className="text-sm text-green-400 font-semibold">Bullish</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Bitcoin</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="bg-green-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm text-green-400 font-semibold">Strong</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Ethereum</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-sm text-yellow-400 font-semibold">Neutral</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => {
                  toast.success('AI Trade executed successfully!');
                  // Simulate adding a new trade
                  const newTrade = {
                    id: Date.now(),
                    symbol: 'BTC',
                    type: 'BUY',
                    amount: 0.1,
                    price: 67420.50,
                    status: 'executed'
                  };
                  console.log('New AI trade:', newTrade);
                }}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-xl font-semibold transition-all"
              >
                Execute AI Trade
              </button>
              <button 
                onClick={() => {
                  toast('Redirecting to alerts page...', {
                    icon: '📡',
                    duration: 2000,
                  });
                  window.location.href = '/dashboard/alerts';
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Set Price Alert
              </button>
              <button 
                onClick={() => {
                  toast.success('Portfolio rebalancing initiated!');
                  // Simulate rebalancing
                  setTimeout(() => {
                    toast.success('Portfolio rebalanced successfully!');
                  }, 2000);
                }}
                className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Rebalance Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}