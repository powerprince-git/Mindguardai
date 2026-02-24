import type { Alert, Recommendation, ModelMetrics, TrainingConfig } from '../types';

export const generateMockTextAnalysis = () => ({
  sentiment: (['positive', 'negative', 'neutral'] as const)[Math.floor(Math.random() * 3)],
  stressLevel: Math.random() * 100,
  depressionIndicators: Math.random() * 100,
  anxietyIndicators: Math.random() * 100,
  keywords: ['tired', 'overwhelmed', 'hopeless', 'anxious', 'stressed'].slice(0, Math.floor(Math.random() * 5) + 1),
  bertEmbedding: Array.from({ length: 768 }, () => Math.random() * 2 - 1),
  confidence: 0.7 + Math.random() * 0.25,
});

export const generateMockAudioAnalysis = () => ({
  emotion: (['happy', 'sad', 'angry', 'fearful', 'neutral', 'anxious'] as const)[Math.floor(Math.random() * 6)],
  voiceStress: Math.random() * 100,
  speechRate: 80 + Math.random() * 120,
  pitchVariability: Math.random() * 100,
  wav2vecFeatures: Array.from({ length: 512 }, () => Math.random() * 2 - 1),
  confidence: 0.7 + Math.random() * 0.25,
});

export const generateMockFacialAnalysis = () => ({
  expression: (['happy', 'sad', 'angry', 'surprised', 'fearful', 'neutral', 'contempt'] as const)[Math.floor(Math.random() * 7)],
  microExpressions: ['tension', 'fleeting_sadness', 'suppressed_anxiety'].slice(0, Math.floor(Math.random() * 3) + 1),
  eyeContact: Math.random() * 100,
  facialTension: Math.random() * 100,
  cnnFeatures: Array.from({ length: 256 }, () => Math.random() * 2 - 1),
  confidence: 0.7 + Math.random() * 0.25,
});

export const generateMockFusionOutput = () => ({
  textWeight: 0.3 + Math.random() * 0.2,
  audioWeight: 0.25 + Math.random() * 0.15,
  facialWeight: 0.25 + Math.random() * 0.15,
  attentionScores: Array.from({ length: 12 }, () => Math.random()),
  fusedEmbedding: Array.from({ length: 256 }, () => Math.random() * 2 - 1),
});

export const generateMockRiskAssessment = () => ({
  overallScore: Math.random() * 100,
  stressRisk: Math.random() * 100,
  depressionRisk: Math.random() * 100,
  anxietyRisk: Math.random() * 100,
  crisisRisk: Math.random() * 30,
  trend: (['improving', 'stable', 'declining'] as const)[Math.floor(Math.random() * 3)],
  confidence: 0.75 + Math.random() * 0.2,
});

export const mockAlerts: Alert[] = [
  { id: '1', type: 'crisis', message: 'Elevated crisis indicators detected - immediate intervention recommended', timestamp: new Date(), acknowledged: false, priority: 1 },
  { id: '2', type: 'high_risk', message: 'Depression markers significantly elevated over past 7 days', timestamp: new Date(Date.now() - 3600000), acknowledged: false, priority: 2 },
  { id: '3', type: 'warning', message: 'Sleep pattern disruption indicated by voice analysis', timestamp: new Date(Date.now() - 7200000), acknowledged: true, priority: 3 },
  { id: '4', type: 'info', message: 'Weekly wellness check-in reminder', timestamp: new Date(Date.now() - 86400000), acknowledged: true, priority: 4 },
];

export const mockRecommendations: Recommendation[] = [
  { id: '1', category: 'immediate', title: 'Crisis Hotline', description: 'Consider contacting mental health crisis support', resources: ['988 Suicide & Crisis Lifeline', 'Crisis Text Line'], urgency: 1 },
  { id: '2', category: 'short_term', title: 'Therapy Session', description: 'Schedule a session with your therapist within 48 hours', resources: ['Dr. Smith - CBT Specialist'], urgency: 2 },
  { id: '3', category: 'long_term', title: 'Mindfulness Practice', description: 'Daily 10-minute meditation sessions', resources: ['Headspace App', 'Calm App'], urgency: 3 },
];

export const mockExplainability = {
  featureImportance: [
    { feature: 'Negative sentiment words', importance: 0.85, modality: 'text' },
    { feature: 'Voice tremor detection', importance: 0.72, modality: 'audio' },
    { feature: 'Reduced eye contact', importance: 0.68, modality: 'facial' },
    { feature: 'Speech rate decrease', importance: 0.61, modality: 'audio' },
    { feature: 'Hopelessness keywords', importance: 0.58, modality: 'text' },
    { feature: 'Facial tension score', importance: 0.52, modality: 'facial' },
    { feature: 'Anxiety-related phrases', importance: 0.49, modality: 'text' },
    { feature: 'Pitch variability', importance: 0.45, modality: 'audio' },
  ],
  attentionVisualization: Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => Math.random())),
  decisionPath: [
    'Text sentiment classified as negative (confidence: 0.89)',
    'Audio features indicate elevated stress levels',
    'Facial expression shows signs of distress',
    'Multi-modal fusion weighted towards text modality',
    'Risk score computed using ensemble prediction',
    'Final classification: High Risk (0.78)',
  ],
  counterfactualExplanation: 'If the speech rate increased by 20% and facial tension decreased by 30%, the risk classification would change from "High Risk" to "Moderate Risk".',
};

export const mockModelMetrics: ModelMetrics = {
  accuracy: 0.867,
  precision: 0.842,
  recall: 0.891,
  f1Score: 0.865,
  auc: 0.923,
  specificity: 0.834,
  sensitivity: 0.891,
};

export const mockTrainingConfig: TrainingConfig = {
  epochs: 100,
  batchSize: 32,
  learningRate: 0.0001,
  optimizer: 'adamw',
  lossFunction: 'weighted_cross_entropy',
  modalityWeights: { text: 0.4, audio: 0.3, facial: 0.3 },
};

export const historicalRiskData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  stress: 40 + Math.random() * 30 + (i > 20 ? 15 : 0),
  depression: 35 + Math.random() * 25 + (i > 15 ? 10 : 0),
  anxiety: 45 + Math.random() * 20,
  overall: 40 + Math.random() * 25 + (i > 20 ? 12 : 0),
}));

export const modalityAccuracyData = [
  { modality: 'Text (BERT)', accuracy: 0.89, f1: 0.87 },
  { modality: 'Audio (wav2vec)', accuracy: 0.82, f1: 0.80 },
  { modality: 'Facial (CNN)', accuracy: 0.85, f1: 0.83 },
  { modality: 'Fused (Attention)', accuracy: 0.91, f1: 0.89 },
];

export const confusionMatrix = [
  [245, 12, 8, 5],
  [15, 198, 18, 9],
  [7, 21, 186, 16],
  [3, 8, 14, 171],
];

export const trainingProgress = Array.from({ length: 100 }, (_, i) => ({
  epoch: i + 1,
  trainLoss: 2.5 * Math.exp(-i / 20) + 0.15 + Math.random() * 0.1,
  valLoss: 2.5 * Math.exp(-i / 22) + 0.18 + Math.random() * 0.12,
  trainAcc: Math.min(0.95, 0.4 + 0.55 * (1 - Math.exp(-i / 25)) + Math.random() * 0.02),
  valAcc: Math.min(0.92, 0.38 + 0.52 * (1 - Math.exp(-i / 28)) + Math.random() * 0.03),
}));
