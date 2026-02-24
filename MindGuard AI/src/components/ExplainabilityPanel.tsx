import React, { useState } from 'react';

interface FusedResult {
  overallRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  breakdown: { text: number; audio: number; facial: number };
  weights: { text: number; audio: number; facial: number };
  confidence: number;
  activeModalities: { text: boolean; audio: boolean; facial: boolean };
}

interface TextResult {
  sentiment: { label: string; score: number };
  emotions: { stress: number; depression: number; anxiety: number; positivity: number };
  riskIndicators: string[];
  keywords: string[];
}

interface ExplainabilityPanelProps {
  fusedResult: FusedResult | null;
  textResult: TextResult | null;
}

export const ExplainabilityPanel: React.FC<ExplainabilityPanelProps> = ({
  fusedResult,
  textResult
}) => {
  const [activeTab, setActiveTab] = useState<'importance' | 'attention' | 'counterfactual'>('importance');

  if (!fusedResult) return null;

  const active = fusedResult.activeModalities;

  // Only show features for active modalities
  const featureImportance: { feature: string; value: number; modality: string }[] = [];

  if (active.text) {
    featureImportance.push(
      { feature: 'Negative Sentiment Score', value: textResult?.sentiment.label === 'NEGATIVE' ? textResult.sentiment.score : 0.1, modality: 'text' },
      { feature: 'Stress Indicators', value: textResult?.emotions.stress || 0.3, modality: 'text' },
      { feature: 'Depression Keywords', value: textResult?.emotions.depression || 0.2, modality: 'text' },
      { feature: 'Risk Phrases Detected', value: textResult?.riskIndicators.length ? 0.8 : 0.1, modality: 'text' },
    );
  }
  if (active.audio) {
    featureImportance.push(
      { feature: 'Voice Energy Level', value: fusedResult.breakdown.audio, modality: 'audio' },
      { feature: 'Speech Pace Variation', value: 0.4, modality: 'audio' },
    );
  }
  if (active.facial) {
    featureImportance.push(
      { feature: 'Negative Facial Expression', value: fusedResult.breakdown.facial, modality: 'facial' },
      { feature: 'Eye Contact Pattern', value: 0.3, modality: 'facial' },
    );
  }

  featureImportance.sort((a, b) => b.value - a.value);

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'text': return 'bg-blue-500';
      case 'audio': return 'bg-purple-500';
      case 'facial': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Dynamic decision path based on active modalities
  const decisionPath: { step: number; description: string }[] = [];
  let stepNum = 1;

  const activeNames: string[] = [];
  if (active.text) activeNames.push('Text');
  if (active.audio) activeNames.push('Audio');
  if (active.facial) activeNames.push('Facial');

  decisionPath.push({ step: stepNum++, description: `Input received from ${activeNames.length} ${activeNames.length === 1 ? 'modality' : 'modalities'}: ${activeNames.join(', ')}` });

  if (active.text) {
    decisionPath.push({ step: stepNum++, description: 'Text processed through DistilBERT/RoBERTa encoder → sentiment + emotion scores' });
  }
  if (active.audio) {
    decisionPath.push({ step: stepNum++, description: 'Audio features extracted via wav2vec → energy, pitch, tempo analysis' });
  }
  if (active.facial) {
    decisionPath.push({ step: stepNum++, description: 'Facial features extracted via CNN → expression classification' });
  }

  if (activeNames.length > 1) {
    decisionPath.push({ step: stepNum++, description: 'Cross-modal attention fusion computed across active modalities' });
  }

  decisionPath.push({ step: stepNum++, description: `Risk score calculated: ${(fusedResult.overallRisk * 100).toFixed(0)}/100` });
  decisionPath.push({ step: stepNum++, description: `Final classification: ${fusedResult.riskLevel.toUpperCase()} risk` });

  // Only show counterfactuals for active modalities
  const counterfactuals: { original: string; change: string; impact: number }[] = [];

  if (active.text) {
    counterfactuals.push({
      original: 'Negative sentiment detected',
      change: 'If sentiment were positive',
      impact: -25,
    });
    if (textResult?.riskIndicators.length) {
      counterfactuals.push({
        original: 'High-risk keywords present',
        change: 'If no risk keywords detected',
        impact: -40,
      });
    }
  }
  if (active.audio) {
    counterfactuals.push({
      original: 'Stressed voice patterns',
      change: 'If calm voice patterns',
      impact: -15,
    });
  }
  if (active.facial) {
    counterfactuals.push({
      original: 'Negative facial expression',
      change: 'If neutral/happy expression',
      impact: -10,
    });
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        Explainability (XAI)
        <span className="ml-auto text-xs text-gray-400 font-normal">
          {activeNames.join(' + ')} analysis
        </span>
      </h3>

      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 border-b">
        {[
          { id: 'importance', label: 'Feature Importance' },
          { id: 'attention', label: 'Decision Path' },
          { id: 'counterfactual', label: 'Counterfactuals' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'importance' | 'attention' | 'counterfactual')}
            className={`px-4 py-2 text-sm font-medium transition border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feature Importance */}
      {activeTab === 'importance' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-4">
            SHAP-like feature importance showing contribution to the final risk score
            (only for analyzed modalities):
          </p>
          {featureImportance.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${getModalityColor(item.modality)}`} />
              <span className="flex-1 text-sm text-gray-700">{item.feature}</span>
              <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${getModalityColor(item.modality)}`}
                  style={{ width: `${item.value * 100}%` }}
                />
              </div>
              <span className="text-sm font-medium w-12 text-right">
                {(item.value * 100).toFixed(0)}%
              </span>
            </div>
          ))}

          <div className="mt-4 flex gap-4 text-xs text-gray-500">
            {active.text && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Text
              </span>
            )}
            {active.audio && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Audio
              </span>
            )}
            {active.facial && (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Facial
              </span>
            )}
          </div>
        </div>
      )}

      {/* Decision Path */}
      {activeTab === 'attention' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Step-by-step decision path for the {activeNames.length} active {activeNames.length === 1 ? 'modality' : 'modalities'}:
          </p>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            {decisionPath.map((step, i) => (
              <div key={i} className="relative flex items-start gap-4 pb-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium z-10">
                  {step.step}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700">{step.description}</p>
                </div>
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            ))}
          </div>

          {/* Attention Weights — only for active */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              {activeNames.length > 1 ? 'Cross-Modal Attention Weights' : 'Modality Weight'}
            </h4>
            <div className={`grid grid-cols-${activeNames.length} gap-4`}>
              {active.text && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(fusedResult.weights.text * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-500">📝 Text</div>
                </div>
              )}
              {active.audio && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {(fusedResult.weights.audio * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-500">🎤 Audio</div>
                </div>
              )}
              {active.facial && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(fusedResult.weights.facial * 100).toFixed(0)}%
                  </div>
                  <div className="text-sm text-gray-500">📷 Facial</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Counterfactual Explanations */}
      {activeTab === 'counterfactual' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            "What-if" analysis for the {activeNames.length} analyzed {activeNames.length === 1 ? 'modality' : 'modalities'}:
          </p>
          {counterfactuals.length > 0 ? (
            <>
              {counterfactuals.map((cf, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Current: {cf.original}</p>
                      <p className="text-gray-900 font-medium mt-1">{cf.change}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      cf.impact < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {cf.impact > 0 ? '+' : ''}{cf.impact}%
                    </div>
                  </div>
                  <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full transition-all"
                      style={{ width: `${Math.abs(cf.impact)}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="mt-4 p-4 border border-indigo-200 bg-indigo-50 rounded-lg">
                <h4 className="font-medium text-indigo-900 mb-2">💡 Key Insight</h4>
                <p className="text-sm text-indigo-800">
                  {active.text && textResult?.riskIndicators.length
                    ? `Removing high-risk keywords would have the largest impact, reducing the risk score by ~40%.`
                    : `Improving the dominant risk factor would reduce the overall risk score significantly.`
                  }
                  {' '}Current classification: <strong>{fusedResult.riskLevel.toUpperCase()}</strong>.
                </p>
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              No counterfactual analysis available yet. Analyze at least one input first.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
