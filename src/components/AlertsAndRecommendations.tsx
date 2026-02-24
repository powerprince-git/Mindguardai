import React from 'react';

interface FusedResult {
  overallRisk: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  breakdown: { text: number; audio: number; facial: number };
  activeModalities: { text: boolean; audio: boolean; facial: boolean };
}

interface TextResult {
  riskIndicators: string[];
}

interface AlertsAndRecommendationsProps {
  fusedResult: FusedResult | null;
  textResult: TextResult | null;
}

interface Alert {
  id: string;
  level: 'critical' | 'high' | 'medium' | 'info';
  title: string;
  message: string;
  action?: string;
}

interface Recommendation {
  id: string;
  category: 'immediate' | 'short-term' | 'long-term';
  title: string;
  description: string;
  icon: string;
}

export const AlertsAndRecommendations: React.FC<AlertsAndRecommendationsProps> = ({
  fusedResult,
  textResult
}) => {
  const generateAlerts = (): Alert[] => {
    const alerts: Alert[] = [];
    if (!fusedResult) return alerts;

    const active = fusedResult.activeModalities;
    const hasHighRiskIndicators = textResult?.riskIndicators.some(r => r.startsWith('HIGH'));

    if (hasHighRiskIndicators || fusedResult.riskLevel === 'critical') {
      alerts.push({
        id: 'crisis',
        level: 'critical',
        title: '🚨 CRISIS ALERT',
        message: 'High-risk indicators detected suggesting potential crisis situation.',
        action: 'Contact crisis intervention team immediately'
      });
    }

    if (fusedResult.riskLevel === 'high') {
      alerts.push({
        id: 'high-risk',
        level: 'high',
        title: '⚠️ High Risk Detected',
        message: 'Multiple indicators suggest elevated mental health risk.',
        action: 'Schedule urgent professional consultation'
      });
    }

    // Only show modality-specific alerts for modalities that were actually used
    if (active.text && fusedResult.breakdown.text > 0.5) {
      alerts.push({
        id: 'text-risk',
        level: 'medium',
        title: '📝 Concerning Language Patterns',
        message: 'Text analysis reveals negative sentiment and stress indicators.',
      });
    }

    if (active.audio && fusedResult.breakdown.audio > 0.5) {
      alerts.push({
        id: 'audio-risk',
        level: 'medium',
        title: '🎤 Voice Stress Indicators',
        message: 'Audio analysis shows signs of emotional distress.',
      });
    }

    if (active.facial && fusedResult.breakdown.facial > 0.4) {
      alerts.push({
        id: 'facial-risk',
        level: 'medium',
        title: '😔 Negative Facial Expressions',
        message: 'Facial analysis indicates distressed emotional state.',
      });
    }

    if (fusedResult.riskLevel === 'low') {
      alerts.push({
        id: 'stable',
        level: 'info',
        title: '✅ Stable Status',
        message: 'No immediate concerns detected. Continue regular monitoring.',
      });
    }

    if (fusedResult.riskLevel === 'moderate') {
      alerts.push({
        id: 'moderate',
        level: 'medium',
        title: '🔶 Moderate Risk',
        message: 'Some indicators suggest mild to moderate mental health concern.',
      });
    }

    return alerts;
  };

  const generateRecommendations = (): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    if (!fusedResult) return recommendations;

    if (fusedResult.riskLevel === 'critical' || fusedResult.riskLevel === 'high') {
      recommendations.push({
        id: 'crisis-line',
        category: 'immediate',
        title: 'Contact Crisis Helpline',
        description: 'National Suicide Prevention Lifeline: 988 (US) or local emergency services',
        icon: '📞'
      });
      recommendations.push({
        id: 'professional',
        category: 'immediate',
        title: 'Seek Professional Help',
        description: 'Schedule an appointment with a mental health professional immediately',
        icon: '👨‍⚕️'
      });
    }

    if (fusedResult.riskLevel === 'moderate' || fusedResult.riskLevel === 'high') {
      recommendations.push({
        id: 'therapist',
        category: 'short-term',
        title: 'Connect with a Therapist',
        description: 'Consider speaking with a licensed therapist about your feelings',
        icon: '🧠'
      });
      recommendations.push({
        id: 'support',
        category: 'short-term',
        title: 'Reach Out to Support Network',
        description: 'Talk to trusted friends, family, or support groups',
        icon: '👥'
      });
    }

    recommendations.push({
      id: 'self-care',
      category: 'short-term',
      title: 'Practice Self-Care',
      description: 'Engage in activities that promote relaxation and well-being',
      icon: '🧘'
    });

    recommendations.push({
      id: 'sleep',
      category: 'long-term',
      title: 'Improve Sleep Hygiene',
      description: 'Maintain regular sleep schedule and create a restful environment',
      icon: '😴'
    });

    recommendations.push({
      id: 'exercise',
      category: 'long-term',
      title: 'Regular Physical Activity',
      description: 'Exercise has proven benefits for mental health',
      icon: '🏃'
    });

    recommendations.push({
      id: 'mindfulness',
      category: 'long-term',
      title: 'Mindfulness & Meditation',
      description: 'Practice daily mindfulness exercises to reduce stress',
      icon: '🧘‍♀️'
    });

    return recommendations;
  };

  const alerts = generateAlerts();
  const recommendations = generateRecommendations();

  const getAlertStyle = (level: Alert['level']) => {
    switch (level) {
      case 'critical':
        return 'bg-red-50 border-red-400 text-red-800';
      case 'high':
        return 'bg-orange-50 border-orange-400 text-orange-800';
      case 'medium':
        return 'bg-yellow-50 border-yellow-400 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-400 text-blue-800';
    }
  };

  if (!fusedResult) return null;

  const activeCount = [fusedResult.activeModalities.text, fusedResult.activeModalities.audio, fusedResult.activeModalities.facial].filter(Boolean).length;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Alerts Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Alert Generation
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Based on {activeCount} analyzed {activeCount === 1 ? 'modality' : 'modalities'}
        </p>

        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border-l-4 rounded-r-lg ${getAlertStyle(alert.level)}`}
            >
              <h4 className="font-semibold">{alert.title}</h4>
              <p className="text-sm mt-1 opacity-90">{alert.message}</p>
              {alert.action && (
                <p className="text-sm mt-2 font-medium">→ {alert.action}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Recommendations
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Personalized based on risk level: {fusedResult.riskLevel.toUpperCase()}
        </p>

        <div className="space-y-4">
          {['immediate', 'short-term', 'long-term'].map((category) => {
            const categoryRecs = recommendations.filter(r => r.category === category);
            if (categoryRecs.length === 0) return null;

            return (
              <div key={category}>
                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
                  {category === 'immediate' ? '🔴 Immediate' : category === 'short-term' ? '🟡 Short-term' : '🟢 Long-term'}
                </h4>
                <div className="space-y-2">
                  {categoryRecs.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-gray-50 rounded-lg flex items-start gap-3 hover:bg-gray-100 transition"
                    >
                      <span className="text-2xl">{rec.icon}</span>
                      <div>
                        <h5 className="font-medium text-gray-900">{rec.title}</h5>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
