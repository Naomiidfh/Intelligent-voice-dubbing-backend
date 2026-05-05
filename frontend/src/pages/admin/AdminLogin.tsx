import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Key, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import { useAdminStore } from '@/stores/adminStore';

const ROLES = [
  { id: 'operator', label: '运营人员', desc: '负责日常运营管理', username: 'admin', password: 'admin123' },
  { id: 'counselor', label: '辅导员', desc: '负责帮扶学员管理', username: 'counselor', password: 'counselor123' },
  { id: 'reviewer', label: '审核人员', desc: '负责内容审核质控', username: 'reviewer', password: 'reviewer123' }
];

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isLoading } = useAdminStore();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [role, setRole] = useState('operator');

  useEffect(() => {
    const selectedRole = ROLES.find(r => r.id === role);
    if (selectedRole) {
      setUsername(selectedRole.username);
      setPassword(selectedRole.password);
    }
  }, [role]);

  const handleLogin = async () => {
    if (!username || !password) {
      alert('请填写用户名和密码');
      return;
    }
    
    try {
      await login(username, role);
      navigate('/admin/dashboard');
    } catch (error) {
      alert('登录失败，请检查账号信息');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">运营管理后台</h1>
          <p className="text-gray-400">智声助业配音平台</p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">角色选择</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-3 rounded-xl text-center transition-all ${
                    role === r.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  <p className="font-medium text-sm">{r.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">用户名</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="请输入用户名"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-300 mb-2">密码</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码"
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary-500"
                />
              </div>
            </div>

            <Button 
              onClick={handleLogin} 
              variant="primary" 
              size="lg" 
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  登录中...
                </span>
              ) : '登录'}
            </Button>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-xl">
            <p className="text-gray-400 text-sm mb-2">测试账号（切换角色自动填充）：</p>
            <div className="space-y-1 text-gray-500 text-sm">
              <p>运营人员：admin / admin123</p>
              <p>辅导员：counselor / counselor123</p>
              <p>审核人员：reviewer / reviewer123</p>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © 2026 智声助业 All Rights Reserved
        </p>
      </div>
    </div>
  );
}
