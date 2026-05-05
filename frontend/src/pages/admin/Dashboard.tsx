import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, FileText, CheckCircle, Clock, DollarSign, 
  TrendingUp, AlertCircle, LogOut, Bell, Menu
} from 'lucide-react';
import Card from '@/components/Card';
import { useAdminStore } from '@/stores/adminStore';
import { api } from '@/services/api';

interface DashboardStats {
  totalVoiceActors: number;
  totalClients: number;
  pendingTasks: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
}

interface VoiceActor {
  id: number;
  name: string;
  phone: string;
  counselor_id: number;
  totalEarnings: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { currentAdmin, isLoggedIn, logout } = useAdminStore();
  const [stats, setStats] = useState<DashboardStats>({
    totalVoiceActors: 0,
    totalClients: 0,
    pendingTasks: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0
  });
  const [recentTasks, setRecentTasks] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counselorStudents, setCounselorStudents] = useState<VoiceActor[]>([]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [tasksRes, ordersRes, voiceActorsRes, clientsRes] = await Promise.all([
        api.tasks.list(),
        api.orders.list(),
        api.users.voiceActors.list(),
        api.users.clients.list()
      ]);

      const tasks = tasksRes.success ? tasksRes.data : [];
      const orders = ordersRes.success ? ordersRes.data : [];
      const allVoiceActors = voiceActorsRes.success ? voiceActorsRes.data : [];
      const clients = clientsRes.success ? clientsRes.data : [];

      const currentCounselorId = currentAdmin?.id;
      const filteredVoiceActors = currentAdmin?.role === 'counselor' && currentCounselorId
        ? allVoiceActors.filter((va: any) => va.counselor_id === currentCounselorId)
        : allVoiceActors;

      setStats({
        totalVoiceActors: filteredVoiceActors.length,
        totalClients: clients.length,
        pendingTasks: tasks.filter((t: any) => t.status === 'pending').length,
        pendingOrders: orders.filter((o: any) => ['pending_record', 'pending_review'].includes(o.status)).length,
        completedOrders: orders.filter((o: any) => o.status === 'completed').length,
        totalRevenue: orders
          .filter((o: any) => o.status === 'completed')
          .reduce((sum: number, o: any) => sum + (o.budget || 0), 0)
      });

      setRecentTasks(tasks.slice(0, 5));
      setCounselorStudents(filteredVoiceActors);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-warning-100', text: 'text-warning-700', label: '待审核' },
      approved: { bg: 'bg-success-100', text: 'text-success-700', label: '已通过' },
      rejected: { bg: 'bg-danger-100', text: 'text-danger-700', label: '已驳回' },
      in_progress: { bg: 'bg-blue-100', text: 'text-blue-700', label: '进行中' },
      completed: { bg: 'bg-success-100', text: 'text-success-700', label: '已完成' }
    };
    const badge = badges[status] || badges.pending;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        {badge.label}
      </span>
    );
  };

  const menuItems = (() => {
    const role = currentAdmin?.role;
    if (role === 'counselor') {
      return [
        { id: 'dashboard', label: '工作台', icon: <TrendingUp className="w-5 h-5" />, path: '/admin/dashboard' },
        { id: 'users', label: '帮扶学员', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
        { id: 'counselors', label: '辅导员管理', icon: <Users className="w-5 h-5" />, path: '/admin/counselors' },
        { id: 'organizations', label: '机构管理', icon: <Users className="w-5 h-5" />, path: '/admin/organizations' }
      ];
    } else if (role === 'reviewer') {
      return [
        { id: 'dashboard', label: '工作台', icon: <TrendingUp className="w-5 h-5" />, path: '/admin/dashboard' },
        { id: 'quality', label: '质控审核', icon: <CheckCircle className="w-5 h-5" />, path: '/admin/quality' },
        { id: 'finance', label: '财务结算', icon: <DollarSign className="w-5 h-5" />, path: '/admin/finance' }
      ];
    } else {
      return [
        { id: 'dashboard', label: '数据大盘', icon: <TrendingUp className="w-5 h-5" />, path: '/admin/dashboard' },
        { id: 'users', label: '人员管理', icon: <Users className="w-5 h-5" />, path: '/admin/users' },
        { id: 'manuscripts', label: '文稿预处理', icon: <FileText className="w-5 h-5" />, path: '/admin/manuscripts' },
        { id: 'dispatch', label: '订单分派', icon: <Clock className="w-5 h-5" />, path: '/admin/dispatch' },
        { id: 'quality', label: '质控审核', icon: <CheckCircle className="w-5 h-5" />, path: '/admin/quality' },
        { id: 'counselors', label: '辅导员管理', icon: <Users className="w-5 h-5" />, path: '/admin/counselors' },
        { id: 'organizations', label: '机构管理', icon: <Users className="w-5 h-5" />, path: '/admin/organizations' },
        { id: 'finance', label: '财务结算', icon: <DollarSign className="w-5 h-5" />, path: '/admin/finance' }
      ];
    }
  })();

  const getPageTitle = () => {
    const role = currentAdmin?.role;
    if (role === 'counselor') return '辅导员工作台';
    if (role === 'reviewer') return '审核工作台';
    return '数据大盘';
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors" onClick={() => navigate('/admin/dashboard')}>
              <h1 className="text-xl font-bold text-white">智声助业</h1>
              <p className="text-gray-400 text-sm">运营管理后台</p>
            </div>
            
            <nav className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    window.location.pathname === item.path
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-gray-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentAdmin?.username?.[0]?.toUpperCase() || 'A'}
                </div>
                <div>
                  <p className="text-white font-medium">{currentAdmin?.username}</p>
                  <p className="text-gray-400 text-xs">
                    {currentAdmin?.role === 'operator' ? '运营人员' : 
                     currentAdmin?.role === 'counselor' ? '辅导员' : '审核人员'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:bg-gray-800 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="px-6 py-4 flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-xl font-bold text-gray-800">{getPageTitle()}</h2>
              <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5" />
                {stats.pendingTasks > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-danger-500 text-white text-xs rounded-full flex items-center justify-center">
                    {stats.pendingTasks}
                  </span>
                )}
              </button>
            </div>
          </header>

          <main className="flex-1 p-6">
            {currentAdmin?.role === 'counselor' ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">辅导员工作概览</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalVoiceActors}</p>
                      <p className="text-sm text-gray-500">帮扶学员数</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-success-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.completedOrders}</p>
                      <p className="text-sm text-gray-500">已完成任务</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-warning-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
                      <p className="text-sm text-gray-500">进行中任务</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue}</p>
                      <p className="text-sm text-gray-500">累计收益</p>
                    </Card>
                  </div>
                </div>

                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-800">我的帮扶学员</h3>
                    <button 
                      onClick={() => navigate('/admin/users')}
                      className="text-sm text-primary-600 hover:underline"
                    >
                      查看全部
                    </button>
                  </div>
                  {counselorStudents.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p>暂无帮扶学员</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {counselorStudents.map((actor) => (
                        <div key={actor.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                            {actor.name?.[0] || '?'}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">{actor.name}</p>
                            <p className="text-sm text-gray-500">{actor.phone}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-success-600">¥{actor.totalEarnings || 0}</p>
                            <p className="text-xs text-gray-400">累计收益</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </>
            ) : currentAdmin?.role === 'reviewer' ? (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">审核工作概览</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-warning-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.pendingOrders}</p>
                      <p className="text-sm text-gray-500">待审核作品</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-success-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.completedOrders}</p>
                      <p className="text-sm text-gray-500">已审核通过</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalVoiceActors}</p>
                      <p className="text-sm text-gray-500">配音员总数</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-primary-600" />
                        </div>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">¥{stats.totalRevenue}</p>
                      <p className="text-sm text-gray-500">累计结算</p>
                    </Card>
                  </div>
                </div>

                <div 
                  onClick={() => navigate('/admin/quality')}
                  className="flex items-center gap-3 p-6 bg-success-50 rounded-xl cursor-pointer hover:bg-success-100 transition-colors"
                >
                  <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-bold text-gray-800">开始审核</p>
                    <p className="text-gray-600">点击进入作品质量审核</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">核心指标</h3>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-primary-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-success-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalVoiceActors}</p>
                      <p className="text-sm text-gray-500">配音员数量</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-success-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-success-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">¥{stats.totalRevenue}</p>
                      <p className="text-sm text-gray-500">累计收益</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                          <Clock className="w-6 h-6 text-warning-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-success-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.pendingTasks}</p>
                      <p className="text-sm text-gray-500">待审核任务</p>
                    </Card>

                    <Card>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-success-500" />
                      </div>
                      <p className="text-2xl font-bold text-gray-800">{stats.completedOrders}</p>
                      <p className="text-sm text-gray-500">已完成订单</p>
                    </Card>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">最近任务</h3>
                      <button 
                        onClick={() => navigate('/admin/manuscripts')}
                        className="text-sm text-primary-600 hover:underline"
                      >
                        查看全部
                      </button>
                    </div>
                    <div className="space-y-3">
                      {recentTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p>暂无任务</p>
                        </div>
                      ) : (
                        recentTasks.map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-gray-800">{task.content?.slice(0, 30)}...</p>
                              <p className="text-sm text-gray-500">¥{task.budget} · {task.company_name}</p>
                            </div>
                            {getStatusBadge(task.status)}
                          </div>
                        ))
                      )}
                    </div>
                  </Card>

                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-800">待处理事项</h3>
                    </div>
                    <div className="space-y-3">
                      <div 
                        onClick={() => navigate('/admin/manuscripts')}
                        className="flex items-center gap-3 p-3 bg-warning-50 rounded-lg cursor-pointer hover:bg-warning-100 transition-colors"
                      >
                        <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-warning-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">任务审核</p>
                          <p className="text-sm text-gray-500">{stats.pendingTasks} 个任务待审核</p>
                        </div>
                        <AlertCircle className="w-5 h-5 text-warning-500" />
                      </div>

                      <div 
                        onClick={() => navigate('/admin/dispatch')}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors"
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">订单分派</p>
                          <p className="text-sm text-gray-500">{stats.pendingOrders} 个订单待分派</p>
                        </div>
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                      </div>

                      <div 
                        onClick={() => navigate('/admin/quality')}
                        className="flex items-center gap-3 p-3 bg-success-50 rounded-lg cursor-pointer hover:bg-success-100 transition-colors"
                      >
                        <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-success-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">质量审核</p>
                          <p className="text-sm text-gray-500">查看配音作品质量</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </>
            )}
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
