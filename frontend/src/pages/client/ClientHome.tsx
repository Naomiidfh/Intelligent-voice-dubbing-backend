import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Plus, FileText, Users, CreditCard, Bell, Loader2 } from 'lucide-react';
import Card from '@/components/Card';
import { useClientStore } from '@/stores/clientStore';
import { api } from '@/services/api';

const MENU_ITEMS = [
  { id: 'publish', title: '发布需求', icon: <Plus className="w-8 h-8" />, path: '/client/publish', desc: '发布新的配音需求', color: 'bg-primary-100 text-primary-600' },
  { id: 'orders', title: '我的订单', icon: <FileText className="w-8 h-8" />, path: '/client/orders', desc: '管理您的配音订单', color: 'bg-success-100 text-success-600' },
  { id: 'actors', title: '配音员库', icon: <Users className="w-8 h-8" />, path: '/client/actors', desc: '浏览选择配音员', color: 'bg-warning-100 text-warning-600' },
  { id: 'finance', title: '消费记录', icon: <CreditCard className="w-8 h-8" />, path: '/client/profile', desc: '查看消费明细', color: 'bg-purple-100 text-purple-600' }
];

export default function ClientHome() {
  const navigate = useNavigate();
  const { currentClient, isLoggedIn } = useClientStore();
  const [stats, setStats] = useState({ inProgress: 0, completed: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/client/login');
    } else {
      fetchStats();
    }
  }, [isLoggedIn, navigate]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [tasksRes, ordersRes] = await Promise.all([
        api.tasks.list({ client_id: currentClient?.id }),
        api.orders.list()
      ]);

      let inProgress = 0;
      let completed = 0;
      let totalSpent = 0;

      if (tasksRes.success) {
        tasksRes.data.forEach((task: any) => {
          if (['pending', 'approved'].includes(task.status)) inProgress++;
        });
      }

      if (ordersRes.success) {
        ordersRes.data.forEach((order: any) => {
          if (order.status === 'completed') {
            completed++;
            totalSpent += order.budget || 0;
          } else if (['pending_record', 'accepted', 'pending_review'].includes(order.status)) {
            inProgress++;
          }
        });
      }

      setStats({ inProgress, completed, totalSpent });
    } catch (error) {
      console.error('获取统计数据失败:', error);
    }
    setLoading(false);
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{currentClient?.company_name || '企业用户'}</h1>
                <p className="text-primary-100 text-sm">{currentClient?.verified ? '已认证企业' : '待认证企业'}</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/client/profile')}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"
            >
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4">
          {MENU_ITEMS.map((item) => (
            <Card
              key={item.id}
              variant="elevated"
              onClick={() => handleMenuClick(item.path)}
            >
              <div className={`w-14 h-14 ${item.color} rounded-xl flex items-center justify-center mb-4`}>
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-6 bg-white rounded-2xl p-4 shadow-md">
          <h3 className="text-lg font-bold text-gray-800 mb-4">快捷统计</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary-600">{stats.inProgress}</p>
              <p className="text-sm text-gray-500">进行中</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success-600">{stats.completed}</p>
              <p className="text-sm text-gray-500">已完成</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-warning-600">¥{stats.totalSpent}</p>
              <p className="text-sm text-gray-500">消费总额</p>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg">
          <h3 className="font-bold mb-2">配音员推荐</h3>
          <p className="text-primary-100 text-sm mb-4">根据您的需求，系统为您推荐合适的配音员</p>
          <button
            onClick={() => navigate('/client/actors')}
            className="w-full py-3 bg-white/20 rounded-xl font-medium hover:bg-white/30 transition-colors"
          >
            查看推荐
          </button>
        </div>
      </div>
    </div>
  );
}
