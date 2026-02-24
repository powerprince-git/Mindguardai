import { Brain, Shield, Activity, Bell } from 'lucide-react';

interface HeaderProps {
  activeAlerts: number;
}

export function Header({ activeAlerts }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-indigo-900 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">MindGuard AI</h1>
              <p className="text-indigo-200 text-sm">Multi-Modal Mental Health Analysis System</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-indigo-800/50 px-4 py-2 rounded-lg">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-sm">System Active</span>
            </div>
            <div className="flex items-center space-x-2 bg-indigo-800/50 px-4 py-2 rounded-lg">
              <Shield className="w-5 h-5 text-cyan-400" />
              <span className="text-sm">Privacy Protected</span>
            </div>
            <div className="relative">
              <button className="p-2 bg-indigo-800/50 rounded-lg hover:bg-indigo-700/50 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              {activeAlerts > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
                  {activeAlerts}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
