'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { toast } from 'react-hot-toast';

const portfolioData = {
  totalValue: 245680.50,
  dayChange: 18420.30,
  dayChangePercent: 8.24,
  positions: [
    { symbol: 'BTC', name: 'Bitcoin', amount: 2.5, value: 168551.25, price: 67420.50, change: 3.24, allocation: 68.6 },
    { symbol: 'ETH', name: 'Ethereum', amount: 18.2, value: 69901.65, price: 3840.75, change: -1.12, allocation: 28.4 },
    { symbol: 'SOL', name: 'Solana', amount: 37.8, value: 7496.50, price: 198.32, change: 5.43, allocation: 3.0 },
  ]
};

export default function PortfolioPage() {
  const [data, setData] = useState(portfolioData);

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        positions: prev.positions.map(pos => ({
          ...pos,
          price: pos.price + (Math.random() - 0.5) * pos.price * 0.02,
          change: (Math.random() - 0.5) * 10
        }))
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Portfolio Summary */}
      <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h3 className="text-lg text-gray-400 mb-2">Total Portfolio Value</h3>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">${data.totalValue.toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-green-400 font-semibold">+${data.dayChange.toLocaleString()}</span>
              <span className="text-green-400">({data.dayChangePercent}%)</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg text-gray-400 mb-2">24h Performance</h3>
            <div className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">+{data.dayChangePercent}%</div>
            <p className="text-gray-400">Above market average</p>
          </div>
          
          <div>
            <h3 className="text-lg text-gray-400 mb-2">Active Positions</h3>
            <div className="text-2xl sm:text-3xl font-bold mb-2">{data.positions.length}</div>
            <p className="text-gray-400">Diversified portfolio</p>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
        <h3 className="text-2xl font-bold mb-6">Your Holdings</h3>
        
        <div className="space-y-4">
          {data.positions.map((position) => (
            <div key={position.symbol} className="bg-gray-800/50 rounded-2xl p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center font-bold text-black text-lg">
                    {position.symbol.slice(0, 2)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold">{position.symbol}</h4>
                    <p className="text-gray-400">{position.name}</p>
                    <p className="text-sm text-gray-500">{position.amount} {position.symbol}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold">${position.value.toLocaleString()}</div>
                  <div className="text-gray-400">${position.price.toLocaleString()}</div>
                  <div className={`flex items-center justify-end space-x-1 ${
                    position.change > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {position.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    <span>{position.change > 0 ? '+' : ''}{position.change.toFixed(2)}%</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-semibold">{position.allocation}%</div>
                  <div className="w-20 bg-gray-700 rounded-full h-2 mt-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full" 
                      style={{ width: `${position.allocation}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => {
                toast.success('Portfolio rebalancing initiated!');
                setTimeout(() => {
                  toast.success('Portfolio rebalanced successfully!');
                }, 2000);
              }}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 py-3 rounded-xl font-semibold transition-all"
            >
              Rebalance Portfolio
            </button>
            <button 
              onClick={() => {
                const amount = prompt('Enter amount to add ($):');
                if (amount && !isNaN(Number(amount))) {
                  toast.success(`$${amount} added to portfolio!`);
                  setData(prev => ({
                    ...prev,
                    totalValue: prev.totalValue + Number(amount)
                  }));
                } else if (amount) {
                  toast.error('Please enter a valid amount');
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition-colors"
            >
              Add Funds
            </button>
            <button 
              onClick={() => {
                const amount = prompt('Enter amount to withdraw ($):');
                if (amount && !isNaN(Number(amount))) {
                  if (Number(amount) <= data.totalValue) {
                    toast.success(`$${amount} withdrawal initiated!`);
                    setData(prev => ({
                      ...prev,
                      totalValue: prev.totalValue - Number(amount)
                    }));
                  } else {
                    toast.error('Insufficient funds');
                  }
                } else if (amount) {
                  toast.error('Please enter a valid amount');
                }
              }}
              className="w-full bg-gray-800 hover:bg-gray-700 py-3 rounded-xl font-semibold transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-6">
          <h3 className="text-xl font-bold mb-4">Performance Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">7d Return</span>
              <span className="text-green-400 font-semibold">+12.4%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">30d Return</span>
              <span className="text-green-400 font-semibold">+28.7%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">All Time</span>
              <span className="text-green-400 font-semibold">+156.3%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Sharpe Ratio</span>
              <span className="text-white font-semibold">2.34</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}