/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Palette, Book, Home, ShieldCheck, Sparkles, ChevronRight, Info } from 'lucide-react';
import MascotAvatar from './components/MascotAvatar';
import ChatWindow from './components/ChatWindow';
import UGCGenerator from './components/UGCGenerator';
import PolicyWiki from './components/PolicyWiki';
import { AppMode } from './types';

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');

  const renderContent = () => {
    switch (mode) {
      case 'chat': return <ChatWindow />;
      case 'ugc': return <UGCGenerator />;
      case 'wiki': return <PolicyWiki />;
      default: return <LandingPage onStart={(m) => setMode(m)} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900 selection:bg-red-100 selection:text-red-600 overflow-hidden">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMode('home')}>
          <div className="bg-red-600 p-2 rounded-xl shadow-lg shadow-red-200">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="font-black text-xl tracking-tight text-red-700">清风商院</h1>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kuangshi You Wo</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-2xl">
          <NavButton active={mode === 'home'} icon={<Home size={18} />} label="首页" onClick={() => setMode('home')} />
          <NavButton active={mode === 'chat'} icon={<MessageSquare size={18} />} label="清风对话" onClick={() => setMode('chat')} />
          <NavButton active={mode === 'ugc'} icon={<Palette size={18} />} label="廉洁绘卷" onClick={() => setMode('ugc')} />
          <NavButton active={mode === 'wiki'} icon={<Book size={18} />} label="政策百科" onClick={() => setMode('wiki')} />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            <MascotAvatar type="shangshang" size="sm" className="border-2 border-white shadow-sm" />
            <MascotAvatar type="caicai" size="sm" className="border-2 border-white shadow-sm" />
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-xl border border-gray-200 px-4 py-3 rounded-full shadow-2xl flex items-center gap-6 z-50">
        <MobileNavIcon active={mode === 'home'} icon={<Home size={22} />} onClick={() => setMode('home')} />
        <MobileNavIcon active={mode === 'chat'} icon={<MessageSquare size={22} />} onClick={() => setMode('chat')} />
        <MobileNavIcon active={mode === 'ugc'} icon={<Palette size={22} />} onClick={() => setMode('ugc')} />
        <MobileNavIcon active={mode === 'wiki'} icon={<Book size={22} />} onClick={() => setMode('wiki')} />
      </div>

      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-100/30 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}

function LandingPage({ onStart }: { onStart: (m: AppMode) => void }) {
  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold border border-red-100 shadow-sm"
        >
          <Sparkles size={16} />
          <span>2026 党风廉政建设宣传教育月</span>
        </motion.div>
        
        <h2 className="text-5xl md:text-7xl font-black tracking-tight text-gray-900 leading-tight">
          清风商院<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">匡时有我</span>
        </h2>
        
        <p className="max-w-2xl mx-auto text-lg text-gray-500 font-medium leading-relaxed">
          深入学习贯彻习近平新时代中国特色社会主义思想，涵养校园廉洁文化生态，
          打造“清风商院”品牌。让吉祥物“商商”和“财财”带你开启AI廉洁之旅。
        </p>

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <button
            onClick={() => onStart('chat')}
            className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl shadow-red-200 flex items-center gap-2 group"
          >
            立即开启对话 <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => onStart('ugc')}
            className="bg-white text-gray-800 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-lg flex items-center gap-2"
          >
            创作廉洁绘卷 <Palette className="text-yellow-500" />
          </button>
        </div>
      </div>

      {/* Mascot Introduction */}
      <div className="grid md:grid-cols-2 gap-8 pt-12">
        <MascotCard
          type="shangshang"
          title="廉洁监督员 · 商商"
          description="黄色圆润，手持“商”字徽章。我是你的廉洁守护者，负责提醒纪律、识别风险，让我们一起坚守底线。"
          color="bg-yellow-400"
          onClick={() => onStart('chat')}
        />
        <MascotCard
          type="caicai"
          title="政策讲解员 · 财财"
          description="红色书本，佩戴党徽。我是你的政策辅导员，负责解读最新精神、传播廉洁知识，让我们一起学深悟透。"
          color="bg-red-600"
          onClick={() => onStart('chat')}
        />
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureItem
          icon={<MessageSquare className="text-red-600" />}
          title="对话式教学"
          desc="与商商财财实时互动，模拟廉洁场景，学习合规知识。"
        />
        <FeatureItem
          icon={<Palette className="text-yellow-500" />}
          title="AI 创意生成"
          desc="输入你的廉洁感悟，AI为你生成专属的吉祥物主题插画。"
        />
        <FeatureItem
          icon={<Book className="text-blue-600" />}
          title="政策百科全书"
          desc="一站式查询廉洁文化建设三年行动计划及二十大精神。"
        />
      </div>

      {/* Footer Info */}
      <div className="bg-gray-900 text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-3 rounded-2xl">
            <Info className="w-8 h-8 text-red-400" />
          </div>
          <div>
            <h4 className="font-bold text-xl">关于“清风商院”</h4>
            <p className="text-gray-400 text-sm">上海财经大学商学院廉洁文化品牌，旨在打造风清气正的育人环境。</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">主办单位</p>
            <p className="font-bold">上财商学院党委</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
        active ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200/50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function MobileNavIcon({ active, icon, onClick }: { active: boolean; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-2xl transition-all ${active ? 'text-red-600 bg-red-50 scale-110' : 'text-gray-400'}`}
    >
      {icon}
    </button>
  );
}

function MascotCard({ type, title, description, color, onClick }: { type: 'shangshang' | 'caicai'; title: string; description: string; color: string; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center text-center group cursor-pointer"
      onClick={onClick}
    >
      <MascotAvatar type={type} size="lg" className="mb-6 group-hover:rotate-6 transition-transform" />
      <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">{description}</p>
      <div className={`w-12 h-1.5 rounded-full ${color}`} />
    </motion.div>
  );
}

function FeatureItem({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
      <div className="bg-gray-50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>
      <h4 className="font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
