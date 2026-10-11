import { useState, useEffect, useRef, useCallback } from 'react';
import type { GameStatus } from '../types';

export interface UseTraceEngineProps {
  initialTrace?: number;
  passiveRate?: number; // % per second, default 2.5
  typoPenalty?: number; // % per typo, default 5.0
  completionRelief?: number; // % dropped on completion, default 15.0
  targetCommandCount?: number; // total commands required for victory
  onGameOver?: (stats: { survivalTime: number; totalTypos: number; completedCommands: number }) => void;
  onVictory?: (stats: { survivalTime: number; totalTypos: number; completedCommands: number }) => void;
}

export interface UseTraceEngineReturn {
  traceLevel: number;
  status: GameStatus;
  survivalTime: number;
  totalTypos: number;
  completedCommands: number;
  targetCommandCount: number;
  isCritical: boolean; // trace >= 80%
  statusLabel: string;
  start: () => void;
  addTypoPenalty: (customPenalty?: number) => void;
  applyCompletionRelief: (customRelief?: number) => void;
  reset: () => void;
  pause: () => void;
  resume: () => void;
  triggerVictory: () => void;
}

export const useTraceEngine = ({
  initialTrace = 0.0,
  passiveRate = 2.5,
  typoPenalty = 5.0,
  completionRelief = 15.0,
  targetCommandCount = 5,
  onGameOver,
  onVictory,
}: UseTraceEngineProps = {}): UseTraceEngineReturn => {
  const [traceLevel, setTraceLevel] = useState<number>(initialTrace);
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [survivalTime, setSurvivalTime] = useState<number>(0);
  const [totalTypos, setTotalTypos] = useState<number>(0);
  const [completedCommands, setCompletedCommands] = useState<number>(0);

  const onGameOverRef = useRef(onGameOver);
  const onVictoryRef = useRef(onVictory);
  const lastTickTimeRef = useRef<number | null>(null);

  useEffect(() => {
    onGameOverRef.current = onGameOver;
    onVictoryRef.current = onVictory;
  }, [onGameOver, onVictory]);

  // Start the trace loop (transitions from IDLE to ACTIVE)
  const start = useCallback(() => {
    setStatus((prev) => {
      if (prev === 'IDLE') {
        lastTickTimeRef.current = Date.now();
        return 'ACTIVE';
      }
      return prev;
    });
  }, []);

  // Pause trace loop
  const pause = useCallback(() => {
    setStatus((prev) => (prev === 'ACTIVE' ? 'IDLE' : prev));
  }, []);

  // Resume trace loop
  const resume = useCallback(() => {
    setStatus((prev) => {
      if (prev === 'IDLE') {
        lastTickTimeRef.current = Date.now();
        return 'ACTIVE';
      }
      return prev;
    });
  }, []);

  // Reset engine to initial state
  const reset = useCallback(() => {
    setTraceLevel(initialTrace);
    setStatus('IDLE');
    setSurvivalTime(0);
    setTotalTypos(0);
    setCompletedCommands(0);
    lastTickTimeRef.current = null;
  }, [initialTrace]);

  // Manual or auto victory trigger
  const triggerVictory = useCallback(() => {
    setStatus('VICTORY');
    onVictoryRef.current?.({
      survivalTime,
      totalTypos,
      completedCommands,
    });
  }, [survivalTime, totalTypos, completedCommands]);

  // Passive trace accumulation loop
  useEffect(() => {
    if (status !== 'ACTIVE') {
      lastTickTimeRef.current = null;
      return;
    }

    lastTickTimeRef.current = Date.now();

    const interval = setInterval(() => {
      const now = Date.now();
      const dt = lastTickTimeRef.current ? (now - lastTickTimeRef.current) / 1000 : 0.1;
      lastTickTimeRef.current = now;

      setSurvivalTime((prev) => Math.round((prev + dt) * 10) / 10);

      setTraceLevel((prev) => {
        const nextTrace = prev + passiveRate * dt;
        if (nextTrace >= 100.0) {
          setStatus('GAME_OVER');
          onGameOverRef.current?.({
            survivalTime,
            totalTypos,
            completedCommands,
          });
          return 100.0;
        }
        return Math.min(100.0, Math.round(nextTrace * 100) / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [status, passiveRate, survivalTime, totalTypos, completedCommands]);

  // Add typo penalty
  const addTypoPenalty = useCallback((customPenalty?: number) => {
    const penalty = customPenalty ?? typoPenalty;

    // If IDLE, first typo activates game
    setStatus((prev) => {
      if (prev === 'IDLE') {
        lastTickTimeRef.current = Date.now();
        return 'ACTIVE';
      }
      return prev;
    });

    setTotalTypos((prev) => prev + 1);

    setTraceLevel((prev) => {
      const nextTrace = prev + penalty;
      if (nextTrace >= 100.0) {
        setStatus('GAME_OVER');
        onGameOverRef.current?.({
          survivalTime,
          totalTypos: totalTypos + 1,
          completedCommands,
        });
        return 100.0;
      }
      return Math.min(100.0, Math.round(nextTrace * 10) / 10);
    });
  }, [typoPenalty, survivalTime, totalTypos, completedCommands]);

  // Apply relief upon command completion
  const applyCompletionRelief = useCallback((customRelief?: number) => {
    const relief = customRelief ?? completionRelief;

    setCompletedCommands((prev) => {
      const updated = prev + 1;
      if (updated >= targetCommandCount) {
        setStatus('VICTORY');
        onVictoryRef.current?.({
          survivalTime,
          totalTypos,
          completedCommands: updated,
        });
      }
      return updated;
    });

    setTraceLevel((prev) => Math.max(0.0, Math.round((prev - relief) * 10) / 10));
  }, [completionRelief, targetCommandCount, survivalTime, totalTypos]);

  // Dynamic status text label
  const statusLabel = 
    traceLevel >= 80
      ? 'CRITICAL // IMMEDIATE EVASION REQUIRED'
      : traceLevel >= 50
      ? 'TRACE SIGNAL DETECTED'
      : 'PROXY SECURE';

  return {
    traceLevel,
    status,
    survivalTime,
    totalTypos,
    completedCommands,
    targetCommandCount,
    isCritical: traceLevel >= 80,
    statusLabel,
    start,
    addTypoPenalty,
    applyCompletionRelief,
    reset,
    pause,
    resume,
    triggerVictory,
  };
};
