import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, FileText, Play, Loader2, User, Users, Search, Home } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAdminStore } from '@/stores/adminStore';
import { useOrderStore } from '@/stores/orderStore';
import { api } from '@/services/api';

export default function OrderDispatch() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAdminStore();
  const { orders, fetchOrders } = useOrderStore();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [voiceActors, setVoiceActors] = useState<any[]>([]);
  const [selectedVoiceActor, setSelectedVoiceActor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchOrders();
    fetchVoiceActors();
  }, [fetchOrders]);

  const fetchVoiceActors = async () => {
    try {
      const response = await api.users.voiceActors.list();
      if (response.success) {
        setVoiceActors(response.data);
      }
    } catch (error) {
      console.error('获取配音员列表失败:', error);
    }
  };

  const pendingOrders = orders.filter(o => {
    if (o.status === 'pending_record' && !o.voice_actor_id) {
      return true;
    }
    if (o.status === 'pending_review') {
      return true;
    }
    return false;
  });

  const filteredVoiceActors = voiceActors.filter(va => 
    !searchKeyword || 
    va.name?.includes(searchKeyword) || 
    va.phone?.includes(searchKeyword)
  );

  const handleDispatch = async (orderId: number) => {
    if (!selectedVoiceActor) {
      alert('请先选择配音员');
      return;
    }

    setProcessing(true);
    try {
      const voiceActor = voiceActors.find(va => va.id === selectedVoiceActor);
      
      await api.orders.update(orderId, { 
        voice_actor_id: selectedVoiceActor,
        voice_actor_name: voiceActor?.name || '配音员',
        status: 'pending_record'
      });
      
      await fetchOrders();
      setSelectedOrder(null);
      setSelectedVoiceActor(null);
      alert('订单已分派成功！配音员现在可以在任务广场看到订单了');
    } catch (error) {
      alert('分派失败，请重试');
    }
    setProcessing(false);
  };

  const handleApprove = async (orderId: number) => {
    if (!confirm('确认通过此作品审核？')) return;

    setProcessing(true);
    try {
      await api.orders.update(orderId, { status: 'completed' });
      await fetchOrders();
      setSelectedOrder(null);
      alert('作品已通过审核！');
    } catch (error) {
      alert('操作失败，请重试');
    }
    setProcessing(false);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending_record: { bg: 'bg-warning-100', text: 'text-warning-700', label: '待录制' },
      pending_review: { bg: 'bg-blue-100', text: 'text-blue-700', label: '待审核' },
      completed: { bg: 'bg-success-100', text: 'text-success-700', label: '已完成' },
      rejected: { bg: 'bg-danger-100', text: 'text-danger-700', label: '已驳回' }
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
                  item.path === '/admin/dispatch'
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
                <h2 className="text-xl font-bold text-gray-800">订单分派</h2>
                <p className="text-sm text-gray-500">管理配音员订单分配</p>
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
            <div className="grid lg:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold text-gray-800 mb-4">
                  待处理订单
                  <span className="ml-2 px-2 py-1 bg-warning-500 text-white text-sm rounded-full">
                    {pendingOrders.length}
                  </span>
                </h3>
                
                {pendingOrders.length === 0 ? (
                  <Card>
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-success-300 mx-auto mb-4" />
                      <p className="text-gray-500">暂无待处理订单</p>
                    </div>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pendingOrders.map((order) => {
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
                              <User className="w-4 h-4" />
                              {order.voice_actor_name || '待分派'}
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
                <h3 className="font-bold text-gray-800 mb-4">订单详情</h3>
                
                {selectedOrder ? (
                  <Card>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">订单 #{selectedOrder.id}</h4>
                          <p className="text-sm text-gray-500">
                            创建于 {new Date(selectedOrder.created_at).toLocaleDateString('zh-CN')}
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
                          <p className="text-sm text-gray-500">预算金额</p>
                          <p className="text-xl font-bold text-primary-600">¥{selectedOrder.budget || 0}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">句子数量</p>
                          <p className="text-xl font-bold text-gray-800">{selectedOrder.task_sentences?.length || 0} 句</p>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">文稿内容</h5>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                          <p className="text-gray-800 whitespace-pre-wrap">{selectedOrder.task_content}</p>
                        </div>
                      </div>

                      {selectedOrder.task_sentences && selectedOrder.task_sentences.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">分句预览</h5>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {selectedOrder.task_sentences.slice(0, 3).map((sentence: any, index: number) => (
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
                            {selectedOrder.task_sentences.length > 3 && (
                              <p className="text-center text-sm text-gray-400">
                                还有 {selectedOrder.task_sentences.length - 3} 句...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {selectedOrder.status === 'pending_record' && !selectedOrder.voice_actor_id && (
                        <div className="pt-4 border-t">
                          <h5 className="font-medium text-gray-700 mb-3">选择配音员</h5>
                          
                          <div className="mb-3">
                            <div className="flex gap-2 mb-2">
                              <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                  type="text"
                                  value={searchKeyword}
                                  onChange={(e) => setSearchKeyword(e.target.value)}
                                  placeholder="搜索配音员..."
                                  className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
                                />
                              </div>
                            </div>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                              {filteredVoiceActors.map((va) => (
                                <div
                                  key={va.id}
                                  onClick={() => setSelectedVoiceActor(va.id)}
                                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                                    selectedVoiceActor === va.id
                                      ? 'bg-primary-50 border border-primary-300'
                                      : 'bg-gray-50 hover:bg-gray-100'
                                  }`}
                                >
                                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold">
                                    {va.name?.[0] || va.phone?.[0] || 'V'}
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-800">{va.name || '未命名'}</p>
                                    <p className="text-sm text-gray-500">{va.phone}</p>
                                  </div>
                                  {selectedVoiceActor === va.id && (
                                    <CheckCircle className="w-5 h-5 text-primary-600" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          <Button
                            onClick={() => handleDispatch(selectedOrder.id)}
                            variant="primary"
                            className="w-full"
                            disabled={!selectedVoiceActor || processing}
                          >
                            {processing ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                分派中...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                分派给配音员
                              </span>
                            )}
                          </Button>
                        </div>
                      )}

                      {selectedOrder.status === 'pending_record' && selectedOrder.voice_actor_id && (
                        <div className="pt-4 border-t">
                          <div className="flex items-center gap-3 bg-success-50 rounded-lg p-3">
                            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-success-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{selectedOrder.voice_actor_name}</p>
                              <p className="text-sm text-gray-500">ID: {selectedOrder.voice_actor_id}</p>
                            </div>
                            <CheckCircle className="w-5 h-5 text-success-500 ml-auto" />
                          </div>
                          <p className="text-sm text-gray-500 mt-3">订单已分派，等待配音员录制...</p>
                        </div>
                      )}

                      {selectedOrder.status === 'pending_review' && (
                        <div className="pt-4 border-t">
                          <p className="text-sm text-gray-500 mb-3">配音员已提交作品，请审核...</p>
                          
                          <Button
                            onClick={() => handleApprove(selectedOrder.id)}
                            variant="success"
                            className="w-full"
                            disabled={processing}
                          >
                            {processing ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                处理中...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                通过审核
                              </span>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <div className="text-center py-16">
                      <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">请选择左侧订单查看详情</p>
                    </div>
                  </Card>
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-4">快速统计</h3>
                <div className="space-y-4">
                  <Card>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center bg-warning-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-warning-600">
                          {orders.filter(o => o.status === 'pending_record' && !o.voice_actor_id).length}
                        </p>
                        <p className="text-sm text-gray-500">待分派</p>
                      </div>
                      <div className="text-center bg-blue-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-blue-600">
                          {orders.filter(o => o.status === 'pending_review').length}
                        </p>
                        <p className="text-sm text-gray-500">待审核</p>
                      </div>
                      <div className="text-center bg-success-50 rounded-lg p-4">
                        <p className="text-2xl font-bold text-success-600">
                          {orders.filter(o => o.status === 'completed').length}
                        </p>
                        <p className="text-sm text-gray-500">已完成</p>
                      </div>
                      <div className="text-center bg-gray-50 rounded-lg p-4">
                        <p className="text-xl font-bold text-primary-600">
                          {voiceActors.length}
                        </p>
                        <p className="text-sm text-gray-500">配音员</p>
                      </div>
                    </div>
                  </Card>
                  
                  <Card>
                    <h5 className="font-medium text-gray-800 mb-3">工作流程</h5>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-xs font-bold">1</div>
                        <span>甲方发布需求</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-warning-100 rounded-full flex items-center justify-center text-warning-600 text-xs font-bold">2</div>
                        <span>文稿预处理（审核任务）</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-bold">3</div>
                        <span>订单分派给配音员</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-bold">4</div>
                        <span>配音员录制提交</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-success-100 rounded-full flex items-center justify-center text-success-600 text-xs font-bold">5</div>
                        <span>质控审核</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
