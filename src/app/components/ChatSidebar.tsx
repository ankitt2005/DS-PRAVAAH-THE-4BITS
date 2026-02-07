import React, { useState, useRef, useEffect } from 'react';

interface Message {
  role: 'user' | 'system';
  content: string;
}

interface ChatSidebarProps {
  transcriptId: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({ transcriptId }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'system', content: `Ready to analyze transcript ID: ${transcriptId}. Ask me anything!` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Add User Message to UI
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInput('');
    setIsTyping(true);

    try {
      // 👇 CHANGED: Now pointing exactly to 127.0.0.1 to match your backend
      const response = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg,
          transcript_id: transcriptId,
          history: messages 
        }),
      });

      if (!response.ok) throw new Error('Network response was not ok');

      const data = await response.json();

      // 3. Update UI with Real Response
      setMessages(prev => [...prev, { role: 'system', content: data.response }]);
      
    } catch (error) {
      console.error("Connection Error:", error);
      setMessages(prev => [...prev, { 
        role: 'system', 
        content: "⚠️ Error: Could not connect to 127.0.0.1:8000. Is the backend running?" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/50 backdrop-blur-md relative z-20">
      <div className="p-6 border-b border-white/5 bg-slate-900/50">
        <h2 className="text-lg font-bold text-white mb-1">Interactive Reasoning</h2>
        <p className="text-xs text-slate-400">
          Start a conversation about transcript: <span className="text-cyan-400 font-mono">{transcriptId}</span>
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg ${
              msg.role === 'user' 
                ? 'bg-cyan-600 text-white rounded-br-none' 
                : 'bg-slate-800/80 text-slate-200 border border-white/5 rounded-bl-none'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800/80 rounded-2xl rounded-bl-none p-4 flex gap-2 items-center border border-white/5">
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-white/5 bg-slate-900/80">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask why..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-slate-600"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;