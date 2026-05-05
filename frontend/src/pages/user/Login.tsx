import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import { useUserStore } from '@/stores/userStore';

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useUserStore();
  const [phone, setPhone] = useState('13900139000');

  const handleLogin = async () => {
    if (!phone) {
      alert('请输入手机号');
      return;
    }
    
    try {
      await login(phone);
      navigate('/user/home');
    } catch (error) {
      alert('登录失败，请重试');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary-500 to-primary-600 flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-6">
        <div className="text-center text-white mb-12">
          <div className="w-24 h-24 bg-white/20 rounded-3xl mx-auto mb-6 flex items-center justify-center">
            <span className="text-4xl">🎙️</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">智声助业</h1>
          <p className="text-primary-100">用声音创造价值</p>
        </div>

        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">快捷登录</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-2">手机号</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 transition-colors"
                />
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-4 mb-6 border border-primary-100">
              <p className="text-sm text-primary-700">
                <strong>测试账号：</strong>13900139000
              </p>
            </div>

            <Button
              onClick={handleLogin}
              variant="primary"
              size="xl"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  登录中...
                </span>
              ) : '一键登录'}
            </Button>
          </div>

          <p className="text-center text-primary-100 text-sm mt-6">
            登录即表示同意《用户协议》和《隐私政策》
          </p>
        </div>
      </div>
    </div>
  );
}
