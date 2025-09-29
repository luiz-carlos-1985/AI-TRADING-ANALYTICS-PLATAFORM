'use client';

import { useState } from 'react';
import { User, Bell, Shield, Database, Key } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { settings, updateSetting } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'api', name: 'API Keys', icon: Key },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-3xl p-8">
        <h2 className="text-2xl font-bold mb-8">Settings</h2>
        
        <div className="flex flex-col lg:flex-row gap-8">
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

          <div className="flex-1">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Profile Settings</h3>
                
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                      {settings.profile.photo ? (
                        <img src={settings.profile.photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-white">{settings.profile.name.charAt(0)}</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            updateSetting('profile', 'photo', e.target?.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Profile Photo</h4>
                    <p className="text-sm text-gray-400 mb-2">Click to upload a new photo</p>
                    {settings.profile.photo && (
                      <button
                        onClick={() => updateSetting('profile', 'photo', '')}
                        className="text-sm text-red-400 hover:text-red-300"
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>
                
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
                </div>
                
                <button 
                  onClick={() => toast.success('Profile settings saved!')}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Notification Preferences</h3>
                <p className="text-gray-400">Notification settings coming soon...</p>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">Security Settings</h3>
                <p className="text-gray-400">Security settings coming soon...</p>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold">API Keys</h3>
                <p className="text-gray-400">API management coming soon...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}