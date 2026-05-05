import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, FileText, Play, Loader2, Headphones, Star } from 'lucide-react';
import { Home } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAdminStore } from '@/stores/adminStore';
import { useOrderStore } from '@/stores/orderStore';
import { useMessageStore } from '@/stores/messageStore';

export default function QualityReview() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdminStore();
  const { orders, fetchOrders, updateOrder } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const { sendMessage } = useMessageStore();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const pendingReviewOrders = orders.filter(o => o.status === 'pending_review');

  const handleApprove = async (orderId: number) => {
    setLoading(true);
    try {
      await updateOrder(orderId, { status: 'pending_acceptance' });
      await fetchOrders();
      alert('作品已通过审核，请甲方进行验收');
    } catch (error) {
      alert('操作失败，请重试');
    }
    setLoading(false);
  };

  const handleReject = async (orderId: number) => {
    const reason = prompt('请输入驳回原因：');
    if (!reason) return;
    
    setLoading(true);
    try {
      await updateOrder(orderId, { status: 'pending_record', admin_feedback: reason });
      await fetchOrders();
      alert('作品已驳回');
    } catch (error) {
      alert('操作失败，请重试');
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending_record: { bg: 'bg-warning-100', text: 'text-warning-700', label: '待录制' },
      pending_review: { bg: 'bg-blue-100', text: 'text-blue-700', label: '待审核' },
      pending_acceptance: { bg: 'bg-purple-100', text: 'text-purple-700', label: '待验收' },
      completed: { bg: 'bg-success-100', text: 'text-success-700', label: '已完成' }
    };
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-700', label: status };
  };

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
                  item.path === '/admin/quality'
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
            <div className="px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">质控审核</h2>
                <p className="text-sm text-gray-500">审核配音员提交的作品质量</p>
              </div>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="font-medium">返回主页</span>
              </button>
            </div>
          </header>

          <main className="flex-1 p-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-4">
                  待审核作品
                  <span className="ml-2 px-2 py-1 bg-blue-500 text-white text-sm rounded-full">
                    {pendingReviewOrders.length}
                  </span>
                </h3>
                
                {pendingReviewOrders.length === 0 ? (
                  <Card>
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-success-300 mx-auto mb-4" />
                      <p className="text-gray-500">暂无待审核作品</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingReviewOrders.map((order) => {
                      const badge = getStatusBadge(order.status);
                      return (
                        <Card
                          key={order.id}
                          variant="elevated"
                          onClick={() => setSelectedOrder(order)}
                          className={selectedOrder?.id === order.id ? 'ring-2 ring-primary-500' : ''}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                {badge.label}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">订单号：{order.id}</span>
                            </div>
                            <span className="text-lg font-bold text-primary-600">¥{order.budget || 0}</span>
                          </div>
                          
                          <p className="text-gray-800 line-clamp-2 mb-3">
                            {order.task_content || '任务内容'}
                          </p>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Headphones className="w-4 h-4" />
                              {order.voice_actor_name || '配音员'}
                            </div>
                            <span className="text-sm text-gray-400">
                              {order.task_sentences?.length || 0} 句
                            </span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-4">审核详情</h3>
                
                {selectedOrder ? (
                  <Card>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">订单 #{selectedOrder.id}</h4>
                          <p className="text-sm text-gray-500">
                            提交于 {selectedOrder.submitted_at ? new Date(selectedOrder.submitted_at).toLocaleDateString('zh-CN') : '-'}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusBadge(selectedOrder.status).bg
                        } ${getStatusBadge(selectedOrder.status).text}`}>
                          {getStatusBadge(selectedOrder.status).label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">配音员</p>
                          <p className="font-bold text-gray-800">{selectedOrder.voice_actor_name || '-'}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">预算金额</p>
                          <p className="font-bold text-primary-600">¥{selectedOrder.budget || 0}</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">文稿内容</h5>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto">
                          <p className="text-gray-800 whitespace-pre-wrap">{selectedOrder.task_content}</p>
                        </div>
                      </div>

                      {selectedOrder.task_sentences && selectedOrder.task_sentences.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">分句预览</h5>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {selectedOrder.task_sentences.map((sentence: any, index: number) => (
                              <div key={sentence.id || index} className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                                    {index + 1}
                                  </span>
                                  <div className="flex-1">
                                    <p className="text-gray-800">{sentence.text}</p>
                                    {sentence.pinyin && (
                                      <p className="text-sm text-gray-500 italic mt-1">{sentence.pinyin}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-3">请播放录音文件进行审核</p>
                        
                        <div className="bg-primary-50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-center gap-4">
                            <Button variant="outline" size="sm">
                              <Play className="w-4 h-4 mr-1" />
                              播放录音
                            </Button>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  onClick={() => setRating(star)}
                                  onMouseEnter={() => setHoverRating(star)}
                                  onMouseLeave={() => setHoverRating(0)}
                                  className="text-gray-300 hover:text-warning-500 transition-colors"
                                >
                                  <Star
                                    className={`w-5 h-5 ${
                                      star <= (hoverRating || rating)
                                        ? 'fill-warning-500 text-warning-500'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-center text-gray-500 mt-2">
                            {rating > 0 ? `当前评分：${rating}星` : '点击星星评分'}
                          </p>
                        </div>

                        {selectedOrder.status === 'pending_review' && (
                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleApprove(selectedOrder.id)}
                              variant="success"
                              className="flex-1"
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  通过
                                </>
                              )}
                            </Button>
                            <Button
                              onClick={() => handleReject(selectedOrder.id)}
                              variant="danger"
                              className="flex-1"
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-1" />
                                  驳回
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <div className="text-center py-16">
                      <Headphones className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">请选择左侧作品进行审核</p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
