import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search, Plus, Phone, Award, Clock, Loader2 } from 'lucide-react';
import { Home } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAdminStore } from '@/stores/adminStore';
import { api } from '@/services/api';

interface VoiceActor {
  id: number;
  phone: string;
  name: string;
  abilityLevel?: number;
  completedOrders?: number;
  totalEarnings?: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
}

export default function UserManagement() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdminStore();
  const [voiceActors, setVoiceActors] = useState<VoiceActor[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [loading, setLoading] = useState(false);
  const [selectedActor, setSelectedActor] = useState<VoiceActor | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    loadVoiceActors();
  }, []);

  const loadVoiceActors = async () => {
    setLoading(true);
    try {
      const response = await api.users.voiceActors.list();
      if (response.success) {
        setVoiceActors(response.data);
      }
    } catch (error) {
      console.error('加载配音员列表失败:', error);
    }
    setLoading(false);
  };

  const filteredActors = voiceActors.filter(actor => {
    if (filter !== 'all' && actor.status !== filter) return false;
    if (searchKeyword && !actor.name?.includes(searchKeyword) && !actor.phone?.includes(searchKeyword)) {
      return false;
    }
    return true;
  });

  const menuItems = [
    { id: 'dashboard', label: '数据大盘', path: '/admin/dashboard' },
    { id: 'users', label: '人员管理', path: '/admin/users' },
    { id: 'manuscripts', label: '文稿预处理', path: '/admin/manuscripts' },
    { id: 'dispatch', label: '订单分派', path: '/admin/dispatch' },
    { id: 'quality', label: '质控审核', path: '/admin/quality' },
    { id: 'counselors', label: '辅导员管理', path: '/admin/counselors' },
    { id: 'organizations', label: '机构管理', path: '/admin/organizations' },
    { id: 'finance', label: '财务结算', path: '/admin/finance' }
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-success-100', text: 'text-success-700', label: '活跃' },
      inactive: { bg: 'bg-gray-100', text: 'text-gray-600', label: '不活跃' },
      suspended: { bg: 'bg-danger-100', text: 'text-danger-700', label: '已停用' }
    };
    return badges[status] || badges.active;
  };

  const handleViewDetails = (actor: VoiceActor) => {
    setSelectedActor(actor);
  };

  const handleCloseDetails = () => {
    setSelectedActor(null);
  };

  const handleAssignTask = (actor: VoiceActor) => {
    alert(`为 ${actor.name || '配音员'} 分配任务功能开发中...`);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-gray-900 min-h-screen">
          <div className="p-6 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => navigate('/admin/dashboard')}>
            <h1 className="text-xl font-bold text-white">智声助业</h1>
            <p className="text-gray-400 text-sm">运营管理后台</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  item.path === '/admin/users'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-800">配音员管理</h2>
                <p className="text-sm text-gray-500">管理平台配音员信息</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">返回主页</span>
                </button>
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  添加配音员
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                {(['all', 'active', 'inactive'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? '全部' : status === 'active' ? '活跃' : '不活跃'}
                    {status === 'all' && (
                      <span className="ml-2 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full">
                        {voiceActors.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="搜索姓名或手机号..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            ) : filteredActors.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">暂无配音员</p>
                </div>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredActors.map((actor) => {
                  const badge = getStatusBadge(actor.status);
                  return (
                    <Card key={actor.id} variant="elevated">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xl font-bold">
                          {actor.name?.[0] || actor.phone?.[0] || 'U'}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-gray-800">{actor.name || '未命名'}</h4>
                              <p className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {actor.phone}
                              </p>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-3">
                            <div className="text-center bg-gray-50 rounded-lg p-2">
                              <p className="text-lg font-bold text-primary-600">
                                {actor.abilityLevel || 1}
                              </p>
                              <p className="text-xs text-gray-500">能力等级</p>
                            </div>
                            <div className="text-center bg-gray-50 rounded-lg p-2">
                              <p className="text-lg font-bold text-success-600">
                                {actor.completedOrders || 0}
                              </p>
                              <p className="text-xs text-gray-500">完成订单</p>
                            </div>
                            <div className="text-center bg-gray-50 rounded-lg p-2">
                              <p className="text-lg font-bold text-warning-600">
                                ¥{actor.totalEarnings || 0}
                              </p>
                              <p className="text-xs text-gray-500">累计收益</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleViewDetails(actor)}
                            >
                              查看详情
                            </Button>
                            <Button 
                              variant="secondary" 
                              size="sm"
                              onClick={() => handleAssignTask(actor)}
                            >
                              分配任务
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      {selectedActor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-800">配音员详情</h3>
                <button
                  onClick={handleCloseDetails}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-2xl font-bold">
                  {selectedActor.name?.[0] || selectedActor.phone?.[0] || 'U'}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{selectedActor.name || '未命名'}</h4>
                  <p className="text-gray-500">{selectedActor.phone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">能力等级</p>
                    <p className="text-2xl font-bold text-primary-600">{selectedActor.abilityLevel || 1}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500 mb-1">完成订单</p>
                    <p className="text-2xl font-bold text-success-600">{selectedActor.completedOrders || 0}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">累计收益</p>
                  <p className="text-2xl font-bold text-warning-600">¥{selectedActor.totalEarnings || 0}</p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">状态</p>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedActor.status).bg} ${getStatusBadge(selectedActor.status).text}`}>
                    {getStatusBadge(selectedActor.status).label}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500 mb-1">注册时间</p>
                  <p className="text-gray-800">{new Date(selectedActor.created_at).toLocaleDateString('zh-CN')}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1"
                  onClick={handleCloseDetails}
                >
                  关闭
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => {
                    handleAssignTask(selectedActor);
                    handleCloseDetails();
                  }}
                >
                  分配任务
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
