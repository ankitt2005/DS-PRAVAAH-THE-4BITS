import React from 'react';

interface InsightCardProps {
  title: string;
  value: string | number;
  trend?: string;
  icon?: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ title, value, trend, icon }) => {
  return (
    <div className="group bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl hover:bg-white/[0.03] transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)] relative overflow-hidden">
      
      {/* Background Glow on Hover */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-[50px] group-hover:bg-cyan-500/20 transition-all"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest">{title}</h3>
          <span className="text-xl opacity-50 grayscale group-hover:grayscale-0 transition-all">{icon}</span>
        </div>
        
        <div className="flex items-end gap-3">
          <div className="text-4xl font-black text-white tracking-tighter">
            {value}
          </div>
          {trend && (
            <div className={`text-xs font-bold mb-1.5 px-2 py-0.5 rounded-full ${
              trend.includes('+') ? 'bg-emerald-500/20 text-emerald-400' : 
              trend === 'Normal' ? 'bg-blue-500/20 text-blue-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {trend}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InsightCard;