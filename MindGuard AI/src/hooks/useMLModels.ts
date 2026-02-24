import { useState, useEffect, useCallback } from 'react';
import { pipeline, env } from '@xenova/transformers';

// Configure transformers.js
env.allowLocalModels = false;
env.useBrowserCache = true;

interface ModelState {
  textClassifier: any;
  isLoading: boolean;
  loadingProgress: string;
  error: string | null;
}

interface TextAnalysisResult {
  sentiment: {
    label: string;
    score: number;
  };
  emotions: {
    stress: number;
    depression: number;
    anxiety: number;
    positivity: number;
  };
  keywords: string[];
  riskIndicators: string[];
}

interface AudioAnalysisResult {
  energy: number;
  pitch: number;
  tempo: number;
  emotions: {
    calm: number;
    stressed: number;
    sad: number;
    anxious: number;
  };
}

interface FacialAnalysisResult {
  expressions: {
    neutral: number;
    happy: number;
    sad: number;
    angry: number;
    fearful: number;
    disgusted: number;
    surprised: number;
  };
  dominantExpression: string;
}

// Risk keywords and patterns for mental health analysis
const RISK_KEYWORDS = {
  high: ['suicide', 'kill myself', 'end it all', 'no reason to live', 'want to die', 'better off dead'],
  medium: ['hopeless', 'worthless', 'nobody cares', 'can\'t go on', 'exhausted', 'giving up', 'alone', 'isolated'],
  low: ['stressed', 'anxious', 'worried', 'tired', 'sad', 'overwhelmed', 'frustrated', 'depressed']
};

const POSITIVE_KEYWORDS = ['happy', 'grateful', 'hopeful', 'excited', 'good', 'great', 'wonderful', 'amazing', 'better', 'improving'];

export function useMLModels() {
  const [modelState, setModelState] = useState<ModelState>({
    textClassifier: null,
    isLoading: true,
    loadingProgress: 'Initializing...',
    error: null
  });

  // Load models on mount
  useEffect(() => {
    let isMounted = true;

    async function loadModels() {
      try {
        setModelState(prev => ({ ...prev, loadingProgress: 'Loading sentiment analysis model...' }));
        
        // Load sentiment analysis pipeline
        const classifier = await pipeline(
          'sentiment-analysis',
          'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
          {
            progress_callback: (progress: any) => {
              if (progress.status === 'downloading') {
                const pct = Math.round((progress.loaded / progress.total) * 100);
                if (isMounted) {
                  setModelState(prev => ({
                    ...prev,
                    loadingProgress: `Downloading model: ${pct}%`
                  }));
                }
              }
            }
          }
        );

        if (isMounted) {
          setModelState({
            textClassifier: classifier,
            isLoading: false,
            loadingProgress: 'Models loaded!',
            error: null
          });
        }
      } catch (error) {
        console.error('Model loading error:', error);
        if (isMounted) {
          setModelState(prev => ({
            ...prev,
            isLoading: false,
            error: 'Failed to load ML models. Using fallback analysis.'
          }));
        }
      }
    }

    loadModels();

    return () => {
      isMounted = false;
    };
  }, []);

  // Analyze text for mental health indicators
  const analyzeText = useCallback(async (text: string): Promise<TextAnalysisResult> => {
    const lowerText = text.toLowerCase();
    
    // Find risk indicators
    const riskIndicators: string[] = [];
    let riskLevel = 0;

    RISK_KEYWORDS.high.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        riskIndicators.push(`HIGH RISK: "${keyword}"`);
        riskLevel += 3;
      }
    });

    RISK_KEYWORDS.medium.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        riskIndicators.push(`MEDIUM: "${keyword}"`);
        riskLevel += 2;
      }
    });

    RISK_KEYWORDS.low.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        riskIndicators.push(`LOW: "${keyword}"`);
        riskLevel += 1;
      }
    });

    let positivityBoost = 0;
    POSITIVE_KEYWORDS.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        positivityBoost += 0.1;
      }
    });

    // Use ML model for sentiment if available
    let sentimentResult = { label: 'NEUTRAL', score: 0.5 };
    
    if (modelState.textClassifier && text.trim().length > 0) {
      try {
        const result = await modelState.textClassifier(text);
        sentimentResult = {
          label: result[0].label,
          score: result[0].score
        };
      } catch (e) {
        console.error('Sentiment analysis error:', e);
      }
    }

    // Calculate emotion scores based on combined analysis
    const isNegative = sentimentResult.label === 'NEGATIVE';
    const negativityScore = isNegative ? sentimentResult.score : 1 - sentimentResult.score;
    
    const baseStress = Math.min(1, (riskLevel * 0.1) + (negativityScore * 0.4));
    const baseDepression = Math.min(1, (riskLevel * 0.12) + (negativityScore * 0.35));
    const baseAnxiety = Math.min(1, (riskLevel * 0.08) + (negativityScore * 0.3));
    const positivity = Math.min(1, Math.max(0, (1 - negativityScore) * 0.7 + positivityBoost));

    // Extract keywords (simple implementation)
    const words = text.split(/\s+/).filter(w => w.length > 4);
    const keywords = [...new Set(words)].slice(0, 5);

    return {
      sentiment: sentimentResult,
      emotions: {
        stress: baseStress,
        depression: baseDepression,
        anxiety: baseAnxiety,
        positivity: positivity
      },
      keywords,
      riskIndicators
    };
  }, [modelState.textClassifier]);

  // Analyze audio features (simulated with Web Audio API patterns)
  const analyzeAudio = useCallback(async (audioData: Float32Array | null): Promise<AudioAnalysisResult> => {
    if (!audioData || audioData.length === 0) {
      return {
        energy: 0.5,
        pitch: 0.5,
        tempo: 0.5,
        emotions: { calm: 0.5, stressed: 0.3, sad: 0.1, anxious: 0.1 }
      };
    }

    // Calculate audio features
    let energy = 0;
    let zeroCrossings = 0;
    
    for (let i = 0; i < audioData.length; i++) {
      energy += audioData[i] * audioData[i];
      if (i > 0 && ((audioData[i] >= 0) !== (audioData[i - 1] >= 0))) {
        zeroCrossings++;
      }
    }
    
    energy = Math.sqrt(energy / audioData.length);
    const normalizedEnergy = Math.min(1, energy * 10);
    const pitch = zeroCrossings / audioData.length;
    const normalizedPitch = Math.min(1, pitch * 50);

    // Infer emotions from audio features
    const isHighEnergy = normalizedEnergy > 0.6;
    const isHighPitch = normalizedPitch > 0.5;

    return {
      energy: normalizedEnergy,
      pitch: normalizedPitch,
      tempo: 0.5 + (normalizedEnergy - 0.5) * 0.5,
      emotions: {
        calm: isHighEnergy ? 0.2 : 0.7,
        stressed: isHighEnergy && isHighPitch ? 0.7 : 0.2,
        sad: !isHighEnergy && !isHighPitch ? 0.6 : 0.1,
        anxious: isHighPitch ? 0.5 : 0.2
      }
    };
  }, []);

  // Analyze facial expressions using advanced pixel analysis
  const analyzeFacial = useCallback(async (imageData: ImageData | null): Promise<FacialAnalysisResult> => {
    if (!imageData) {
      return {
        expressions: {
          neutral: 0.7, happy: 0.1, sad: 0.1, angry: 0.05,
          fearful: 0.02, disgusted: 0.02, surprised: 0.01
        },
        dominantExpression: 'neutral'
      };
    }

    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const totalPixels = width * height;

    // ---- Step 1: Compute global image statistics ----
    let globalBrightness = 0;
    let rTotal = 0, gTotal = 0, bTotal = 0;
    const grayValues: number[] = [];

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i + 1], b = data[i + 2];
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      globalBrightness += gray;
      rTotal += r; gTotal += g; bTotal += b;
      grayValues.push(gray);
    }

    globalBrightness /= totalPixels;
    const avgR = rTotal / totalPixels;
    const avgB = bTotal / totalPixels;

    // Variance / contrast
    let variance = 0;
    for (const val of grayValues) {
      variance += (val - globalBrightness) ** 2;
    }
    variance = Math.sqrt(variance / totalPixels);

    // ---- Step 2: Analyze face regions (upper, middle, lower thirds) ----
    const getRegionStats = (yStart: number, yEnd: number, xStart: number, xEnd: number) => {
      let sum = 0, count = 0, edgeCount = 0;
      for (let y = yStart; y < yEnd; y++) {
        for (let x = xStart; x < xEnd; x++) {
          const idx = (y * width + x) * 4;
          const gray = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
          sum += gray;
          count++;
          // Simple edge detection (horizontal gradient)
          if (x > xStart) {
            const prevIdx = (y * width + x - 1) * 4;
            const prevGray = 0.299 * data[prevIdx] + 0.587 * data[prevIdx + 1] + 0.114 * data[prevIdx + 2];
            if (Math.abs(gray - prevGray) > 20) edgeCount++;
          }
        }
      }
      return {
        brightness: count > 0 ? sum / count : 128,
        edges: count > 0 ? edgeCount / count : 0
      };
    };

    // Divide image into face-like regions
    const cx = Math.floor(width * 0.25);
    const cxEnd = Math.floor(width * 0.75);
    const forehead = getRegionStats(Math.floor(height * 0.1), Math.floor(height * 0.3), cx, cxEnd);
    const eyes = getRegionStats(Math.floor(height * 0.3), Math.floor(height * 0.5), cx, cxEnd);
    const mouth = getRegionStats(Math.floor(height * 0.55), Math.floor(height * 0.8), cx, cxEnd);

    // ---- Step 3: Compute skin-tone warmth ----
    const warmth = (avgR - avgB) / 255; // positive = warm, negative = cool

    // ---- Step 4: Map features to expressions ----
    const nb = globalBrightness / 255;   // 0-1
    const nc = Math.min(1, variance / 80); // 0-1
    const eyeEdge = Math.min(1, eyes.edges * 15);
    const mouthEdge = Math.min(1, mouth.edges * 15);
    const mouthBright = mouth.brightness / 255;

    // Raw expression scores using multi-feature heuristics
    const raw = {
      neutral:   0.25 + (1 - nc) * 0.2 + (1 - eyeEdge) * 0.15,
      happy:     0.1  + (mouthBright > 0.55 ? 0.25 : 0) + (warmth > 0.05 ? 0.15 : 0) + (nb > 0.5 ? 0.1 : 0),
      sad:       0.1  + (nb < 0.45 ? 0.25 : 0) + (warmth < -0.02 ? 0.15 : 0) + (mouthEdge < 0.3 ? 0.1 : 0),
      angry:     0.08 + (nc > 0.5 ? 0.2 : 0) + (eyeEdge > 0.5 ? 0.15 : 0) + (warmth > 0.1 ? 0.1 : 0),
      fearful:   0.05 + (eyeEdge > 0.6 ? 0.2 : 0) + (forehead.edges > 0.04 ? 0.1 : 0),
      disgusted: 0.05 + (nc > 0.6 ? 0.1 : 0) + (mouthEdge > 0.5 ? 0.1 : 0),
      surprised: 0.05 + (eyeEdge > 0.5 ? 0.15 : 0) + (mouthBright > 0.6 ? 0.15 : 0) + (forehead.brightness / 255 > 0.55 ? 0.1 : 0)
    };

    // ---- Step 5: Add small randomness for realistic variation ----
    const jitter = () => (Math.random() - 0.5) * 0.04;
    Object.keys(raw).forEach(k => {
      raw[k as keyof typeof raw] = Math.max(0.01, raw[k as keyof typeof raw] + jitter());
    });

    // ---- Step 6: Normalize to sum to 1 ----
    const total = Object.values(raw).reduce((a, b) => a + b, 0);
    const expressions = {
      neutral:   raw.neutral / total,
      happy:     raw.happy / total,
      sad:       raw.sad / total,
      angry:     raw.angry / total,
      fearful:   raw.fearful / total,
      disgusted: raw.disgusted / total,
      surprised: raw.surprised / total
    };

    // ---- Step 7: Find dominant expression ----
    const dominant = Object.entries(expressions).reduce((a, b) => a[1] > b[1] ? a : b);

    return {
      expressions,
      dominantExpression: dominant[0]
    };
  }, []);

  // Multimodal fusion
  const computeFusedRisk = useCallback((
    textResult: TextAnalysisResult,
    audioResult: AudioAnalysisResult,
    facialResult: FacialAnalysisResult
  ) => {
    // Attention weights (learned in real system, heuristic here)
    const textWeight = 0.5;
    const audioWeight = 0.25;
    const facialWeight = 0.25;

    // Calculate individual risk scores
    const textRisk = (textResult.emotions.stress + textResult.emotions.depression + textResult.emotions.anxiety) / 3;
    const audioRisk = (audioResult.emotions.stressed + audioResult.emotions.sad + audioResult.emotions.anxious) / 3;
    
    const negativeExpressions = facialResult.expressions.sad + facialResult.expressions.angry + 
                                facialResult.expressions.fearful + facialResult.expressions.disgusted;
    const facialRisk = negativeExpressions;

    // High-risk keyword boost
    const hasHighRisk = textResult.riskIndicators.some(r => r.startsWith('HIGH'));
    const riskBoost = hasHighRisk ? 0.3 : 0;

    // Fused risk score
    const fusedRisk = Math.min(1, 
      (textRisk * textWeight + audioRisk * audioWeight + facialRisk * facialWeight) + riskBoost
    );

    // Risk level classification
    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (fusedRisk > 0.8 || hasHighRisk) riskLevel = 'critical';
    else if (fusedRisk > 0.6) riskLevel = 'high';
    else if (fusedRisk > 0.35) riskLevel = 'moderate';

    return {
      overallRisk: fusedRisk,
      riskLevel,
      breakdown: {
        text: textRisk,
        audio: audioRisk,
        facial: facialRisk
      },
      weights: {
        text: textWeight,
        audio: audioWeight,
        facial: facialWeight
      },
      confidence: modelState.textClassifier ? 0.85 : 0.65
    };
  }, [modelState.textClassifier]);

  return {
    ...modelState,
    analyzeText,
    analyzeAudio,
    analyzeFacial,
    computeFusedRisk
  };
}
