'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { chatWithAgent } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAgent(userMessage.content, conversationId);

      if (response.conversationId && !conversationId) {
        setConversationId(response.conversationId);
      }

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col rounded-2xl bg-white/5 ring-1 ring-white/10">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-white/10 p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 ring-1 ring-emerald-500/30">
          <Bot className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">NEXUS Assistant</h3>
          <p className="text-xs text-white/60">AI-powered IoT control</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 ring-1 ring-emerald-500/30">
                <Bot className="h-8 w-8 text-emerald-500" />
              </div>
              <h4 className="text-lg font-semibold text-white">
                Welcome to NEXUS
              </h4>
              <p className="mt-2 text-sm text-white/60 max-w-xs">
                Ask me to control your devices, check telemetry, or get insights
                about your IoT network.
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ring-1 ${
                    message.role === 'user'
                      ? 'bg-blue-500/20 ring-blue-500/30'
                      : 'bg-emerald-500/20 ring-emerald-500/30'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="h-4 w-4 text-blue-500" />
                  ) : (
                    <Bot className="h-4 w-4 text-emerald-500" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-xl p-3 ring-1 ${
                    message.role === 'user'
                      ? 'bg-blue-500/10 ring-blue-500/20'
                      : 'bg-white/5 ring-white/10'
                  }`}
                >
                  <p className="text-sm text-white/90 whitespace-pre-wrap">
                    {message.content}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3"
          >
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 ring-1 ring-emerald-500/30">
              <Bot className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-center rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10">
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500" />
              <span className="ml-2 text-sm text-white/60">Thinking...</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask NEXUS to control devices..."
            disabled={isLoading}
            className="flex-1 rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex items-center justify-center rounded-xl bg-emerald-500/20 px-4 py-3 text-emerald-500 ring-1 ring-emerald-500/30 transition-all hover:bg-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="mt-2 text-xs text-white/40">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
