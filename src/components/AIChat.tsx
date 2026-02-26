import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! I am your CSE Department AI Assistant. I have access to all current notices, routines, and study notes. How can I help you today?' }
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

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ role: 'assistant', content: 'Chat cleared. How can I help you now?' }]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">CSE AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Online & Ready</span>
            </div>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
          title="Clear Chat"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-slate-100 text-slate-600' : 'bg-indigo-100 text-indigo-600'
                }`}>
                  {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-100' 
                    : 'bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  <div className="markdown-body">
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="flex gap-3 items-center bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100">
              <Loader2 className="w-4 h-4 text-indigo-600 animate-spin" />
              <span className="text-sm text-slate-500 font-medium">AI is thinking...</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-100 bg-slate-50/30">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            placeholder="Ask about routines, notices, or study notes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-3 uppercase tracking-widest font-bold">
          Powered by Gemini AI • Department Data Trained
        </p>
      </div>
    </div>
  );
}
