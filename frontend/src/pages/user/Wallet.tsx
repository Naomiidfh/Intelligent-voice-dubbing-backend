import { useEffect } from 'react';
import { useVoice } from '@/hooks/useVoice';
import { useUserStore } from '@/stores/userStore';
import { useOrderStore, Earning } from '@/stores/orderStore';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { Wallet as WalletIcon, TrendingUp, Clock, CheckCircle, DollarSign } from 'lucide-react';

export default function Wallet() {
  const { speak } = useVoice();
  const { currentUser } = useUserStore();
  const { earnings, fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders();
    const message = `薪资钱包页面，您当前可提现${currentUser?.withdrawable || 0}元，累计收益${currentUser?.totalEarnings || 0}元`;
    speak(message);
  }, [currentUser, speak, fetchOrders]);

  const handleSpeakAmount = (amount: number) => {
    speak(`金额${amount}元`);
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 pb-6">
      <Header title="薪资钱包" showBack={true} />

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        <div className="bg-gradient-to-br from-primary-600 via-primary-500 to-primary-700 rounded-3xl p-6 text-white shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <WalletIcon className="w-7 h-7" />
            </div>
            <span className="text-xl font-medium opacity-90">我的收益</span>
          </div>
          
          <div className="mb-6">
            <p className="text-primary-100 mb-2">可提现金额</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold">¥{currentUser?.withdrawable || 0}</span>
              <span className="text-lg opacity-80">元</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div className="text-center">
              <p className="text-primary-100 text-sm mb-1">累计收益</p>
              <p className="text-2xl font-bold">¥{currentUser?.totalEarnings || 0}</p>
            </div>
            <div className="text-center">
              <p className="text-primary-100 text-sm mb-1">已完成订单</p>
              <p className="text-2xl font-bold">{currentUser?.completedOrders || 0}</p>
            </div>
          </div>
        </div>

        <Card variant="elevated">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-success-100 rounded-full flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800">收益说明</h3>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <CheckCircle className="w-5 h-5 text-success-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">任务完成后自动结算</p>
                <p className="text-sm text-gray-500">甲方验收通过后，收益自动到账</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-warning-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">统一时间提现</p>
                <p className="text-sm text-gray-500">平台每月统一结算，请耐心等待</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-primary-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-800">多种任务奖励</p>
                <p className="text-sm text-gray-500">完成高质量任务可获得额外奖励</p>
              </div>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-800">收益明细</h3>
            <span className="text-sm text-gray-400">共 {earnings.length} 笔</span>
          </div>
          
          {earnings.length === 0 ? (
            <div className="text-center py-8">
              <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-lg text-gray-500">暂无收益记录</p>
              <p className="text-sm text-gray-400">完成订单后可查看收益</p>
            </div>
          ) : (
            <div className="space-y-3">
              {earnings.map((earning) => (
                <div
                  key={earning.id}
                  onClick={() => handleSpeakAmount(earning.amount)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      earning.status === 'settled' ? 'bg-success-100' : 'bg-warning-100'
                    }`}>
                      {earning.status === 'settled' ? (
                        <CheckCircle className="w-5 h-5 text-success-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-warning-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{earning.taskTitle}</p>
                      <p className="text-sm text-gray-400">{formatDate(earning.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      earning.status === 'settled' ? 'text-success-600' : 'text-warning-600'
                    }`}>
                      +¥{earning.amount}
                    </p>
                    <p className="text-xs text-gray-400">
                      {earning.status === 'settled' ? '已结算' : '待结算'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <div className="bg-primary-50 rounded-2xl p-4 border-2 border-primary-100">
          <p className="text-center text-primary-700 font-medium">
            💡 提示：平台统一结算，请联系辅导员了解更多
          </p>
        </div>
      </div>
    </div>
  );
}
