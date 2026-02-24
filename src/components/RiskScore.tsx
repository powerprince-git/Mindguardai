import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { RiskAssessment } from '../types';

interface RiskScoreProps {
  assessment?: RiskAssessment;
}

// Removed unused RiskGauge component

export function RiskScore({ assessment }: RiskScoreProps) {
  const getRiskLevel = (score: number) => {
    if (score < 30) return { level: 'Low', color: 'text-green-600', bg: 'bg-green-100' };
    if (score < 60) return { level: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (score < 80) return { level: 'High', color: 'text-orange-600', bg: 'bg-orange-100' };
    return { level: 'Critical', color: 'text-red-600', bg: 'bg-red-100' };
  };
  
  const TrendIcon = assessment?.trend === 'improving' ? TrendingDown : 
                    assessment?.trend === 'declining' ? TrendingUp : Minus;
  
  const trendColor = assessment?.trend === 'improving' ? 'text-green-500' :
                     assessment?.trend === 'declining' ? 'text-red-500' : 'text-gray-500';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3">
        <div className="flex items-center space-x-3 text-white">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-semibold">Mental Health Risk Assessment</h3>
        </div>
      </div>
      
      {assessment ? (
        <div className="p-4 space-y-4">
          {/* Overall Score */}
          <div className="text-center bg-gray-50 rounded-lg p-4">
            <div className="relative inline-block">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke={assessment.overallScore > 60 ? '#ef4444' : assessment.overallScore > 30 ? '#f59e0b' : '#22c55e'}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(assessment.overallScore / 100) * 352} 352`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{assessment.overallScore.toFixed(0)}</span>
                <span className="text-xs text-gray-500">Overall Score</span>
              </div>
            </div>
            
            <div className="mt-3 flex items-center justify-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskLevel(assessment.overallScore).bg} ${getRiskLevel(assessment.overallScore).color}`}>
                {getRiskLevel(assessment.overallScore).level} Risk
              </span>
              <div className={`flex items-center space-x-1 ${trendColor}`}>
                <TrendIcon className="w-4 h-4" />
                <span className="text-xs capitalize">{assessment.trend}</span>
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2">
              Confidence: {(assessment.confidence * 100).toFixed(1)}%
            </p>
          </div>
          
          {/* Individual Risk Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-orange-600">{assessment.stressRisk.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Stress Risk</div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 rounded-full" style={{ width: `${assessment.stressRisk}%` }} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-600">{assessment.depressionRisk.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Depression Risk</div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: `${assessment.depressionRisk}%` }} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{assessment.anxietyRisk.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Anxiety Risk</div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${assessment.anxietyRisk}%` }} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-600">{assessment.crisisRisk.toFixed(0)}%</div>
              <div className="text-xs text-gray-600">Crisis Risk</div>
              <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${assessment.crisisRisk}%` }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-400">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Awaiting analysis...</p>
        </div>
      )}
    </div>
  );
}
