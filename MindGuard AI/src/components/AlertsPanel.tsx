import { AlertTriangle, AlertCircle, Info, Check } from 'lucide-react';
import type { Alert } from '../types';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge: (id: string) => void;
}

export function AlertsPanel({ alerts, onAcknowledge }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'crisis': return <AlertTriangle className="w-5 h-5" />;
      case 'high_risk': return <AlertCircle className="w-5 h-5" />;
      case 'warning': return <AlertCircle className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };
  
  const getAlertStyles = (type: Alert['type']) => {
    switch (type) {
      case 'crisis': return 'bg-red-50 border-red-200 text-red-800';
      case 'high_risk': return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default: return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };
  
  const getIconStyles = (type: Alert['type']) => {
    switch (type) {
      case 'crisis': return 'text-red-500';
      case 'high_risk': return 'text-orange-500';
      case 'warning': return 'text-yellow-500';
      default: return 'text-blue-500';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 px-4 py-3">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-semibold">Alert Center</h3>
          </div>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {alerts.filter(a => !a.acknowledged).length} Active
          </span>
        </div>
      </div>
      
      <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
        {alerts.map(alert => (
          <div 
            key={alert.id}
            className={`p-3 border-l-4 ${getAlertStyles(alert.type)} ${alert.acknowledged ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={getIconStyles(alert.type)}>
                  {getAlertIcon(alert.type)}
                </div>
                <div>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              {!alert.acknowledged && (
                <button
                  onClick={() => onAcknowledge(alert.id)}
                  className="p-1 hover:bg-white/50 rounded transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
