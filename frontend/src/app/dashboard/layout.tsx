'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { 
  Brain, 
  BarChart3, 
  TrendingUp, 
  Settings, 
  Bell, 
  User, 
  Home,
  Activity,
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

const navigation = [
  { name: 'Overview', href: '/dashboard/overview', icon: Home },
  { name: 'Portfolio', href: '/dashboard/portfolio', icon: BarChart3 },
  { name: 'Trading', href: '/dashboard/trading', icon: TrendingUp },
  { name: 'Analytics', href: '/dashboard/analytics', icon: Activity },
  { name: 'Alerts', href: '/dashboard/alerts', icon: AlertTriangle },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [language, setLanguage] = useState<'en' | 'pt' | 'es'>('en');
  const pathname = usePathname();
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed left-0 top-0 h-full w-64 max-w-[80vw] bg-gray-900 border-r border-gray-800 overflow-y-auto">
          <div className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AI Trading</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              title="Close sidebar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="px-6">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-colors ${
                    isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:h-full lg:w-64 lg:bg-gray-900 lg:border-r lg:border-gray-800 lg:block lg:overflow-y-auto">
        <div className="flex items-center space-x-3 p-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">AI Trading</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">Live</span>
            </div>
          </div>
        </div>
        
        <nav className="px-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-xl border-b border-gray-800 sticky top-0 z-40">
          <div className="px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button
                  className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setSidebarOpen(true)}
                  aria-label="Open sidebar menu"
                  title="Open sidebar menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold capitalize">
                  {pathname.split('/').pop() || 'Dashboard'}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative" ref={notificationsRef}>
                  <button 
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-colors"
                    aria-label="Open notifications"
                    title="Open notifications"
                  >
                    <Bell className="w-5 h-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  </button>
                  
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
                      <div className="p-4 border-b border-gray-700">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="p-3 hover:bg-gray-700 border-b border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">BTC Alert Triggered</p>
                              <p className="text-xs text-gray-400">Price reached $70,000</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 hover:bg-gray-700 border-b border-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">Trade Executed</p>
                              <p className="text-xs text-gray-400">AI bought 0.1 BTC</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-3 hover:bg-gray-700">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">Market Update</p>
                              <p className="text-xs text-gray-400">ETH showing bullish signals</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 border-t border-gray-700">
                        <button 
                          onClick={() => {
                            toast('Redirecting to alerts page...', { icon: '🔔' });
                            window.location.href = '/dashboard/alerts';
                          }}
                          className="w-full text-center text-blue-400 hover:text-blue-300 text-sm"
                          title="View all alerts"
                        >
                          View All Alerts
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="relative" ref={profileRef}>
                  <button 
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                    aria-label="Open user profile menu"
                    title="Open user profile menu"
                  >
                    <User className="w-5 h-5 text-white" />
                  </button>
                  
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-lg z-50">
                      <div className="p-3 border-b border-gray-700">
                        <p className="font-semibold">John Doe</p>
                        <p className="text-sm text-gray-400">john@example.com</p>
                      </div>
                      <div className="py-2">
                        <button 
                          onClick={() => {
                            toast('Redirecting to profile settings...', { icon: '⚙️' });
                            window.location.href = '/dashboard/settings';
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm"
                        >
                          Profile Settings
                        </button>
                        <button 
                          onClick={() => {
                            setPreferencesOpen(true);
                            setProfileOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm"
                        >
                          Preferences
                        </button>
                        <button 
                          onClick={() => {
                            setHelpOpen(true);
                            setProfileOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm"
                        >
                          Help
                        </button>
                      </div>
                      <div className="border-t border-gray-700 py-2">
                        <button 
                          onClick={() => {
                            toast('Logging out...', { icon: '👋' });
                            setTimeout(() => {
                              window.location.href = '/';
                            }, 1000);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-700 text-sm text-red-400"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 overflow-x-hidden">
          <div className="max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Preferences Modal */}
      {preferencesOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-2xl p-6 w-full max-w-md mx-4 bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Preferences</h3>
              <button 
                onClick={() => setPreferencesOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close preferences"
                title="Close preferences"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    defaultChecked 
                    className="sr-only peer"
                    aria-label="Toggle email notifications"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Sound Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    aria-label="Toggle sound alerts"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select 
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'pt' | 'es')}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  title="Select language"
                >
                  <option value="en">English</option>
                  <option value="pt">Português</option>
                  <option value="es">Español</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Currency</label>
                <select 
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  aria-label="Select currency"
                  title="Select currency"
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>BRL (R$)</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button 
                onClick={() => {
                  toast.success('Preferences saved successfully!');
                  setPreferencesOpen(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-colors"
              >
                Save
              </button>
              <button 
                onClick={() => setPreferencesOpen(false)}
                className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Modal */}
      {helpOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-2xl p-6 w-full max-w-lg mx-4 max-h-[80vh] overflow-y-auto bg-gray-800">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Help & Support</h3>
              <button 
                onClick={() => setHelpOpen(false)}
                className="text-gray-400 hover:text-white"
                aria-label="Close help modal"
                title="Close help modal"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">Frequently Asked Questions</h4>
                <div className="space-y-3">
                  <details className="bg-gray-700 rounded-lg">
                    <summary className="p-3 cursor-pointer hover:bg-gray-600 rounded-lg">How do I start trading?</summary>
                    <div className="p-3 pt-0 text-sm text-gray-300">
                      Navigate to the Trading page, select your cryptocurrency, choose buy/sell, enter amount and price, then click the trade button.
                    </div>
                  </details>
                  
                  <details className="bg-gray-700 rounded-lg">
                    <summary className="p-3 cursor-pointer hover:bg-gray-600 rounded-lg">How do AI signals work?</summary>
                    <div className="p-3 pt-0 text-sm text-gray-300">
                      Our AI analyzes market data, news sentiment, and technical indicators to generate trading signals with confidence levels.
                    </div>
                  </details>
                  
                  <details className="bg-gray-700 rounded-lg">
                    <summary className="p-3 cursor-pointer hover:bg-gray-600 rounded-lg">How to set price alerts?</summary>
                    <div className="p-3 pt-0 text-sm text-gray-300">
                      Go to Alerts page, click 'New Alert', select cryptocurrency, set target price, and choose alert type.
                    </div>
                  </details>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Contact Support</h4>
                <div className="space-y-3">
                  <button 
                    onClick={() => {
                      toast('Opening live chat...', { icon: '💬' });
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold transition-colors"
                  >
                    💬 Live Chat
                  </button>
                  
                  <button 
                    onClick={() => {
                      toast('Opening email support...', { icon: '📧' });
                      window.open('mailto:support@tradingai.com');
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold transition-colors"
                  >
                    📧 Email Support
                  </button>
                  
                  <button 
                    onClick={() => {
                      toast('Opening documentation...', { icon: '📚' });
                    }}
                    className="w-full bg-gray-600 hover:bg-gray-700 py-2 rounded-lg font-semibold transition-colors"
                  >
                    📚 Documentation
                  </button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-400">
                <p>Need immediate help?</p>
                <p>Call us: <span className="text-blue-400">+1 (555) 123-4567</span></p>
                <p>Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}