import { FileText, Mic, Camera, Loader2, CheckCircle } from 'lucide-react';
import type { TextAnalysis, AudioAnalysis, FacialAnalysis } from '../types';

interface ProcessorCardProps {
  title: string;
  icon: React.ReactNode;
  model: string;
  status: 'idle' | 'processing' | 'complete';
  children: React.ReactNode;
}

function ProcessorCard({ title, icon, model, status, children }: ProcessorCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg text-white">
              {icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">{title}</h3>
              <p className="text-xs text-gray-500">{model}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {status === 'processing' && <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />}
            {status === 'complete' && <CheckCircle className="w-4 h-4 text-green-500" />}
            <span className={`text-xs px-2 py-1 rounded-full ${
              status === 'idle' ? 'bg-gray-100 text-gray-500' :
              status === 'processing' ? 'bg-indigo-100 text-indigo-600' :
              'bg-green-100 text-green-600'
            }`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

interface TextProcessorProps {
  analysis?: TextAnalysis;
  status: 'idle' | 'processing' | 'complete';
}

export function TextProcessor({ analysis, status }: TextProcessorProps) {
  return (
    <ProcessorCard
      title="Text Analysis"
      icon={<FileText className="w-5 h-5" />}
      model="RoBERTa-base (125M params)"
      status={status}
    >
      {analysis ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Sentiment</p>
              <p className={`font-semibold ${
                analysis.sentiment === 'positive' ? 'text-green-600' :
                analysis.sentiment === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>{analysis.sentiment}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="font-semibold text-indigo-600">{(analysis.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Stress Level</span>
              <span className="font-medium">{analysis.stressLevel.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${analysis.stressLevel}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Depression Indicators</span>
              <span className="font-medium">{analysis.depressionIndicators.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${analysis.depressionIndicators}%` }}
              />
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2">Detected Keywords</p>
            <div className="flex flex-wrap gap-1">
              {analysis.keywords.map((kw, i) => (
                <span key={i} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Awaiting text input...</p>
        </div>
      )}
    </ProcessorCard>
  );
}

interface AudioProcessorProps {
  analysis?: AudioAnalysis;
  status: 'idle' | 'processing' | 'complete';
}

export function AudioProcessor({ analysis, status }: AudioProcessorProps) {
  return (
    <ProcessorCard
      title="Audio Analysis"
      icon={<Mic className="w-5 h-5" />}
      model="wav2vec 2.0 (95M params)"
      status={status}
    >
      {analysis ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Emotion</p>
              <p className="font-semibold text-indigo-600 capitalize">{analysis.emotion}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="font-semibold text-indigo-600">{(analysis.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Voice Stress</span>
              <span className="font-medium">{analysis.voiceStress.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${analysis.voiceStress}%` }}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Speech Rate</p>
              <p className="font-semibold">{analysis.speechRate.toFixed(0)} WPM</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Pitch Variability</p>
              <p className="font-semibold">{analysis.pitchVariability.toFixed(0)}%</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-1 py-2">
            {Array.from({ length: 20 }, (_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                style={{ height: `${Math.random() * 24 + 8}px` }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Mic className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Awaiting audio input...</p>
        </div>
      )}
    </ProcessorCard>
  );
}

interface FacialProcessorProps {
  analysis?: FacialAnalysis;
  status: 'idle' | 'processing' | 'complete';
}

export function FacialProcessor({ analysis, status }: FacialProcessorProps) {
  return (
    <ProcessorCard
      title="Facial Analysis"
      icon={<Camera className="w-5 h-5" />}
      model="ResNet-50 + FER (23M params)"
      status={status}
    >
      {analysis ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Expression</p>
              <p className="font-semibold text-indigo-600 capitalize">{analysis.expression}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Confidence</p>
              <p className="font-semibold text-indigo-600">{(analysis.confidence * 100).toFixed(1)}%</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Eye Contact</span>
              <span className="font-medium">{analysis.eyeContact.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-600 rounded-full transition-all duration-500"
                style={{ width: `${analysis.eyeContact}%` }}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Facial Tension</span>
              <span className="font-medium">{analysis.facialTension.toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-600 rounded-full transition-all duration-500"
                style={{ width: `${analysis.facialTension}%` }}
              />
            </div>
          </div>
          
          <div>
            <p className="text-xs text-gray-500 mb-2">Micro-expressions</p>
            <div className="flex flex-wrap gap-1">
              {analysis.microExpressions.map((me, i) => (
                <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">{me.replace('_', ' ')}</span>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Awaiting facial input...</p>
        </div>
      )}
    </ProcessorCard>
  );
}
