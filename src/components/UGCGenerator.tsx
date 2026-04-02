import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Download, Sparkles, RefreshCw, Palette, Type } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { MASCOTS } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const TEMPLATES = [
  { id: 'integrity', label: '廉洁自律', prompt: 'Shangshang and Caicai standing together in front of Shanghai University of Finance and Economics Business School, holding a sign that says "Integrity and Self-discipline".' },
  { id: 'study', label: '勤学苦练', prompt: 'Caicai teaching a group of students about integrity policies in a modern classroom. Bright and inspiring atmosphere.' },
  { id: 'supervise', label: '清风监督', prompt: 'Shangshang acting as a supervisor, pointing at a red line representing discipline, with a serious but cute expression.' },
  { id: 'campus', label: '清风校园', prompt: 'A beautiful campus scene at SUFE Business School with Shangshang and Caicai walking together, cherry blossoms falling.' },
];

export default function UGCGenerator() {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleGenerate = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setGeneratedImage(null);

    try {
      const fullPrompt = `
        Create a high-quality cartoon illustration for Shanghai University of Finance and Economics Business School's integrity culture theme.
        Characters to include: 
        - Shangshang: ${MASCOTS.shangshang.prompt}
        - Caicai: ${MASCOTS.caicai.prompt}
        Scene description: ${finalPrompt}
        Style: Vibrant, cute, professional, clean lines, high resolution, 3D cartoon style.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ parts: [{ text: fullPrompt }] }],
        config: {
          imageConfig: {
            aspectRatio: "1:1",
          }
        }
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
      if (imagePart?.inlineData) {
        setGeneratedImage(`data:image/png;base64,${imagePart.inlineData.data}`);
      } else {
        throw new Error('No image generated');
      }
    } catch (error) {
      console.error('Generation Error:', error);
      alert('生成失败，请稍后再试。');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `清风商院_廉洁故事_${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">廉洁绘卷</h3>
            <p className="text-xs opacity-80">AI创作您的专属廉洁故事插画</p>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-white animate-pulse" />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Preview Area */}
        <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center group">
          <AnimatePresence mode="wait">
            {generatedImage ? (
              <motion.img
                key="image"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={generatedImage}
                alt="Generated"
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            ) : isGenerating ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                <RefreshCw className="w-12 h-12 text-yellow-500 animate-spin" />
                <p className="text-sm text-gray-500 font-medium">商商和财财正在为您作画...</p>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-4 text-gray-400"
              >
                <ImageIcon className="w-16 h-16 opacity-20" />
                <p className="text-sm font-medium">选择模板或输入描述开始创作</p>
              </motion.div>
            )}
          </AnimatePresence>

          {generatedImage && !isGenerating && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <button
                onClick={handleDownload}
                className="bg-white/90 backdrop-blur shadow-lg p-3 rounded-full text-yellow-600 hover:bg-yellow-500 hover:text-white transition-all"
              >
                <Download size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Templates */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-700 flex items-center gap-2">
            <Type size={16} className="text-yellow-500" />
            快速模板
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => {
                  setSelectedTemplate(t.id);
                  handleGenerate(t.prompt);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${
                  selectedTemplate === t.id
                    ? 'bg-yellow-500 text-white border-yellow-500 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Prompt */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-700">自定义描述</h4>
          <div className="flex gap-2">
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="例如：商商和财财在图书馆一起学习廉洁知识..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 min-h-[80px] resize-none"
            />
          </div>
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-yellow-500 text-white py-3 rounded-xl font-bold hover:bg-yellow-600 disabled:opacity-50 transition-all shadow-lg shadow-yellow-200 flex items-center justify-center gap-2"
          >
            {isGenerating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {isGenerating ? '正在生成中...' : '开始AI创作'}
          </button>
        </div>
      </div>
    </div>
  );
}
