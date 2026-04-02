import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, MessageSquare, ShieldAlert, BookOpen, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { MASCOTS, POLICIES } from '../constants';
import MascotAvatar from './MascotAvatar';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

interface Message {
  role: 'user' | 'shangshang' | 'caicai' | 'system';
  content: string;
}

const SYSTEM_INSTRUCTION = `
你现在是上海财经大学商学院的廉洁文化推广大使。
你有两个身份可以切换：
1. **商商** (Shangshang): 黄色圆润吉祥物，担任“廉洁监督员”。你的语气严肃但亲切，专注于提醒纪律、识别风险，比如指出“红包”、“宴请”等行为的合规性。
2. **财财** (Caicai): 红色书本形象吉祥物，担任“政策讲解员”。你的语气博学、稳重，专注于解读《新时代廉洁文化建设三年行动计划》、二十大精神等政策内容。

当用户提问时，请根据问题内容，以“商商”或“财财”的口吻回答，或者两者进行对话式教学。
例如：
商商：同学，这个供应商送的礼品看起来不太合适哦。
财财：没错，根据《新时代廉洁文化建设三年行动计划》，我们要坚决杜绝此类行为...

请始终保持正面、积极、教育性的态度，弘扬“清风商院·匡时有我”的主题。
`;

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: '欢迎来到“清风商院”互动空间！我是商商，我是财财。有什么廉洁文化方面的问题想和我们聊聊吗？' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: messages.concat(userMessage).map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      const aiContent = response.text || '抱歉，我刚才走神了，请再说一遍。';
      
      // Heuristic to split response if it contains both mascots
      if (aiContent.includes('商商：') || aiContent.includes('财财：')) {
         setMessages(prev => [...prev, { role: 'system', content: aiContent }]);
      } else {
         // Default to a combined response or choose one based on content
         setMessages(prev => [...prev, { role: 'caicai', content: aiContent }]);
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { role: 'system', content: '连接超时，请稍后再试。' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            <MascotAvatar type="shangshang" size="sm" className="border-2 border-white" />
            <MascotAvatar type="caicai" size="sm" className="border-2 border-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg">清风对话</h3>
            <p className="text-xs opacity-80 text-red-100">商商 & 财财 在线为您解答</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className="flex-shrink-0 mt-1">
                  {msg.role === 'user' ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <User size={18} />
                    </div>
                  ) : msg.role === 'shangshang' ? (
                    <MascotAvatar type="shangshang" size="sm" />
                  ) : msg.role === 'caicai' ? (
                    <MascotAvatar type="caicai" size="sm" />
                  ) : (
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                      <MessageSquare size={18} />
                    </div>
                  )}
                </div>
                <div
                  className={`p-3 rounded-2xl text-sm shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-red-600 text-white rounded-tr-none'
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  }`}
                >
                  {msg.content.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-2' : ''}>
                      {line.startsWith('商商：') ? <span className="font-bold text-yellow-600">商商：</span> : null}
                      {line.startsWith('财财：') ? <span className="font-bold text-red-600">财财：</span> : null}
                      {line.replace(/^(商商：|财财：)/, '')}
                    </p>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex gap-2 items-center">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="输入您想咨询的廉洁问题..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
          <QuickAction icon={<ShieldAlert size={14} />} label="识别风险" onClick={() => setInput('商商，帮我看看这个行为合规吗？')} />
          <QuickAction icon={<BookOpen size={14} />} label="政策解读" onClick={() => setInput('财财，能解读一下最新的廉洁行动计划吗？')} />
          <QuickAction icon={<Sparkles size={14} />} label="清风故事" onClick={() => setInput('讲一个关于商学院廉洁自律的小故事吧。')} />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 whitespace-nowrap bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium hover:bg-red-100 transition-colors border border-red-100"
    >
      {icon}
      {label}
    </button>
  );
}
