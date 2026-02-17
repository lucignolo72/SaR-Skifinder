
import React, { useState, useMemo } from 'react';
import { QUESTIONS, SAR_LOGO } from './constants';
import { RiderProfile } from './types';
import { getSkiRecommendation } from './geminiService';

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [profile, setProfile] = useState<Partial<RiderProfile>>({});
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [customInput, setCustomInput] = useState("");

  const progress = useMemo(() => {
    if (currentStep < 0) return 0;
    return Math.round(((currentStep) / QUESTIONS.length) * 100);
  }, [currentStep]);

  const startAnalysis = () => setCurrentStep(0);

  const handleSelect = async (value: string) => {
    const currentQ = QUESTIONS[currentStep];
    const newProfile = { ...profile, [currentQ.id]: value };
    setProfile(newProfile);

    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCurrentStep(QUESTIONS.length);
      setLoading(true);
      const result = await getSkiRecommendation(newProfile as RiderProfile);
      setLoading(false);
      setRecommendation(result);
    }
  };

  const renderWelcome = () => (
    <div className="relative flex flex-col items-center justify-center min-h-[85vh] text-center px-6 animate-in fade-in duration-1000 overflow-hidden">
      {/* Background Image with Overlay - Big Mountain Freeride with reduced blur for better visibility */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-110"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1551524559-8af4e6624178?q=80&w=2000&auto=format&fit=crop')`,
          animation: 'slowZoom 25s infinite alternate',
          filter: 'blur(3px) brightness(0.6)'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/60"></div>
      </div>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.2); }
        }
      `}</style>

      <div className="relative z-10 flex flex-col items-center">
        <div className="max-w-md w-full mb-10 drop-shadow-[0_0_30px_rgba(140,198,63,0.6)] animate-in zoom-in duration-1000">
          {SAR_LOGO}
        </div>
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-tight drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)]">
            SKIFINDER<br/>
            <span className="text-sar-green">GUIDA ALLA SCELTA DELLO SCI</span>
          </h1>
          <p className="text-zinc-100 text-lg md:text-xl max-w-2xl mx-auto font-semibold tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
            Protocollo tecnico per rider Big Mountain e Freeride Specialist. 
            <span className="block mt-4 text-sar-green font-mono text-sm uppercase tracking-[0.2em] font-bold bg-black/70 py-2 px-6 inline-block border-l-4 border-sar-green">
              APPENNINO CENTRALE // ROCCARASO CORE
            </span>
          </p>
        </div>
        
        <button
          onClick={startAnalysis}
          className="group relative bg-sar-green text-black font-black py-6 px-16 rounded-none skew-x-[-12deg] text-2xl hover:scale-110 transition-all shadow-[0_0_50px_rgba(140,198,63,0.5)] overflow-hidden"
        >
          <span className="relative z-10 block skew-x-[12deg]">INIZIA IL TEST PRO</span>
          <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
        </button>

        <div className="mt-16 flex gap-12 opacity-90 animate-in slide-in-from-bottom-5 duration-1000 delay-300">
           <div className="text-center">
             <div className="text-[10px] font-mono uppercase text-sar-green tracking-widest mb-1">Terrain</div>
             <div className="text-sm font-black uppercase italic text-white tracking-tighter">Big Mountain</div>
           </div>
           <div className="text-center border-x border-zinc-800 px-12">
             <div className="text-[10px] font-mono uppercase text-sar-green tracking-widest mb-1">Context</div>
             <div className="text-sm font-black uppercase italic text-white tracking-tighter">Alto Sangro</div>
           </div>
           <div className="text-center">
             <div className="text-[10px] font-mono uppercase text-sar-green tracking-widest mb-1">Status</div>
             <div className="text-sm font-black uppercase italic text-white tracking-tighter">Independent</div>
           </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    const question = QUESTIONS[currentStep];
    return (
      <div className="max-w-4xl mx-auto w-full px-6 py-12 animate-in slide-in-from-right-8 duration-500">
        <div className="mb-12">
          <div className="flex justify-between items-end mb-4">
            <div>
              <span className="text-sar-green font-mono text-sm font-bold uppercase tracking-widest">Analisi Parametro {currentStep + 1}/{QUESTIONS.length}</span>
              <h2 className="text-3xl md:text-4xl font-black uppercase italic mt-1">{question.label}</h2>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-zinc-600 font-mono text-xs uppercase tracking-tighter">System Status</span>
              <div className="text-sar-green font-mono text-sm">CALCULATING_OPTIMAL_GEOMETRY</div>
            </div>
          </div>
          <div className="h-1 w-full bg-zinc-900 overflow-hidden">
            <div 
              className="h-full bg-sar-green transition-all duration-500 ease-out shadow-[0_0_10px_#8CC63F]" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => handleSelect(option)}
              className="group flex items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 hover:border-sar-green transition-all hover:bg-sar-green/5 text-left"
            >
              <span className="text-xl font-bold uppercase italic group-hover:text-sar-green transition-colors">{option}</span>
              <div className="w-6 h-6 border border-zinc-700 group-hover:border-sar-green flex items-center justify-center">
                <div className="w-2 h-2 bg-sar-green scale-0 group-hover:scale-100 transition-transform"></div>
              </div>
            </button>
          ))}
        </div>

        {question.id === 'physique' && (
          <div className="mt-8">
            <label className="block text-zinc-500 font-mono text-xs uppercase mb-2">Input Manuale (Opzionale)</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Es: 182cm, 78kg"
                className="flex-1 bg-zinc-950 border border-zinc-800 p-4 text-white focus:outline-none focus:border-sar-green font-mono"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
              />
              <button 
                onClick={() => { if(customInput) handleSelect(customInput); setCustomInput(""); }}
                className="bg-zinc-800 px-8 font-bold hover:bg-sar-green hover:text-black transition-colors"
              >
                INVIO
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderResult = () => (
    <div className="max-w-5xl mx-auto w-full px-6 py-12 animate-in fade-in zoom-in duration-1000">
      <div className="bg-zinc-950 border-t-4 border-sar-green p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <div className="text-8xl font-black italic select-none text-zinc-800">SaR</div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 border-b border-zinc-800 pb-8">
          <div>
            <h2 className="text-sar-green font-mono text-sm font-bold uppercase tracking-[0.3em] mb-2">Technical Analysis Report</h2>
            <h3 className="text-4xl font-black uppercase italic leading-tight">Assetto Consigliato <span className="text-zinc-500">v3.0</span></h3>
          </div>
          <div className="flex gap-4">
             <div className="bg-zinc-900 p-4 border border-zinc-800 text-center min-w-[100px]">
                <div className="text-zinc-500 text-[10px] uppercase font-mono">Confidence</div>
                <div className="text-sar-green font-black text-xl italic">98.4%</div>
             </div>
             <div className="bg-zinc-900 p-4 border border-zinc-800 text-center min-w-[100px]">
                <div className="text-zinc-500 text-[10px] uppercase font-mono">Location</div>
                <div className="text-white font-black text-xl italic uppercase">Aremogna</div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {recommendation?.split('\n').map((line, i) => {
              if (line.trim() === '') return null;
              const isHeader = line.startsWith('🔹') || line.startsWith('🎿') || line.startsWith('📏') || line.startsWith('❄️') || line.startsWith('⚙️') || line.startsWith('⚠️');
              
              return (
                <div key={i} className={isHeader ? "mt-8 first:mt-0" : "text-zinc-300 leading-relaxed font-light text-lg"}>
                  {isHeader ? (
                    <h4 className="flex items-center gap-3 text-sar-green font-black text-xl uppercase italic tracking-tight mb-4 border-l-4 border-sar-green pl-4 py-1 bg-sar-green/5">
                      {line}
                    </h4>
                  ) : line}
                </div>
              );
            })}
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900/50 p-6 border border-zinc-800">
               <h5 className="text-white font-black uppercase italic mb-4 text-sm border-b border-zinc-800 pb-2">Rider Tech Specs</h5>
               <div className="space-y-3 font-mono text-xs">
                 {Object.entries(profile).map(([key, val]) => (
                   <div key={key} className="flex justify-between">
                     <span className="text-zinc-500 uppercase">{key}:</span>
                     <span className="text-sar-green uppercase">{val}</span>
                   </div>
                 ))}
               </div>
            </div>
            
            <div className="bg-sar-green p-6 text-black">
               <h5 className="font-black uppercase italic mb-2">SaR Philosophy</h5>
               <p className="text-sm font-bold leading-tight">
                 "La scelta dello sci non è marketing, è fisica applicata al divertimento. Scia consapevole, scia forte."
               </p>
            </div>

            <button 
              onClick={() => {
                setCurrentStep(-1);
                setProfile({});
                setRecommendation(null);
              }}
              className="w-full bg-zinc-800 hover:bg-white hover:text-black text-white font-black py-4 uppercase italic transition-all skew-x-[-12deg]"
            >
              Riavvia Analisi
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans selection:bg-sar-green selection:text-black">
      {/* HUD Header */}
      <header className="p-6 border-b border-zinc-900 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentStep(-1)}>
            <div className="w-10 h-10">{SAR_LOGO}</div>
            <div className="leading-none">
              <div className="font-black text-xl tracking-tighter uppercase italic leading-none">SnowRiders <span className="text-sar-green">PRO</span></div>
              <div className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase mt-1">Skifinder Engine v3.1.0</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 font-mono text-[10px] text-zinc-500">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-sar-green rounded-full shadow-[0_0_5px_#8CC63F]"></span>
              LIVE_DATA_FEED: ACTIVE
            </div>
            <div>REGION: ALTO_SANGRO_CORE</div>
          </div>
        </div>
      </header>

      {/* Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-x-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        
        {loading ? (
          <div className="flex flex-col items-center gap-8 animate-pulse">
            <div className="w-24 h-24 border-4 border-sar-green border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <h2 className="text-2xl font-black uppercase italic text-sar-green tracking-tighter">Processing Data</h2>
              <p className="text-zinc-500 font-mono text-sm">SIMULATING_MOUNTAIN_CONDITIONS...</p>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {currentStep === -1 && renderWelcome()}
            {currentStep >= 0 && currentStep < QUESTIONS.length && renderStep()}
            {recommendation && renderResult()}
          </div>
        )}
      </main>

      {/* Footer HUD */}
      <footer className="p-4 border-t border-zinc-900 bg-black/80 backdrop-blur-md text-[10px] font-mono text-zinc-600 flex justify-between items-center px-10">
        <div>© 2025 SAR SNOWRIDERS COMMUNITY</div>
        <div className="flex gap-4">
          <span className="hover:text-sar-green cursor-pointer transition-colors">SAFETY_PROTOCOL</span>
          <span className="hover:text-sar-green cursor-pointer transition-colors">TECH_SPECS</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
