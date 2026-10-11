import React, { useState, useCallback } from 'react';
import { TerminalHeader } from './components/TerminalHeader';
import { CaseDossierPanel } from './components/CaseDossierPanel';
import { ActiveTerminalPanel } from './components/ActiveTerminalPanel';
import { ScanlineOverlay } from './components/ScanlineOverlay';
import { TraceAlertOverlay } from './components/TraceAlertOverlay';
import { CaseVerdictModal } from './components/CaseVerdictModal';
import { CASE_BLACK_CHIMERA } from './data/cases';
import { INITIAL_TERMINAL_LOGS } from './data/mockCaseData';
import { useTraceEngine } from './hooks/useTraceEngine';
import type { TerminalLogEntry, TypingEngineMetrics } from './types';
import type { CaseFile, ClueItem, DifficultyLevel } from './types/case';

export const App: React.FC = () => {
  const [activeCase] = useState<CaseFile>(CASE_BLACK_CHIMERA);
  const [currentStageIndex, setCurrentStageIndex] = useState<number>(0);
  const [currentLineIndex, setCurrentLineIndex] = useState<number>(0);
  const [unlockedClues, setUnlockedClues] = useState<ClueItem[]>([]);
  const [logs, setLogs] = useState<TerminalLogEntry[]>(INITIAL_TERMINAL_LOGS);
  const [scanlinesActive, setScanlinesActive] = useState<boolean>(true);
  const [showVerdictModal, setShowVerdictModal] = useState<boolean>(false);

  // Difficulty & Case-Insensitive Mode Options
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('NORMAL');
  const [isCaseSensitive, setIsCaseSensitive] = useState<boolean>(true);
  
  // Real-time metrics snapshot from typing engine
  const [currentMetrics, setCurrentMetrics] = useState<TypingEngineMetrics>({
    wpm: 0,
    accuracy: 100,
    streak: 0,
    errorCount: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0,
    elapsedTime: 0,
    isStarted: false,
    isCompleted: false,
  });

  const getNowTimestamp = () => {
    const d = new Date();
    return d.toTimeString().split(' ')[0];
  };

  const generateLogId = (prefix: string) => 
    `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const currentStage = activeCase.stages[Math.min(currentStageIndex, activeCase.stages.length - 1)];
  const currentTargetCommand = currentStage?.commands?.[currentLineIndex] || currentStage?.command || '';

  // Difficulty scaling multipliers
  const difficultyConfig = {
    EASY: { timeMultiplier: 1.4, typoPenalty: 3.0, lineRelief: 8.0, stageRelief: 25.0 },
    NORMAL: { timeMultiplier: 1.0, typoPenalty: 5.0, lineRelief: 6.0, stageRelief: 20.0 },
    HARD: { timeMultiplier: 0.75, typoPenalty: 7.5, lineRelief: 4.5, stageRelief: 15.0 },
  }[difficulty];

  // Dynamic time limit and passive trace rate based on stage & difficulty
  const effectiveTimeLimit = Math.round(
    (currentStage?.timeLimitSeconds || 65) * difficultyConfig.timeMultiplier
  );
  const currentPassiveRate = Math.round((100 / effectiveTimeLimit) * 100) / 100;

  // Total lines across all 10 stages
  const totalMissionCommands = activeCase.stages.reduce(
    (acc, stage) => acc + (stage.commands?.length || 1), 
    0
  );

  // Game Over callback
  const handleGameOver = useCallback(() => {
    const time = getNowTimestamp();
    setLogs((prev) => [
      ...prev,
      {
        id: generateLogId('game-over'),
        timestamp: time,
        type: 'trace',
        text: '[FATAL ERROR] 100% TRACE COMPLETE // Sentinel Counter-ICE neutralized local host. Terminal killed.',
      }
    ]);
  }, []);

  // Victory callback
  const handleVictory = useCallback(() => {
    const time = getNowTimestamp();
    setLogs((prev) => [
      ...prev,
      {
        id: generateLogId('victory'),
        timestamp: time,
        type: 'success',
        text: '[CASE SOLVED] All 10 security tiers penetrated. Master forensic dossier compiled.',
      }
    ]);
    setShowVerdictModal(true);
  }, []);

  // Initialize Trace Engine (Tension Loop)
  const {
    traceLevel,
    status: traceStatus,
    survivalTime,
    totalTypos,
    completedCommands,
    statusLabel,
    start: startTrace,
    addTypoPenalty,
    applyCompletionRelief,
    reset: resetTraceEngine,
  } = useTraceEngine({
    initialTrace: 0.0,
    passiveRate: currentPassiveRate,
    typoPenalty: difficultyConfig.typoPenalty,
    completionRelief: difficultyConfig.stageRelief,
    targetCommandCount: totalMissionCommands,
    onGameOver: handleGameOver,
    onVictory: handleVictory,
  });

  // Called when typing the very first keystroke
  const handleTypingStart = () => {
    startTrace();
  };

  // Called on each typo (scaled by difficulty penalty)
  const handleTypo = (_expected: string, _actual: string) => {
    addTypoPenalty(difficultyConfig.typoPenalty);
  };

  const handleMetricsUpdate = useCallback((m: TypingEngineMetrics) => {
    setCurrentMetrics(m);
  }, []);

  // Difficulty change handler with terminal announcement
  const handleDifficultyChange = (newLevel: DifficultyLevel) => {
    setDifficulty(newLevel);
    const newMultiplier = newLevel === 'EASY' ? 1.4 : newLevel === 'HARD' ? 0.75 : 1.0;
    const newAllocated = Math.round((currentStage?.timeLimitSeconds || 65) * newMultiplier);
    setLogs((prev) => [
      ...prev,
      {
        id: generateLogId('setting'),
        timestamp: getNowTimestamp(),
        type: 'sys',
        text: `[PARAM RECONFIG] Difficulty set to ${newLevel}. Allocated stage timer shifted to ${newAllocated}s (Penalty: +${newLevel === 'EASY' ? 3 : newLevel === 'HARD' ? 7.5 : 5}%).`,
      }
    ]);
  };

  // Case sensitivity toggle with terminal announcement
  const handleCaseSensitivityToggle = () => {
    const nextMode = !isCaseSensitive;
    setIsCaseSensitive(nextMode);
    setLogs((prev) => [
      ...prev,
      {
        id: generateLogId('case-toggle'),
        timestamp: getNowTimestamp(),
        type: 'sys',
        text: `[INPUT MODE SHIFT] Case Sensitivity: ${nextMode ? 'STRICT [A≠a]' : 'RELAXED [A=a: Case Insensitive Mode Active]'}`,
      }
    ]);
  };

  // Called when command for current line is successfully completed
  const handleCommandComplete = (command: string, metrics: TypingEngineMetrics) => {
    setCurrentMetrics(metrics);
    const time = getNowTimestamp();
    const pid = Math.floor(Math.random() * 8000 + 1000);
    const totalLinesInStage = currentStage.commands?.length || 1;
    const isLastLineOfStage = currentLineIndex + 1 >= totalLinesInStage;

    if (!isLastLineOfStage) {
      // Intermediate line within current stage
      const nextLine = currentLineIndex + 1;
      setCurrentLineIndex(nextLine);
      applyCompletionRelief(difficultyConfig.lineRelief);

      setLogs((prev) => [
        ...prev,
        {
          id: generateLogId('cmd'),
          timestamp: time,
          type: 'cmd',
          promptPrefix: 'root@net:/#',
          text: command,
        },
        {
          id: generateLogId('out'),
          timestamp: time,
          type: 'success',
          text: `[SEQUENCE ${nextLine}/${totalLinesInStage} VERIFIED] Command accepted (PID ${pid}) @ ${metrics.wpm} WPM. Trace cooled -${difficultyConfig.lineRelief}%.`,
        }
      ]);
    } else {
      // FINAL line of current stage -> Stage Complete!
      const completedStage = currentStage;
      const newClue: ClueItem = {
        ...completedStage.unlockedClue,
        decrypted: true,
        timestamp: time,
      };

      // Unlock evidence in dossier
      setUnlockedClues((prev) => {
        const exists = prev.some((c) => c.id === newClue.id);
        return exists ? prev : [...prev, newClue];
      });

      applyCompletionRelief(difficultyConfig.stageRelief);

      const stageCompletionLogs: TerminalLogEntry[] = [
        {
          id: generateLogId('cmd'),
          timestamp: time,
          type: 'cmd',
          promptPrefix: 'root@net:/#',
          text: command,
        },
        {
          id: generateLogId('out'),
          timestamp: time,
          type: 'success',
          text: `[STAGE ${currentStageIndex + 1} CLEARED] Security Node ${completedStage.securityNode} breached! Trace cooled -${difficultyConfig.stageRelief}%.`,
        },
        {
          id: generateLogId('intel'),
          timestamp: time,
          type: 'success',
          text: `[FORENSIC EVIDENCE UNLOCKED] [${newClue.category}] ${newClue.headline}`,
        }
      ];

      const nextStageIndex = currentStageIndex + 1;
      if (nextStageIndex < activeCase.stages.length) {
        const nextStage = activeCase.stages[nextStageIndex];
        stageCompletionLogs.push({
          id: generateLogId('next-phase'),
          timestamp: time,
          type: 'sys',
          text: nextStage.narrativeLog,
        });
        setCurrentStageIndex(nextStageIndex);
        setCurrentLineIndex(0);
      } else {
        // All 10 stages cleared -> Trigger Case Solved
        stageCompletionLogs.push({
          id: generateLogId('verdict'),
          timestamp: time,
          type: 'success',
          text: '[ALL 10 TIERS BREACHED] Full defense network dismantled! Interpol indictment warrant primed.',
        });
        setCurrentStageIndex(nextStageIndex);
        setShowVerdictModal(true);
      }

      setLogs((prev) => [...prev, ...stageCompletionLogs]);
    }
  };

  // Restart / Retry mission
  const handleRetry = () => {
    resetTraceEngine();
    setCurrentStageIndex(0);
    setCurrentLineIndex(0);
    setUnlockedClues([]);
    setShowVerdictModal(false);
    setLogs([
      {
        id: generateLogId('reboot'),
        timestamp: getNowTimestamp(),
        type: 'sys',
        text: `[SYSTEM REBOOT] Proxy tunnel refreshed for ${activeCase.title}. Stage 1 initialized [Difficulty: ${difficulty}].`,
      },
      {
        id: generateLogId('stage1-intel'),
        timestamp: getNowTimestamp(),
        type: 'sys',
        text: activeCase.stages[0].narrativeLog,
      }
    ]);
  };

  const handleClearLogs = () => {
    setLogs([
      {
        id: generateLogId('clear'),
        timestamp: getNowTimestamp(),
        type: 'sys',
        text: 'Terminal screen cleared. Cryptographic tunnel socket active.',
      }
    ]);
  };

  const handleSkipTarget = () => {
    const totalLines = currentStage.commands?.length || 1;
    if (currentLineIndex + 1 < totalLines) {
      setCurrentLineIndex((prev) => prev + 1);
    } else if (currentStageIndex + 1 < activeCase.stages.length) {
      setCurrentStageIndex((prev) => prev + 1);
      setCurrentLineIndex(0);
    }
  };

  // Typing engine is active when game is IDLE or ACTIVE, and verdict modal is not covering screen
  const isTypingActive = (traceStatus === 'IDLE' || traceStatus === 'ACTIVE') && !showVerdictModal;

  return (
    <div className="h-screen w-screen bg-cyber-bg text-cyber-green flex flex-col overflow-hidden relative font-mono selection:bg-cyber-green selection:text-cyber-bg">
      {/* CRT Scanline & Vignette Overlay */}
      <ScanlineOverlay 
        showScanlines={scanlinesActive} 
        showVignette={true} 
      />

      {/* Top Header with Dynamic Trace Bar, Difficulty Selector & Case Sensitivity Mode */}
      <TerminalHeader 
        traceLevel={traceLevel}
        statusText={statusLabel}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        isCaseSensitive={isCaseSensitive}
        onCaseSensitivityToggle={handleCaseSensitivityToggle}
        scanlinesActive={scanlinesActive}
        onScanlinesToggle={() => setScanlinesActive(!scanlinesActive)}
      />

      {/* Tension Alert Overlay (Critical Red Vignette, Game Over Screen) */}
      <TraceAlertOverlay 
        status={traceStatus}
        traceLevel={traceLevel}
        survivalTime={survivalTime}
        completedCommands={completedCommands}
        totalTypos={totalTypos}
        wpm={currentMetrics.wpm}
        accuracy={currentMetrics.accuracy}
        streak={currentMetrics.streak}
        onRetry={handleRetry}
        onContinue={() => setShowVerdictModal(true)}
      />

      {/* Case Solved Verdict Modal (Deduction Phase) */}
      <CaseVerdictModal 
        caseFile={activeCase}
        unlockedClues={unlockedClues}
        survivalTime={survivalTime}
        wpm={currentMetrics.wpm}
        accuracy={currentMetrics.accuracy}
        streak={currentMetrics.streak}
        fatalTypos={totalTypos}
        isOpen={showVerdictModal}
        onRestartCase={handleRetry}
        onArchiveCase={handleRetry}
      />

      {/* Split Dashboard (Left Dossier Panel + Right Terminal Panel) */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative z-10">
        {/* Left Panel: Progressive Case Dossier & Dynamic ASCII Schematics */}
        <CaseDossierPanel 
          activeCase={activeCase}
          currentStageIndex={currentStageIndex}
          unlockedClues={unlockedClues}
        />

        {/* Right Panel: Active Terminal & Core Typing Engine */}
        <ActiveTerminalPanel 
          logs={logs}
          targetCommand={currentTargetCommand}
          commandProgress={{
            current: currentLineIndex + 1,
            total: currentStage.commands?.length || 1,
          }}
          stageTitle={`STAGE ${currentStageIndex + 1}`}
          isCaseSensitive={isCaseSensitive}
          isActive={isTypingActive}
          onStart={handleTypingStart}
          onCommandComplete={handleCommandComplete}
          onTypo={handleTypo}
          onMetricsUpdate={handleMetricsUpdate}
          onClearLogs={handleClearLogs}
          onNextTarget={handleSkipTarget}
        />
      </div>
    </div>
  );
};

export default App;
