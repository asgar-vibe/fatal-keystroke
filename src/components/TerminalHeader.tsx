import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Wifi,
  Terminal as TerminalIcon,
  Radio,
  Lock,
  AlertTriangle,
  ShieldCheck,
  Zap
} from 'lucide-react';
import type { DifficultyLevel } from '../types/case';

interface TerminalHeaderProps {
  traceLevel: number; // 0.0 to 100.0
  statusText?: string;
  connectionStatus?: string;
  systemVersion?: string;
  difficulty?: DifficultyLevel;
  onDifficultyChange?: (level: DifficultyLevel) => void;
  isCaseSensitive?: boolean;
  onCaseSensitivityToggle?: () => void;
  onScanlinesToggle?: () => void;
  scanlinesActive?: boolean;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({
  traceLevel,
  statusText,
  connectionStatus = 'CONNECTED - ENCRYPTED NODE',
  systemVersion = 'CYBER-INTELLIGENCE DIVISION // AKIRA WAEWBANDHIT (ASGAR)',
  difficulty = 'NORMAL',
  onDifficultyChange,
  isCaseSensitive = true,
  onCaseSensitivityToggle,
  onScanlinesToggle,
  scanlinesActive = true,
}) => {
  const [timestamp, setTimestamp] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimestamp(
        now.toTimeString().split(' ')[0] + '.' + String(Math.floor(now.getMilliseconds() / 100))
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 200);
    return () => clearInterval(interval);
  }, []);

  // Determine Trace Meter styling based on user-requested thresholds:
  // < 50%: Neon Emerald
  // 50% - 79%: Warning Amber
  // >= 80%: Critical Red with pulsing alert
  const isCritical = traceLevel >= 80;
  const isWarning = traceLevel >= 50 && traceLevel < 80;

  const currentStatusText =
    statusText ||
    (isCritical
      ? 'CRITICAL // IMMEDIATE EVASION REQUIRED'
      : isWarning
        ? 'TRACE SIGNAL DETECTED'
        : 'PROXY SECURE');

  const traceTextColor = isCritical
    ? 'text-red-500 font-bold glow-danger'
    : isWarning
      ? 'text-amber-400 font-bold glow-amber'
      : 'text-emerald-400 font-bold glow-green';

  const traceBarBg = isCritical
    ? 'bg-red-600 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse'
    : isWarning
      ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)]'
      : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]';

  const traceBorder = isCritical
    ? 'border-red-600/70 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
    : isWarning
      ? 'border-amber-400/50'
      : 'border-emerald-500/40';

  return (
    <header className="h-14 border-b border-cyber-panel-border bg-cyber-panel/90 backdrop-blur-md px-3 sm:px-4 flex items-center justify-between select-none relative z-20">
      {/* Left: Agency & System Title */}
      <div className="flex items-center space-x-3">
        <div className="p-1.5 bg-[#00ff66]/10 border border-cyber-green/40 rounded-sm">
          <TerminalIcon className="w-5 h-5 text-cyber-green glow-green" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-bold tracking-widest text-xs sm:text-sm text-cyber-green glow-green">
              FATAL KEYSTROKE
            </span>
            <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-cyber-green/10 text-cyber-green border border-cyber-green/30 font-semibold tracking-wider hidden sm:inline">
              MIL-SPEC
            </span>
          </div>
          <p className="text-[10px] text-cyber-muted tracking-wider hidden md:block">
            {systemVersion}
          </p>
        </div>
      </div>

      {/* Middle-Left: Difficulty & Case Sensitivity Selectors */}
      <div className="hidden lg:flex items-center space-x-2.5">
        {/* Difficulty Level Selector */}
        <div className="flex items-center space-x-1 bg-[#05080e] p-0.5 rounded border border-cyber-panel-border text-[10px] font-mono">
          <span className="text-cyber-muted px-1.5 uppercase flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyber-green" /> LEVEL:
          </span>
          {(['EASY', 'NORMAL', 'HARD'] as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => onDifficultyChange?.(level)}
              className={`px-2 py-0.5 rounded transition-all font-bold ${difficulty === level
                  ? level === 'EASY'
                    ? 'bg-cyber-cyan/20 text-cyber-cyan border border-cyber-cyan/50 shadow-neon-cyan'
                    : level === 'HARD'
                      ? 'bg-red-600/20 text-red-400 border border-red-600/50 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                      : 'bg-cyber-green/20 text-cyber-green border border-cyber-green/50 shadow-neon-green'
                  : 'text-cyber-muted hover:text-slate-300'
                }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Case Sensitivity Mode Selector */}
        {onCaseSensitivityToggle && (
          <button
            onClick={onCaseSensitivityToggle}
            title="Toggle Case Sensitivity (Strict: A≠a vs Relaxed: A=a)"
            className={`px-2 py-1 text-[10px] uppercase rounded border transition-colors flex items-center gap-1 font-mono ${isCaseSensitive
                ? 'border-cyber-panel-border text-slate-300 bg-cyber-faint hover:border-slate-500'
                : 'border-cyber-amber/60 text-cyber-amber bg-amber-500/10 shadow-[0_0_8px_rgba(251,191,36,0.3)]'
              }`}
          >
            <span>{isCaseSensitive ? 'CASE: STRICT' : 'CASE: RELAXED [Aa]'}</span>
          </button>
        )}
      </div>

      {/* Middle: Connection Status Indicator */}
      <div className="hidden xl:flex items-center space-x-4 text-xs">
        <div className="flex items-center space-x-2 px-3 py-1 bg-cyber-bg border border-cyber-panel-border rounded">
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-green opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyber-green"></span>
          </div>
          <span className="text-cyber-green glow-green-sm text-[11px] tracking-wide font-medium flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 inline text-cyber-green" />
            {connectionStatus}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-cyber-muted text-[11px]">
          <Lock className="w-3.5 h-3.5 text-cyber-cyan" />
          <span className="text-cyber-cyan/80">PROXY: 14.201.78.33 [TOR-HEX]</span>
        </div>
      </div>

      {/* Right: Trace Detection Warning Meter & Utilities */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Trace Warning Indicator */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-1.5">
            {isCritical ? (
              <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
            ) : isWarning ? (
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            )}
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 hidden sm:inline">
              TRACE:
            </span>
            <span className={`text-[10px] font-mono tracking-wider hidden md:inline ${traceTextColor}`}>
              {currentStatusText}
            </span>
            <span className={`text-xs font-mono font-bold ${traceTextColor} ml-1`}>
              [{traceLevel.toFixed(1)}%]
            </span>
          </div>

          {/* Dynamic Visual Progress Bar */}
          <div className={`w-28 sm:w-44 h-2 bg-[#0a0f16] rounded-full overflow-hidden mt-1 border ${traceBorder}`}>
            <div
              className={`h-full transition-all duration-150 ${traceBarBg}`}
              style={{ width: `${Math.min(100, Math.max(0, traceLevel))}%` }}
            />
          </div>
        </div>

        {/* Real-time System Clock */}
        <div className="hidden lg:flex flex-col text-right pl-3 border-l border-cyber-panel-border/60">
          <span className="text-[10px] text-cyber-muted uppercase tracking-wider">NET CLOCK</span>
          <span className="text-xs font-mono text-cyber-green font-semibold">{timestamp}</span>
        </div>

        {/* CRT Scanline Toggle Button */}
        {onScanlinesToggle && (
          <button
            onClick={onScanlinesToggle}
            title="Toggle CRT Scanline Overlay"
            className={`px-2 py-1 text-[10px] uppercase rounded border transition-colors flex items-center gap-1 ${scanlinesActive
                ? 'border-cyber-green/50 text-cyber-green bg-cyber-green/10 hover:bg-cyber-green/20'
                : 'border-cyber-muted text-cyber-muted hover:text-slate-300'
              }`}
          >
            <Radio className="w-3 h-3" />
            <span className="hidden sm:inline">CRT: {scanlinesActive ? 'ON' : 'OFF'}</span>
          </button>
        )}
      </div>
    </header>
  );
};
