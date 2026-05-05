import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, FileText, CreditCard, Settings, Shield, LogOut } from 'lucide-react';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useExpenseStore } from '@/stores/expenseStore';
import { useClientStore } from '@/stores/clientStore';

export default function ClientProfile() {
  const navigate = useNavigate();
  const { currentClient } = useClientStore();
  const { expenses, fetchExpenses } = useExpenseStore();

  useEffect(() => {
    if (currentClient?.id) {
      fetchExpenses(currentClient.id);
    } else {
      fetchExpenses();
    }
  }, [currentClient, fetchExpenses]);

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const thisMonthExpense = expenses
    .filter(e => {
      const date = new Date(e.created_at);
      return date.getMonth() === thisMonth && date.getFullYear() === thisYear;
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const handleLogout = () => {
    navigate('/client/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-lg mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/client/home')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">企业中心</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">北京童趣出版社</h2>
              <p className="text-primary-100 text-sm">已认证企业</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <Card variant="default">
          <h3 className="font-bold text-gray-800 mb-4">企业信息</h3>
          <div className="space-y-3">
            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500">企业名称</span>
              <span className="font-medium">北京童趣出版社</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500">联系人</span>
              <span className="font-medium">张经理</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500">联系电话</span>
              <span className="font-medium">13900139000</span>
            </div>
            <div className="flex justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-gray-500">认证状态</span>
              <span className="px-3 py-1 bg-success-100 text-success-700 rounded-full text-sm">已认证</span>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <h3 className="font-bold text-gray-800 mb-4">消费统计</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-primary-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-primary-600">¥{totalExpense.toFixed(2)}</p>
              <p className="text-sm text-gray-500">累计消费</p>
            </div>
            <div className="bg-success-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-success-600">¥{thisMonthExpense.toFixed(2)}</p>
              <p className="text-sm text-gray-500">本月消费</p>
            </div>
          </div>
        </Card>

        <Card variant="default">
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <FileText className="w-6 h-6 text-primary-600" />
              <span className="flex-1 text-left font-medium">发票申请</span>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
            <button 
              onClick={() => navigate('/client/expenses')}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <CreditCard className="w-6 h-6 text-primary-600" />
              <span className="flex-1 text-left font-medium">消费记录</span>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <Settings className="w-6 h-6 text-primary-600" />
              <span className="flex-1 text-left font-medium">账号设置</span>
              <ArrowLeft className="w-5 h-5 text-gray-400 rotate-180" />
            </button>
          </div>
        </Card>

        <Card variant="outlined" className="border-primary-200 bg-primary-50">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-primary-600" />
            <div>
              <h4 className="font-bold text-primary-800">隐私与安全</h4>
              <p className="text-sm text-primary-600">您的企业信息受到保护</p>
            </div>
          </div>
        </Card>

        <Button onClick={handleLogout} variant="danger" size="lg" fullWidth>
          <LogOut className="w-5 h-5" />
          退出登录
        </Button>

        <p className="text-center text-gray-400 text-sm mt-4">
          智声助业配音平台 v1.0.0
        </p>
      </div>
    </div>
  );
}
