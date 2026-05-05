import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useVoice } from '@/hooks/useVoice';
import { useRecorder } from '@/hooks/useRecorder';
import { useOrderStore, Order } from '@/stores/orderStore';
import Header from '@/components/Header';
import Button from '@/components/Button';
import { 
  Mic, 
  Square, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Volume2, 
  Info,
  Play,
  Pause,
  Loader2
} from 'lucide-react';

export default function Recording() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { speak } = useVoice();
  const { fetchOrder, currentOrder, updateOrder } = useOrderStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recordings, setRecordings] = useState<Map<number, { audioUrl: string; duration: number }>>(new Map());
  const [aiDenoise, setAiDenoise] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayedBeep, setHasPlayedBeep] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const {
    recording,
    paused,
    audioUrl: currentAudioUrl,
    duration: currentDuration,
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
  } = useRecorder();

  useEffect(() => {
    if (orderId) {
      fetchOrder(parseInt(orderId));
    }
  }, [orderId, fetchOrder]);

  useEffect(() => {
    if (!currentOrder) {
      return;
    }
    const sentences = currentOrder.task_sentences || [];
    if (sentences.length > 0 && currentIndex < sentences.length) {
      speak(`开始录制第${currentIndex + 1}句，共${sentences.length}句。请点击开始录音按钮进行录制。`);
    }
  }, [currentIndex, currentOrder, speak]);

  useEffect(() => {
    if (currentAudioUrl && audioRef.current) {
      audioRef.current.src = currentAudioUrl;
    }
  }, [currentAudioUrl]);

  if (!currentOrder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const sentences = currentOrder.task_sentences || [];
  
  if (sentences.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">该订单没有可录制的句子</p>
          <Button onClick={() => navigate('/user/orders')} className="mt-4">
            返回订单列表
          </Button>
        </div>
      </div>
    );
  }

  const currentSentence = sentences[currentIndex];

  const handlePlaySentence = () => {
    if (currentSentence) {
      speak(currentSentence.text || currentSentence);
    }
  };

  const handleStartRecording = async () => {
    if (!hasPermission && !isDemoMode) {
      await requestPermission();
      return;
    }
    setHasPlayedBeep(false);
    startRecording();
    speak('开始录音');
  };

  const handleStopRecording = () => {
    stopRecording();
    speak('录音结束');
  };

  const handleSaveCurrent = () => {
    if (!currentAudioUrl) return;
    
    setRecordings(prev => {
      const newMap = new Map(prev);
      newMap.set(currentIndex, {
        audioUrl: currentAudioUrl,
        duration: currentDuration
      });
      return newMap;
    });
    
    resetRecording();
    
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      speak('所有句子录制完成！');
    }
  };

  const handlePrevSentence = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNextSentence = () => {
    if (currentIndex < sentences.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleRerecord = () => {
    setRecordings(prev => {
      const newMap = new Map(prev);
      newMap.delete(currentIndex);
      return newMap;
    });
    resetRecording();
  };

  const handlePlayRecording = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSubmit = async () => {
    try {
      const allRecorded = sentences.every((_, i) => recordings.has(i));
      if (!allRecorded) {
        speak('还有句子未录制，请完成所有录制后再提交');
        return;
      }
      
      const audioUrls = Array.from(recordings.values()).map(r => r.audioUrl);
      await updateOrder(parseInt(orderId!), {
        status: 'pending_review',
        audio_url: audioUrls[0]
      });
      
      speak('提交成功！作品已提交审核');
      navigate('/user/orders');
    } catch (error) {
      alert('提交失败，请重试');
    }
  };

  const currentRecording = recordings.get(currentIndex);
  const progress = (recordings.size / sentences.length) * 100;
  const allRecorded = sentences.every((_, i) => recordings.has(i));

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <Header title="分句录音" showBack={true} />

      <div className="max-w-lg mx-auto px-4 pt-6">
        {currentOrder.admin_feedback && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 shadow-md">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-700 mb-1">驳回原因：</p>
                <p className="text-sm text-red-600">{currentOrder.admin_feedback}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-4 mb-6 shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-gray-800">录制进度</span>
            <span className="text-lg font-bold text-primary-600">{recordings.size}/{sentences.length}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-primary-500 to-primary-700 h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-primary-50 to-success-50 rounded-2xl p-6 mb-6 shadow-md border-2 border-primary-200">
          <div className="flex items-center justify-between mb-4">
            <span className="px-4 py-1 bg-primary-600 text-white rounded-full font-bold text-lg">
              第{currentIndex + 1}句
            </span>
            <span className="text-lg font-bold text-gray-600">共{sentences.length}句</span>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-2xl font-bold text-gray-800 mb-3 leading-relaxed">
              {currentSentence?.text || currentSentence}
            </div>
            <div className="text-lg text-gray-500 italic">
              {currentSentence?.pinyin || ''}
            </div>
          </div>

          <Button 
            onClick={handlePlaySentence} 
            variant="secondary" 
            size="lg" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Volume2 className="w-6 h-6" />
            听标准发音
          </Button>
        </div>

        <div className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <div className="flex justify-center mb-6">
            <div 
              className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                recording 
                  ? 'bg-gradient-to-br from-danger-400 to-danger-600 animate-pulse' 
                  : currentRecording 
                  ? 'bg-gradient-to-br from-success-400 to-success-600' 
                  : 'bg-gradient-to-br from-primary-400 to-primary-600'
              }`}
            >
              {recording ? (
                <Square className="w-12 h-12 text-white" />
              ) : currentRecording ? (
                <Check className="w-12 h-12 text-white" />
              ) : (
                <Mic className="w-12 h-12 text-white" />
              )}
            </div>
          </div>

          {recording && (
            <div className="flex justify-center mb-6">
              <div className="flex gap-1 items-end h-12">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-3 bg-primary-500 rounded-t"
                    style={{
                      height: `${20 + (recording ? audioLevel + Math.random() * 30 : 0)}%`,
                      transition: 'height 0.1s'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {currentDuration > 0 && (
            <div className="text-center text-3xl font-mono font-bold text-gray-800 mb-6">
              {Math.floor(currentDuration / 60).toString().padStart(2, '0')}:{(currentDuration % 60).toString().padStart(2, '0')}
            </div>
          )}

          {!currentRecording ? (
            <div className="space-y-3">
              {recording ? (
                <Button 
                  onClick={handleStopRecording} 
                  variant="danger" 
                  size="xl" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Square className="w-6 h-6" />
                  停止录音
                </Button>
              ) : (
                <Button 
                  onClick={handleStartRecording} 
                  variant="primary" 
                  size="xl" 
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isPreparing}
                >
                  <Mic className="w-6 h-6" />
                  {isPreparing ? '准备中...' : '开始录音'}
                </Button>
              )}
              
              {currentAudioUrl && !recording && (
                <Button 
                  onClick={handleSaveCurrent} 
                  variant="success" 
                  size="xl" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Check className="w-6 h-6" />
                  保存本条
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <Button 
                onClick={handlePlayRecording} 
                variant="secondary" 
                size="xl" 
                className="w-full flex items-center justify-center gap-2"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6" />
                ) : (
                  <Play className="w-6 h-6" />
                )}
                {isPlaying ? '暂停试听' : '试听录音'}
              </Button>
              
              <Button 
                onClick={handleRerecord} 
                variant="warning" 
                size="xl" 
                className="w-full flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-6 h-6" />
                重新录制
              </Button>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mb-6">
          <Button 
            onClick={handlePrevSentence} 
            variant="secondary" 
            size="lg" 
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
            上一句
          </Button>
          
          <Button 
            onClick={handleNextSentence} 
            variant="secondary" 
            size="lg" 
            disabled={currentIndex === sentences.length - 1}
          >
            下一句
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6 px-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="aiDenoise"
              checked={aiDenoise}
              onChange={(e) => setAiDenoise(e.target.checked)}
              className="w-6 h-6 rounded border-2 border-primary-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="aiDenoise" className="text-lg text-gray-700">AI降噪</label>
          </div>
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-gray-400" />
            <span className="text-sm text-gray-400">{isDemoMode ? '演示模式' : '录音模式'}</span>
          </div>
        </div>

        <div className="grid grid-cols-8 gap-2 mb-6">
          {sentences.map((_, index) => (
            <div 
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`aspect-square rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer transition-all ${
                recordings.has(index)
                  ? 'bg-gradient-to-br from-success-400 to-success-600 text-white'
                  : index === currentIndex
                  ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white scale-110'
                  : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>

        <audio ref={audioRef} />

        {allRecorded && (
          <Button 
            onClick={handleSubmit} 
            variant="success" 
            size="xl" 
            className="w-full text-xl py-4"
          >
            <Check className="w-6 h-6 mr-2" />
            提交所有录音
          </Button>
        )}
      </div>
    </div>
  );
}
