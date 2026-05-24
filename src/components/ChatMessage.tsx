'use client';

import ReactMarkdown from 'react-markdown';
import { User, PawPrint } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  role: 'user' | 'bot';
  content: string;
  imageBase64?: string;
}

export function ChatMessage({ role, content, imageBase64 }: ChatMessageProps) {
  const isUser = role === 'user';

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
            <p className="whitespace-pre-wrap">{content}</p>
          ) : (
            <div className="markdown-content">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
