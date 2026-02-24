import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, X, Brain, Server, UserCheck, Code } from 'lucide-react';
import { Architecture } from './Architecture';

interface PresentationModeProps {
  onClose: () => void;
}

const PresentationMode: React.FC<PresentationModeProps> = ({ onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [architectureView, setArchitectureView] = useState<'system' | 'pseudocode' | 'training' | 'deployment'>('system');

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide(curr => curr + 1);
  };

  const prevSlide = () => {
    if (currentSlide > 0) setCurrentSlide(curr => curr - 1);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  const slides = [
    // 1. Intro
    {
      title: "MindGuard AI: Multi-Modal Deep Learning System",
      subtitle: "Real-time Crisis Prevention through Text, Audio, and Visual Fusion",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
          <div className="p-8 bg-blue-500/10 rounded-full animate-pulse">
            <Brain className="w-32 h-32 text-blue-400" />
          </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              MindGuard AI
            </h1>
            <p className="text-2xl text-gray-300">
              Senior AI Engineering Project
            </p>
            <p className="text-xl text-gray-400">
              Presented by: Senior AI Engineer
            </p>
          </div>
        </div>
      )
    },
    // 2. Abstract
    {
      title: "Abstract",
      content: (
        <div className="flex flex-col justify-center h-full space-y-8 max-w-4xl mx-auto">
          <p className="text-2xl leading-relaxed text-gray-200">
            Mental health diagnostics often rely on subjective self-reporting. 
            <span className="font-bold text-blue-400"> MindGuard AI</span> is a comprehensive deep learning system that analyzes mental state through three simultaneous modalities:
            <span className="text-green-400"> Text</span> (semantic), 
            <span className="text-purple-400"> Audio</span> (prosody), and 
            <span className="text-orange-400"> Facial Expressions</span>.
          </p>
          <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <p className="text-xl text-center text-gray-300">
              By employing an <span className="text-yellow-400">attention-based fusion network</span>, the system correlates disparate data streams to calculate a unified risk score.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-500/30 text-center">
              <h4 className="text-blue-300 font-bold mb-1">Target Accuracy</h4>
              <p className="text-2xl font-bold text-white">80-90%</p>
            </div>
            <div className="bg-green-900/30 p-4 rounded-xl border border-green-500/30 text-center">
              <h4 className="text-green-300 font-bold mb-1">Key Feature</h4>
              <p className="text-lg text-white">Privacy-Aware Local Processing</p>
            </div>
          </div>
        </div>
      )
    },
    // 3. System Requirements
    {
      title: "System Requirements",
      content: (
        <div className="grid grid-cols-2 gap-12 h-full items-center max-w-5xl mx-auto">
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-600 pb-4">
              <Server className="w-8 h-8 text-blue-400" />
              <h3 className="text-3xl font-bold text-white">Hardware</h3>
            </div>
            <ul className="space-y-5 text-xl text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">➤</span>
                <div><strong>Processor:</strong> Intel i7 / Ryzen 7 (Multi-core)</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">➤</span>
                <div><strong>GPU:</strong> NVIDIA RTX 3060+ (CUDA support)</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">➤</span>
                <div><strong>Memory:</strong> 16GB RAM Min (32GB Rec.)</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 mt-1">➤</span>
                <div><strong>Sensors:</strong> High-quality Mic, HD Webcam</div>
              </li>
            </ul>
          </div>
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 h-full">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-600 pb-4">
              <Code className="w-8 h-8 text-green-400" />
              <h3 className="text-3xl font-bold text-white">Software Stack</h3>
            </div>
            <ul className="space-y-5 text-xl text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">➤</span>
                <div><strong>Frontend:</strong> React v18+, TypeScript, Tailwind</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">➤</span>
                <div><strong>ML Runtime:</strong> TensorFlow.js, ONNX Runtime</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">➤</span>
                <div><strong>Training:</strong> PyTorch, HuggingFace</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 mt-1">➤</span>
                <div><strong>Processing:</strong> Web Audio API, OpenCV.js</div>
              </li>
            </ul>
          </div>
        </div>
      )
    },
    // 4. Existing Systems
    {
      title: "Existing Systems",
      content: (
        <div className="flex flex-col h-full justify-center space-y-8 max-w-4xl mx-auto">
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700">
            <h3 className="text-2xl font-bold text-gray-100 mb-4">Current mental health analysis tools:</h3>
            <ul className="space-y-4 text-xl text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-2xl">•</span>
                <div><strong>Text-Only Sentiment Analysis:</strong> Social media posts/chat logs.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-2xl">•</span>
                <div><strong>Clinical Surveys:</strong> Digitized PHQ-9/GAD-7 questionnaires.</div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-500 text-2xl">•</span>
                <div><strong>Wearable Biometrics:</strong> Heart rate/HRV monitoring.</div>
              </li>
            </ul>
            <p className="mt-6 text-xl text-red-400 border-t border-slate-600 pt-4">
              <strong className="text-red-300">Problem:</strong> These systems largely operate in "silos," processing only one data type without context.
            </p>
          </div>
        </div>
      )
    },
    // 5. Disadvantages
    {
      title: "Disadvantages of Existing Systems",
      content: (
        <div className="grid grid-cols-2 gap-8 h-full items-center max-w-5xl mx-auto">
          <div className="bg-red-900/10 p-6 rounded-xl border border-red-500/20 hover:bg-red-900/20 transition-all">
            <h3 className="text-xl font-bold text-red-400 mb-2">1. Missed Signals</h3>
            <p className="text-gray-300">Text analysis misses sarcasm, tone of voice, or flat affect (facial expression).</p>
          </div>
          <div className="bg-red-900/10 p-6 rounded-xl border border-red-500/20 hover:bg-red-900/20 transition-all">
            <h3 className="text-xl font-bold text-red-400 mb-2">2. Delayed Intervention</h3>
            <p className="text-gray-300">Survey-based methods are retrospective and rely on user initiative.</p>
          </div>
          <div className="bg-red-900/10 p-6 rounded-xl border border-red-500/20 hover:bg-red-900/20 transition-all">
            <h3 className="text-xl font-bold text-red-400 mb-2">3. High False Positives</h3>
            <p className="text-gray-300">Single-modality systems lack context (e.g., joking vs. serious crisis).</p>
          </div>
          <div className="bg-red-900/10 p-6 rounded-xl border border-red-500/20 hover:bg-red-900/20 transition-all">
            <h3 className="text-xl font-bold text-red-400 mb-2">4. Privacy Concerns</h3>
            <p className="text-gray-300">Cloud-based processing of sensitive data raises significant privacy risks.</p>
          </div>
        </div>
      )
    },
    // 6. Proposal
    {
      title: "Proposed System",
      content: (
        <div className="flex flex-col h-full justify-center space-y-8 max-w-4xl mx-auto">
           <div className="bg-green-900/10 p-8 rounded-xl border border-green-500/30">
            <h3 className="text-3xl font-bold text-green-400 mb-6 flex items-center gap-3">
              <Brain className="w-8 h-8" />
              MindGuard AI
            </h3>
            <p className="text-2xl text-gray-200 leading-relaxed mb-6">
              We propose a <span className="font-bold text-white">Multi-Modal Attention-Based Fusion Network</span>.
            </p>
            <ul className="space-y-4 text-xl text-gray-300">
               <li className="flex items-center gap-3">
                 <div className="bg-blue-500/20 p-2 rounded text-blue-300">Unified Architecture</div>
                 <span>Ingests text, audio, and video simultaneously.</span>
               </li>
               <li className="flex items-center gap-3">
                 <div className="bg-purple-500/20 p-2 rounded text-purple-300">Dynamic Fusion</div>
                 <span>Weights modalities based on signal quality/context.</span>
               </li>
               <li className="flex items-center gap-3">
                 <div className="bg-orange-500/20 p-2 rounded text-orange-300">Real-Time Dashboard</div>
                 <span>Immediate feedback & alerts.</span>
               </li>
               <li className="flex items-center gap-3">
                 <div className="bg-green-500/20 p-2 rounded text-green-300">Privacy-First</div>
                 <span>Edge-computing capable (runs locally).</span>
               </li>
            </ul>
          </div>
        </div>
      )
    },
    // 7. Advantages
    {
      title: "Advantages",
      content: (
        <div className="grid grid-cols-2 gap-6 h-full items-center max-w-5xl mx-auto">
          <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-green-500">
            <h3 className="text-xl font-bold text-green-400 mb-2">Higher Accuracy</h3>
            <p className="text-gray-300">Combining modalities validates signals (e.g., sad text + sad voice = high confidence).</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-blue-500">
            <h3 className="text-xl font-bold text-blue-400 mb-2">Real-Time Processing</h3>
            <p className="text-gray-300">Immediate detection of crisis states triggers instant alerts.</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-400 mb-2">Robustness</h3>
            <p className="text-gray-300">System functions even if one input source is noisy or unavailable.</p>
          </div>
          <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-orange-500">
            <h3 className="text-xl font-bold text-orange-400 mb-2">Explainability (XAI)</h3>
            <p className="text-gray-300">Users can see which factors contributed to the risk score.</p>
          </div>
           <div className="bg-slate-800 p-6 rounded-xl border-l-4 border-cyan-500 col-span-2">
            <h3 className="text-xl font-bold text-cyan-400 mb-2">Scalability</h3>
            <p className="text-gray-300">Architecture supports containerized deployment (Docker/Kubernetes).</p>
          </div>
        </div>
      )
    },
    // 8. Architecture Diagram
    {
      title: "Architecture Diagram",
      content: (
        <div className="h-full flex items-center justify-center p-4">
          <div className="transform scale-75 origin-center w-full text-slate-900">
             <Architecture activeView={architectureView} onViewChange={setArchitectureView} />
          </div>
        </div>
      )
    },
    // 9. Algorithm Used
    {
      title: "Algorithm Used",
      content: (
        <div className="space-y-8 max-w-5xl mx-auto">
          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-2xl font-bold text-blue-400 mb-4">Core Components</h3>
            <div className="grid grid-cols-2 gap-6 text-lg">
              <div>
                <p className="font-bold text-white mb-1">Text Analysis</p>
                <p className="text-gray-400 text-base">DistilBERT for efficient semantic sentiment extraction.</p>
              </div>
              <div>
                 <p className="font-bold text-white mb-1">Audio Analysis</p>
                <p className="text-gray-400 text-base">Spectral Energy Analysis & Pitch Detection (Wav2Vec simulation).</p>
              </div>
              <div>
                 <p className="font-bold text-white mb-1">Visual Analysis</p>
                <p className="text-gray-400 text-base">CNN (ResNet) for Facial Expression Recognition (FER).</p>
              </div>
              <div>
                 <p className="font-bold text-white mb-1">Fusion Strategy</p>
                <p className="text-gray-400 text-base">Multi-Head Self-Attention Transformer.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
            <h3 className="text-2xl font-bold text-green-400 mb-4">Fusion Mechanism</h3>
            <p className="text-gray-300 text-lg">
              The model learns the relationship between modalities (e.g., how a specific word correlates with a specific facial expression) to output a unified risk score.
            </p>
          </div>
        </div>
      )
    },
    // 10. Greetings / Thank You
    {
      title: "Thank You",
      content: (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-12">
          <div className="p-12 bg-green-500/10 rounded-full animate-bounce">
            <UserCheck className="w-32 h-32 text-green-400" />
          </div>
           <div className="space-y-6">
            <h1 className="text-5xl font-bold text-white">
              MindGuard AI
            </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              "We believe this multi-modal approach represents the future of digital mental health support—combining the analytical power of AI with the nuance of human expression."
            </p>
          </div>
          <div className="text-3xl font-bold text-blue-400 mt-8">
            Q&A Session
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 text-white flex flex-col">
      {/* Header / Controls */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="flex items-center gap-2 text-blue-400 font-bold text-xl">
           <Brain className="w-6 h-6" />
           MindGuard AI Presentation
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span>Slide {currentSlide + 1} / {slides.length}</span>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Slide Content */}
      <div className="flex-1 overflow-hidden relative p-8 md:p-16 flex flex-col">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {slides[currentSlide].title}
        </h2>
        {slides[currentSlide].subtitle && (
          <h3 className="text-2xl text-gray-400 text-center -mt-4 mb-8">{slides[currentSlide].subtitle}</h3>
        )}
        
        <div className="flex-1 relative">
           {slides[currentSlide].content}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50 backdrop-blur flex items-center justify-between">
         <button 
           onClick={prevSlide} 
           disabled={currentSlide === 0}
           className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg disabled:opacity-50 transition-colors"
         >
           <ChevronLeft className="w-5 h-5" /> Previous
         </button>

         <div className="flex gap-2">
           {slides.map((_, idx) => (
             <button 
               key={idx}
               onClick={() => setCurrentSlide(idx)}
               className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-blue-500 w-8' : 'bg-slate-700 hover:bg-slate-600'}`}
             />
           ))}
         </div>

         <button 
           onClick={nextSlide} 
           disabled={currentSlide === slides.length - 1}
           className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg disabled:opacity-50 transition-colors font-semibold"
         >
           Next <ChevronRight className="w-5 h-5" />
         </button>
      </div>
    </div>
  );
};

export default PresentationMode;
