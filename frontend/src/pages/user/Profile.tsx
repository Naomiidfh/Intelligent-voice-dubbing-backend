import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '@/hooks/useVoice';
import { useUserStore } from '@/stores/userStore';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { User, Star, Phone, Settings, Volume2, Type, LogOut, Shield } from 'lucide-react';

const FONT_SIZES = [
  { label: '标准', value: 20 },
  { label: '较大', value: 24 },
  { label: '特大', value: 28 },
  { label: '超大', value: 32 }
];

export default function Profile() {
  const navigate = useNavigate();
  const { speak, voiceEnabled } = useVoice();
  const currentUser = useUserStore((state) => state.currentUser);
  const { fontSize, setFontSize, setVoiceEnabled, logout } = useUserStore();

  useEffect(() => {
    const message = `个人中心页面，您可以查看和修改您的设置`;
    speak(message);
  }, [speak]);

  const handleLogout = () => {
    logout();
    speak('已退出登录');
    navigate('/');
  };

  const handleSpeakUserInfo = () => {
    speak(`您的姓名是${currentUser?.name || '用户'}，账号是${currentUser?.account || '未知'}，能力等级${currentUser?.abilityLevel || 1}级`);
  };

  const getLevelLabel = (level: number) => {
    const labels = ['初级', '入门', '进阶', '熟练', '专业'];
    return labels[level - 1] || '初级';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <Header title="个人中心" showBack={true} />

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <Card variant="elevated" className="bg-gradient-to-br from-primary-500 to-primary-600 text-white border-0">
          <div 
            className="flex items-center gap-4 cursor-pointer"
            onClick={handleSpeakUserInfo}
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{currentUser?.name || '用户'}</h3>
              <p className="text-primary-100">账号：{currentUser?.account || '未知'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4" />
                <span>{getLevelLabel(currentUser?.abilityLevel || 1)} ({currentUser?.abilityLevel || 1}级)</span>
              </div>
            </div>
            <div className="text-primary-100 text-sm">
              点击<br />朗读
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center gap-3 mb-4">
            <Phone className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800">联系方式</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">绑定辅导员</span>
              <span className="font-medium text-gray-800">{currentUser?.counselorName || '李老师'}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">辅导员电话</span>
              <span className="font-medium text-primary-600">{currentUser?.counselorPhone || '13800138000'}</span>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-primary-600" />
            <h3 className="text-xl font-bold text-gray-800">界面设置</h3>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Volume2 className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">语音播报</span>
            </div>
            <button
              onClick={() => {
                setVoiceEnabled(!voiceEnabled);
                speak(voiceEnabled ? '语音播报已关闭' : '语音播报已开启');
              }}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-colors ${
                voiceEnabled
                  ? 'bg-success-100 text-success-700'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {voiceEnabled ? '✓ 已开启' : '✗ 已关闭'}
            </button>
            <p className="text-sm text-gray-500 mt-2">开启后页面会自动朗读操作提示</p>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <Type className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">字体大小</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  onClick={() => {
                    setFontSize(size.value);
                    speak(`字体大小已调整为${size.label}`);
                  }}
                  className={`py-3 rounded-xl font-medium transition-all ${
                    fontSize === size.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span style={{ fontSize: `${size.value}px` }}>A</span>
                  <span className="block text-xs mt-1">{size.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 p-4 bg-gray-50 rounded-xl">
              <p style={{ fontSize: `${fontSize}px` }}>
                预览文字：这是一段示例文字，用于预览字体大小效果
              </p>
            </div>
          </div>
        </Card>

        <Card variant="outlined" className="border-gray-200">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-gray-600" />
            <div>
              <h4 className="font-bold text-gray-800">隐私与安全</h4>
              <p className="text-sm text-gray-500">您的个人信息受到保护</p>
            </div>
          </div>
        </Card>

        <Button
          onClick={handleLogout}
          variant="danger"
          size="lg"
          fullWidth
        >
          <LogOut className="w-6 h-6" />
          退出登录
        </Button>

        <p className="text-center text-gray-400 text-sm mt-4">
          智声助业配音平台 v1.0.0
        </p>
      </div>
    </div>
  );
}
