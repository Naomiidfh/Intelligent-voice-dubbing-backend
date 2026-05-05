import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Lock, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import { useClientStore } from '@/stores/clientStore';

export default function ClientLogin() {
  const navigate = useNavigate();
  const { login, isLoading } = useClientStore();
  const [phone, setPhone] = useState('13800138000');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);

  const handleSendCode = () => {
    if (!phone) {
      alert('请输入手机号');
      return;
    }
    setCode('123456');
    alert('验证码已发送（演示模式）');
  };

  const handleLogin = async () => {
    if (!phone || !code) {
      alert('请填写完整信息');
      return;
    }
    
    try {
      await login(phone);
      navigate('/client/home');
    } catch (error) {
      alert('登录失败，请检查账号信息');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-6">
        <button 
          onClick={() => navigate('/')}
          className="w-12 h-12 rounded-full bg-white shadow flex items-center justify-center mb-6"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">企业登录</h1>
          <p className="text-gray-500 mb-6">发布配音需求，找到合适的配音员</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="请输入手机号"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">验证码</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="请输入验证码"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400"
                  />
                </div>
                <button
                  onClick={handleSendCode}
                  className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 whitespace-nowrap"
                >
                  获取验证码
                </button>
              </div>
            </div>

            <div className="bg-primary-50 rounded-xl p-4 border border-primary-100">
              <p className="text-sm text-primary-700">
                <strong>测试账号：</strong>13800138000<br/>
                <strong>验证码：</strong>任意6位数字
              </p>
            </div>

            <Button
              onClick={handleLogin}
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  登录中...
                </span>
              ) : '登录'}
            </Button>

            <p className="text-center text-sm text-gray-500">
              还没有账号？
              <button onClick={() => navigate('/client/register')} className="text-primary-600 ml-1">
                企业注册
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
