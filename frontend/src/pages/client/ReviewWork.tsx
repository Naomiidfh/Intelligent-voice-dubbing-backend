import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, CheckCircle, XCircle, MessageSquare, Volume2, Loader2 } from 'lucide-react';
import Button from '@/components/Button';
import { useOrderStore } from '@/stores/orderStore';
import { useClientStore } from '@/stores/clientStore';

export default function ReviewWork() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, fetchOrders, updateOrder } = useOrderStore();
  const { currentClient } = useClientStore();
  const [playing, setPlaying] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState<'pass' | 'reject' | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const order = orders.find(o => o.id === parseInt(id || '0'));

  const handlePlayPause = () => {
    setPlaying(!playing);
  };

  const handlePass = async () => {
    if (!order) return;
    
    setLoading(true);
    try {
      await updateOrder(order.id, { status: 'completed' });
      await fetchOrders();
      setResult('pass');
      setShowResult(true);
      setTimeout(() => {
        navigate('/client/orders');
      }, 2000);
    } catch (error) {
      alert('操作失败，请重试');
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!order) return;
    if (!feedback.trim()) {
      alert('请填写修改意见');
      return;
    }
    
    setLoading(true);
    try {
      await updateOrder(order.id, { 
        status: 'pending_record',
        admin_feedback: feedback
      });
      await fetchOrders();
      setResult('reject');
      setShowResult(true);
      setTimeout(() => {
        navigate('/client/orders');
      }, 2000);
    } catch (error) {
      alert('操作失败，请重试');
      setLoading(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    );
  }

  const sentences = order.task_sentences || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/client/orders')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-bold">作品试听</h1>
              <p className="text-sm text-gray-500">订单 #{order.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">音频播放器</h3>
            {order.audio_url && (
              <span className="text-primary-100">已提交</span>
            )}
          </div>
          <div className="w-full h-2 bg-white/30 rounded-full mb-4">
            <div className="w-1/3 h-full bg-white rounded-full" />
          </div>
          <div className="flex items-center justify-center gap-6">
            <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 20L9 12l10-8v16z" />
                <path d="M5 19V5" />
              </svg>
            </button>
            <button
              onClick={handlePlayPause}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              {playing ? <Pause className="w-8 h-8 text-primary-600" /> : <Play className="w-8 h-8 text-primary-600 ml-1" />}
            </button>
            <button className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 4l10 8-10 8V4z" />
                <path d="M19 5v14l-7-7 7-7z" />
              </svg>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">任务信息</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">配音员</span>
              <span className="font-medium">{order.voice_actor_name || '-'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">预算金额</span>
              <span className="font-bold text-primary-600">¥{order.budget || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">分句列表</h3>
          <div className="space-y-3">
            {sentences.length > 0 ? sentences.map((sentence: any, index: number) => (
              <div key={sentence.id || index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 text-gray-700">{sentence.text}</span>
                <CheckCircle className="w-5 h-5 text-success-500" />
              </div>
            )) : (
              <p className="text-center text-gray-500 py-4">暂无分句数据</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-md">
          <h3 className="font-bold text-gray-800 mb-4">审核意见</h3>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="请输入修改意见（如需驳回）..."
            className="w-full h-32 p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 resize-none"
          />
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              variant="danger"
              size="lg"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <XCircle className="w-5 h-5" />
                  驳回修改
                </>
              )}
            </Button>
            <Button
              onClick={handlePass}
              variant="success"
              size="lg"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  验收通过
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {showResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-8 mx-6 max-w-sm w-full text-center">
            <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
              result === 'pass' ? 'bg-success-100' : 'bg-danger-100'
            }`}>
              {result === 'pass' ? (
                <CheckCircle className="w-10 h-10 text-success-600" />
              ) : (
                <XCircle className="w-10 h-10 text-danger-600" />
              )}
            </div>
            <h3 className="text-2xl font-bold mb-2">
              {result === 'pass' ? '验收通过' : '已驳回'}
            </h3>
            <p className="text-gray-500">
              {result === 'pass' ? '订单已完成，薪资将自动结算' : '修改意见已发送，配音员将重新录制'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
