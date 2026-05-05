import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '@/hooks/useVoice';
import { useUserStore } from '@/stores/userStore';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { Phone, MessageCircle, Headphones, Send, AlertCircle } from 'lucide-react';

const QUICK_HELP_TOPICS = [
  '如何使用平台',
  '如何接任务',
  '如何录制音频',
  '忘记账号密码',
  '薪资结算问题',
  '其他问题'
];

export default function Help() {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const currentUser = useUserStore((state) => state.currentUser);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [topic, setTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const counselorName = currentUser?.counselorName || '李老师';
    const counselorPhone = currentUser?.counselorPhone || '13800138000';
    const message = `帮扶求助页面，您可以一键联系您的辅导员${counselorName}，电话${counselorPhone}，也可以留言寻求帮助`;
    speak(message);
  }, [currentUser, speak]);

  const handleCall = () => {
    const phone = currentUser?.counselorPhone || '13800138000';
    speak(`正在拨打${currentUser?.counselorName || '辅导员'}的电话：${phone}`);
    window.location.href = `tel:${phone}`;
  };

  const handleVoiceHelp = () => {
    const counselorName = currentUser?.counselorName || '李老师';
    speak(`${counselorName}老师您好，我是${currentUser?.name || '用户'}，我在使用配音平台时需要帮助，请帮帮我。`);
  };

  const handleTopicClick = (selectedTopic: string) => {
    speak(`您选择了：${selectedTopic}，正在提交咨询`);
    setTopic(selectedTopic);
    setMessage(`【${selectedTopic}】您好，我在使用平台时遇到了一些问题，请帮我解答。`);
  };

  const handleSubmitMessage = async () => {
    if (!message.trim()) {
      speak('请输入您要咨询的内容');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/help/help-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: currentUser?.id || 1,
          user_name: currentUser?.name || '配音员',
          user_phone: currentUser?.phone || '13900139000',
          counselor_id: null,
          counselor_name: currentUser?.counselorName || '李老师',
          topic: topic || '其他问题',
          content: message,
          type: 'text'
        })
      });

      if (response.ok) {
        setShowSuccess(true);
        speak('留言已提交，辅导员会尽快回复您');
        setTimeout(() => {
          setShowSuccess(false);
        }, 2000);
      } else {
        speak('提交失败，请重试');
      }
    } catch (error) {
      console.error('提交帮扶求助失败:', error);
      speak('提交失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSpeakPhone = () => {
    speak(`辅导员的电话是${currentUser?.counselorPhone || '13800138000'}，点击一键呼叫可以直接拨打`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warning-50 via-white to-primary-50 pb-6">
      <Header title="帮扶求助" showBack={true} />

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <Card variant="elevated" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Headphones className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold mb-2">您的专属辅导员</h3>
            <p className="text-primary-100 text-lg">{currentUser?.counselorName || '李老师'}</p>
          </div>

          <div 
            className="bg-white/10 rounded-2xl p-4 mb-6 cursor-pointer hover:bg-white/20 transition-colors"
            onClick={handleSpeakPhone}
          >
            <p className="text-center text-xl">
              📞 {currentUser?.counselorPhone || '13800138000'}
            </p>
            <p className="text-center text-sm text-primary-100 mt-2">点击可语音播报电话号码</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={handleCall}
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              <Phone className="w-6 h-6" />
              一键呼叫
            </Button>
            <Button
              onClick={handleVoiceHelp}
              variant="secondary"
              size="lg"
              className="bg-white text-primary-600 hover:bg-primary-50"
            >
              <MessageCircle className="w-6 h-6" />
              语音求助
            </Button>
          </div>
        </Card>

        <Card variant="default">
          <h3 className="text-xl font-bold text-gray-800 mb-4">快捷留言</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {QUICK_HELP_TOPICS.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className="px-4 py-2 bg-gray-100 hover:bg-primary-50 text-gray-700 hover:text-primary-600 rounded-full text-base transition-colors border-2 border-transparent hover:border-primary-300"
              >
                {topic}
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="请输入您要咨询的内容..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-xl text-lg resize-none focus:border-primary-400 focus:outline-none transition-colors"
          />

          <Button
            onClick={handleSubmitMessage}
            variant="primary"
            size="lg"
            fullWidth
            className="mt-4"
          >
            <Send className="w-5 h-5" />
            提交留言
          </Button>
        </Card>

        {showSuccess && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 mx-6 max-w-sm w-full text-center animate-bounce-in">
              <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-10 h-10 text-success-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">提交成功</h3>
              <p className="text-gray-500">辅导员会尽快回复您</p>
            </div>
          </div>
        )}

        <Card variant="outlined" className="border-warning-200 bg-warning-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-warning-600 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-warning-800 mb-2">温馨提示</h4>
              <ul className="text-sm text-warning-700 space-y-1">
                <li>• 工作时间：周一至周五 9:00-18:00</li>
                <li>• 非工作时间留言，辅导员会在上班后第一时间回复</li>
                <li>• 紧急情况可直接拨打辅导员电话</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
