import React, { useEffect } from 'react';
import { 
  Skull, 
  ShieldCheck, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  AlertOctagon, 
  CheckCircle2, 
  Gauge, 
  ShieldAlert,
  Flame
} from 'lucide-react';
import type { GameStatus } from '../types';

interface TraceAlertOverlayProps {
  status: GameStatus;
  traceLevel: number;
  survivalTime: number;
  completedCommands: number;
  totalTypos: number;
  wpm?: number;
  accuracy?: number;
  streak?: number;
  onRetry: () => void;
  onContinue?: () => void;
}

export const TraceAlertOverlay: React.FC<TraceAlertOverlayProps> = ({
  status,
  traceLevel,
  survivalTime,
  completedCommands,
  totalTypos,
  wpm = 0,
  accuracy = 100,
  streak = 0,
  onRetry,
  onContinue,
}) => {
  const isCritical = traceLevel >= 80 && status === 'ACTIVE';

  // Listen to Enter key when game is in GAME_OVER or VICTORY
  useEffect(() => {
    if (status !== 'GAME_OVER' && status !== 'VICTORY') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (status === 'GAME_OVER') {
          onRetry();
        } else if (status === 'VICTORY') {
          if (onContinue) onContinue();
          else onRetry();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [status, onRetry, onContinue]);

  return (
    <>
      {/* 1. Critical Warning Red Vignette & Border Glow when Trace >= 80% */}
      {isCritical && (
        <div 
          className="fixed inset-0 pointer-events-none z-30 transition-all duration-300 animate-pulse"
          style={{
            boxShadow: 'inset 0 0 70px rgba(239, 68, 68, 0.45), inset 0 0 140px rgba(239, 68, 68, 0.25)',
            border: '2px solid rgba(239, 68, 68, 0.6)',
          }}
          aria-hidden="true"
        >
          <div className="absolute top-16 left-1/2 -translate-x-1/2 bg-red-950/90 border border-red-600 px-4 py-1.5 rounded text-xs font-mono text-red-400 flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.6)]">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
            <span className="font-bold tracking-widest uppercase">
              TRACE EVASION FAILURE IMMINENT [{traceLevel.toFixed(1)}%]
            </span>
          </div>
        </div>
      )}

      {/* 2. GAME OVER Screen Overlay */}
      {status === 'GAME_OVER' && (
        <div className="fixed inset-0 z-40 bg-[#05070b]/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="max-w-lg w-full bg-[#0a0e16] border-2 border-red-600/80 shadow-[0_0_35px_rgba(239,68,68,0.5)] rounded p-6 font-mono text-center relative overflow-hidden animate-glitch-shake">
            {/* Top Warning Banner */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-950/80 border border-red-600/60 rounded text-red-400 text-xs font-bold tracking-widest uppercase mb-4">
              <Skull className="w-4 h-4 text-red-500 animate-pulse" />
              <span>TRACE COMPLETE // SYSTEM COMPROMISED</span>
            </div>

            {/* ASCII Skull Graphic */}
            <pre className="text-[10px] sm:text-xs leading-tight font-mono text-red-500/90 whitespace-pre overflow-x-auto select-none my-2 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]">
{`       .---.
      /     \\
     | () () |
      \\  ^  /
       |||||
       \`'''\``}
            </pre>

            <h1 className="text-xl sm:text-2xl font-black text-red-500 tracking-wider mt-1 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)]">
              FATAL KEYSTROKE DETECTED
            </h1>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Target counter-ICE tracer located your node coordinates. Terminal session terminated by Zurich Security Grid.
            </p>

            {/* Survivability Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 my-5 p-3.5 bg-[#05070b] border border-red-900/60 rounded text-left">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-red-400" /> SURVIVED
                </span>
                <span className="text-sm font-bold text-slate-200">
                  {survivalTime.toFixed(1)}s
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> INJECTIONS
                </span>
                <span className="text-sm font-bold text-emerald-400">
                  {completedCommands}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase flex items-center gap-1">
                  <AlertOctagon className="w-3 h-3 text-red-400" /> FATAL ERRORS
                </span>
                <span className="text-sm font-bold text-red-400">
                  {totalTypos}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
              <button
                onClick={onRetry}
                className="w-full sm:w-auto px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase tracking-widest rounded shadow-[0_0_15px_rgba(239,68,68,0.7)] transition-all flex items-center justify-center gap-2 group"
              >
                <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                <span>[RETRY INFILTRATION]</span>
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-mono">
              Press <strong className="text-red-400">ENTER</strong> to reboot proxy and retry
            </p>
          </div>
        </div>
      )}

      {/* 3. VICTORY Screen Overlay */}
      {status === 'VICTORY' && (
        <div className="fixed inset-0 z-40 bg-[#05070b]/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="max-w-lg w-full bg-[#0a1215] border-2 border-cyber-green/80 shadow-neon-green-strong rounded p-6 font-mono text-center relative overflow-hidden">
            {/* Top Victory Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#00ff66]/10 border border-cyber-green/50 rounded text-cyber-green text-xs font-bold tracking-widest uppercase mb-3">
              <ShieldCheck className="w-4 h-4 text-cyber-green" />
              <span>ACCESS GRANTED // NODE CIPHER BROKEN</span>
            </div>

            {/* ASCII Trophy / Unlocked Vault Art */}
            <pre className="text-[10px] sm:text-xs leading-tight font-mono text-cyber-green whitespace-pre select-none my-2 drop-shadow-[0_0_10px_rgba(0,255,102,0.8)]">
{`   ╔═════════════════════════════════╗
   ║  [DATA EXFILTRATION COMPLETE]   ║
   ║    CIPHER SHIFTED: 100% SUCCESS ║
   ╚═════════════════════════════════╝`}
            </pre>

            <h1 className="text-xl sm:text-2xl font-black text-cyber-green tracking-wider mt-1 glow-green">
              MISSION OBJECTIVE ACHIEVED
            </h1>
            <p className="text-xs text-slate-300 mt-2 max-w-sm mx-auto leading-relaxed">
              All neural schematics extracted. Zurich Gateway root privileges acquired without triggering defensive lockdown.
            </p>

            {/* Performance Stats Grid */}
            <div className="grid grid-cols-4 gap-2 my-5 p-3.5 bg-[#05090e] border border-cyber-green/30 rounded text-left">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase flex items-center gap-1">
                  <Gauge className="w-3 h-3 text-cyber-cyan" /> SPEED
                </span>
                <span className="text-sm font-bold text-cyber-cyan glow-cyan">
                  {wpm} WPM
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-cyber-green" /> ACCURACY
                </span>
                <span className="text-sm font-bold text-cyber-green glow-green">
                  {accuracy.toFixed(1)}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase flex items-center gap-1">
                  <Flame className="w-3 h-3 text-cyber-amber" /> STREAK
                </span>
                <span className="text-sm font-bold text-cyber-amber glow-amber">
                  {streak}x
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> TIME
                </span>
                <span className="text-sm font-bold text-slate-200">
                  {survivalTime.toFixed(1)}s
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
              <button
                onClick={onContinue || onRetry}
                className="w-full sm:w-auto px-6 py-2.5 bg-cyber-green hover:bg-[#39ff14] text-black font-extrabold text-xs uppercase tracking-widest rounded shadow-[0_0_20px_rgba(0,255,102,0.8)] transition-all flex items-center justify-center gap-2 group"
              >
                <span>[PROCEED TO NEXT TARGET]</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onRetry}
                className="w-full sm:w-auto px-4 py-2.5 border border-cyber-panel-border hover:border-cyber-green/40 text-slate-400 hover:text-cyber-green text-xs font-mono uppercase tracking-wider rounded transition-colors"
              >
                [REPLAY MISSION]
              </button>
            </div>
            <p className="text-[10px] text-slate-500 mt-3 font-mono">
              Press <strong className="text-cyber-green">ENTER</strong> to proceed
            </p>
          </div>
        </div>
      )}
    </>
  );
};
