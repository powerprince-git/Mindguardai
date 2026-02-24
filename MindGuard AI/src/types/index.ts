// Multi-Modal Mental Health Analysis Types

export interface TextAnalysis {
  sentiment: 'positive' | 'negative' | 'neutral';
  stressLevel: number;
  depressionIndicators: number;
  anxietyIndicators: number;
  keywords: string[];
  bertEmbedding: number[];
  confidence: number;
}

export interface AudioAnalysis {
  emotion: 'happy' | 'sad' | 'angry' | 'fearful' | 'neutral' | 'anxious';
  voiceStress: number;
  speechRate: number;
  pitchVariability: number;
  wav2vecFeatures: number[];
  confidence: number;
}

export interface FacialAnalysis {
  expression: 'happy' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'neutral' | 'contempt';
  microExpressions: string[];
  eyeContact: number;
  facialTension: number;
  cnnFeatures: number[];
  confidence: number;
}

export interface FusionOutput {
  textWeight: number;
  audioWeight: number;
  facialWeight: number;
  attentionScores: number[];
  fusedEmbedding: number[];
}

export interface RiskAssessment {
  overallScore: number;
  stressRisk: number;
  depressionRisk: number;
  anxietyRisk: number;
  crisisRisk: number;
  trend: 'improving' | 'stable' | 'declining';
  confidence: number;
}

export interface Alert {
  id: string;
  type: 'crisis' | 'high_risk' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  priority: number;
}

export interface Recommendation {
  id: string;
  category: 'immediate' | 'short_term' | 'long_term';
  title: string;
  description: string;
  resources: string[];
  urgency: number;
}

export interface ExplainabilityData {
  featureImportance: { feature: string; importance: number; modality: string }[];
  attentionVisualization: number[][];
  decisionPath: string[];
  counterfactualExplanation: string;
}

export interface PrivacySettings {
  dataRetention: number; // days
  anonymization: boolean;
  encryptionEnabled: boolean;
  consentGiven: boolean;
  dataSharing: 'none' | 'research' | 'clinical';
}

export interface PatientSession {
  id: string;
  timestamp: Date;
  textInput?: string;
  textAnalysis?: TextAnalysis;
  audioAnalysis?: AudioAnalysis;
  facialAnalysis?: FacialAnalysis;
  fusionOutput?: FusionOutput;
  riskAssessment?: RiskAssessment;
  alerts: Alert[];
  recommendations: Recommendation[];
  explainability?: ExplainabilityData;
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  specificity: number;
  sensitivity: number;
}

export interface TrainingConfig {
  epochs: number;
  batchSize: number;
  learningRate: number;
  optimizer: 'adam' | 'sgd' | 'adamw';
  lossFunction: string;
  modalityWeights: { text: number; audio: number; facial: number };
}
