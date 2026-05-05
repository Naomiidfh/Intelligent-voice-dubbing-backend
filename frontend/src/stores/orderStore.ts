import { create } from 'zustand';
import { api } from '@/services/api';

export interface Order {
  id: number;
  task_id: number;
  voice_actor_id: number | null;
  voice_actor_name?: string | null;
  status: string;
  audio_url?: string;
  task_content?: string;
  task_sentences?: any[];
  budget?: number;
  submitted_at?: string;
  completed_at?: string;
  created_at: string;
  price?: number;
  taskTitle?: string;
  recordings?: any[];
  createdAt?: string;
  admin_feedback?: string;
  task_type?: string;
}

export interface Earning {
  id: number;
  taskTitle: string;
  amount: number;
  status: 'settled' | 'pending';
  createdAt: string;
}

type OrderStatus = 'pending_record' | 'pending_review' | 'pending_acceptance' | 'pending_settlement' | 'completed' | 'rejected';

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  earnings: Earning[];
  selectedStatus: OrderStatus | 'all';
  isLoading: boolean;
  error: string | null;
  fetchOrders: (params?: { voice_actor_id?: number; task_id?: number; status?: string }) => Promise<void>;
  fetchOrder: (id: number) => Promise<void>;
  createOrder: (data: { task_id: number; voice_actor_id: number }) => Promise<Order>;
  updateOrder: (id: number, data: { 
    status?: string; 
    audio_url?: string;
    voice_actor_id?: number;
    voice_actor_name?: string;
    admin_feedback?: string;
  }) => Promise<void>;
  setSelectedStatus: (status: OrderStatus | 'all') => void;
  getFilteredOrders: () => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  earnings: [],
  selectedStatus: 'all',
  isLoading: false,
  error: null,

  fetchOrders: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.orders.list(params);
      if (response.success) {
        const orders = response.data.map((order: any) => ({
          ...order,
          taskTitle: order.task_content?.slice(0, 50) || '配音任务',
          price: order.budget || 0,
          createdAt: new Date(order.created_at).toLocaleDateString('zh-CN'),
          recordings: []
        }));
        
        const earnings: Earning[] = response.data
          .filter((order: any) => order.status === 'completed')
          .map((order: any) => ({
            id: order.id,
            taskTitle: order.task_content?.slice(0, 30) || '配音任务',
            amount: order.budget || 0,
            status: 'settled' as const,
            createdAt: new Date(order.created_at).toLocaleDateString('zh-CN')
          }));
        
        set({ orders, earnings, isLoading: false });
      }
    } catch (error) {
      console.error('获取订单列表失败:', error);
      set({ error: '获取订单列表失败', isLoading: false });
    }
  },

  fetchOrder: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.orders.get(id);
      if (response.success) {
        set({ currentOrder: response.data, isLoading: false });
      }
    } catch (error) {
      console.error('获取订单详情失败:', error);
      set({ error: '获取订单详情失败', isLoading: false });
    }
  },

  createOrder: async (data: { task_id: number; voice_actor_id: number }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.orders.create(data);
      if (response.success) {
        const newOrder = {
          ...response.data,
          taskTitle: '配音任务',
          price: 0,
          createdAt: new Date().toLocaleDateString('zh-CN'),
          recordings: []
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
          isLoading: false
        }));
        return newOrder;
      }
      throw new Error(response.message || '接单失败');
    } catch (error) {
      console.error('接单失败:', error);
      set({ error: '接单失败', isLoading: false });
      throw error;
    }
  },

  updateOrder: async (id: number, data: { 
    status?: string; 
    audio_url?: string;
    voice_actor_id?: number;
    voice_actor_name?: string;
    admin_feedback?: string;
  }) => {
    try {
      const response = await api.orders.update(id, data);
      if (response.success) {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...data } : order
          ),
          currentOrder: state.currentOrder?.id === id
            ? { ...state.currentOrder, ...data }
            : state.currentOrder
        }));
      }
    } catch (error) {
      console.error('更新订单失败:', error);
      throw error;
    }
  },

  setSelectedStatus: (status: OrderStatus | 'all') => {
    set({ selectedStatus: status });
  },

  getFilteredOrders: () => {
    const { orders, selectedStatus } = get();
    if (selectedStatus === 'all') {
      return orders;
    }
    if (selectedStatus === 'rejected') {
      return orders.filter(order => 
        order.status === 'pending_record' && order.admin_feedback
      );
    }
    return orders.filter(order => order.status === selectedStatus);
  }
}));
