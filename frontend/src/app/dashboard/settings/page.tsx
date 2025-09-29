'use client';

import { useState } from 'react';
import { User, Bell, Shield, Palette, Database, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: 'John Doe',
      email: 'john@example.com',
      timezone: 'UTC-3'
    },
    notifications: {
      priceAlerts: true,
      tradeExecutions: true,
      aiSignals: true,
      marketNews: false,
      email: true,
      push: true
    },
    trading: {
      autoTrade: false,
      riskLevel: 'medium',
      maxPosition: 10000,
      stopLoss: 5
    },
    security: {
      twoFactor: true,
      apiAccess: false
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'trading', name: 'Trading', icon: Database },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api', name: 'API Keys', icon: Key },
  ];

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-8">Settings</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Profile Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={settings.profile.name}
                      onChange={(e) => updateSetting('profile', 'name', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      value={settings.profile.email}
                      onChange={(e) => updateSetting('profile', 'email', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Timezone</label>
                    <select
                      value={settings.profile.timezone}
                      onChange={(e) => updateSetting('profile', 'timezone', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="UTC-3">UTC-3 (São Paulo)</option>
                      <option value="UTC-5">UTC-5 (New York)</option>
                      <option value="UTC+0">UTC+0 (London)</option>
                      <option value="UTC+8">UTC+8 (Singapore)</option>
                    </select>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    toast.success('Profile settings saved successfully!');
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold">Price Alerts</h4>
                      <p className="text-sm text-gray-400">Get notified when price targets are hit</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.priceAlerts}
                        onChange={(e) => updateSetting('notifications', 'priceAlerts', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold">Trade Executions</h4>
                      <p className="text-sm text-gray-400">Notifications for completed trades</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.tradeExecutions}
                        onChange={(e) => updateSetting('notifications', 'tradeExecutions', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold">AI Signals</h4>
                      <p className="text-sm text-gray-400">AI-generated trading signals</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.aiSignals}
                        onChange={(e) => updateSetting('notifications', 'aiSignals', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trading' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Trading Settings</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold">Auto Trading</h4>
                      <p className="text-sm text-gray-400">Allow AI to execute trades automatically</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.trading.autoTrade}
                        onChange={(e) => updateSetting('trading', 'autoTrade', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Risk Level</label>
                    <select
                      value={settings.trading.riskLevel}
                      onChange={(e) => updateSetting('trading', 'riskLevel', e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="low">Low Risk</option>
                      <option value="medium">Medium Risk</option>
                      <option value="high">High Risk</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Max Position Size ($)</label>
                    <input
                      type="number"
                      value={settings.trading.maxPosition}
                      onChange={(e) => updateSetting('trading', 'maxPosition', parseInt(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Stop Loss (%)</label>
                    <input
                      type="number"
                      value={settings.trading.stopLoss}
                      onChange={(e) => updateSetting('trading', 'stopLoss', parseInt(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Security Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl">
                    <div>
                      <h4 className="font-semibold">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.security.twoFactor}
                        onChange={(e) => updateSetting('security', 'twoFactor', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="p-4 bg-gray-800/50 rounded-xl">
                    <h4 className="font-semibold mb-2">Change Password</h4>
                    <div className="space-y-3">
                      <input
                        type="password"
                        placeholder="Current Password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="New Password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                      <input
                        type="password"
                        placeholder="Confirm New Password"
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                      />
                      <button 
                        onClick={() => {
                          toast.success('Password updated successfully!');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">API Keys</h3>
                
                <div className="bg-gray-800/50 rounded-xl p-6">
                  <h4 className="font-semibold mb-4">Trading API Access</h4>
                  <p className="text-sm text-gray-400 mb-4">
                    Generate API keys to access your trading data programmatically
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <div className="font-mono text-sm">ak_live_••••••••••••••••</div>
                        <div className="text-xs text-gray-400">Created on Jan 15, 2024</div>
                      </div>
                      <button 
                        onClick={() => {
                          if (confirm('Are you sure you want to revoke this API key?')) {
                            toast.success('API key revoked successfully!');
                          }
                        }}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Revoke
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => {
                        const newKey = 'ak_live_' + Math.random().toString(36).substring(2, 15);
                        toast.success(`New API key generated: ${newKey}`);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                    >
                      Generate New Key
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}