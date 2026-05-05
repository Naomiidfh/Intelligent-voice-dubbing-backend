import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Calendar, User } from 'lucide-react';
import Card from '@/components/Card';
import { useExpenseStore } from '@/stores/expenseStore';
import { useClientStore } from '@/stores/clientStore';

export default function Expenses() {
  const navigate = useNavigate();
  const { expenses, isLoading, fetchExpenses } = useExpenseStore();
  const { currentClient } = useClientStore();

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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/client/profile')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">消费记录</h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <CreditCard className="w-4 h-4" />
              <span className="text-sm">累计消费</span>
            </div>
            <p className="text-2xl font-bold text-primary-600">¥{totalExpense.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">本月消费</span>
            </div>
            <p className="text-2xl font-bold text-success-600">¥{thisMonthExpense.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-bold text-gray-800">明细记录</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : expenses.length === 0 ? (
            <Card className="text-center py-12">
              <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无消费记录</p>
            </Card>
          ) : (
            <div className="space-y-3">
              {expenses.map((expense) => (
                <Card key={expense.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{expense.description}</p>
                        <p className="text-sm text-gray-500">
                          {expense.voice_actor_name ? `配音员：${expense.voice_actor_name}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-danger-600">-¥{expense.amount.toFixed(2)}</p>
                      <p className="text-xs text-gray-400">{formatDate(expense.created_at)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
