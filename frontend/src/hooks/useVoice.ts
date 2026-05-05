import { useCallback, useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';

export const useVoice = () => {
  const [speaking, setSpeaking] = useState(false);
  const voiceEnabled = useUserStore((state) => state.voiceEnabled);

  const speak = useCallback((text: string) => {
    if (!voiceEnabled) return;
    
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.85;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, [voiceEnabled]);

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  }, []);

  const speakWithDelay = useCallback((text: string, delay: number = 500) => {
    setTimeout(() => speak(text), delay);
  }, [speak]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return {
    speak,
    stop,
    speakWithDelay,
    speaking,
    voiceEnabled
  };
};
