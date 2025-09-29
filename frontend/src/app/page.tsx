'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, TrendingUp, TrendingDown, BarChart3, Brain, Zap, Shield, Star, Play, ChevronRight, Sparkles, Target, Globe, Lock } from 'lucide-react';
import CountUp from 'react-countup';
import { toast } from 'react-hot-toast';

const cryptoData = [
  { symbol: 'BTC', name: 'Bitcoin', price: 67420.50, change: 3.24, volume: '28.5B', color: 'from-orange-500 to-yellow-500' },
  { symbol: 'ETH', name: 'Ethereum', price: 3840.75, change: -1.12, volume: '15.2B', color: 'from-blue-500 to-purple-500' },
  { symbol: 'BNB', name: 'BNB', price: 635.48, change: 2.87, volume: '2.1B', color: 'from-yellow-500 to-orange-500' },
  { symbol: 'SOL', name: 'Solana', price: 198.32, change: 5.43, volume: '3.8B', color: 'from-purple-500 to-pink-500' },
];

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Trading',
    description: 'Advanced neural networks analyze market patterns with 96% accuracy',
    color: 'from-blue-500 to-cyan-500',
    stats: '96% Accuracy'
  },
  {
    icon: Zap,
    title: 'Lightning Execution',
    description: 'Sub-millisecond trade execution with institutional-grade infrastructure',
    color: 'from-purple-500 to-pink-500',
    stats: '<1ms Latency'
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Multi-layer security with cold storage and advanced encryption',
    color: 'from-green-500 to-emerald-500',
    stats: '100% Secure'
  }
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length);
    }, 4000);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-black"></div>
        <motion.div 
          className="absolute w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: mousePosition.x / 50,
            y: mousePosition.y / 50,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          style={{ left: '20%', top: '20%' }}
        />
        <motion.div 
          className="absolute w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: -mousePosition.x / 30,
            y: -mousePosition.y / 30,
          }}
          transition={{ type: "spring", stiffness: 50, damping: 30 }}
          style={{ right: '20%', bottom: '20%' }}
        />
      </div>

      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-20">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
                <Brain className="w-6 h-6 text-white relative z-10" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                TradingAI
              </span>
            </motion.div>
            
            <div className="hidden md:flex items-center space-x-8">
              {['Features', 'Analytics', 'Security', 'API'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(item.toLowerCase());
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      toast(`Scrolling to ${item} section`, { icon: '🔗' });
                    }
                  }}
                  className="text-gray-300 hover:text-white transition-colors relative"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.5 }}
                >
                  {item}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Link href="/dashboard" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-2.5 rounded-xl font-semibold transition-all relative overflow-hidden group">
                  <span className="relative z-10">Launch App</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 z-10">
        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div 
            className="inline-flex items-center space-x-2 bg-gray-800/30 backdrop-blur-sm px-6 py-3 rounded-full mb-8 border border-gray-700/50"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
            <span className="text-sm text-gray-300">Trusted by <CountUp end={50000} duration={2} separator="," />+ traders worldwide</span>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.span 
              className="block bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Trade Smarter
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              with AI
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            Advanced AI algorithms analyze market sentiment, predict price movements, and execute trades 
            with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-semibold">institutional-grade precision</span>. 
            Join the future of cryptocurrency trading.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Link href="/dashboard" className="group bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all flex items-center space-x-2 relative overflow-hidden">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
                <span className="relative z-10">Start Trading Now</span>
                <motion.div
                  className="relative z-10"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.button 
              onClick={() => {
                toast('Demo video coming soon!', { icon: '🎥' });
              }}
              className="group flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gray-800/30 backdrop-blur-sm rounded-full flex items-center justify-center border border-gray-700/50 group-hover:border-gray-600 transition-colors relative overflow-hidden"
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-blue-500/20 rounded-full"
                />
                <Play className="w-5 h-5 ml-1 relative z-10" />
              </motion.div>
              <span className="font-semibold">Watch Demo</span>
            </motion.button>
          </motion.div>
          
          {/* Floating Stats */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.3 }}
          >
            {[
              { label: 'Trading Volume', value: 2.5, suffix: 'B+', prefix: '$' },
              { label: 'Active Users', value: 50, suffix: 'K+' },
              { label: 'Success Rate', value: 96, suffix: '%' },
              { label: 'Uptime', value: 99.9, suffix: '%' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 + index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.prefix}<CountUp end={stat.value} duration={2} decimals={stat.value % 1 !== 0 ? 1 : 0} />{stat.suffix}
                </div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Live Market Data */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Live Market Data
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Real-time cryptocurrency prices powered by our advanced AI engine
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cryptoData.map((crypto, index) => (
              <motion.div
                key={crypto.symbol}
                className="group bg-gray-900/30 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-6 hover:border-gray-700/50 transition-all relative overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center space-x-3">
                    <motion.div 
                      className={`w-14 h-14 bg-gradient-to-r ${crypto.color} rounded-2xl flex items-center justify-center font-bold text-black text-sm relative overflow-hidden`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/20"
                        animate={{ 
                          background: [
                            'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                            'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)'
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      {crypto.symbol.slice(0, 2)}
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-xl">{crypto.symbol}</h3>
                      <p className="text-gray-400 text-sm">{crypto.name}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ 
                      rotate: crypto.change > 0 ? [0, 10, 0] : [0, -10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {crypto.change > 0 ? (
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    ) : (
                      <TrendingDown className="w-6 h-6 text-red-400" />
                    )}
                  </motion.div>
                </div>
                
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <motion.span 
                      className="text-3xl font-bold"
                      key={crypto.price}
                      initial={{ scale: 1.1, color: '#60a5fa' }}
                      animate={{ scale: 1, color: '#ffffff' }}
                      transition={{ duration: 0.3 }}
                    >
                      $<CountUp end={crypto.price} duration={1} separator="," decimals={2} />
                    </motion.span>
                    <motion.span 
                      className={`text-sm font-semibold px-3 py-1.5 rounded-xl backdrop-blur-sm ${
                        crypto.change > 0 
                          ? 'text-green-400 bg-green-400/10 border border-green-400/20' 
                          : 'text-red-400 bg-red-400/10 border border-red-400/20'
                      }`}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {crypto.change > 0 ? '+' : ''}{crypto.change}%
                    </motion.span>
                  </div>
                  <div className="flex items-center justify-between text-gray-400 text-sm">
                    <span>Volume:</span>
                    <span className="font-semibold">{crypto.volume}</span>
                  </div>
                  
                  {/* Mini Chart Simulation */}
                  <div className="flex items-end space-x-1 h-8 mt-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className={`flex-1 rounded-t ${crypto.change > 0 ? 'bg-green-400/30' : 'bg-red-400/30'}`}
                        initial={{ height: 0 }}
                        animate={{ height: Math.random() * 32 + 8 }}
                        transition={{ duration: 0.5, delay: i * 0.05 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features */}
      <section id="features" className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Advanced Trading Features
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Professional-grade tools powered by artificial intelligence and real-time data processing
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="group relative bg-gray-900/20 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 hover:border-gray-700/50 transition-all overflow-hidden"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                whileHover={{ 
                  y: -10,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                }}
                onHoverStart={() => setActiveFeature(index)}
              >
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5`}
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                />
                
                <motion.div 
                  className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-8 relative overflow-hidden`}
                  whileHover={{ 
                    rotate: 360,
                    scale: 1.1
                  }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    animate={{ 
                      rotate: activeFeature === index ? 360 : 0
                    }}
                    transition={{ duration: 2, repeat: activeFeature === index ? Infinity : 0, ease: "linear" }}
                  />
                  <feature.icon className="w-10 h-10 text-white relative z-10" />
                </motion.div>
                
                <motion.h3 
                  className="text-2xl font-bold mb-4"
                  initial={{ opacity: 0.8 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-400 mb-6 leading-relaxed"
                  initial={{ opacity: 0.7 }}
                  whileHover={{ opacity: 1 }}
                >
                  {feature.description}
                </motion.p>
                
                <div className="flex items-center justify-between">
                  <motion.div 
                    className={`text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r ${feature.color} bg-opacity-10 border border-current border-opacity-20`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.stats}
                  </motion.div>
                  
                  <motion.div 
                    onClick={() => {
                      toast('Feature details coming soon!', { icon: 'ℹ️' });
                    }}
                    className="flex items-center text-gray-400 group-hover:text-white transition-colors cursor-pointer"
                    whileHover={{ x: 5 }}
                  >
                    <span className="text-sm font-semibold mr-2">Learn more</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.div>
                  </motion.div>
                </div>
                
                {/* Animated Background Pattern */}
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 opacity-5"
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity }
                  }}
                >
                  <div className={`w-full h-full bg-gradient-to-br ${feature.color} rounded-full blur-xl`} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Analytics Preview */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Real-Time Analytics Dashboard
              </span>
            </motion.h2>
          </motion.div>
          
          <motion.div 
            className="bg-gray-900/20 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-8 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Target className="w-12 h-12 text-white" />
                  <motion.div
                    className="absolute inset-0 border-4 border-blue-400/30 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Precision Trading</h3>
                <p className="text-gray-400">AI-powered algorithms execute trades with surgical precision</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Globe className="w-12 h-12 text-white" />
                  <motion.div
                    className="absolute inset-0 border-4 border-purple-400/30 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Global Markets</h3>
                <p className="text-gray-400">Access to worldwide cryptocurrency exchanges</p>
              </motion.div>
              
              <motion.div 
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 relative"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Lock className="w-12 h-12 text-white" />
                  <motion.div
                    className="absolute inset-0 border-4 border-green-400/30 rounded-full"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">Secure Vault</h3>
                <p className="text-gray-400">Military-grade security for your digital assets</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div 
            className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-gray-800/50 rounded-3xl p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"
              animate={{ 
                background: [
                  'linear-gradient(45deg, rgba(59,130,246,0.05) 0%, rgba(147,51,234,0.05) 50%, rgba(236,72,153,0.05) 100%)',
                  'linear-gradient(45deg, rgba(236,72,153,0.05) 0%, rgba(59,130,246,0.05) 50%, rgba(147,51,234,0.05) 100%)',
                  'linear-gradient(45deg, rgba(147,51,234,0.05) 0%, rgba(236,72,153,0.05) 50%, rgba(59,130,246,0.05) 100%)'
                ]
              }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <motion.h2 
              className="text-5xl md:text-6xl font-bold mb-6 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Ready to Transform
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your Trading?
              </span>
            </motion.h2>
            
            <motion.p 
              className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed relative z-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              Join <CountUp end={50000} duration={2} separator="," />+ traders who have already discovered the power of 
              AI-driven cryptocurrency trading. Start your journey today.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 relative z-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/dashboard" className="group bg-gradient-to-r from-blue-600 to-purple-600 px-10 py-4 rounded-2xl font-bold text-xl transition-all flex items-center space-x-3 relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                  <span className="relative z-10">Get Started Free</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.div 
                className="text-gray-400 text-sm"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                viewport={{ once: true }}
              >
                No credit card required • Start in 30 seconds
              </motion.div>
            </motion.div>
            
            {/* Floating Elements */}
            <motion.div
              className="absolute top-10 left-10 w-20 h-20 bg-blue-500/10 rounded-full blur-xl"
              animate={{ 
                y: [-10, 10, -10],
                x: [-5, 5, -5]
              }}
              transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
              className="absolute bottom-10 right-10 w-16 h-16 bg-purple-500/10 rounded-full blur-xl"
              animate={{ 
                y: [10, -10, 10],
                x: [5, -5, 5]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <motion.footer 
        className="border-t border-gray-800/50 py-16 px-6 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center relative overflow-hidden"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-7 h-7 text-white" />
              </motion.div>
              <span className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                TradingAI
              </span>
            </motion.div>
            
            <motion.p 
              className="text-gray-400 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Empowering traders worldwide with cutting-edge AI technology and institutional-grade infrastructure. 
              Built for the future of decentralized finance.
            </motion.p>
            
            <motion.div 
              className="flex items-center justify-center space-x-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              {['Privacy', 'Terms', 'Security', 'API Docs', 'Support'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={(e) => {
                    e.preventDefault();
                    toast(`${item} page coming soon!`, { icon: '📄' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item}
                </motion.a>
              ))}
            </motion.div>
          </div>
          
          <motion.div 
            className="border-t border-gray-800/50 pt-8 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-500">
              © 2024 TradingAI. Built with ❤️ using cutting-edge technology for the future of trading.
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
}