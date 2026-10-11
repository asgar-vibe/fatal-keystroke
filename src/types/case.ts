export type ClueCategory = 'FINANCIAL' | 'INTERCEPT' | 'CREDENTIAL' | 'IDENTITY';

export interface ClueItem {
  id: string;
  stageIndex: number;
  timestamp: string;
  category: ClueCategory;
  headline: string;
  snippet: string;
  decrypted: boolean;
  metadata?: string;
}

export interface CaseStage {
  stageIndex: number;
  title: string;
  narrativeLog: string;
  commands: string[]; // Lines/commands player must type to pass this stage
  command?: string; // Optional convenience for single-command compatibility
  timeLimitSeconds: number; // Allocated time limit in seconds
  securityNode: string;
  asciiArt: string;
  unlockedClue: ClueItem;
}

export interface CaseConclusion {
  culprit: string;
  title: string;
  motive: string;
  verdictSummary: string;
  evidenceSummary: string[];
}

export interface CaseFile {
  id: string;
  caseCode: string;
  title: string;
  classification: string;
  targetEntity: string;
  targetIP: string;
  securityThreatLevel: string;
  briefing: string;
  passiveTraceRate: number; // Default passive creep rate
  stages: CaseStage[];
  conclusion: CaseConclusion;
}

export type DetectiveRank = 
  | 'RANK S [MASTER CYBER-DETECTIVE]' 
  | 'RANK A [SENIOR INTRUSION AGENT]' 
  | 'RANK B [FIELD INFILTRATOR]' 
  | 'RANK C [ROGUE KEYSTROKER]';

export interface VerdictMetrics {
  totalTime: number;
  avgWpm: number;
  avgAccuracy: number;
  maxStreak: number;
  fatalTypos: number;
  rank: DetectiveRank;
}

export type DifficultyLevel = 'EASY' | 'NORMAL' | 'HARD';
export type CaseSensitivityMode = 'STRICT' | 'RELAXED';

