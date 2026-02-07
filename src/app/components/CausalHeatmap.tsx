export default function CausalHeatmap({ transcript, causalTurnId }: any) {
  if (!transcript) return <div className="text-slate-500">No transcript data loaded.</div>;
  
  return (
    <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-4">Causal Identification</h3>
      <div className="space-y-4">
        {transcript.map((turn: any, index: number) => (
          <div key={index} className={`p-4 rounded-xl border transition-all ${
            index === causalTurnId ? "border-red-500 bg-red-500/10" : "border-slate-700 bg-slate-800/50"
          }`}>
            <p className="text-[10px] font-bold text-blue-400 uppercase">{turn.speaker}</p>
            <p className="text-sm text-slate-200">{turn.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}