import React from 'react';
import { motion } from 'motion/react';
import { Book, ChevronRight, ExternalLink, ShieldCheck, FileText, GraduationCap } from 'lucide-react';
import { POLICIES } from '../constants';

export default function PolicyWiki() {
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Book className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">政策百科</h3>
            <p className="text-xs opacity-80">廉洁文化政策一站式查询</p>
          </div>
        </div>
        <ShieldCheck className="w-5 h-5 text-blue-200 animate-pulse" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
        <div className="grid gap-4">
          {POLICIES.map((policy, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <FileText size={20} />
                </div>
                <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </div>
              <h4 className="font-bold text-gray-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
                {policy.title}
              </h4>
              <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                {policy.content}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded">
                  官方政策
                </span>
                <button className="text-xs text-blue-600 font-medium flex items-center gap-1 hover:underline">
                  阅读全文 <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Learning Resources */}
        <div className="mt-8 space-y-4">
          <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <GraduationCap size={18} className="text-blue-600" />
            学习资源
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <ResourceCard title="廉洁教育视频" color="bg-red-50 text-red-700" />
            <ResourceCard title="案例库" color="bg-yellow-50 text-yellow-700" />
            <ResourceCard title="在线测评" color="bg-green-50 text-green-700" />
            <ResourceCard title="互动社区" color="bg-purple-50 text-purple-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ title, color }: { title: string; color: string }) {
  return (
    <div className={`p-4 rounded-xl font-medium text-xs text-center shadow-sm border border-white/50 cursor-pointer hover:scale-105 transition-transform ${color}`}>
      {title}
    </div>
  );
}
