import { create } from 'zustand';
import { api } from '@/services/api';

interface Expense {
  id: number;
  client_id: number;
  order_id: number;
  task_id?: number;
  voice_actor_id?: number;
  voice_actor_name?: string;
  amount: number;
  description: string;
  created_at: string;
}

interface ExpenseState {
  expenses: Expense[];
  isLoading: boolean;
  fetchExpenses: (client_id?: number) => Promise<void>;
}

export const useExpenseStore = create<ExpenseState>((set) => ({
  expenses: [],
  isLoading: false,

  fetchExpenses: async (client_id?: number) => {
    set({ isLoading: true });
    try {
      const params = client_id ? { client_id } : {};
      const response = await api.expenses.list(params);
      if (response.success) {
        set({ expenses: response.data, isLoading: false });
      }
    } catch (error) {
      console.error('获取消费记录失败:', error);
      set({ isLoading: false });
    }
  },
}));
