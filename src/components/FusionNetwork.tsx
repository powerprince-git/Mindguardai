import { Layers, Zap } from 'lucide-react';
import type { FusionOutput } from '../types';

interface FusionNetworkProps {
  fusionOutput?: FusionOutput;
  isProcessing: boolean;
}

export function FusionNetwork({ fusionOutput, isProcessing }: FusionNetworkProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3">
        <div className="flex items-center space-x-3 text-white">
          <Layers className="w-5 h-5" />
          <div>
            <h3 className="font-semibold">Multi-Modal Attention Fusion</h3>
            <p className="text-xs text-indigo-200">Cross-Modal Transformer (8 heads, 4 layers)</p>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Architecture Visualization */}
        <div className="relative bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                isProcessing ? 'bg-gradient-to-br from-blue-500 to-cyan-500 animate-pulse' : 'bg-blue-100'
              }`}>
                <span className="text-xs font-bold text-white">BERT</span>
              </div>
              <span className="text-xs text-gray-500">768-dim</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                isProcessing ? 'bg-gradient-to-br from-green-500 to-emerald-500 animate-pulse' : 'bg-green-100'
              }`}>
                <span className="text-xs font-bold text-white">W2V</span>
              </div>
              <span className="text-xs text-gray-500">512-dim</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                isProcessing ? 'bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse' : 'bg-purple-100'
              }`}>
                <span className="text-xs font-bold text-white">CNN</span>
              </div>
              <span className="text-xs text-gray-500">256-dim</span>
            </div>
          </div>
          
          {/* Connection Lines */}
          <div className="absolute top-20 left-0 right-0 flex justify-center">
            <svg className="w-full h-12" viewBox="0 0 300 40">
              <path d="M50 0 L150 35" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.5" />
              <path d="M150 0 L150 35" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.5" />
              <path d="M250 0 L150 35" stroke="#6366f1" strokeWidth="2" fill="none" opacity="0.5" />
            </svg>
          </div>
          
          {/* Fusion Block */}
          <div className="flex justify-center mt-2">
            <div className={`px-6 py-3 rounded-lg text-white flex items-center space-x-2 ${
              isProcessing ? 'bg-gradient-to-r from-indigo-600 to-purple-600 animate-pulse' : 'bg-indigo-500'
            }`}>
              <Zap className="w-4 h-4" />
              <span className="text-sm font-semibold">Cross-Modal Attention</span>
            </div>
          </div>
        </div>
        
        {/* Attention Weights */}
        {fusionOutput && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-700">Modality Weights</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span className="w-16 text-xs text-gray-600">Text</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${fusionOutput.textWeight * 100}%` }}
                  />
                </div>
                <span className="w-12 text-xs font-medium text-right">{(fusionOutput.textWeight * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-16 text-xs text-gray-600">Audio</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500"
                    style={{ width: `${fusionOutput.audioWeight * 100}%` }}
                  />
                </div>
                <span className="w-12 text-xs font-medium text-right">{(fusionOutput.audioWeight * 100).toFixed(1)}%</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="w-16 text-xs text-gray-600">Facial</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full transition-all duration-500"
                    style={{ width: `${fusionOutput.facialWeight * 100}%` }}
                  />
                </div>
                <span className="w-12 text-xs font-medium text-right">{(fusionOutput.facialWeight * 100).toFixed(1)}%</span>
              </div>
            </div>
            
            {/* Attention Heatmap */}
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Attention Scores</h4>
              <div className="grid grid-cols-12 gap-0.5">
                {fusionOutput.attentionScores.map((score, i) => (
                  <div
                    key={i}
                    className="h-6 rounded-sm transition-all duration-300"
                    style={{
                      backgroundColor: `rgba(99, 102, 241, ${score})`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
