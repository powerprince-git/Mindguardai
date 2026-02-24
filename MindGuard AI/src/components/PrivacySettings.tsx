import { Shield, Lock, Eye, Trash2, Database, Share2 } from 'lucide-react';
import type { PrivacySettings as PrivacySettingsType } from '../types';

interface PrivacySettingsProps {
  settings: PrivacySettingsType;
  onUpdate: (settings: Partial<PrivacySettingsType>) => void;
}

export function PrivacySettings({ settings, onUpdate }: PrivacySettingsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-3">
        <div className="flex items-center space-x-3 text-white">
          <Shield className="w-5 h-5" />
          <h3 className="font-semibold">Privacy & Data Protection</h3>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        {/* Encryption Status */}
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
          <div className="flex items-center space-x-3">
            <Lock className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-800">End-to-End Encryption</p>
              <p className="text-xs text-green-600">AES-256 + RSA-2048</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.encryptionEnabled}
              onChange={(e) => onUpdate({ encryptionEnabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
        
        {/* Anonymization */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Eye className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Data Anonymization</p>
              <p className="text-xs text-gray-500">Remove PII from analysis</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.anonymization}
              onChange={(e) => onUpdate({ anonymization: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
          </label>
        </div>
        
        {/* Data Retention */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Trash2 className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Data Retention Period</p>
              <p className="text-xs text-gray-500">Auto-delete after specified days</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-3">
            <input
              type="range"
              min="7"
              max="365"
              value={settings.dataRetention}
              onChange={(e) => onUpdate({ dataRetention: parseInt(e.target.value) })}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
            <span className="text-sm font-medium w-16 text-right">{settings.dataRetention} days</span>
          </div>
        </div>
        
        {/* Data Sharing */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <Share2 className="w-5 h-5 text-gray-600" />
            <div>
              <p className="text-sm font-medium text-gray-800">Data Sharing Preferences</p>
            </div>
          </div>
          <div className="flex space-x-2">
            {(['none', 'research', 'clinical'] as const).map(option => (
              <button
                key={option}
                onClick={() => onUpdate({ dataSharing: option })}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
                  settings.dataSharing === option
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-indigo-300'
                }`}
              >
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </button>
            ))}
          </div>
        </div>
        
        {/* Consent Status */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-blue-800">Consent Status</p>
              <p className="text-xs text-blue-600">HIPAA Compliant</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            settings.consentGiven ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {settings.consentGiven ? 'Consent Given' : 'Pending'}
          </span>
        </div>
      </div>
    </div>
  );
}
