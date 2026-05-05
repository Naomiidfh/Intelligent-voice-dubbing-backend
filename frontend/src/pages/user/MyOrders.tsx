import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '@/hooks/useVoice';
import { useOrderStore, Order } from '@/stores/orderStore';
import Header from '@/components/Header';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { FileText, Clock, CheckCircle, DollarSign, AlertCircle, Play } from 'lucide-react';

type OrderStatus = 'pending_record' | 'pending_review' | 'pending_acceptance' | 'pending_settlement' | 'completed' | 'rejected';

const STATUS_TABS: { id: OrderStatus | 'all'; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: '全部', icon: <FileText className="w-5 h-5" /> },
  { id: 'pending_record', label: '待录制', icon: <Clock className="w-5 h-5" /> },
  { id: 'pending_review', label: '待审核', icon: <AlertCircle className="w-5 h-5" /> },
  { id: 'pending_acceptance', label: '待验收', icon: <DollarSign className="w-5 h-5" /> },
  { id: 'completed', label: '已完成', icon: <CheckCircle className="w-5 h-5" /> },
  { id: 'rejected', label: '已驳回', icon: <AlertCircle className="w-5 h-5" /> }
];

const getStatusLabel = (status: string) => {
  const labels: Record<string, string> = {
    pending_record: '待录制',
    pending_review: '待审核',
    pending_acceptance: '待验收',
    pending_settlement: '待结算',
    completed: '已完成',
    rejected: '已驳回',
    accepted: '已接单'
  };
  return labels[status] || status;
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending_record: 'bg-warning-100 text-warning-700',
    pending_review: 'bg-blue-100 text-blue-700',
    pending_acceptance: 'bg-purple-100 text-purple-700',
    pending_settlement: 'bg-purple-100 text-purple-700',
    completed: 'bg-success-100 text-success-700',
    rejected: 'bg-danger-100 text-danger-700',
    accepted: 'bg-primary-100 text-primary-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
};

const getStatusIcon = (status: string) => {
  const icons: Record<string, React.ReactNode> = {
    pending_record: <Clock className="w-5 h-5" />,
    pending_review: <AlertCircle className="w-5 h-5" />,
    pending_acceptance: <DollarSign className="w-5 h-5" />,
    pending_settlement: <DollarSign className="w-5 h-5" />,
    completed: <CheckCircle className="w-5 h-5" />,
    rejected: <AlertCircle className="w-5 h-5" />,
    accepted: <Clock className="w-5 h-5" />
  };
  return icons[status] || <FileText className="w-5 h-5" />;
};

export default function MyOrders() {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const { orders, fetchOrders, selectedStatus, setSelectedStatus, getFilteredOrders } = useOrderStore();
  const [animatingTab, setAnimatingTab] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
    speak('我的订单页面，点击顶部标签可以切换查看不同状态的订单');
  }, [fetchOrders, speak]);

  const filteredOrders = getFilteredOrders();

  const handleTabChange = (status: OrderStatus | 'all') => {
    setAnimatingTab(status);
    setSelectedStatus(status as OrderStatus | 'all');
    const label = STATUS_TABS.find(t => t.id === status)?.label || '全部';
    speak(`已切换到${label}订单`);
    setTimeout(() => setAnimatingTab(null), 300);
  };

  const handleOrderClick = (order: Order) => {
    if (order.status === 'pending_record' || order.status === 'accepted' || order.admin_feedback) {
      navigate(`/user/recording/${order.id}`);
    }
  };

  const handleGoToRecord = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/user/recording/${order.id}`);
  };

  const handleViewDetails = (order: Order, e: React.MouseEvent) => {
    e.stopPropagation();
    alert(`订单详情\n\n订单号：${order.id}\n状态：${getStatusLabel(order.status)}\n金额：¥${order.budget || order.price || 0}\n任务内容：${order.task_content || order.taskTitle || '配音任务'}\n创建时间：${order.createdAt || new Date(order.created_at).toLocaleDateString('zh-CN')}${order.voice_actor_name ? '\n配音员：' + order.voice_actor_name : ''}`);
  };

  const getActionButton = (order: Order) => {
    if (order.status === 'pending_record' || order.status === 'accepted' || order.admin_feedback) {
      return (
        <Button onClick={(e) => handleGoToRecord(order, e)} variant="primary" size="md">
          <Play className="w-5 h-5" />
          去录制
        </Button>
      );
    }
    return (
      <Button onClick={(e) => handleViewDetails(order, e)} variant="secondary" size="md">
        查看详情
      </Button>
    );
  };

  const getStatusCount = (status: OrderStatus | 'all') => {
    if (status === 'all') return orders.length;
    if (status === 'rejected') {
      return orders.filter(o => o.status === 'pending_record' && o.admin_feedback).length;
    }
    return orders.filter(o => o.status === status).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <Header title="我的订单" showBack={true} />

      <div className="max-w-lg mx-auto px-4 pt-4">
        <div className="bg-white rounded-2xl p-2 mb-6 shadow-md">
          <div className="flex overflow-x-auto scrollbar-hide">
            {STATUS_TABS.map((tab) => {
              const isActive = selectedStatus === tab.id;
              const count = getStatusCount(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex-1 min-w-0 px-3 py-3 rounded-xl flex flex-col items-center gap-1 transition-all ${
                    isActive
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${animatingTab === tab.id ? 'scale-95' : ''}`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium whitespace-nowrap">{tab.label}</span>
                  <span className={`text-xs ${isActive ? 'text-primary-100' : 'text-gray-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500">暂无订单</p>
              <p className="text-base text-gray-400 mt-2">去任务广场接取新任务吧</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                variant="elevated"
                onClick={() => handleOrderClick(order)}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusLabel(order.status)}
                  </span>
                  <span className="text-lg font-bold text-primary-600">¥{order.budget || order.price || 0}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                  {order.taskTitle || order.task_content?.slice(0, 50) || '配音任务'}
                </h3>

                {order.admin_feedback && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium text-red-700 mb-1">驳回原因：</p>
                    <p className="text-sm text-red-600">{order.admin_feedback}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    <p>订单号：{order.id}</p>
                    <p>创建时间：{order.createdAt || new Date(order.created_at).toLocaleDateString('zh-CN')}</p>
                    {order.task_sentences && order.task_sentences.length > 0 && (
                      <p>共{order.task_sentences.length}句</p>
                    )}
                  </div>
                  {getActionButton(order)}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
