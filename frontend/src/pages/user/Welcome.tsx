import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2 } from 'lucide-react';
import { useVoice } from '@/hooks/useVoice';
import Button from '@/components/Button';

export default function Welcome() {
  const navigate = useNavigate();
  const { speak, speaking, voiceEnabled } = useVoice();

  useEffect(() => {
    const welcomeMessage = '欢迎来到智声助业配音平台，点击下方按钮开始使用';
    speak(welcomeMessage);
  }, [speak]);

  const handleEnter = () => {
    navigate('/user/login');
  };

  const handleSpeak = () => {
    const message = '欢迎来到智声助业配音工作平台，这是一款帮助特殊人群完成配音工作的在线平台，点击进入登录按钮可以开始使用';
    speak(message);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 flex flex-col items-center justify-center p-6">
      <div className="text-center max-w-lg mx-auto">
        <div className="mb-8 animate-bounce">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-2xl">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl font-bold text-gray-800 mb-4 tracking-tight">
          智声助业
        </h1>
        
        <p className="text-2xl text-gray-600 mb-12 leading-relaxed">
          配音工作平台
        </p>

        <div className="space-y-6">
          <button
            onClick={handleSpeak}
            className="w-full flex items-center justify-center gap-4 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-primary-100 hover:border-primary-300"
          >
            <div className={`w-16 h-16 rounded-full ${speaking ? 'bg-primary-100 animate-pulse' : 'bg-primary-50'} flex items-center justify-center`}>
              <Volume2 className={`w-8 h-8 ${speaking ? 'text-primary-600' : 'text-primary-400'}`} />
            </div>
            <div className="text-left">
              <p className="text-xl font-bold text-gray-800">点击收听介绍</p>
              <p className="text-base text-gray-500">了解平台使用方法</p>
            </div>
          </button>

          <Button 
            onClick={handleEnter}
            variant="primary"
            size="xl"
            fullWidth
          >
            <span className="text-2xl">进入登录</span>
          </Button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span className="text-base">用心服务 成就梦想</span>
        </div>
      </div>

      {!voiceEnabled && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-warning-100 text-warning-800 px-6 py-3 rounded-full text-lg font-medium shadow-lg">
          语音功能已关闭
        </div>
      )}
    </div>
  );
}
