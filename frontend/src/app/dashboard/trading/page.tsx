'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Zap, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const tradingData = {
  activeTrades: [
    { id: 1, symbol: 'BTC', type: 'BUY', amount: 0.5, price: 67420.50, currentPrice: 67850.30, pnl: 214.90, status: 'active' },
    { id: 2, symbol: 'ETH', type: 'SELL', amount: 2.0, price: 3840.75, currentPrice: 3798.20, pnl: 85.10, status: 'active' },
    { id: 3, symbol: 'SOL', type: 'BUY', amount: 10, price: 198.32, currentPrice: 201.45, pnl: 31.30, status: 'active' },
  ],
  recentTrades: [
    { id: 4, symbol: 'BTC', type: 'SELL', amount: 0.25, price: 66800.00, pnl: 420.50, status: 'completed', time: '2 hours ago' },
    { id: 5, symbol: 'ETH', type: 'BUY', amount: 1.5, price: 3750.00, pnl: -125.30, status: 'completed', time: '4 hours ago' },
  ],
  aiSignals: [
    { symbol: 'BTC', signal: 'STRONG_BUY', confidence: 87, reason: 'Bullish momentum + positive sentiment' },
    { symbol: 'ETH', signal: 'HOLD', confidence: 65, reason: 'Consolidation phase detected' },
    { symbol: 'SOL', signal: 'BUY', confidence: 78, reason: 'Technical breakout pattern' },
  ]
};

export default function TradingPage() {
  const [data, setData] = useState(tradingData);
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [orderType, setOrderType] = useState('BUY');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        activeTrades: prev.activeTrades.map(trade => ({
          ...trade,
          currentPrice: trade.currentPrice + (Math.random() - 0.5) * trade.currentPrice * 0.01,
          pnl: trade.type === 'BUY' 
            ? (trade.currentPrice - trade.price) * trade.amount
            : (trade.price - trade.currentPrice) * trade.amount
        }))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleTrade = () => {
    if (!amount || !price) return;
    
    const newTrade = {
      id: Date.now(),
      symbol: selectedSymbol,
      type: orderType,
      amount: parseFloat(amount),
      price: parseFloat(price),
      currentPrice: parseFloat(price),
      pnl: 0,
      status: 'active'
    };
    
    setData(prev => ({
      ...prev,
      activeTrades: [...prev.activeTrades, newTrade]
    }));
    
    setAmount('');
    setPrice('');
  };

  return (
    <div className="space-y-8">
      {/* Trading Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active Trades</p>
              <p className="text-2xl font-bold">{data.activeTrades.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total P&L</p>
              <p className="text-2xl font-bold text-green-400">
                +${data.activeTrades.reduce((sum, trade) => sum + trade.pnl, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">AI Signals</p>
              <p className="text-2xl font-bold">{data.aiSignals.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Win Rate</p>
              <p className="text-2xl font-bold">87.3%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Trading Form */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6">Place Order</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Symbol</label>
              <select 
                value={selectedSymbol}
                onChange={(e) => setSelectedSymbol(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Order Type</label>
              <div className="flex space-x-2">
                <button
                  onClick={() => setOrderType('BUY')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    orderType === 'BUY' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  BUY
                </button>
                <button
                  onClick={() => setOrderType('SELL')}
                  className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
                    orderType === 'SELL' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  SELL
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <button
              onClick={handleTrade}
              className={`w-full py-4 rounded-xl font-semibold transition-all ${
                orderType === 'BUY'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                  : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700'
              }`}
            >
              {orderType} {selectedSymbol}
            </button>
          </div>
        </div>

        {/* Active Trades */}
        <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6">Active Trades</h3>
          
          <div className="space-y-4">
            {data.activeTrades.map((trade) => (
              <div key={trade.id} className="bg-gray-800/50 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                      trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.symbol}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold">{trade.type}</span>
                        <span className="text-gray-400">{trade.amount} {trade.symbol}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        Entry: ${trade.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      ${trade.currentPrice.toLocaleString()}
                    </div>
                    <div className={`text-sm font-semibold ${
                      trade.pnl > 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {trade.pnl > 0 ? '+' : ''}${trade.pnl.toFixed(2)}
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => {
                      toast.success(`${trade.symbol} position closed successfully!`);
                      setData(prev => ({
                        ...prev,
                        activeTrades: prev.activeTrades.filter(t => t.id !== trade.id),
                        recentTrades: [...prev.recentTrades, {
                          ...trade,
                          status: 'completed',
                          time: 'Just now'
                        }]
                      }));
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Signals */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-6">AI Trading Signals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.aiSignals.map((signal) => (
            <div key={signal.symbol} className="bg-gray-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xl font-bold">{signal.symbol}</h4>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  signal.signal === 'STRONG_BUY' ? 'bg-green-500/20 text-green-400' :
                  signal.signal === 'BUY' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {signal.signal.replace('_', ' ')}
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Confidence</span>
                  <span className="font-semibold">{signal.confidence}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-400 h-2 rounded-full" 
                    style={{ width: `${signal.confidence}%` }}
                  ></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-400">{signal.reason}</p>
              
              <button 
                onClick={() => {
                  toast.success(`${signal.signal} signal executed for ${signal.symbol}!`);
                  // Simulate executing the signal
                  const newTrade = {
                    symbol: signal.symbol,
                    action: signal.signal,
                    confidence: signal.confidence,
                    timestamp: new Date().toISOString()
                  };
                  console.log('Signal executed:', newTrade);
                }}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-colors"
              >
                Execute Signal
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}