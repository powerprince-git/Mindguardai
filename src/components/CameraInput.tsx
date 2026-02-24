import { useState, useRef, useEffect, useCallback } from 'react';

interface CameraInputProps {
  onImageData: (data: ImageData) => void;
  isProcessing: boolean;
}

export const CameraInput: React.FC<CameraInputProps> = ({ onImageData, isProcessing }) => {
  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'streaming' | 'captured' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.load();
    }
  }, []);

  const startCamera = async () => {
    setErrorMsg('');
    setCapturedImage(null);
    setAnalysisComplete(false);
    setCameraState('starting');

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported. Please use Chrome, Firefox, or Safari.');
      }

      // Stop any existing stream first
      stopCamera();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640, min: 320 },
          height: { ideal: 480, min: 240 }
        },
        audio: false
      });

      streamRef.current = stream;

      // Use a small delay to ensure DOM is ready
      await new Promise(resolve => setTimeout(resolve, 100));

      const video = videoRef.current;
      if (!video) {
        throw new Error('Video element not found. Please try again.');
      }

      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('autoplay', 'true');
      video.muted = true;

      // Wait for video to be ready
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Camera timed out. Please try again.')), 10000);

        video.onloadedmetadata = () => {
          clearTimeout(timeout);
          video.play()
            .then(() => resolve())
            .catch(e => reject(e));
        };

        video.onerror = () => {
          clearTimeout(timeout);
          reject(new Error('Video playback failed'));
        };
      });

      setCameraState('streaming');

    } catch (err: any) {
      console.error('Camera error:', err);
      stopCamera();
      setCameraState('error');

      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMsg('Camera permission denied. Click the camera icon in your browser\'s address bar to allow access, then try again.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMsg('No camera found. Please connect a camera and try again.');
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        setErrorMsg('Camera is in use by another application. Please close other apps using the camera and try again.');
      } else if (err.name === 'OverconstrainedError') {
        setErrorMsg('Camera does not meet requirements. Trying with basic settings...');
        // Retry with basic constraints
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
            setCameraState('streaming');
            setErrorMsg('');
          }
        } catch {
          setErrorMsg('Could not access any camera. Please check your camera connection.');
        }
      } else {
        setErrorMsg(err.message || 'Failed to access camera. Please try again.');
      }
    }
  };

  const captureFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) {
      setErrorMsg('Camera not ready. Please wait and try again.');
      return;
    }

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    if (vw === 0 || vh === 0) {
      setErrorMsg('Camera not ready yet. Please wait a moment...');
      return;
    }

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      setErrorMsg('Canvas error. Please try again.');
      return;
    }

    canvas.width = vw;
    canvas.height = vh;

    // Draw mirrored
    ctx.save();
    ctx.translate(vw, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, vw, vh);
    ctx.restore();

    // Save preview image
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);

    // Get ImageData for analysis
    const imageData = ctx.getImageData(0, 0, vw, vh);

    // Stop camera
    stopCamera();
    setCameraState('captured');

    // Send to analysis
    setAnalysisComplete(false);
    onImageData(imageData);

    // Mark analysis as complete after a short delay
    setTimeout(() => setAnalysisComplete(true), 800);
  };

  const retake = () => {
    setCapturedImage(null);
    setAnalysisComplete(false);
    setCameraState('idle');
    startCamera();
  };

  const reset = () => {
    stopCamera();
    setCapturedImage(null);
    setAnalysisComplete(false);
    setErrorMsg('');
    setCameraState('idle');
  };

  // Upload photo as fallback
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, img.width, img.height);

        setCapturedImage(dataUrl);
        setCameraState('captured');
        setAnalysisComplete(false);
        onImageData(imageData);
        setTimeout(() => setAnalysisComplete(true), 800);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6" ref={containerRef}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Facial Analysis</h3>
          <p className="text-sm text-gray-500">CNN-based expression classification</p>
        </div>
        {cameraState === 'streaming' && (
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-red-50 rounded-full">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-600 font-semibold">LIVE</span>
          </div>
        )}
        {cameraState === 'captured' && analysisComplete && (
          <div className="ml-auto flex items-center gap-1.5 px-2 py-1 bg-green-50 rounded-full">
            <svg className="w-3.5 h-3.5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-green-600 font-semibold">ANALYZED</span>
          </div>
        )}
      </div>

      {/* Video / Preview Area */}
      <div className="relative w-full aspect-[4/3] bg-gray-900 rounded-lg overflow-hidden mb-4">
        {/* Live Video - always in DOM but hidden when not streaming */}
        <video
          ref={videoRef}
          playsInline
          autoPlay
          muted
          className={`absolute inset-0 w-full h-full object-cover ${
            cameraState === 'streaming' ? 'block' : 'hidden'
          }`}
          style={{ transform: 'scaleX(-1)' }}
        />

        {/* Captured Image Preview */}
        {capturedImage && cameraState === 'captured' && (
          <img
            src={capturedImage}
            alt="Captured face"
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Face guide overlay for live view */}
        {cameraState === 'streaming' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-40 h-52 border-2 border-dashed border-green-400/60 rounded-[50%]" />
            <div className="absolute bottom-3 inset-x-0 text-center">
              <span className="text-xs text-white bg-black/60 px-3 py-1 rounded-full">
                Align your face in the oval
              </span>
            </div>
          </div>
        )}

        {/* Starting overlay */}
        {cameraState === 'starting' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm text-gray-300 font-medium">Starting camera...</p>
            <p className="text-xs text-gray-500 mt-1">Please allow camera access</p>
          </div>
        )}

        {/* Idle state */}
        {cameraState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
            <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-sm text-gray-500 font-medium">Camera not active</p>
            <p className="text-xs text-gray-400 mt-1">Click below to enable</p>
          </div>
        )}

        {/* Error state */}
        {cameraState === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 p-4">
            <svg className="w-12 h-12 text-red-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="text-sm text-red-600 font-medium text-center mb-1">Camera Error</p>
            <p className="text-xs text-red-500 text-center max-w-[250px]">{errorMsg}</p>
          </div>
        )}

        {/* Analysis processing overlay on captured image */}
        {cameraState === 'captured' && !analysisComplete && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white rounded-lg px-4 py-3 flex items-center gap-3 shadow-lg">
              <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium text-gray-700">Analyzing expression...</span>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Action Buttons */}
      <div className="space-y-3">
        {cameraState === 'idle' && (
          <>
            <button
              onClick={startCamera}
              disabled={isProcessing}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Enable Camera
            </button>

            {/* Upload fallback */}
            <label className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-gray-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Photo Instead
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </>
        )}

        {cameraState === 'starting' && (
          <button
            onClick={reset}
            className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}

        {cameraState === 'streaming' && (
          <div className="flex gap-2">
            <button
              onClick={reset}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={captureFrame}
              disabled={isProcessing}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Capture & Analyze
            </button>
          </div>
        )}

        {cameraState === 'captured' && (
          <div className="flex gap-2">
            <button
              onClick={retake}
              disabled={isProcessing}
              className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retake
            </button>
            <button
              onClick={reset}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Done
            </button>
          </div>
        )}

        {cameraState === 'error' && (
          <div className="space-y-2">
            <button
              onClick={startCamera}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </button>
            <label className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-gray-200">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Upload Photo Instead
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        )}
      </div>

      {/* Privacy note */}
      <p className="text-xs text-gray-400 text-center mt-3">
        🔒 All processing happens locally. No images are stored or sent to any server.
      </p>
    </div>
  );
};
