import { useCallback, useRef, useState, useEffect } from 'react';

interface UseRecorderReturn {
  recording: boolean;
  paused: boolean;
  audioUrl: string | null;
  duration: number;
  audioLevel: number;
  hasPermission: boolean | null;
  isDemoMode: boolean;
  isPreparing: boolean;
  requestPermission: () => Promise<boolean>;
  startRecording: () => Promise<void>;
  pauseRecording: () => void;
  resumeRecording: () => void;
  stopRecording: () => void;
  resetRecording: () => void;
}

export const useRecorder = (): UseRecorderReturn => {
  const [recording, setRecording] = useState(false);
  const [paused, setPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [isPreparing, setIsPreparing] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const playBeep = useCallback((type: 'start' | 'stop') => {
  }, []);

  const checkPermission = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false);
      setIsDemoMode(true);
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      if (permission.state === 'granted') {
        setHasPermission(true);
        return true;
      } else if (permission.state === 'denied') {
        setHasPermission(false);
        setIsDemoMode(true);
        return false;
      }
      setHasPermission(null);
      return null;
    } catch (error) {
      console.log('Permission check failed, using demo mode');
      setHasPermission(false);
      setIsDemoMode(true);
      return false;
    }
  }, []);

  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
      setIsDemoMode(false);
      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      const errorMessage = error instanceof Error ? error.message : 'unknown';
      
      if (errorMessage.includes('denied') || errorMessage.includes('NotAllowedError')) {
        setHasPermission(false);
        setIsDemoMode(true);
      }
      
      return false;
    }
  }, []);

  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current && recording && !paused) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      setAudioLevel(Math.min(100, average * 1.5));
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [recording, paused]);

  const updateDemoAudioLevel = useCallback(() => {
    if (recording && !paused) {
      const newLevel = Math.random() * 60 + 20;
      setAudioLevel(newLevel);
      animationRef.current = requestAnimationFrame(() => {
        setTimeout(updateDemoAudioLevel, 100);
      });
    }
  }, [recording, paused]);

  const generateDemoAudio = useCallback(() => {
    const sampleRate = 44100;
    const durationSeconds = Math.max(2, duration);
    const numSamples = sampleRate * durationSeconds;
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBuffer = audioContext.createBuffer(1, numSamples, sampleRate);
    const channelData = audioBuffer.getChannelData(0);

    for (let i = 0; i < numSamples; i++) {
      channelData[i] = Math.sin(i * 0.005) * 0.3 + Math.sin(i * 0.01) * 0.2;
    }

    const wavBlob = (() => {
      const dataView = new DataView(new ArrayBuffer(44 + numSamples * 2));
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          dataView.setUint8(offset + i, string.charCodeAt(i));
        }
      };

      writeString(0, 'RIFF');
      dataView.setUint32(4, 36 + numSamples * 2, true);
      writeString(8, 'WAVE');
      writeString(12, 'fmt ');
      dataView.setUint32(16, 16, true);
      dataView.setUint16(20, 1, true);
      dataView.setUint16(22, 1, true);
      dataView.setUint32(24, sampleRate, true);
      dataView.setUint32(28, sampleRate * 2, true);
      dataView.setUint16(32, 2, true);
      dataView.setUint16(34, 16, true);
      writeString(36, 'data');
      dataView.setUint32(40, numSamples * 2, true);

      for (let i = 0; i < numSamples; i++) {
        dataView.setInt16(44 + i * 2, Math.max(-32768, Math.min(32767, channelData[i] * 32767)), true);
      }

      return new Blob([dataView], { type: 'audio/wav' });
    })();

    return URL.createObjectURL(wavBlob);
  }, [duration]);

  const startRecording = useCallback(async () => {
    setIsPreparing(true);
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setIsPreparing(false);

    if (isDemoMode) {
      setRecording(true);
      setPaused(false);
      setDuration(0);
      setAudioLevel(30);
      updateDemoAudioLevel();
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        
        stream.getTracks().forEach(track => track.stop());
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };

      mediaRecorder.start(100);
      setRecording(true);
      setPaused(false);
      setDuration(0);

      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);

      animationRef.current = requestAnimationFrame(updateAudioLevel);
    } catch (error) {
      console.error('Failed to start recording:', error);
      const errorMessage = error instanceof Error ? error.message : '无法访问麦克风';
      
      if (errorMessage.includes('denied') || errorMessage.includes('NotAllowedError')) {
        alert('麦克风权限被拒绝\n\n请在浏览器设置中允许使用麦克风，或者使用演示模式。');
      } else {
        alert(`录音失败: ${errorMessage}\n\n您可以尝试使用演示模式继续操作。`);
      }
    }
  }, [isDemoMode, updateAudioLevel, updateDemoAudioLevel, playBeep]);

  const pauseRecording = useCallback(() => {
    if (isDemoMode) {
      setPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setAudioLevel(0);
      return;
    }

    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.pause();
      setPaused(true);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLevel(0);
    }
  }, [recording, isDemoMode]);

  const resumeRecording = useCallback(() => {
    if (isDemoMode) {
      setPaused(false);
      setAudioLevel(30);
      updateDemoAudioLevel();
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
      return;
    }

    if (mediaRecorderRef.current && paused) {
      mediaRecorderRef.current.resume();
      setPaused(false);
      timerRef.current = setInterval(() => {
        setDuration(d => d + 1);
      }, 1000);
      animationRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [paused, updateAudioLevel, isDemoMode, updateDemoAudioLevel]);

  const stopRecording = useCallback(() => {
    if (isDemoMode) {
      setRecording(false);
      setPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setAudioLevel(0);
      const demoUrl = generateDemoAudio();
      setAudioUrl(demoUrl);
      return;
    }

    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setPaused(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAudioLevel(0);
    }
  }, [recording, isDemoMode, generateDemoAudio, playBeep]);

  const resetRecording = useCallback(() => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setDuration(0);
    setAudioLevel(0);
    chunksRef.current = [];
  }, [audioUrl]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  return {
    recording,
    paused,
    audioUrl,
    duration,
    audioLevel,
    hasPermission,
    isDemoMode,
    isPreparing,
    requestPermission,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording
  };
};
