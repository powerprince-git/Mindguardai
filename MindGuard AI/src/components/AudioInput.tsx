import React, { useState, useRef, useEffect } from 'react';

interface AudioInputProps {
  onAudioData: (data: Float32Array) => void;
  isProcessing: boolean;
}

export const AudioInput: React.FC<AudioInputProps> = ({ onAudioData, isProcessing }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioBufferRef = useRef<Float32Array[]>([]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);

      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;

      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      audioBufferRef.current = [];
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Visualize and capture audio
      const captureAudio = () => {
        if (!analyserRef.current) return;

        const dataArray = new Float32Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getFloatTimeDomainData(dataArray);
        
        // Calculate RMS for visualization
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i] * dataArray[i];
        }
        const rms = Math.sqrt(sum / dataArray.length);
        setAudioLevel(Math.min(1, rms * 5));

        // Store audio data
        audioBufferRef.current.push(new Float32Array(dataArray));

        animationRef.current = requestAnimationFrame(captureAudio);
      };

      captureAudio();
    } catch (err) {
      console.error('Microphone access denied:', err);
      setHasPermission(false);
    }
  };

  const stopRecording = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }

    // Combine all audio buffers
    if (audioBufferRef.current.length > 0) {
      const totalLength = audioBufferRef.current.reduce((acc, buf) => acc + buf.length, 0);
      const combinedBuffer = new Float32Array(totalLength);
      let offset = 0;
      for (const buffer of audioBufferRef.current) {
        combinedBuffer.set(buffer, offset);
        offset += buffer.length;
      }
      onAudioData(combinedBuffer);
    }

    setIsRecording(false);
    setAudioLevel(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Audio Analysis</h3>
          <p className="text-sm text-gray-500">wav2vec voice emotion recognition</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Audio Level Visualizer */}
        <div className="h-24 bg-gray-50 rounded-lg flex items-center justify-center overflow-hidden">
          {isRecording ? (
            <div className="flex items-center gap-1 h-full py-4">
              {[...Array(20)].map((_, i) => {
                const height = Math.random() * audioLevel * 100;
                return (
                  <div
                    key={i}
                    className="w-2 bg-purple-500 rounded-full transition-all duration-75"
                    style={{ 
                      height: `${Math.max(10, height)}%`,
                      opacity: 0.5 + audioLevel * 0.5
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <p className="text-sm">Click to start recording</p>
            </div>
          )}
        </div>

        {/* Recording Timer */}
        {isRecording && (
          <div className="text-center">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              Recording: {formatTime(recordingTime)}
            </span>
          </div>
        )}

        {/* Permission Error */}
        {hasPermission === false && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Microphone access denied. Please enable microphone permissions.
          </div>
        )}

        {/* Record Button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`w-full py-3 font-medium rounded-lg transition flex items-center justify-center gap-2 ${
            isRecording
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-gray-300'
          }`}
        >
          {isRecording ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop & Analyze
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              Start Recording
            </>
          )}
        </button>
      </div>
    </div>
  );
};
