import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle, XCircle, Clock, Search, Play, Loader2, AlertCircle, Home } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useAdminStore } from '@/stores/adminStore';
import { useTaskStore } from '@/stores/taskStore';
import { useVoice } from '@/hooks/useVoice';

export default function ManuscriptProcessing() {
  const navigate = useNavigate();
  const { isLoggedIn, currentAdmin } = useAdminStore();
  const { tasks, fetchTasks, updateTaskStatus, isLoading } = useTaskStore();
  const { speak } = useVoice();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      await fetchTasks();
      setError(null);
    } catch (err) {
      setError('加载任务失败，请刷新重试');
      console.error('加载任务失败:', err);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter !== 'all' && task.status !== filter) return false;
    if (searchKeyword && !task.content?.includes(searchKeyword)) return false;
    return true;
  });

  const handleApprove = async (taskId: number) => {
    if (!confirm('确认通过此任务审核？\n\n审核通过后，系统将自动创建订单等待配音员接单。')) return;
    
    setProcessing(true);
    setError(null);
    try {
      console.log('正在审核任务:', taskId);
      await updateTaskStatus(taskId, 'approved');
      console.log('审核成功，刷新列表');
      await loadTasks();
      setSelectedTask(null);
      alert('✅ 任务已通过审核！\n\n已自动创建订单，等待配音员接单。');
    } catch (err: any) {
      console.error('审核失败:', err);
      setError(err.message || '审核失败，请重试');
      alert('❌ 审核失败：' + (err.message || '请重试'));
    }
    setProcessing(false);
  };

  const handleReject = async (taskId: number) => {
    const reason = prompt('请输入驳回原因：');
    if (!reason) return;
    
    setProcessing(true);
    setError(null);
    try {
      console.log('正在驳回任务:', taskId, '原因:', reason);
      await updateTaskStatus(taskId, 'rejected');
      await loadTasks();
      setSelectedTask(null);
      alert('任务已驳回');
    } catch (err: any) {
      console.error('驳回失败:', err);
      setError(err.message || '驳回失败，请重试');
      alert('❌ 驳回失败：' + (err.message || '请重试'));
    }
    setProcessing(false);
  };

  const handlePreview = (task: any) => {
    setSelectedTask(task);
    setError(null);
  };

  const handleSpeakContent = (text: string) => {
    speak(text);
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-warning-100', text: 'text-warning-700', label: '待审核' },
      approved: { bg: 'bg-success-100', text: 'text-success-700', label: '已通过' },
      rejected: { bg: 'bg-danger-100', text: 'text-danger-700', label: '已驳回' }
    };
    return badges[status] || badges.pending;
  };

  const getTaskTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      children_book: '童书配音',
      picture_book: '绘本朗读',
      documentary: '纪录片',
      charity: '公益广告'
    };
    return types[type] || type;
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
                  item.path === '/admin/manuscripts'
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
                <h2 className="text-xl font-bold text-gray-800">文稿预处理</h2>
                <p className="text-sm text-gray-500">审核甲方发布的配音需求文稿</p>
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
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
                <button 
                  onClick={loadTasks}
                  className="ml-auto px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  重试
                </button>
              </div>
            )}

            <div className="mb-6 flex flex-col md:flex-row gap-4">
              <div className="flex gap-2">
                {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilter(status);
                      setSelectedTask(null);
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filter === status
                        ? 'bg-primary-600 text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {status === 'all' ? '全部' : 
                     status === 'pending' ? '待审核' :
                     status === 'approved' ? '已通过' : '已驳回'}
                    {status === 'pending' && (
                      <span className="ml-2 px-2 py-0.5 bg-warning-500 text-white text-xs rounded-full">
                        {tasks.filter(t => t.status === 'pending').length}
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
                  placeholder="搜索文稿内容..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-400"
                />
              </div>
            </div>

            {isLoading && (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
              </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">
                  任务列表 
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    (共 {filteredTasks.length} 个)
                  </span>
                </h3>
                
                {!isLoading && filteredTasks.length === 0 ? (
                  <Card>
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">
                        {filter === 'pending' ? '暂无待审核任务' : '暂无任务'}
                      </p>
                    </div>
                  </Card>
                ) : (
                  filteredTasks.map((task) => {
                    const badge = getStatusBadge(task.status);
                    return (
                      <Card
                        key={task.id}
                        variant="elevated"
                        onClick={() => handlePreview(task)}
                        className={`cursor-pointer transition-all ${
                          selectedTask?.id === task.id 
                            ? 'ring-2 ring-primary-500 shadow-lg' 
                            : 'hover:shadow-md'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                              {badge.label}
                            </span>
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                              {getTaskTypeLabel(task.task_type)}
                            </span>
                          </div>
                          <span className="text-lg font-bold text-primary-600">¥{task.budget}</span>
                        </div>
                        <p className="text-gray-800 line-clamp-2 mb-2">{task.content}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{task.company_name || '企业用户'}</span>
                          <span>{task.sentences?.length || 0} 句</span>
                        </div>
                      </Card>
                    );
                  })
                )}
              </div>

              <div>
                <h3 className="font-bold text-gray-800 mb-4">任务详情</h3>
                
                {selectedTask ? (
                  <Card>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{getTaskTypeLabel(selectedTask.task_type)}</h4>
                          <p className="text-sm text-gray-500">发布于 {new Date(selectedTask.created_at).toLocaleDateString('zh-CN')}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(selectedTask.status).bg} ${getStatusBadge(selectedTask.status).text}`}>
                          {getStatusBadge(selectedTask.status).label}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">预算金额</p>
                          <p className="text-xl font-bold text-primary-600">¥{selectedTask.budget}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-500">句子数量</p>
                          <p className="text-xl font-bold text-gray-800">{selectedTask.sentences?.length || 0} 句</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-gray-700">完整文稿</h5>
                          <button
                            onClick={() => handleSpeakContent(selectedTask.content)}
                            className="flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100"
                          >
                            <Play className="w-4 h-4" />
                            <span className="text-sm">朗读</span>
                          </button>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                          <p className="text-gray-800 whitespace-pre-wrap">{selectedTask.content}</p>
                        </div>
                      </div>

                      {selectedTask.sentences && selectedTask.sentences.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">分句预览</h5>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {selectedTask.sentences.map((sentence: any, index: number) => (
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

                      {selectedTask.status === 'pending' && (
                        <div className="flex gap-3 pt-4 border-t">
                          <Button
                            onClick={() => handleApprove(selectedTask.id)}
                            variant="success"
                            size="lg"
                            className="flex-1"
                            disabled={processing}
                          >
                            {processing ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                审核中...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                通过审核
                              </span>
                            )}
                          </Button>
                          <Button
                            onClick={() => handleReject(selectedTask.id)}
                            variant="danger"
                            size="lg"
                            className="flex-1"
                            disabled={processing}
                          >
                            {processing ? (
                              <span className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                处理中...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <XCircle className="w-4 h-4" />
                                驳回
                              </span>
                            )}
                          </Button>
                        </div>
                      )}

                      {selectedTask.status !== 'pending' && (
                        <div className="pt-4 border-t text-center text-gray-500">
                          此任务已{getStatusBadge(selectedTask.status).label}，无法再次审核
                        </div>
                      )}
                    </div>
                  </Card>
                ) : (
                  <Card>
                    <div className="text-center py-16">
                      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">请选择左侧任务查看详情</p>
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
