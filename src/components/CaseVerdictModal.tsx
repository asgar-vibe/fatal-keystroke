import React, { useEffect } from 'react';
import { 
  CheckCircle2, 
  UserX, 
  FileCheck, 
  RotateCcw, 
  ArrowRight, 
  Clock, 
  Gauge, 
  Flame,
  Scale
} from 'lucide-react';
import type { CaseFile, ClueItem, DetectiveRank } from '../types/case';

interface CaseVerdictModalProps {
  caseFile: CaseFile;
  unlockedClues: ClueItem[];
  survivalTime: number;
  wpm: number;
  accuracy: number;
  streak: number;
  fatalTypos: number;
  isOpen: boolean;
  onRestartCase: () => void;
  onArchiveCase?: () => void;
}

export const CaseVerdictModal: React.FC<CaseVerdictModalProps> = ({
  caseFile,
  unlockedClues,
  survivalTime,
  wpm,
  accuracy,
  streak,
  fatalTypos,
  isOpen,
  onRestartCase,
  onArchiveCase,
}) => {
  if (!isOpen) return null;

  // Calculate Detective Rank based on speed, accuracy, and error count
  const calculateRank = (): DetectiveRank => {
    if (accuracy >= 97 && wpm >= 60 && fatalTypos <= 2) {
      return 'RANK S [MASTER CYBER-DETECTIVE]';
    }
    if (accuracy >= 93 && wpm >= 45) {
      return 'RANK A [SENIOR INTRUSION AGENT]';
    }
    if (accuracy >= 85) {
      return 'RANK B [FIELD INFILTRATOR]';
    }
    return 'RANK C [ROGUE KEYSTROKER]';
  };

  const rank = calculateRank();
  const isRankS = rank.startsWith('RANK S');
  const isRankA = rank.startsWith('RANK A');

  const rankColor = isRankS
    ? 'text-yellow-400 border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.5)]'
    : isRankA
    ? 'text-cyber-green border-cyber-green/50 shadow-neon-green'
    : 'text-cyber-cyan border-cyber-cyan/50 shadow-neon-cyan';

  // Listen to Enter key to confirm verdict
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (onArchiveCase) onArchiveCase();
        else onRestartCase();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onArchiveCase, onRestartCase]);

  return (
    <div className="fixed inset-0 z-50 bg-[#04060a]/92 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="max-w-2xl w-full bg-[#080d15] border-2 border-cyber-green/70 shadow-neon-green-strong rounded-lg p-6 font-mono text-left relative overflow-hidden my-8">
        {/* Top Header Banner */}
        <div className="flex items-center justify-between pb-3 border-b border-cyber-panel-border/80">
          <div className="flex items-center space-x-2">
            <Scale className="w-5 h-5 text-cyber-green glow-green" />
            <span className="text-sm font-bold tracking-widest text-cyber-green glow-green uppercase">
              CASE CLOSED // FORENSIC VERDICT CONFIRMED
            </span>
          </div>
          <span className="text-xs px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30">
            {caseFile.caseCode}
          </span>
        </div>

        {/* Rating & Performance Badge */}
        <div className="mt-4 p-3 bg-[#05080e] rounded border border-cyber-panel-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-cyber-muted uppercase tracking-wider block">
              DETECTIVE INTRUSION EVALUATION:
            </span>
            <span className={`text-sm font-extrabold tracking-wide uppercase px-2 py-0.5 rounded border inline-block mt-0.5 ${rankColor}`}>
              {rank}
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-mono">
            <div>
              <span className="text-[10px] text-cyber-muted block flex items-center gap-1">
                <Gauge className="w-3 h-3 text-cyber-cyan" /> SPEED
              </span>
              <span className="font-bold text-cyber-cyan text-sm">{wpm} WPM</span>
            </div>
            <div>
              <span className="text-[10px] text-cyber-muted block flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyber-green" /> ACCURACY
              </span>
              <span className="font-bold text-cyber-green text-sm">{accuracy.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-[10px] text-cyber-muted block flex items-center gap-1">
                <Flame className="w-3 h-3 text-cyber-amber" /> STREAK
              </span>
              <span className="font-bold text-cyber-amber text-sm">{streak}x</span>
            </div>
            <div>
              <span className="text-[10px] text-cyber-muted block flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> TIME
              </span>
              <span className="font-bold text-slate-200 text-sm">{survivalTime.toFixed(1)}s</span>
            </div>
          </div>
        </div>

        {/* Culprit Profile Dossier Card */}
        <div className="mt-4 p-4 rounded bg-[#0a111a] border border-cyber-cyan/30 shadow-[0_0_15px_rgba(34,211,238,0.1)] space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-red-950/60 border border-red-500/50 rounded">
                <UserX className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <span className="text-[10px] text-red-400 uppercase tracking-wider font-bold">
                  PRIMARY PERPETRATOR IDENTIFIED
                </span>
                <h3 className="text-base font-bold text-slate-100">
                  {caseFile.conclusion.culprit}
                </h3>
              </div>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-700/60 font-bold uppercase">
              INDICTED
            </span>
          </div>

          <div className="text-xs pt-1 border-t border-cyber-panel-border/60">
            <span className="text-cyber-muted text-[10px] uppercase block tracking-wider">
              CRIMINAL MOTIVE & CHARGES:
            </span>
            <p className="text-cyber-amber font-semibold text-xs mt-0.5">
              {caseFile.conclusion.motive}
            </p>
          </div>

          <div className="text-xs text-slate-300 font-sans leading-relaxed pt-1 border-t border-cyber-panel-border/60">
            <span className="text-cyber-muted font-mono text-[10px] uppercase block tracking-wider mb-1">
              INVESTIGATION SUMMARY:
            </span>
            <p>{caseFile.conclusion.verdictSummary}</p>
          </div>
        </div>

        {/* Unlocked Evidence Proof Ledger */}
        <div className="mt-4 space-y-2">
          <span className="text-[10px] font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-cyber-green" />
            FORENSIC EVIDENCE RECOVERY LEDGER ({unlockedClues.length} EXHIBITS)
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {caseFile.conclusion.evidenceSummary.map((item, idx) => (
              <div 
                key={idx} 
                className="p-2.5 rounded bg-[#05080e] border border-cyber-green/20 flex items-start gap-2"
              >
                <span className="text-cyber-green font-bold text-[11px] select-none">
                  #{idx + 1}
                </span>
                <span className="text-slate-300 text-[11px] leading-snug">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-6 pt-4 border-t border-cyber-panel-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onRestartCase}
            className="w-full sm:w-auto px-4 py-2 border border-cyber-panel-border hover:border-cyber-green/50 text-slate-400 hover:text-cyber-green text-xs font-mono uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>[RE-RUN INVESTIGATION]</span>
          </button>

          <button
            onClick={onArchiveCase || onRestartCase}
            className="w-full sm:w-auto px-6 py-2.5 bg-cyber-green hover:bg-[#39ff14] text-black font-extrabold text-xs uppercase tracking-widest rounded shadow-[0_0_20px_rgba(0,255,102,0.8)] transition-all flex items-center justify-center gap-2 group"
          >
            <span>[ARCHIVE DOSSIER & PROSECUTE]</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <p className="text-[10px] text-slate-500 text-center mt-3 font-mono">
          Press <strong className="text-cyber-green">ENTER</strong> to archive dossier and complete verdict
        </p>
      </div>
    </div>
  );
};
