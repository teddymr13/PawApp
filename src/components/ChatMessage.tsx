'use client';

import ReactMarkdown from 'react-markdown';
import { User, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface ChatMessageProps {
  role: 'user' | 'bot';
  content: string;
  imageBase64?: string;
}

export function ChatMessage({ role, content, imageBase64 }: ChatMessageProps) {
  const isUser = role === 'user';

  // Parse [SCORE: X/10]
  let displayContent = content;
  let scoreMatch = displayContent.match(/\[SCORE:\s*(\d+)\/10\]/i);
  let scoreValue = scoreMatch ? parseInt(scoreMatch[1]) : null;
  
  if (scoreMatch) {
    displayContent = displayContent.replace(scoreMatch[0], '').trim();
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-red-50 border-red-200 text-red-700';
    if (score >= 4) return 'bg-amber-50 border-amber-200 text-amber-700';
    return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return 'Tinggi - SEGERA KE DOKTER HEWAN';
    if (score >= 4) return 'Sedang - Perlu Observasi';
    return 'Ringan - Aman / Perawatan Mandiri';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6 chat-bubble`}
    >
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${isUser ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
          {isUser ? <User size={16} /> : <PawPrint size={16} />}
        </div>

        {/* Bubble */}
        <div 
          className={`px-5 py-4 rounded-2xl shadow-sm text-sm leading-relaxed overflow-hidden ${
            isUser 
              ? 'bg-primary text-white rounded-br-none text-right' 
              : 'bg-white border border-slate-100 text-text-main rounded-bl-none text-left'
          }`}
        >
          {imageBase64 && (
            <div className="mb-3 flex justify-end">
              <img 
                src={imageBase64} 
                alt="Uploaded by user" 
                className="max-w-full h-auto max-h-64 rounded-xl shadow-sm border border-slate-200/20 object-cover" 
              />
            </div>
          )}
          {isUser ? (
            <p className="whitespace-pre-wrap">{displayContent}</p>
          ) : (
            <div className="markdown-content space-y-3">
              <ReactMarkdown>{displayContent}</ReactMarkdown>
              
              {scoreValue !== null && (
                <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 ${getScoreColor(scoreValue)}`}>
                  <div className="bg-white/50 p-2 rounded-full shrink-0">
                    <Activity size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">AI Health Score Prediction</p>
                    <p className="text-sm font-semibold">Keparahan: {scoreValue}/10 ({getScoreLabel(scoreValue)})</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
