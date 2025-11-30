import React, { useState, useRef, useEffect } from 'react';
import { Message } from '../types';
import { chatStream } from '../services/geminiService';
import { Send, Bot, User, StopCircle } from 'lucide-react';
import { GenerateContentResponse } from '@google/genai';

export const AIChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Olá. Sou a IA Holthausen. Como posso ajudar com seus processos licitatórios hoje?',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || isStreaming) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsStreaming(true);

    // Prepare history for API
    const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
    }));

    try {
        const streamResponse = await chatStream(history, userMsg.text);
        
        let fullResponseText = '';
        const modelMsgId = (Date.now() + 1).toString();
        
        // Add placeholder message
        setMessages(prev => [...prev, {
            id: modelMsgId,
            role: 'model',
            text: '',
            timestamp: new Date()
        }]);

        for await (const chunk of streamResponse) {
            const c = chunk as GenerateContentResponse;
            const chunkText = c.text || '';
            fullResponseText += chunkText;

            setMessages(prev => 
                prev.map(msg => 
                    msg.id === modelMsgId ? { ...msg, text: fullResponseText } : msg
                )
            );
        }

    } catch (error) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            text: 'Desculpe, ocorreu um erro ao processar sua solicitação. Verifique sua chave de API.',
            timestamp: new Date()
        }]);
    } finally {
        setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-900">
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur z-10">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Bot className="text-blue-500" />
          Assistente Holthausen
        </h1>
        <p className="text-slate-400 text-sm mt-1 ml-9">Consultoria estratégica em tempo real.</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'model' && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <Bot size={18} className="text-white" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl p-4 shadow-md ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-sm' 
                : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-sm'
            }`}>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.text}</div>
              <div className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                <User size={18} className="text-slate-300" />
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 bg-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre leis, análise de editais ou estratégia..."
            className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none shadow-lg"
            rows={2}
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim() || isStreaming}
            className={`absolute right-3 top-3 p-2 rounded-lg transition-all ${
              inputText.trim() && !isStreaming
                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/30' 
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isStreaming ? <StopCircle size={20} className="animate-pulse text-red-400" /> : <Send size={20} />}
          </button>
        </div>
        <div className="text-center mt-3 text-xs text-slate-600">
          A IA pode cometer erros. Considere verificar informações legais importantes.
        </div>
      </div>
    </div>
  );
};
