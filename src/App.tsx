import { useState, useCallback } from 'react';
import { useMLModels } from './hooks/useMLModels';
import { TextInput } from './components/TextInput';
import { AudioInput } from './components/AudioInput';
import { CameraInput } from './components/CameraInput';
import { ResultsPanel } from './components/ResultsPanel';
import { AlertsAndRecommendations } from './components/AlertsAndRecommendations';
import { ExplainabilityPanel } from './components/ExplainabilityPanel';
import { ModelInfo } from './components/ModelInfo';

interface TextResult {
  sentiment: { label: string; score: number };
  emotions: { stress: number; depression: number; anxiety: number; positivity: number };
  keywords: string[];
  riskIndicators: string[];
}

interface AudioResult {
  energy: number;
  pitch: number;
  tempo: number;
  emotions: { calm: number; stressed: number; sad: number; anxious: number };
}

interface FacialResult {
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

interface FusedResult {
  overallRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  breakdown: { text: number; audio: number; facial: number };
  weights: { text: number; audio: number; facial: number };
  confidence: number;
  activeModalities: { text: boolean; audio: boolean; facial: boolean };
}

function App() {
  const {
    isLoading,
    loadingProgress,
    error,
    analyzeText,
    analyzeAudio,
    analyzeFacial,
  } = useMLModels();

  const [isProcessing, setIsProcessing] = useState(false);
  const [textResult, setTextResult] = useState<TextResult | null>(null);
  const [audioResult, setAudioResult] = useState<AudioResult | null>(null);
  const [facialResult, setFacialResult] = useState<FacialResult | null>(null);
  const [fusedResult, setFusedResult] = useState<FusedResult | null>(null);

  // Only fuse modalities that were actually used
  const computeSmartFusion = useCallback((
    text: TextResult | null,
    audio: AudioResult | null,
    facial: FacialResult | null
  ) => {
    const hasText = text !== null;
    const hasAudio = audio !== null;
    const hasFacial = facial !== null;

    if (!hasText && !hasAudio && !hasFacial) {
      setFusedResult(null);
      return;
    }

    // Calculate individual risk scores only for active modalities
    let textRisk = 0;
    let audioRisk = 0;
    let facialRisk = 0;

    if (hasText) {
      const negScore = text.sentiment.label === 'NEGATIVE' ? text.sentiment.score : (1 - text.sentiment.score) * 0.5;
      textRisk = (text.emotions.stress * 0.3 + text.emotions.depression * 0.3 + text.emotions.anxiety * 0.2 + negScore * 0.2);
      if (text.riskIndicators.length > 0) {
        textRisk = Math.min(1, textRisk + text.riskIndicators.length * 0.15);
      }
    }

    if (hasAudio) {
      audioRisk = (audio.emotions.stressed * 0.35 + audio.emotions.sad * 0.3 + audio.emotions.anxious * 0.25 + (1 - audio.emotions.calm) * 0.1);
    }

    if (hasFacial) {
      facialRisk = (facial.expressions.sad * 0.3 + facial.expressions.angry * 0.2 + facial.expressions.fearful * 0.25 + facial.expressions.disgusted * 0.1 + (1 - facial.expressions.happy) * 0.15);
    }

    // Dynamic weights based on which modalities are active
    let wText = 0, wAudio = 0, wFacial = 0;
    const activeCount = [hasText, hasAudio, hasFacial].filter(Boolean).length;

    if (activeCount === 1) {
      // Single modality - use 100% of that one
      wText = hasText ? 1.0 : 0;
      wAudio = hasAudio ? 1.0 : 0;
      wFacial = hasFacial ? 1.0 : 0;
    } else if (activeCount === 2) {
      // Two modalities - weight text highest if present
      if (hasText && hasAudio) { wText = 0.6; wAudio = 0.4; }
      else if (hasText && hasFacial) { wText = 0.6; wFacial = 0.4; }
      else if (hasAudio && hasFacial) { wAudio = 0.55; wFacial = 0.45; }
    } else {
      // All three modalities
      wText = 0.50; wAudio = 0.25; wFacial = 0.25;
    }

    const overallRisk = textRisk * wText + audioRisk * wAudio + facialRisk * wFacial;
    const clampedRisk = Math.max(0, Math.min(1, overallRisk));

    let riskLevel: 'low' | 'moderate' | 'high' | 'critical' = 'low';
    if (clampedRisk >= 0.8) riskLevel = 'critical';
    else if (clampedRisk >= 0.6) riskLevel = 'high';
    else if (clampedRisk >= 0.35) riskLevel = 'moderate';

    // Confidence is higher with more modalities
    const confidence = activeCount === 1 ? 0.65 : activeCount === 2 ? 0.80 : 0.92;

    setFusedResult({
      overallRisk: clampedRisk,
      riskLevel,
      breakdown: {
        text: textRisk,
        audio: audioRisk,
        facial: facialRisk,
      },
      weights: { text: wText, audio: wAudio, facial: wFacial },
      confidence,
      activeModalities: { text: hasText, audio: hasAudio, facial: hasFacial },
    });
  }, []);

  const handleTextAnalysis = useCallback(async (text: string) => {
    setIsProcessing(true);
    try {
      const result = await analyzeText(text);
      setTextResult(result);
      computeSmartFusion(result, audioResult, facialResult);
    } catch (err) {
      console.error('Text analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [analyzeText, audioResult, facialResult, computeSmartFusion]);

  const handleAudioAnalysis = useCallback(async (audioData: Float32Array) => {
    setIsProcessing(true);
    try {
      const result = await analyzeAudio(audioData);
      setAudioResult(result);
      computeSmartFusion(textResult, result, facialResult);
    } catch (err) {
      console.error('Audio analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [analyzeAudio, textResult, facialResult, computeSmartFusion]);

  const handleFacialAnalysis = useCallback(async (imageData: ImageData) => {
    setIsProcessing(true);
    try {
      const result = await analyzeFacial(imageData);
      setFacialResult(result);
      computeSmartFusion(textResult, audioResult, result);
    } catch (err) {
      console.error('Facial analysis error:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [analyzeFacial, textResult, audioResult, computeSmartFusion]);

  const clearAll = () => {
    setTextResult(null);
    setAudioResult(null);
    setFacialResult(null);
    setFusedResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">MindGuard AI</h1>
                <p className="text-xs text-purple-300">Multi-Modal Mental Health Analysis</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Active Modalities Indicator */}
              {fusedResult && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                  <span className="text-xs text-gray-400 mr-1">Active:</span>
                  <span className={`text-sm ${fusedResult.activeModalities.text ? 'text-blue-400' : 'text-gray-600'}`} title="Text">📝</span>
                  <span className={`text-sm ${fusedResult.activeModalities.audio ? 'text-purple-400' : 'text-gray-600'}`} title="Audio">🎤</span>
                  <span className={`text-sm ${fusedResult.activeModalities.facial ? 'text-green-400' : 'text-gray-600'}`} title="Facial">📷</span>
                </div>
              )}

              {/* Status Indicator */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full">
                <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : error ? 'bg-orange-400' : 'bg-green-400'}`} />
                <span className="text-sm text-white">
                  {isLoading ? 'Loading Models...' : error ? 'Fallback Mode' : 'Models Ready'}
                </span>
              </div>

              {/* Clear Button */}
              {(textResult || audioResult || facialResult) && (
                <button
                  onClick={clearAll}
                  className="px-4 py-1.5 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg text-sm transition"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Privacy Notice */}
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl flex items-start gap-3">
          <svg className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <div className="text-sm text-green-200">
            <strong>Privacy-First Design:</strong> All analysis runs locally in your browser. 
            No data is sent to external servers. Audio/video is processed in real-time and not stored. 
            HIPAA-compliant architecture ready for deployment.
          </div>
        </div>

        {/* Input Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Multi-Modal Input
            <span className="text-xs text-gray-400 font-normal ml-2">— analyze with one, two, or all three modalities</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <TextInput onAnalyze={handleTextAnalysis} isProcessing={isProcessing || isLoading} />
            <AudioInput onAudioData={handleAudioAnalysis} isProcessing={isProcessing} />
            <CameraInput onImageData={handleFacialAnalysis} isProcessing={isProcessing} />
          </div>
        </section>

        {/* Results Section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Analysis Results & Risk Assessment
          </h2>
          <ResultsPanel
            textResult={textResult}
            audioResult={audioResult}
            facialResult={facialResult}
            fusedResult={fusedResult}
          />
        </section>

        {/* Alerts & Recommendations */}
        {fusedResult && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Alerts & Recommendations
            </h2>
            <AlertsAndRecommendations fusedResult={fusedResult} textResult={textResult} />
          </section>
        )}

        {/* Explainability & Model Info */}
        <section className="grid md:grid-cols-2 gap-6">
          <ExplainabilityPanel fusedResult={fusedResult} textResult={textResult} />
          <ModelInfo isLoading={isLoading} loadingProgress={loadingProgress} error={error} />
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            <strong className="text-purple-400">MindGuard AI</strong> - Multi-Modal Deep Learning System for Mental Health Analysis
          </p>
          <p className="text-xs text-gray-500 mt-2">
            This is a demonstration system. For real mental health concerns, please consult a professional.
            <br />
            Crisis Helpline: <strong>988</strong> (US) | <strong>116 123</strong> (UK)
          </p>
          <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
            <span>✓ Privacy-Aware</span>
            <span>✓ HIPAA Ready</span>
            <span>✓ Explainable AI</span>
            <span>✓ Real-time Processing</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
