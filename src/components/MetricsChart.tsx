import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { TrendingUp, Target, Layers } from 'lucide-react';
import { historicalRiskData, trainingProgress, modalityAccuracyData, confusionMatrix } from '../data/mockData';

interface MetricsChartProps {
  activeTab: 'risk' | 'training' | 'performance';
  onTabChange: (tab: 'risk' | 'training' | 'performance') => void;
}

export function MetricsChart({ activeTab, onTabChange }: MetricsChartProps) {
  const tabs = [
    { id: 'risk' as const, label: 'Risk Trends', icon: TrendingUp },
    { id: 'training' as const, label: 'Training', icon: Target },
    { id: 'performance' as const, label: 'Performance', icon: Layers },
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="border-b border-gray-100">
        <div className="flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-4">
        {activeTab === 'risk' && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">30-Day Risk Trend Analysis</h4>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={historicalRiskData}>
                <defs>
                  <linearGradient id="stressGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="depressionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="anxietyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={10} />
                <YAxis stroke="#9ca3af" fontSize={10} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Area type="monotone" dataKey="stress" stroke="#f97316" fill="url(#stressGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="depression" stroke="#8b5cf6" fill="url(#depressionGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="anxiety" stroke="#3b82f6" fill="url(#anxietyGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {activeTab === 'training' && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Model Training Progress</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trainingProgress.filter((_, i) => i % 5 === 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="epoch" stroke="#9ca3af" fontSize={10} />
                <YAxis yAxisId="left" stroke="#9ca3af" fontSize={10} domain={[0, 1]} />
                <YAxis yAxisId="right" orientation="right" stroke="#9ca3af" fontSize={10} domain={[0, 3]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    borderRadius: '8px', 
                    border: '1px solid #e5e7eb'
                  }} 
                />
                <Legend />
                <Line yAxisId="right" type="monotone" dataKey="trainLoss" stroke="#ef4444" strokeWidth={2} dot={false} name="Train Loss" />
                <Line yAxisId="right" type="monotone" dataKey="valLoss" stroke="#f97316" strokeWidth={2} dot={false} name="Val Loss" />
                <Line yAxisId="left" type="monotone" dataKey="trainAcc" stroke="#22c55e" strokeWidth={2} dot={false} name="Train Acc" />
                <Line yAxisId="left" type="monotone" dataKey="valAcc" stroke="#3b82f6" strokeWidth={2} dot={false} name="Val Acc" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {activeTab === 'performance' && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Modality Performance Comparison</h4>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={modalityAccuracyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" domain={[0.7, 1]} stroke="#9ca3af" fontSize={10} />
                  <YAxis type="category" dataKey="modality" stroke="#9ca3af" fontSize={10} width={100} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      border: '1px solid #e5e7eb'
                    }} 
                  />
                  <Bar dataKey="accuracy" fill="#6366f1" radius={[0, 4, 4, 0]} name="Accuracy" />
                  <Bar dataKey="f1" fill="#22c55e" radius={[0, 4, 4, 0]} name="F1 Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Confusion Matrix</h4>
              <div className="text-xs text-gray-500 mb-2">Rows: Actual | Columns: Predicted</div>
              <div className="grid grid-cols-5 gap-1 text-center text-xs">
                <div></div>
                <div className="font-medium text-gray-600">Low</div>
                <div className="font-medium text-gray-600">Mod</div>
                <div className="font-medium text-gray-600">High</div>
                <div className="font-medium text-gray-600">Crit</div>
                {['Low', 'Moderate', 'High', 'Critical'].map((label, i) => (
              <React.Fragment key={`row-${i}`}>
                <div className="font-medium text-gray-600">{label}</div>
                {confusionMatrix[i].map((val, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="py-2 rounded"
                    style={{
                      backgroundColor: i === j 
                        ? `rgba(34, 197, 94, ${val / 300})` 
                        : `rgba(239, 68, 68, ${val / 100})`
                    }}
                  >
                    {val}
                  </div>
                ))}
              </React.Fragment>
            ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
