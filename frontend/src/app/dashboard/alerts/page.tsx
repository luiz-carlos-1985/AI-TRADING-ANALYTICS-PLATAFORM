'use client';

import { useState } from 'react';
import { Bell, Plus, Trash2, Edit, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'react-hot-toast';

const alertsData = [
  { id: 1, symbol: 'BTC', type: 'price_above', value: 70000, current: 67420, active: true, triggered: false },
  { id: 2, symbol: 'ETH', type: 'price_below', value: 3500, current: 3840, active: true, triggered: false },
  { id: 3, symbol: 'SOL', type: 'price_above', value: 200, current: 198, active: true, triggered: false },
  { id: 4, symbol: 'BTC', type: 'price_below', value: 65000, current: 67420, active: false, triggered: true },
];

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(alertsData);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    symbol: 'BTC',
    type: 'price_above',
    value: ''
  });

  const handleCreateAlert = () => {
    if (!formData.value) return;
    
    const newAlert = {
      id: Date.now(),
      symbol: formData.symbol,
      type: formData.type,
      value: parseFloat(formData.value),
      current: formData.symbol === 'BTC' ? 67420 : formData.symbol === 'ETH' ? 3840 : 198,
      active: true,
      triggered: false
    };
    
    setAlerts(prev => [...prev, newAlert]);
    setFormData({ symbol: 'BTC', type: 'price_above', value: '' });
    setShowForm(false);
  };

  const deleteAlert = (id: number) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const toggleAlert = (id: number) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, active: !alert.active } : alert
    ));
  };

  return (
    <div className="space-y-8">
      {/* Alerts Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Total Alerts</p>
              <p className="text-2xl font-bold">{alerts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-2xl font-bold">{alerts.filter(a => a.active).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-gray-400 text-sm">Triggered</p>
              <p className="text-2xl font-bold">{alerts.filter(a => a.triggered).length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6">
          <button
            onClick={() => setShowForm(true)}
            className="w-full h-full flex items-center justify-center space-x-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            <Plus className="w-6 h-6" />
            <span className="font-semibold">New Alert</span>
          </button>
        </div>
      </div>

      {/* Create Alert Form */}
      {showForm && (
        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
          <h3 className="text-2xl font-bold mb-6">Create New Alert</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Symbol</label>
              <select 
                value={formData.symbol}
                onChange={(e) => setFormData(prev => ({ ...prev, symbol: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="BTC">Bitcoin (BTC)</option>
                <option value="ETH">Ethereum (ETH)</option>
                <option value="SOL">Solana (SOL)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Alert Type</label>
              <select 
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              >
                <option value="price_above">Price Above</option>
                <option value="price_below">Price Below</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Target Price</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="0.00"
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            
            <div className="flex items-end space-x-2">
              <button
                onClick={handleCreateAlert}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 rounded-xl font-semibold transition-colors"
              >
                Create
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alerts List */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold">Your Alerts</h3>
          <div className="flex space-x-2">
            <button 
              onClick={() => toast('Showing all alerts', { icon: '📄' })}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              All
            </button>
            <button 
              onClick={() => toast('Filtering active alerts', { icon: '✅' })}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Active
            </button>
            <button 
              onClick={() => toast('Filtering triggered alerts', { icon: '🔔' })}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold transition-colors"
            >
              Triggered
            </button>
          </div>
        </div>
        
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`bg-gray-800/50 rounded-2xl p-6 border-l-4 ${
              alert.triggered ? 'border-orange-400' : alert.active ? 'border-green-400' : 'border-gray-600'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center font-bold text-black text-sm">
                    {alert.symbol}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-bold">{alert.symbol}</h4>
                      <div className={`px-2 py-1 rounded text-xs font-semibold ${
                        alert.triggered ? 'bg-orange-500/20 text-orange-400' :
                        alert.active ? 'bg-green-500/20 text-green-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {alert.triggered ? 'Triggered' : alert.active ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Alert when price goes {alert.type === 'price_above' ? 'above' : 'below'} ${alert.value.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Current Price</div>
                    <div className="text-lg font-bold">${alert.current.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">
                      Target: ${alert.value.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        alert.active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => toast('Edit alert functionality coming soon!', { icon: '✏️' })}
                      className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}