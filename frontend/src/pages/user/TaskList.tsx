import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, DollarSign, BookOpen } from 'lucide-react';
import Card from '@/components/Card';
import { useTaskStore } from '@/stores/taskStore';
import { useUserStore } from '@/stores/userStore';
import { useOrderStore } from '@/stores/orderStore';

const TASK_TYPE_LABELS: Record<string, string> = {
  children_book: '童书配音',
  picture_book: '绘本朗读',
  documentary: '纪录片',
  charity: '公益广告'
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: '待审核', color: 'text-warning-600 bg-warning-50' },
  approved: { label: '可接单', color: 'text-success-600 bg-success-50' },
  in_progress: { label: '进行中', color: 'text-primary-600 bg-primary-50' },
  completed: { label: '已完成', color: 'text-gray-600 bg-gray-50' }
};

export default function TaskList() {
  const navigate = useNavigate();
  const { tasks, fetchTasks, isLoading } = useTaskStore();
  const { currentUser, isLoggedIn } = useUserStore();
  const { orders, fetchOrders } = useOrderStore();
  const [displayTasks, setDisplayTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks({ status: 'approved' });
    fetchOrders();
  }, [fetchTasks, fetchOrders]);

  useEffect(() => {
    // 过滤掉已经被当前用户接单的任务
    const userOrderTaskIds = new Set(
      orders
        .filter(o => o.voice_actor_id === currentUser?.id)
        .map(o => o.task_id)
    );
    
    // 确保只显示有可用订单的任务
    const availableTaskIds = new Set(
      orders
        .filter(o => !o.voice_actor_id && o.status === 'pending_record')
        .map(o => o.task_id)
    );

    const filteredTasks = tasks.filter(task => {
      // 如果任务是 approved 状态，且没有被当前用户接单，则显示
      if (task.status === 'approved' && !userOrderTaskIds.has(task.id)) {
        return true;
      }
      // 如果任务有可用的 pending_record 订单，则显示
      if (availableTaskIds.has(task.id) && !userOrderTaskIds.has(task.id)) {
        return true;
      }
      return false;
    });

    setDisplayTasks(filteredTasks);
  }, [tasks, orders, currentUser]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getTaskStatusLabel = (task: any) => {
    // 检查是否有待录制订单且未分配配音员
    const hasPendingRecordOrder = orders.some(
      o => o.task_id === task.id && !o.voice_actor_id && o.status === 'pending_record'
    );
    
    if (hasPendingRecordOrder || task.status === 'approved') {
      return { label: '可接单', color: 'text-success-600 bg-success-50' };
    }
    return STATUS_LABELS[task.status] || { label: task.status, color: 'text-gray-600 bg-gray-50' };
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => navigate('/user/home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              ←
            </button>
            <h1 className="text-xl font-bold">任务广场</h1>
          </div>
          
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索任务..."
                className="flex-1 bg-transparent outline-none"
              />
            </div>
            <button className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Filter className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        ) : displayTasks.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">暂无可接任务</p>
            <p className="text-sm text-gray-400 mt-1">敬请期待更多任务上线</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayTasks.map((task) => {
              const statusLabel = getTaskStatusLabel(task);
              return (
                <Card
                  key={task.id}
                  variant="elevated"
                  onClick={() => navigate(`/user/task/${task.id}`)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
                      {TASK_TYPE_LABELS[task.task_type] || task.task_type}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusLabel.color}`}>
                      {statusLabel.label}
                    </span>
                  </div>
                  
                  <p className="text-gray-800 font-medium line-clamp-2 mb-3">
                    {task.content.slice(0, 100)}...
                  </p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-primary-600 font-bold">¥{task.budget}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{task.deadline ? formatDate(task.deadline) : '长期'}</span>
                    </div>
                    <div className="flex-1 text-right">
                      <span className="text-xs text-gray-400">
                        {task.sentences?.length || 0}句
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
