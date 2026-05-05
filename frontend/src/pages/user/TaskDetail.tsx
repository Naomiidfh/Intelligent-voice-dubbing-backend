import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, DollarSign, Building2, Loader2, User } from 'lucide-react';
import Button from '@/components/Button';
import Card from '@/components/Card';
import { useTaskStore, Task } from '@/stores/taskStore';
import { useOrderStore } from '@/stores/orderStore';
import { useUserStore } from '@/stores/userStore';
import { api } from '@/services/api';

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

export default function TaskDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTask, fetchTask, isLoading: taskLoading } = useTaskStore();
  const { orders, fetchOrders } = useOrderStore();
  const { currentUser, isLoggedIn } = useUserStore();
  const [matchingOrder, setMatchingOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user/login');
      return;
    }

    if (id) {
      fetchTask(parseInt(id));
      fetchOrders();
    }
  }, [id, fetchTask, fetchOrders, isLoggedIn, navigate]);

  useEffect(() => {
    // 查找匹配的订单
    if (id && orders.length > 0) {
      const order = orders.find(o => 
        o.task_id === parseInt(id) && o.voice_actor_id === currentUser?.id
      );
      if (order) {
        setMatchingOrder(order);
      }
    }
  }, [id, orders, currentUser]);

  const handleAcceptTask = async () => {
    if (!currentUser || !id) {
      alert('请先登录');
      return;
    }

    // 查找未分派的订单
    const availableOrders = orders.filter(o => 
      o.task_id === parseInt(id) && !o.voice_actor_id && o.status === 'pending_record'
    );

    if (availableOrders.length === 0) {
      alert('当前没有可接单的订单');
      return;
    }

    setIsProcessing(true);
    try {
      // 接受第一个订单
      const order = availableOrders[0];
      
      await api.orders.update(order.id, {
        voice_actor_id: currentUser.id,
        voice_actor_name: currentUser.name || currentUser.phone,
        status: 'accepted'
      });
      
      await fetchOrders();
      
      alert('接单成功！请前往录音');
      navigate(`/user/recording/${order.id}`);
    } catch (error: any) {
      alert(error.message || '接单失败，请重试');
    }
    setIsProcessing(false);
  };

  const handleGoToRecording = () => {
    if (matchingOrder) {
      navigate(`/user/recording/${matchingOrder.id}`);
    }
  };

  if (taskLoading || !currentTask) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  // 检查是否有待录制订单且未分配配音员
  const hasPendingRecordOrder = orders.some(
    o => o.task_id === parseInt(id!) && !o.voice_actor_id && o.status === 'pending_record'
  );
  
  const canAccept = (currentTask.status === 'approved' || hasPendingRecordOrder) && !matchingOrder;
  const hasAccepted = !!matchingOrder;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/user/tasks')} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">任务详情</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-4">
        <Card variant="elevated">
          <div className="flex justify-between items-start mb-4">
            <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-sm font-medium">
              {TASK_TYPE_LABELS[currentTask.task_type] || currentTask.task_type}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${(hasPendingRecordOrder || currentTask.status === 'approved') ? 'text-success-600 bg-success-50' : STATUS_LABELS[currentTask.status]?.color || 'bg-gray-50 text-gray-600'}`}>
              {(hasPendingRecordOrder || currentTask.status === 'approved') ? '可接单' : STATUS_LABELS[currentTask.status]?.label || currentTask.status}
            </span>
          </div>

          <div className="mb-4">
            <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
              {currentTask.content}
            </p>
          </div>

          {currentTask.sentences && currentTask.sentences.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <h4 className="font-bold text-gray-700 mb-3">分句预览</h4>
              <div className="space-y-2">
                {currentTask.sentences.slice(0, 3).map((sentence) => (
                  <div key={sentence.id} className="bg-white rounded-lg p-3">
                    <p className="text-gray-800 text-sm">{sentence.text}</p>
                    {sentence.pinyin && (
                      <p className="text-xs text-gray-500 mt-1 italic">{sentence.pinyin}</p>
                    )}
                  </div>
                ))}
                {currentTask.sentences.length > 3 && (
                  <p className="text-center text-sm text-gray-400">
                    还有 {currentTask.sentences.length - 3} 句...
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <DollarSign className="w-5 h-5 text-primary-500" />
              <span>预算：<strong className="text-primary-600">¥{currentTask.budget}</strong></span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-primary-500" />
              <span>截止：{currentTask.deadline || '长期'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span>{currentTask.company_name || '企业用户'}</span>
          </div>
        </Card>

        <div className="bg-white rounded-2xl p-5 shadow-md mt-4">
          <h4 className="font-bold text-gray-800 mb-3">任务说明</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>• 请按照分句顺序逐句录制</li>
            <li>• 确保录音清晰、无杂音</li>
            <li>• 录制完成后系统将自动提交</li>
            <li>• 审核通过后即可获得酬劳</li>
          </ul>
        </div>

        {/* 已接单的情况 */}
        {hasAccepted && (
          <div className="mt-4 bg-success-50 rounded-xl p-4 border border-success-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-success-600" />
              </div>
              <div>
                <p className="font-medium text-success-800">您已接单</p>
                <p className="text-sm text-success-600">订单 #{matchingOrder.id}</p>
              </div>
            </div>
            <Button
              onClick={handleGoToRecording}
              variant="success"
              size="lg"
              className="w-full"
            >
              前往录音
            </Button>
          </div>
        )}

        {/* 未接单的情况 */}
        {!hasAccepted && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
            <div className="max-w-lg mx-auto px-4 py-4">
              <Button
                onClick={handleAcceptTask}
                variant="primary"
                size="lg"
                className="w-full"
                disabled={!canAccept || isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    接单中...
                  </span>
                ) : (
                  '立即接单'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
