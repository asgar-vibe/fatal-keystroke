export type LogSeverity = 'info' | 'warning' | 'critical' | 'decrypted';

export interface EvidenceItem {
  id: string;
  code: string;
  title: string;
  timestamp: string;
  decrypted: boolean;
  content: string;
  tags: string[];
}

export interface CaseDossier {
  caseId: string;
  targetName: string;
  targetEntity: string;
  securityLevel: string;
  iceType: string;
  objective: string;
  targetIP: string;
  encryptionProtocol: string;
  nodeStatus: 'ONLINE' | 'BREACHING' | 'LOCKED' | 'COMPROMISED';
  asciiArt: string;
  evidence: EvidenceItem[];
}

export type TerminalLogType = 'cmd' | 'output' | 'sys' | 'success' | 'warn' | 'error' | 'trace';

export interface TerminalLogEntry {
  id: string;
  timestamp: string;
  type: TerminalLogType;
  text: string;
  promptPrefix?: string;
}

export interface KeystrokeMetrics {
  wpm: number;
  accuracy: number;
  streak: number;
  keystrokesCount: number;
  traceLevel: number; // 0 - 100
}

export type CharacterState = 'correct' | 'incorrect' | 'current' | 'pending';

export interface CharInfo {
  expected: string;
  typed?: string;
  state: CharacterState;
}

export interface TypingEngineMetrics {
  wpm: number;
  accuracy: number;
  streak: number;
  errorCount: number;
  totalKeystrokes: number;
  correctKeystrokes: number;
  elapsedTime: number;
  isStarted: boolean;
  isCompleted: boolean;
}

export type GameStatus = 'IDLE' | 'ACTIVE' | 'GAME_OVER' | 'VICTORY';

export interface TraceEngineState {
  traceLevel: number;
  status: GameStatus;
  survivalTime: number;
  passiveRate: number;
  typoPenalty: number;
  completionRelief: number;
}

export type * from './case';

