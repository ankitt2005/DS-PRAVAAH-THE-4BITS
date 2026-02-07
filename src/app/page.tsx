"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CausalHeatmap from './components/CausalHeatmap';
import InsightCard from './components/InsightCard'; 

// --- EXPLANATIONS FOR METRICS (Static Text) ---
const METRIC_EXPLANATIONS: any = {
  confidence: {
    title: "🎯 AI Confidence Score",
    desc: "The AI is 91.4% certain that the intent of this call is 'Delivery Investigation' based on keyword patterns."
  },
  turns: {
    title: "💬 Conversation Depth",
    desc: "Total turns indicate the back-and-forth count. High counts (15+) often signal complex, unresolved issues."
  },
  reason: {
    title: "📦 Critical Driver Analysis",
    // We will override the 'desc' for this specific metric in the render function to make it interactive
    desc: "" 
  }
};

// --- COMPONENT: INTERACTIVE SENTIMENT GRAPH ---
const SentimentGraph = ({ onGraphClick }: { onGraphClick: (msg: string) => void }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Mock data
  const points = [40, 35, 30, 45, 60, 55, 70, 85, 90, 88];
  const pathData = points.map((p, i) => {
    const x = (i / (points.length - 1)) * 100;
    const y = 50 - ((p / 100) * 50); 
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  const handleGraphClick = () => {
    setIsExpanded(!isExpanded);
  };

  const askAboutGraph = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing
    onGraphClick("Why did the sentiment drop at the beginning and rise at the end?");
  };

  return (
    <div 
      onClick={handleGraphClick}
      className={`w-full bg-slate-900/50 border border-white/5 rounded-xl mb-6 backdrop-blur-sm shadow-inner relative overflow-hidden group transition-all duration-300 cursor-pointer ${isExpanded ? 'h-48 border-purple-500/30' : 'h-[110px] hover:border-purple-500/30'}`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 relative z-10">
        <h3 className="text-xs font-bold text-slate-300 flex items-center gap-2 tracking-widest">
          <span className="text-purple-400 text-lg">📈</span> SENTIMENT VELOCITY
        </h3>
        {isExpanded ? (
           <button className="text-[10px] bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white">CLOSE DETAILS</button>
        ) : (
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            POSITIVE RESOLUTION DETECTED
          </span>
        )}
      </div>
      
      {/* Graph Visuals */}
      <div className={`relative w-full z-0 transition-all duration-500 ${isExpanded ? 'h-[100px] opacity-40' : 'h-[60px] px-4'}`}>
        <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 50">
          <defs>
            <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${pathData} L 100 50 L 0 50 Z`} fill="url(#gradient)" stroke="none" />
          <path d={pathData} fill="none" stroke="#c084fc" strokeWidth="2" vectorEffect="non-scaling-stroke" className="drop-shadow-[0_0_10px_rgba(192,132,252,0.8)]" />
        </svg>
      </div>

      {/* EXPANDED DETAILS OVERLAY */}
      {isExpanded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60 backdrop-blur-[2px] animate-in fade-in">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-xs text-slate-400 uppercase">Lowest Point</div>
              <div className="text-xl font-bold text-red-400">30%</div>
              <div className="text-[10px] text-slate-500">@ 00:45</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase">Peak Point</div>
              <div className="text-xl font-bold text-emerald-400">90%</div>
              <div className="text-[10px] text-slate-500">@ 03:50</div>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase">Analysis</div>
               <button 
                onClick={askAboutGraph}
                className="mt-1 text-[10px] bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition shadow-lg shadow-purple-900/50"
               >
                 💬 Ask AI Why
               </button>
            </div>
          </div>
        </div>
      )}
      
      {!isExpanded && (
         <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none"></div>
      )}
    </div>
  );
};

export default function Dashboard() {
  // --- STATE MANAGEMENT ---
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Interactive States
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  
  // Chat States
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null); // Ref to focus input

  // --- 1. LOAD TRANSCRIPT DATA ---
  useEffect(() => {
    fetch('/transcript.json')
      .then((res) => res.json())
      .then((jsonData) => {
        const realConversation = jsonData.transcripts?.[0]?.conversation || [];
        const realID = jsonData.transcripts?.[0]?.transcript_id || "UNKNOWN";

        const formattedData = {
          confidence_score: "91.4%", 
          causal_turn_id: 2, 
          transcript_id: realID,
          transcript: realConversation
        };

        setData(formattedData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Could not load transcript:", err);
        setLoading(false);
      });
  }, []);

  // --- 2. CHAT WELCOME MESSAGE ---
  useEffect(() => {
    const welcomeMsg = {
      sender: "bot",
      text: `👋 Hello! I'm your AI Analyst. I've analyzed transcript #${data?.transcript_id || '6794-8660'}. 
      
      I found a Critical Delivery Issue. Click on the "Confidence Score" to understand my reasoning, or ask me anything!`
    };
    setMessages([welcomeMsg]);
  }, [data]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 3. HELPER: FOCUS CHAT WITH TOPIC ---
  const focusChatWithTopic = (topic: string) => {
    // 1. Set the input text
    const query = `Tell me more about the ${topic} issue detected in this call.`;
    setInput(query);
    
    // 2. Focus the input box
    if (chatInputRef.current) {
      chatInputRef.current.focus();
    }
  };

  // --- 4. CHAT SEND FUNCTION ---
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsChatLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chat", {
        message: input,
      });

      const botMsg = { sender: "bot", text: response.data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ System Offline. Is your backend running?" },
      ]);
    }
    setIsChatLoading(false);
  };

  // --- LOADING SCREEN ---
  if (loading) return (
    <div className="h-screen bg-[#0B0F19] flex flex-col items-center justify-center text-cyan-400 font-mono">
      <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
      <div className="animate-pulse tracking-widest text-sm">LOADING NEURAL NETWORK...</div>
    </div>
  );

  return (
    <main className="flex h-screen bg-[#0B0F19] text-slate-200 overflow-hidden font-sans selection:bg-cyan-500/30">
      
      {/* 🌌 Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-8 z-10 overflow-hidden relative">
        
        {/* --- HEADER --- */}
        <header className="mb-8 flex items-center justify-between border-b border-white/5 pb-6 relative h-24">
          <div className="z-10 flex-shrink-0">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-1">
              THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">4BITS</span>
            </h1>
            <p className="text-slate-400 text-sm font-medium tracking-wide">CAUSAL TRACEABILITY DASHBOARD</p>
          </div>

          <div className="absolute left-[58%] top-1/2 -translate-x-1/2 -translate-y-1/2 hidden xl:block pointer-events-none w-max">
            <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-cyan-500 font-black tracking-[0.15em] text-3xl uppercase drop-shadow-[0_0_25px_rgba(34,211,238,0.6)] whitespace-nowrap">
              AI Conversation Intelligence
            </h2>
          </div>

          <div className="flex gap-2 z-10 flex-shrink-0">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20 font-mono flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              SYSTEM ONLINE
            </span>
          </div>
        </header>

        {/* 📊 KPI Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="cursor-pointer transition hover:scale-[1.02]" onClick={() => setActiveMetric('confidence')}>
            <InsightCard title="Confidence Score" value={data?.confidence_score || "N/A"} trend="+2.4%" icon="🎯" />
          </div>
          <div className="cursor-pointer transition hover:scale-[1.02]" onClick={() => setActiveMetric('turns')}>
            <InsightCard title="Total Turns" value={data?.transcript?.length || 0} trend="Normal" icon="💬" />
          </div>
          <div className="cursor-pointer transition hover:scale-[1.02]" onClick={() => setActiveMetric('reason')}>
            <InsightCard title="Reason For Call" value="Delivery" trend="Critical" icon="📦" />
          </div>
        </div>

        {/* ℹ️ Info Banner (DYNAMIC) */}
        {activeMetric && (
          <div className="mb-6 bg-slate-800/50 border-l-4 border-cyan-400 p-4 rounded-r-lg backdrop-blur-md animate-in slide-in-from-top-2 fade-in duration-300 relative group">
            <div className="flex justify-between items-start">
              <div className="w-full">
                <h4 className="text-cyan-400 font-bold text-sm uppercase tracking-wider mb-2">
                  {METRIC_EXPLANATIONS[activeMetric].title}
                </h4>
                
                {/* 🌟 CUSTOM LOGIC FOR 'REASON' - THE CLICKABLE PILLS */}
                {activeMetric === 'reason' ? (
                   <div className="space-y-3">
                      <p className="text-slate-300 text-sm">
                        The AI identified <span className="text-white font-bold">Delivery</span> as the primary driver. 
                        Detected sub-topics requiring attention (Click to Analyze):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {['Delivery Status', 'Refund Request', 'Shipping Delay'].map((topic) => (
                          <button
                            key={topic}
                            onClick={() => focusChatWithTopic(topic)}
                            className="px-3 py-1.5 rounded-md text-xs font-semibold bg-cyan-900/30 text-cyan-200 border border-cyan-500/30 hover:bg-cyan-500 hover:text-white hover:border-cyan-400 transition-all shadow-[0_0_10px_rgba(34,211,238,0.1)] hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] flex items-center gap-2 group/btn"
                          >
                            <span>📌 {topic}</span>
                            <span className="opacity-0 group-hover/btn:opacity-100 transition-opacity">→ Go to Chat</span>
                          </button>
                        ))}
                      </div>
                   </div>
                ) : (
                  // Default text for other metrics
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {METRIC_EXPLANATIONS[activeMetric].desc}
                  </p>
                )}
              </div>
              <button onClick={() => setActiveMetric(null)} className="text-slate-500 hover:text-white p-1 hover:bg-white/10 rounded">✕</button>
            </div>
          </div>
        )}

        {/* 📈 INTERACTIVE SENTIMENT GRAPH */}
        <SentimentGraph onGraphClick={(msg) => {
            setInput(msg);
            if (chatInputRef.current) chatInputRef.current.focus();
        }} />

        {/* 🔥 Heatmap Container */}
        <div className="flex-1 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-2xl p-1 shadow-2xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></span>
                Live Transcript Analysis
              </h2>
              <div className="hidden md:flex gap-2 ml-4">
                 <button className="px-3 py-1 text-xs rounded border border-white/10 hover:bg-white/5 transition text-slate-300">📄 Export PDF</button>
                 <button className="px-3 py-1 text-xs rounded border border-white/10 hover:bg-white/5 transition text-slate-300">✉️ Email</button>
              </div>
            </div>
            <div className="text-xs text-slate-500 font-mono">
              ID: {data?.transcript_id}
            </div>
          </div>
          <div className="p-6 overflow-y-auto custom-scrollbar h-full">
            <CausalHeatmap 
              transcript={data?.transcript || []} 
              causalTurnId={data?.causal_turn_id} 
            />
          </div>
        </div>
      </div>

      {/* 🤖 RIGHT SIDEBAR: INTELLIGENT CHAT */}
      <div className="w-[400px] border-l border-white/5 bg-slate-950/80 backdrop-blur-xl relative z-20 shadow-2xl flex flex-col">
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            🤖 Interactive Reasoning
          </h3>
          <p className="text-slate-500 text-xs mt-1">
            Ask questions about transcript {data?.transcript_id?.split('-')[0]}...
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div 
                className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed shadow-lg ${
                  msg.sender === 'user' 
                    ? 'bg-cyan-600 text-white rounded-br-none' 
                    : 'bg-slate-800 text-slate-200 border border-white/10 rounded-bl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isChatLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none border border-white/10 flex gap-2 items-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></span>
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-white/5 bg-black/20">
          <div className="flex gap-2">
            <input
              ref={chatInputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about specific topics..."
              className="flex-1 bg-slate-900 border border-slate-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500 transition placeholder:text-slate-600"
            />
            <button onClick={sendMessage} className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 rounded-lg font-medium transition duration-200">
              Send
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}