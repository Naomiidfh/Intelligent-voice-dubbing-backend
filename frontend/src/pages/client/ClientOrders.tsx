import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, CheckCircle, XCircle, Play, Filter, Loader2 } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useClientStore } from '@/stores/clientStore';
import { api } from '@/services/api';

const STATUS_TABS = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待审核' },
  { id: 'approved', label: '进行中' },
  { id: 'pending_review', label: '待验收' },
  { id: 'rejected', label: '已驳回' },
  { id: 'completed', label: '已完成' }
];

export default function ClientOrders() {
  const navigate = useNavigate();
  const { isLoggedIn, currentClient } = useClientStore();
  const [status, setStatus] = useState('all');
  const [tasks, setTasks] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/client/login');
    } else {
      fetchData();
    }
  }, [isLoggedIn, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksRes, ordersRes] = await Promise.all([
        api.tasks.list({ client_id: currentClient?.id }),
        api.orders.list()
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.data);
      }
      if (ordersRes.success) {
        setOrders(ordersRes.data);
      }
    } catch (error) {
      console.error('获取数据失败:', error);
    }
    setLoading(false);
  };

  const allOrders = [
    ...tasks.map(task => ({
      id: `task-${task.id}`,
      taskId: task.id,
      taskTitle: task.content?.slice(0, 30) || '配音任务',
      status: task.status,
      price: task.budget,
      createdAt: new Date(task.created_at).toLocaleDateString('zh-CN'),
      type: 'task',
      admin_feedback: task.admin_feedback
    })),
    ...orders.map(order => ({
      id: `order-${order.id}`,
      taskId: order.task_id,
      taskTitle: order.task_content?.slice(0, 30) || '配音任务',
      status: order.status,
      price: order.budget,
      createdAt: new Date(order.created_at).toLocaleDateString('zh-CN'),
      type: 'order',
      admin_feedback: order.admin_feedback
    }))
  ];

  const filteredOrders = allOrders.filter(order => {
    if (status === 'all') return true;
    if (status === 'pending') return order.status === 'pending';
    if (status === 'approved') return ['approved', 'pending_record', 'accepted'].includes(order.status);
    if (status === 'pending_review') return ['pending_review', 'pending_acceptance'].includes(order.status);
    if (status === 'rejected') return order.status === 'rejected' || (order.status === 'pending_record' && order.admin_feedback);
    if (status === 'completed') return order.status === 'completed';
    return true;
  });

  const getStatusLabel = (s: string, hasFeedback: boolean = false) => {
    const labels: Record<string, string> = {
      pending: '待审核',
      approved: '进行中',
      pending_record: hasFeedback ? '已驳回' : '待接单',
      accepted: '录制中',
      pending_review: '待验收',
      pending_acceptance: '待验收',
      pending_settlement: '待结算',
      completed: '已完成',
      rejected: '已驳回'
    };
    return labels[s] || s;
  };

  const handleViewDetails = (order: any, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`订单详情\n\n订单号：${order.id}\n任务标题：${order.taskTitle}\n状态：${getStatusLabel(order.status)}\n金额：¥${order.price}\n创建时间：${order.createdAt}`);
  };

  const getStatusColor = (s: string, hasFeedback: boolean = false) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-700',
      approved: 'bg-blue-100 text-blue-700',
      pending_record: hasFeedback ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700',
      accepted: 'bg-orange-100 text-orange-700',
      pending_review: 'bg-purple-100 text-purple-700',
      pending_acceptance: 'bg-purple-100 text-purple-700',
      pending_settlement: 'bg-gray-100 text-gray-700',
      completed: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700'
    };
    return colors[s] || 'bg-gray-100 text-gray-700';
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
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/client/home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">我的订单</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto">
            {STATUS_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatus(tab.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  status === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">暂无订单</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} variant="elevated">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status, !!order.admin_feedback)}`}>
                  {getStatusLabel(order.status, !!order.admin_feedback)}
                </span>
                <span className="text-lg font-bold text-primary-600">¥{order.price}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{order.taskTitle}...</h3>
              <div className="text-sm text-gray-500 mb-4">
                <p>订单号：{order.id}</p>
                <p>创建时间：{order.createdAt}</p>
              </div>
              {order.admin_feedback && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm font-medium text-red-700 mb-1">驳回原因：</p>
                  <p className="text-sm text-red-600">{order.admin_feedback}</p>
                </div>
              )}
              <div className="flex gap-2">
                {['pending_review', 'pending_acceptance'].includes(order.status) && order.type === 'order' && (
                  <Button onClick={() => navigate(`/client/review/${order.id.replace('order-', '')}`)} variant="primary" size="md" className="flex-1">
                    <Play className="w-4 h-4" />
                    去验收
                  </Button>
                )}
                <Button onClick={(e) => handleViewDetails(order, e)} variant="outline" size="md" className="flex-1">
                  查看详情
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
