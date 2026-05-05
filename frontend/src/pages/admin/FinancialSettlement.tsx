import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, Users, CheckCircle, Clock, FileText, Download } from 'lucide-react';
import { Home } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAdminStore } from '@/stores/adminStore';
import { useOrderStore } from '@/stores/orderStore';

export default function FinancialSettlement() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdminStore();
  const { orders, fetchOrders } = useOrderStore();
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const completedOrders = orders.filter(o => o.status === 'completed');
  const pendingOrders = orders.filter(o => o.status === 'pending_settlement');

  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.budget || 0), 0);
  const pendingSettlement = pendingOrders.reduce((sum, o) => sum + (o.budget || 0), 0);

  const filteredOrders = filter === 'all' 
    ? orders.filter(o => ['completed', 'pending_settlement'].includes(o.status))
    : orders.filter(o => o.status === filter);

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
                  item.path === '/admin/finance'
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
                <h2 className="text-xl font-bold text-gray-800">财务结算</h2>
                <p className="text-sm text-gray-500">管理订单收益和结算</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Home className="w-4 h-4" />
                  <span className="font-medium">返回主页</span>
                </button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  导出报表
                </Button>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success-600" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-success-500" />
                </div>
                <p className="text-2xl font-bold text-gray-800">¥{totalRevenue}</p>
                <p className="text-sm text-gray-500">累计收益</p>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-warning-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-warning-600">¥{pendingSettlement}</p>
                <p className="text-sm text-gray-500">待结算金额</p>
              </Card>

              <Card>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-primary-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800">{completedOrders.length}</p>
                <p className="text-sm text-gray-500">已完成订单</p>
              </Card>
            </div>

            <Card>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-800">结算明细</h3>
                <div className="flex gap-2">
                  {(['all', 'completed', 'pending'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        filter === status
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {status === 'all' ? '全部' : status === 'completed' ? '已结算' : '待结算'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">订单号</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">配音员</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">任务类型</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">金额</th>
                      <th className="text-center py-3 px-4 text-sm font-medium text-gray-600">状态</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-gray-600">完成时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-gray-500">
                          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                          <p>暂无结算记录</p>
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-800">#{order.id}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">{order.voice_actor_name || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-800">
                            {order.task_type === 'children_book' ? '童书配音' :
                             order.task_type === 'picture_book' ? '绘本朗读' :
                             order.task_type === 'documentary' ? '纪录片' : '公益广告'}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-primary-600 text-right">
                            ¥{order.budget || 0}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'completed' 
                                ? 'bg-success-100 text-success-700' 
                                : 'bg-warning-100 text-warning-700'
                            }`}>
                              {order.status === 'completed' ? '已结算' : '待结算'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-500 text-right">
                            {order.completed_at ? new Date(order.completed_at).toLocaleDateString('zh-CN') : '-'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
