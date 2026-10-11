import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { CharInfo, CharacterState, TypingEngineMetrics } from '../types';

export interface UseTypingEngineProps {
  targetText: string;
  isActive?: boolean;
  allowBackspace?: boolean;
  isCaseSensitive?: boolean; // If false, 'S' and 's' are treated as identical
  onComplete?: () => void;
  onError?: (expectedChar: string, actualChar: string) => void;
  onCorrect?: (char: string) => void;
  onStart?: () => void;
}

export interface UseTypingEngineReturn {
  typedText: string;
  charInfos: CharInfo[];
  currentIndex: number;
  metrics: TypingEngineMetrics;
  reset: () => void;
}

export const useTypingEngine = ({
  targetText,
  isActive = true,
  allowBackspace = true,
  isCaseSensitive = true,
  onComplete,
  onError,
  onCorrect,
  onStart,
}: UseTypingEngineProps): UseTypingEngineReturn => {
  const [typedText, setTypedText] = useState<string>('');
  const [totalKeystrokes, setTotalKeystrokes] = useState<number>(0);
  const [correctKeystrokes, setCorrectKeystrokes] = useState<number>(0);
  const [errorCount, setErrorCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);

  // Keep latest callbacks in refs to prevent unnecessary effect re-subscriptions
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);
  const onCorrectRef = useRef(onCorrect);
  const onStartRef = useRef(onStart);

  useEffect(() => {
    onCompleteRef.current = onComplete;
    onErrorRef.current = onError;
    onCorrectRef.current = onCorrect;
    onStartRef.current = onStart;
  }, [onComplete, onError, onCorrect, onStart]);

  // Reset input state when targetText changes
  useEffect(() => {
    setTypedText('');
    setIsCompleted(false);
    setStartTime(null);
    setElapsedTime(0);
  }, [targetText]);

  // Elapsed time timer tick
  useEffect(() => {
    if (!startTime || isCompleted || !isActive) return;

    const interval = setInterval(() => {
      setElapsedTime((Date.now() - startTime) / 1000);
    }, 200);

    return () => clearInterval(interval);
  }, [startTime, isCompleted, isActive]);

  // Reset handler
  const reset = useCallback(() => {
    setTypedText('');
    setIsCompleted(false);
    setStartTime(null);
    setElapsedTime(0);
  }, []);

  // Keydown event listener
  useEffect(() => {
    if (!isActive || isCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Allow browser shortcuts (Ctrl, Alt, Meta) to pass through without being intercepted
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      // Handle Backspace
      if (e.key === 'Backspace') {
        e.preventDefault();
        if (allowBackspace && typedText.length > 0) {
          setTypedText((prev) => prev.slice(0, -1));
        }
        return;
      }

      // Ignore non-printable keys (Shift, Escape, Arrows, Function keys, Tab, etc.)
      if (e.key.length !== 1) {
        if (e.key === 'Tab') {
          e.preventDefault();
        }
        return;
      }

      // Ignore tilde (~) and backtick (`) to support Thai keyboard language-switching key seamlessly without penalty
      if (e.key === '~' || e.key === '`') {
        e.preventDefault();
        return;
      }

      // Prevent default page scroll on Space or other printable keys
      if (e.key === ' ') {
        e.preventDefault();
      }

      // Cannot type beyond target length without backspacing errors
      if (typedText.length >= targetText.length) {
        return;
      }

      const inputChar = e.key;
      const expectedChar = targetText[typedText.length];

      // Start the timer and trigger onStart on the very first keystroke
      if (startTime === null) {
        setStartTime(Date.now());
        onStartRef.current?.();
      }

      setTotalKeystrokes((prev) => prev + 1);

      // Check match with case sensitivity consideration
      const isCharMatch = isCaseSensitive
        ? inputChar === expectedChar
        : inputChar.toLowerCase() === expectedChar.toLowerCase();

      if (isCharMatch) {
        setCorrectKeystrokes((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        onCorrectRef.current?.(inputChar);
      } else {
        setStreak(0);
        setErrorCount((prev) => prev + 1);
        onErrorRef.current?.(expectedChar, inputChar);
      }

      const nextTyped = typedText + inputChar;
      setTypedText(nextTyped);

      // Check if target is completed
      if (nextTyped.length === targetText.length) {
        const isTargetCompleted = isCaseSensitive
          ? nextTyped === targetText
          : nextTyped.toLowerCase() === targetText.toLowerCase();

        if (isTargetCompleted) {
          setIsCompleted(true);
          const finalElapsed = startTime ? (Date.now() - startTime) / 1000 : 0.1;
          setElapsedTime(finalElapsed);
          onCompleteRef.current?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, isCompleted, typedText, targetText, startTime, allowBackspace, isCaseSensitive]);

  // Derived character statuses with case sensitivity check
  const charInfos: CharInfo[] = useMemo(() => {
    const targetArr = targetText.split('');
    const typedArr = typedText.split('');

    return targetArr.map((expected, idx) => {
      let state: CharacterState = 'pending';
      const typed = typedArr[idx];

      if (idx < typedArr.length) {
        const isMatched = isCaseSensitive
          ? typed === expected
          : typed?.toLowerCase() === expected.toLowerCase();
        state = isMatched ? 'correct' : 'incorrect';
      } else if (idx === typedArr.length) {
        state = 'current';
      } else {
        state = 'pending';
      }

      return {
        expected,
        typed,
        state,
      };
    });
  }, [targetText, typedText, isCaseSensitive]);

  // Real-time Metrics Calculation
  const metrics: TypingEngineMetrics = useMemo(() => {
    const elapsedMinutes = elapsedTime / 60;
    
    // Standard WPM: (correctKeystrokes / 5) / elapsedMinutes
    let wpm = 0;
    if (elapsedMinutes > 0 && correctKeystrokes > 0) {
      wpm = Math.round((correctKeystrokes / 5) / elapsedMinutes);
    }

    // Accuracy: (correctKeystrokes / totalKeystrokes) * 100
    const accuracy = totalKeystrokes > 0
      ? Math.round((correctKeystrokes / totalKeystrokes) * 1000) / 10
      : 100;

    return {
      wpm,
      accuracy,
      streak,
      errorCount,
      totalKeystrokes,
      correctKeystrokes,
      elapsedTime: Math.round(elapsedTime * 10) / 10,
      isStarted: startTime !== null,
      isCompleted,
    };
  }, [correctKeystrokes, totalKeystrokes, elapsedTime, streak, errorCount, startTime, isCompleted]);

  return {
    typedText,
    charInfos,
    currentIndex: typedText.length,
    metrics,
    reset,
  };
};
