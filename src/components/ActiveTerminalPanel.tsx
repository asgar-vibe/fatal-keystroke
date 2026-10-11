import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal as TerminalIcon, 
  CornerDownLeft, 
  Activity, 
  Gauge, 
  Flame, 
  CheckCircle2, 
  AlertOctagon,
  Trash2,
  SkipForward,
  Keyboard
} from 'lucide-react';
import type { TerminalLogEntry, TypingEngineMetrics } from '../types';
import { useTypingEngine } from '../hooks/useTypingEngine';

interface ActiveTerminalPanelProps {
  logs: TerminalLogEntry[];
  targetCommand: string;
  commandProgress?: { current: number; total: number };
  stageTitle?: string;
  isCaseSensitive?: boolean;
  isActive?: boolean;
  onStart?: () => void;
  onCommandComplete: (command: string, metrics: TypingEngineMetrics) => void;
  onTypo?: (expected: string, actual: string) => void;
  onMetricsUpdate?: (metrics: TypingEngineMetrics) => void;
  onClearLogs?: () => void;
  onNextTarget?: () => void;
}

export const ActiveTerminalPanel: React.FC<ActiveTerminalPanelProps> = ({
  logs,
  targetCommand,
  commandProgress,
  stageTitle,
  isCaseSensitive = true,
  isActive = true,
  onStart,
  onCommandComplete,
  onTypo,
  onMetricsUpdate,
  onClearLogs,
  onNextTarget,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [isGlitching, setIsGlitching] = useState<boolean>(false);
  const glitchTimeoutRef = useRef<number | null>(null);

  // Trigger glitch animation on typing mistake
  const handleTypo = (expected: string, actual: string) => {
    setIsGlitching(true);
    if (glitchTimeoutRef.current) {
      window.clearTimeout(glitchTimeoutRef.current);
    }
    glitchTimeoutRef.current = window.setTimeout(() => {
      setIsGlitching(false);
    }, 250);

    onTypo?.(expected, actual);
  };

  const handleComplete = () => {
    onCommandComplete(targetCommand, metrics);
  };

  // Wire custom typing engine hook
  const {
    charInfos,
    currentIndex,
    metrics,
  } = useTypingEngine({
    targetText: targetCommand,
    isActive,
    allowBackspace: true,
    isCaseSensitive,
    onStart,
    onComplete: handleComplete,
    onError: handleTypo,
  });

  // Report metrics update up to parent
  useEffect(() => {
    onMetricsUpdate?.(metrics);
  }, [metrics, onMetricsUpdate]);

  // Auto-scroll terminal log history to the bottom on new logs
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Clean up glitch timeout on unmount
  useEffect(() => {
    return () => {
      if (glitchTimeoutRef.current) {
        window.clearTimeout(glitchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main 
      className="flex-1 flex flex-col h-full bg-[#05070b]/95 relative overflow-hidden select-none"
    >
      {/* Shell Header */}
      <div className="h-10 border-b border-cyber-panel-border bg-[#080d15] px-4 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-xs font-mono">
          <TerminalIcon className="w-4 h-4 text-cyber-green glow-green" />
          <span className="text-cyber-green glow-green font-semibold">root@terminal-node-7: /</span>
          <span className="text-cyber-muted hidden sm:inline">[BASH 5.2.15-RELEASE]</span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Case Sensitivity Badge */}
          <span className={`text-[10px] px-2 py-0.5 rounded font-mono border hidden sm:inline ${
            isCaseSensitive
              ? 'border-cyber-panel-border text-cyber-muted bg-cyber-bg'
              : 'border-cyber-amber/50 text-cyber-amber bg-amber-500/10 shadow-[0_0_8px_rgba(251,191,36,0.2)]'
          }`}>
            {isCaseSensitive ? 'CASE: STRICT' : 'CASE: RELAXED [Aa]'}
          </span>

          {onClearLogs && (
            <button
              onClick={onClearLogs}
              className="text-[10px] text-cyber-muted hover:text-slate-300 flex items-center gap-1 px-2 py-0.5 rounded border border-cyber-panel-border hover:bg-cyber-panel transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">CLEAR</span>
            </button>
          )}
          {onNextTarget && (
            <button
              onClick={onNextTarget}
              className="text-[10px] text-cyber-cyan border border-cyber-cyan/30 bg-cyber-cyan/10 hover:bg-cyber-cyan/20 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
            >
              <SkipForward className="w-3 h-3" />
              <span>SKIP CMD</span>
            </button>
          )}
        </div>
      </div>

      {/* Terminal History Logs Area */}
      <div 
        ref={logContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-xs select-text scroll-smooth"
      >
        <div className="text-[11px] text-cyber-muted pb-2 border-b border-cyber-panel-border/40 font-mono flex items-center gap-2">
          <Keyboard className="w-3.5 h-3.5 text-cyber-green" />
          <span>[CYBER-ENGINE ACTIVE] DIRECT HARDWARE KEYSTROKE CAPTURE ENABLED. TYPE THE PROTOCOL TO EXECUTE.</span>
        </div>

        {logs.map((log) => {
          let typeColor = 'text-slate-300';
          if (log.type === 'cmd') typeColor = 'text-cyber-cyan font-bold';
          if (log.type === 'sys') typeColor = 'text-cyber-muted';
          if (log.type === 'success') typeColor = 'text-cyber-green font-semibold glow-green-sm';
          if (log.type === 'warn') typeColor = 'text-cyber-amber';
          if (log.type === 'error' || log.type === 'trace') typeColor = 'text-cyber-danger font-semibold glow-danger';

          return (
            <div key={log.id} className="flex items-start space-x-2 leading-relaxed">
              <span className="text-cyber-muted text-[10px] select-none pt-0.5 font-mono">
                [{log.timestamp}]
              </span>
              {log.promptPrefix && (
                <span className="text-cyber-green/80 font-bold select-none">
                  {log.promptPrefix}
                </span>
              )}
              <span className={`${typeColor} break-all`}>
                {log.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* Active Command Input Area */}
      <div className="border-t border-cyber-panel-border bg-[#070b12] p-4">
        <div className="text-[10px] text-cyber-muted uppercase tracking-wider mb-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyber-green animate-ping" />
            <span className="font-semibold text-slate-300">
              {stageTitle ? `${stageTitle.toUpperCase()} // ` : 'ACTIVE SEQUENCE // '}
              {commandProgress ? (
                <span className="text-cyber-cyan font-bold">
                  LINE {commandProgress.current} OF {commandProgress.total}
                </span>
              ) : (
                'INJECTION'
              )}
            </span>
          </div>
          <span className="text-[10px] text-cyber-green font-mono">
            {currentIndex} / {targetCommand.length} CHARS ({Math.round((currentIndex / targetCommand.length) * 100)}%)
          </span>
        </div>

        {/* Prompt Container with Glitch Shake & Glow on Typo */}
        <div 
          className={`flex items-center space-x-2 bg-[#040609] p-3 rounded border transition-all duration-150 ${
            isGlitching 
              ? 'animate-glitch-shake border-cyber-danger shadow-neon-danger bg-red-950/20' 
              : 'border-cyber-green/40 shadow-neon-green hover:border-cyber-green/70'
          }`}
        >
          <span className="text-cyber-green font-bold font-mono text-xs sm:text-sm select-none whitespace-nowrap glow-green">
            root@net:/#
          </span>
          
          {/* Character-by-Character High-Precision Visual Rendering */}
          <div className="flex-1 overflow-x-auto whitespace-nowrap font-mono text-xs sm:text-sm tracking-wider py-0.5">
            {charInfos.map((info, idx) => {
              const isSpace = info.expected === ' ';
              const displayChar = isSpace ? '\u00A0' : info.expected;

              if (info.state === 'correct') {
                return (
                  <span
                    key={idx}
                    className="text-[#39FF14] font-bold glow-green"
                  >
                    {displayChar}
                  </span>
                );
              }

              if (info.state === 'incorrect') {
                return (
                  <span
                    key={idx}
                    className="text-white bg-cyber-danger/80 px-[1px] rounded-[1px] font-bold shadow-[0_0_8px_rgba(255,42,95,0.8)]"
                  >
                    {isSpace ? '␣' : (info.typed || displayChar)}
                  </span>
                );
              }

              if (info.state === 'current') {
                return (
                  <span
                    key={idx}
                    className="inline-flex items-center"
                  >
                    <span className="bg-cyber-green text-black font-extrabold px-[1px] rounded-[1px] shadow-[0_0_10px_#00ff66] animate-pulse">
                      {isSpace ? '␣' : displayChar}
                    </span>
                  </span>
                );
              }

              // Upcoming / Pending Characters
              return (
                <span
                  key={idx}
                  className="text-slate-600/80 font-normal"
                >
                  {displayChar}
                </span>
              );
            })}

            {/* Trailing Cursor if all characters entered */}
            {currentIndex >= targetCommand.length && (
              <span className="animate-cursor-blink text-cyber-green glow-green font-bold select-none ml-0.5">
                █
              </span>
            )}
          </div>

          <div className="text-cyber-green/60 text-xs flex items-center pr-1 select-none">
            <CornerDownLeft className="w-4 h-4" />
          </div>
        </div>

        {/* Typing Instructions & Shortcuts */}
        <div className="text-[10px] text-cyber-muted mt-2 flex items-center justify-between font-mono">
          <span>* Any keystroke is captured globally. Use <strong className="text-slate-300">Backspace</strong> to correct typos.</span>
          <span className="text-cyber-cyan/80">STATUS: {metrics.isStarted ? 'INJECTING' : 'IDLE - PRESS ANY KEY'}</span>
        </div>
      </div>

      {/* Bottom Metrics Bar */}
      <div className="h-12 border-t border-cyber-panel-border bg-cyber-panel/90 px-4 flex items-center justify-between select-none">
        <div className="flex items-center space-x-4 sm:space-x-8 text-xs font-mono">
          {/* WPM */}
          <div className="flex items-center space-x-1.5">
            <Gauge className="w-4 h-4 text-cyber-cyan" />
            <span className="text-cyber-muted uppercase text-[10px]">WPM:</span>
            <span className="text-cyber-cyan font-bold glow-cyan text-sm">
              {metrics.wpm}
            </span>
          </div>

          {/* Accuracy */}
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 text-cyber-green" />
            <span className="text-cyber-muted uppercase text-[10px]">ACCURACY:</span>
            <span className="text-cyber-green font-bold glow-green text-sm">
              {metrics.accuracy.toFixed(1)}%
            </span>
          </div>

          {/* Streak */}
          <div className="flex items-center space-x-1.5">
            <Flame className="w-4 h-4 text-cyber-amber" />
            <span className="text-cyber-muted uppercase text-[10px]">STREAK:</span>
            <span className="text-cyber-amber font-bold glow-amber text-sm">
              {metrics.streak}x
            </span>
          </div>

          {/* Errors Count */}
          <div className="hidden sm:flex items-center space-x-1.5">
            <AlertOctagon className="w-4 h-4 text-cyber-danger" />
            <span className="text-cyber-muted uppercase text-[10px]">ERRORS:</span>
            <span className="text-cyber-danger font-bold text-sm">
              {metrics.errorCount}
            </span>
          </div>

          {/* Total Keystrokes */}
          <div className="hidden md:flex items-center space-x-1.5">
            <Activity className="w-4 h-4 text-slate-400" />
            <span className="text-cyber-muted uppercase text-[10px]">KEYSTROKES:</span>
            <span className="text-slate-300 font-bold text-sm">
              {metrics.totalKeystrokes}
            </span>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2">
          <span 
            className={`inline-block w-2 h-2 rounded-full ${
              !isActive
                ? 'bg-red-500'
                : metrics.isStarted
                ? 'bg-cyber-green animate-ping'
                : 'bg-cyber-cyan animate-pulse'
            }`} 
          />
          <span className={`text-[10px] font-mono uppercase tracking-wider hidden sm:inline ${
            !isActive ? 'text-red-400 font-bold' : 'text-cyber-green'
          }`}>
            {!isActive ? 'TERMINAL LOCKED' : metrics.isStarted ? 'INTRUSION RUNNING' : 'SYSTEM READY'}
          </span>
        </div>
      </div>
    </main>
  );
};
