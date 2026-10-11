import React, { useState } from 'react';
import { 
  FolderLock, 
  Target, 
  ShieldCheck, 
  FileText, 
  Key, 
  Binary, 
  Lock,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Search
} from 'lucide-react';
import type { CaseFile, ClueItem, ClueCategory } from '../types/case';

interface CaseDossierPanelProps {
  activeCase: CaseFile;
  currentStageIndex: number;
  unlockedClues: ClueItem[];
  onSelectClue?: (clue: ClueItem) => void;
}

export const CaseDossierPanel: React.FC<CaseDossierPanelProps> = ({
  activeCase,
  currentStageIndex,
  unlockedClues,
  onSelectClue,
}) => {
  const [showFullBriefing, setShowFullBriefing] = useState<boolean>(false);
  const currentStage = activeCase.stages[Math.min(currentStageIndex, activeCase.stages.length - 1)];

  // Helper for clue category tag colors
  const getCategoryBadge = (category: ClueCategory) => {
    switch (category) {
      case 'FINANCIAL':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/40 shadow-[0_0_8px_rgba(251,191,36,0.2)]';
      case 'INTERCEPT':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/40 shadow-[0_0_8px_rgba(34,211,238,0.2)]';
      case 'IDENTITY':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/40 shadow-[0_0_8px_rgba(251,113,133,0.2)]';
      case 'CREDENTIAL':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-[0_0_8px_rgba(52,211,153,0.2)]';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <aside className="w-full md:w-96 lg:w-[420px] flex-shrink-0 border-r border-cyber-panel-border bg-cyber-panel/60 backdrop-blur-sm flex flex-col h-full overflow-hidden select-none">
      {/* Panel Top Label */}
      <div className="px-4 py-2.5 border-b border-cyber-panel-border flex items-center justify-between bg-[#080d15]/80">
        <div className="flex items-center space-x-2 text-cyber-green text-xs font-semibold tracking-wider uppercase">
          <FolderLock className="w-4 h-4 text-cyber-green" />
          <span>INVESTIGATION DOSSIER</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-cyan/10 border border-cyber-cyan/30 text-cyber-cyan tracking-wider font-mono">
          {activeCase.caseCode}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Target Profile Card */}
        <div className="cyber-corner-box border border-cyber-panel-border p-3.5 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] text-cyber-muted uppercase tracking-wider">TARGET PROFILE</div>
              <h2 className="text-sm font-bold text-cyber-green glow-green flex items-center gap-1.5 mt-0.5">
                <Target className="w-4 h-4 text-cyber-green" />
                {activeCase.targetEntity}
              </h2>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30 font-mono font-bold">
              {currentStageIndex >= activeCase.stages.length ? 'COMPROMISED' : 'PENETRATING'}
            </span>
          </div>

          {/* Operation Phase Indicator */}
          <div className="bg-[#05070b]/90 border border-cyber-panel-border/80 p-2 rounded flex items-center justify-between text-[11px] font-mono">
            <div className="flex items-center gap-1.5 text-cyber-cyan">
              <Layers className="w-3.5 h-3.5" />
              <span className="font-bold">
                PHASE {Math.min(currentStageIndex + 1, activeCase.stages.length)} OF {activeCase.stages.length}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 truncate max-w-[180px]">
              {currentStage?.title || 'Case Solved'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-cyber-panel-border/60">
            <div>
              <span className="text-cyber-muted block text-[10px]">SECURITY LEVEL</span>
              <span className="text-cyber-amber font-mono font-semibold">{activeCase.securityThreatLevel}</span>
            </div>
            <div>
              <span className="text-cyber-muted block text-[10px]">ACTIVE NODE</span>
              <span className="text-cyber-cyan font-mono">{currentStage?.securityNode || 'ALL NODES BREACHED'}</span>
            </div>
            <div>
              <span className="text-cyber-muted block text-[10px]">SUBNET / IP</span>
              <span className="text-slate-300 font-mono">{activeCase.targetIP}</span>
            </div>
            <div>
              <span className="text-cyber-muted block text-[10px]">CLASSIFICATION</span>
              <span className="text-slate-300 font-mono text-[9px] truncate block">{activeCase.classification}</span>
            </div>
          </div>

          {/* Detective Mission Briefing Collapsible */}
          <div className="pt-2 border-t border-cyber-panel-border/60">
            <button
              onClick={() => setShowFullBriefing(!showFullBriefing)}
              className="w-full text-cyber-muted text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-cyber-green" /> MISSION BRIEFING
              </span>
              <span className="text-cyber-cyan flex items-center text-[9px]">
                {showFullBriefing ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </button>
            <p className={`text-xs text-slate-300 leading-relaxed font-sans font-medium bg-[#05070b]/60 p-2 rounded border border-cyber-panel-border/50 ${
              showFullBriefing ? '' : 'line-clamp-2'
            }`}>
              {activeCase.briefing}
            </p>
          </div>
        </div>

        {/* Dynamic ASCII Security Topology Diagram */}
        <div className="border border-cyber-panel-border rounded bg-[#040609]/90 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold text-cyber-cyan tracking-wider flex items-center gap-1.5 uppercase">
              <Binary className="w-3.5 h-3.5 text-cyber-cyan" />
              TOPOLOGY SCHEMATIC // {currentStage?.securityNode || 'GATEWAY BREACHED'}
            </span>
            <span className="text-[9px] text-cyber-green font-mono flex items-center gap-1 animate-pulse">
              <Cpu className="w-3 h-3 text-cyber-green" /> LIVE TAP
            </span>
          </div>
          <pre className="text-[9px] leading-tight font-mono text-cyber-green/90 whitespace-pre overflow-x-auto p-1.5 bg-[#030406] rounded border border-cyber-panel-border/40 select-text transition-all duration-300">
            {currentStage?.asciiArt || activeCase.stages[0]?.asciiArt}
          </pre>
        </div>

        {/* Progressive Decrypted Evidence & Clue Stream */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-300 tracking-wider uppercase flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyber-green" />
              DECRYPTED EVIDENCE STREAM
            </span>
            <span className="text-[10px] text-cyber-green font-mono">
              {unlockedClues.length} / {activeCase.stages.length} UNLOCKED
            </span>
          </div>

          <div className="space-y-2.5">
            {activeCase.stages.map((stage) => {
              const isUnlocked = unlockedClues.some(c => c.id === stage.unlockedClue.id);
              const clue = stage.unlockedClue;

              return (
                <div
                  key={stage.stageIndex}
                  onClick={() => isUnlocked && onSelectClue && onSelectClue(clue)}
                  className={`p-3 rounded border text-xs transition-all duration-300 ${
                    isUnlocked 
                      ? 'border-cyber-green/40 bg-[#00ff66]/[0.04] shadow-[0_0_12px_rgba(0,255,102,0.06)] hover:border-cyber-green/80 cursor-pointer' 
                      : 'border-cyber-panel-border/70 bg-[#060a10]/50 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center space-x-1.5">
                      {isUnlocked ? (
                        <Key className="w-3.5 h-3.5 text-cyber-green glow-green" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-cyber-muted" />
                      )}
                      
                      {/* Clue Category Tag */}
                      <span className={`font-mono font-bold text-[9px] px-1.5 py-0.2 rounded border ${getCategoryBadge(clue.category)}`}>
                        [{clue.category}]
                      </span>

                      <span className={`font-semibold truncate max-w-[170px] ${
                        isUnlocked ? 'text-slate-100' : 'text-slate-500'
                      }`}>
                        {isUnlocked ? clue.headline : `PHASE ${stage.stageIndex + 1} ENCRYPTED`}
                      </span>
                    </div>

                    <span className="text-[9px] text-cyber-muted font-mono">
                      {isUnlocked ? clue.timestamp : `LOCKED`}
                    </span>
                  </div>

                  {/* Evidence Snippet Content */}
                  <p className={`text-[11px] leading-relaxed ${
                    isUnlocked ? 'text-slate-300 font-sans' : 'text-slate-500 italic font-mono'
                  }`}>
                    {isUnlocked 
                      ? clue.snippet 
                      : `[ENCRYPTED CIPHER BLOB - EXECUTE PHASE ${stage.stageIndex + 1} TO DECIPHER]`}
                  </p>

                  {/* Metadata Tag */}
                  {isUnlocked && clue.metadata && (
                    <div className="mt-2 pt-1.5 border-t border-cyber-panel-border/50 flex items-center justify-between text-[9px] font-mono text-cyber-cyan/90">
                      <span>{clue.metadata}</span>
                      <Search className="w-3 h-3 text-cyber-cyan/70 ml-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Case Dossier Footer Status */}
      <div className="p-3 border-t border-cyber-panel-border bg-[#070b10] flex items-center justify-between text-[10px] text-cyber-muted font-mono">
        <span className="flex items-center gap-1">
          <Fingerprint className="w-3.5 h-3.5 text-cyber-green" />
          CASE ID: {activeCase.id}
        </span>
        <span className="text-cyber-green font-bold">
          {unlockedClues.length === activeCase.stages.length ? 'DOSSIER COMPLETE' : 'INFILTRATING'}
        </span>
      </div>
    </aside>
  );
};
