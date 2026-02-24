import { Eye, BarChart3, GitBranch, HelpCircle } from 'lucide-react';
import type { ExplainabilityData } from '../types';

interface ExplainabilityProps {
  data: ExplainabilityData;
}

export function Explainability({ data }: ExplainabilityProps) {
  const modalityColors: Record<string, string> = {
    text: 'bg-blue-500',
    audio: 'bg-green-500',
    facial: 'bg-purple-500',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-600 px-4 py-3">
        <div className="flex items-center space-x-3 text-white">
          <Eye className="w-5 h-5" />
          <h3 className="font-semibold">Model Explainability (XAI)</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Feature Importance */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <BarChart3 className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-800">Feature Importance</h4>
          </div>
          <div className="space-y-2">
            {data.featureImportance.slice(0, 6).map((item, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${modalityColors[item.modality]}`} />
                <span className="text-xs text-gray-600 w-40 truncate">{item.feature}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${modalityColors[item.modality]} rounded-full transition-all duration-500`}
                    style={{ width: `${item.importance * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-12 text-right">{(item.importance * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-500" /><span>Text</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-green-500" /><span>Audio</span></span>
            <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-purple-500" /><span>Facial</span></span>
          </div>
        </div>
        
        {/* Attention Heatmap */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <Eye className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-800">Cross-Modal Attention</h4>
          </div>
          <div className="grid grid-cols-8 gap-0.5 bg-gray-100 p-2 rounded-lg">
            {data.attentionVisualization.flat().map((val, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm"
                style={{
                  backgroundColor: `rgba(139, 92, 246, ${val})`,
                }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low attention</span>
            <span>High attention</span>
          </div>
        </div>
        
        {/* Decision Path */}
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <GitBranch className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-800">Decision Path</h4>
          </div>
          <div className="space-y-2">
            {data.decisionPath.map((step, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  {i < data.decisionPath.length - 1 && (
                    <div className="w-0.5 h-4 bg-indigo-200" />
                  )}
                </div>
                <p className="text-sm text-gray-600 pt-1">{step}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Counterfactual */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-gray-500 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-gray-800">Counterfactual Explanation</h4>
              <p className="text-xs text-gray-600 mt-1">{data.counterfactualExplanation}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
