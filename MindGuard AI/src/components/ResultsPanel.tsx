import React from 'react';

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

interface ResultsPanelProps {
  textResult: TextResult | null;
  audioResult: AudioResult | null;
  facialResult: FacialResult | null;
  fusedResult: FusedResult | null;
}

const ProgressBar: React.FC<{ value: number; color: string; label: string }> = ({ value, color, label }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{(value * 100).toFixed(1)}%</span>
    </div>
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${value * 100}%` }}
      />
    </div>
  </div>
);

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  textResult,
  audioResult,
  facialResult,
  fusedResult
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'moderate': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-green-50 border-green-200';
    }
  };

  const getRiskStrokeColor = (level: string) => {
    switch (level) {
      case 'critical': return '#dc2626';
      case 'high': return '#f97316';
      case 'moderate': return '#eab308';
      default: return '#22c55e';
    }
  };

  // Nothing analyzed yet
  if (!textResult && !audioResult && !facialResult) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-700 mb-2">No Analysis Yet</h3>
        <p className="text-gray-500">Use the input panels above to analyze text, audio, or facial expressions.</p>
        <div className="mt-4 flex justify-center gap-4 text-sm text-gray-400">
          <span>📝 Type text & click Analyze</span>
          <span>🎤 Record audio</span>
          <span>📷 Capture face</span>
        </div>
      </div>
    );
  }

  // Count active modalities
  const activeCount = [textResult, audioResult, facialResult].filter(Boolean).length;
  const activeLabel = activeCount === 1 ? '1 modality' : `${activeCount} modalities`;

  return (
    <div className="space-y-6">
      {/* Fused Risk Score — only shows for used modalities */}
      {fusedResult && (
        <div className={`rounded-xl border-2 p-6 ${getRiskBgColor(fusedResult.riskLevel)}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Mental Health Risk Assessment</h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Based on {activeLabel} analyzed
                {activeCount < 3 && (
                  <span className="text-amber-600 ml-1">
                    — add more modalities for higher accuracy
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 bg-white/60 px-2 py-0.5 rounded-full">
                Confidence: {(fusedResult.confidence * 100).toFixed(0)}%
              </span>
              <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getRiskColor(fusedResult.riskLevel)}`}>
                {fusedResult.riskLevel.toUpperCase()}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 mb-6">
            {/* Risk circle */}
            <div className="relative w-32 h-32 flex-shrink-0">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle cx="64" cy="64" r="56" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={getRiskStrokeColor(fusedResult.riskLevel)}
                  strokeWidth="12"
                  strokeDasharray={`${fusedResult.overallRisk * 352} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{(fusedResult.overallRisk * 100).toFixed(0)}</span>
                <span className="text-xs text-gray-500">Risk Score</span>
              </div>
            </div>

            {/* Breakdown — ONLY for active modalities */}
            <div className="flex-1 space-y-3">
              {fusedResult.activeModalities.text && (
                <ProgressBar value={fusedResult.breakdown.text} color="bg-blue-500" label={`📝 Text Risk (weight: ${(fusedResult.weights.text * 100).toFixed(0)}%)`} />
              )}
              {fusedResult.activeModalities.audio && (
                <ProgressBar value={fusedResult.breakdown.audio} color="bg-purple-500" label={`🎤 Audio Risk (weight: ${(fusedResult.weights.audio * 100).toFixed(0)}%)`} />
              )}
              {fusedResult.activeModalities.facial && (
                <ProgressBar value={fusedResult.breakdown.facial} color="bg-green-500" label={`📷 Facial Risk (weight: ${(fusedResult.weights.facial * 100).toFixed(0)}%)`} />
              )}
            </div>
          </div>

          {/* Hint to add more modalities */}
          {activeCount < 3 && (
            <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2.5 flex items-center gap-2">
              <span>💡</span>
              <span>
                You used <strong>{activeCount === 1 ? 'only 1 modality' : '2 modalities'}</strong>.
                Add {activeCount === 1 ? 'audio or facial input' : 'the remaining input'} for more accurate results (confidence: {activeCount === 1 ? '65%' : '80%'} → {activeCount === 2 ? '92%' : '80%'}).
              </span>
            </div>
          )}
        </div>
      )}

      {/* Individual Results — ONLY for modalities that were used */}

      {/* Text Analysis Results */}
      {textResult && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-base">📝</span>
            </div>
            <h3 className="font-semibold text-gray-900">Text Analysis Results</h3>
            <span className="ml-auto px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
              ✓ Analyzed
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Sentiment</span>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-lg font-semibold ${
                  textResult.sentiment.label === 'POSITIVE' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {textResult.sentiment.label === 'POSITIVE' ? '😊' : '😟'} {textResult.sentiment.label}
                </span>
                <span className="text-sm text-gray-400">
                  ({(textResult.sentiment.score * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-500">Keywords Found</span>
              <div className="text-lg font-semibold text-gray-700 mt-1">
                {textResult.keywords.length > 0 ? textResult.keywords.slice(0, 3).join(', ') : 'None'}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <ProgressBar value={textResult.emotions.stress} color="bg-red-400" label="Stress" />
            <ProgressBar value={textResult.emotions.depression} color="bg-indigo-400" label="Depression" />
            <ProgressBar value={textResult.emotions.anxiety} color="bg-yellow-400" label="Anxiety" />
            <ProgressBar value={textResult.emotions.positivity} color="bg-green-400" label="Positivity" />
          </div>

          {textResult.riskIndicators.length > 0 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800 mb-2">⚠️ Risk Indicators Detected</h4>
              <ul className="space-y-1">
                {textResult.riskIndicators.map((indicator, i) => (
                  <li key={i} className="text-sm text-red-700">• {indicator}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Audio Analysis Results */}
      {audioResult && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-base">🎤</span>
            </div>
            <h3 className="font-semibold text-gray-900">Audio Analysis Results</h3>
            <span className="ml-auto px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              ✓ Analyzed
            </span>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-sm text-gray-500">Energy</span>
              <div className="text-xl font-semibold text-purple-600">
                {(audioResult.energy * 100).toFixed(0)}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-sm text-gray-500">Pitch</span>
              <div className="text-xl font-semibold text-purple-600">
                {(audioResult.pitch * 100).toFixed(0)}%
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <span className="text-sm text-gray-500">Tempo</span>
              <div className="text-xl font-semibold text-purple-600">
                {(audioResult.tempo * 100).toFixed(0)}%
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <ProgressBar value={audioResult.emotions.calm} color="bg-green-400" label="Calm" />
            <ProgressBar value={audioResult.emotions.stressed} color="bg-red-400" label="Stressed" />
            <ProgressBar value={audioResult.emotions.sad} color="bg-indigo-400" label="Sad" />
            <ProgressBar value={audioResult.emotions.anxious} color="bg-yellow-400" label="Anxious" />
          </div>
        </div>
      )}

      {/* Facial Analysis Results */}
      {facialResult && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-base">📷</span>
            </div>
            <h3 className="font-semibold text-gray-900">Facial Expression Results</h3>
            <span className="ml-auto px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              ✓ Analyzed
            </span>
          </div>

          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <span className="text-sm text-gray-500">Dominant Expression</span>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl">
                {facialResult.dominantExpression === 'happy' ? '😊' :
                 facialResult.dominantExpression === 'sad' ? '😢' :
                 facialResult.dominantExpression === 'angry' ? '😠' :
                 facialResult.dominantExpression === 'fearful' ? '😨' :
                 facialResult.dominantExpression === 'disgusted' ? '🤢' :
                 facialResult.dominantExpression === 'surprised' ? '😲' : '😐'}
              </span>
              <div>
                <div className="text-xl font-bold text-green-700 capitalize">
                  {facialResult.dominantExpression}
                </div>
                <div className="text-sm text-gray-500">
                  {(facialResult.expressions[facialResult.dominantExpression as keyof typeof facialResult.expressions] * 100).toFixed(1)}% confidence
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {Object.entries(facialResult.expressions)
              .sort(([, a], [, b]) => b - a)
              .map(([expression, value]) => {
                const emoji = expression === 'happy' ? '😊' :
                              expression === 'sad' ? '😢' :
                              expression === 'angry' ? '😠' :
                              expression === 'fearful' ? '😨' :
                              expression === 'disgusted' ? '🤢' :
                              expression === 'surprised' ? '😲' : '😐';
                const isTop = expression === facialResult.dominantExpression;
                return (
                  <div key={expression} className={`p-2 rounded-lg ${isTop ? 'bg-green-50 border border-green-200' : ''}`}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className={`capitalize flex items-center gap-1.5 ${isTop ? 'text-green-700 font-semibold' : 'text-gray-600'}`}>
                        <span>{emoji}</span> {expression}
                      </span>
                      <span className={`font-medium ${isTop ? 'text-green-700' : 'text-gray-700'}`}>
                        {(value * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${isTop ? 'bg-green-500' : 'bg-green-300'}`}
                        style={{ width: `${value * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
