import { Order, EarningRecord } from '@/types';

export const mockOrders: Order[] = [
  {
    id: 'order-001',
    taskId: 'task-001',
    taskTitle: '《小兔子找朋友》儿童故事',
    status: 'pending_record',
    recordings: [],
    createdAt: '2026-04-28',
    updatedAt: '2026-04-28',
    price: 80
  },
  {
    id: 'order-002',
    taskId: 'task-004',
    taskTitle: '《关爱老人》公益广告',
    status: 'pending_review',
    recordings: [
      { sentenceId: 1, audioUrl: '', duration: 5 },
      { sentenceId: 2, audioUrl: '', duration: 6 }
    ],
    createdAt: '2026-04-25',
    updatedAt: '2026-04-27',
    price: 60
  },
  {
    id: 'order-003',
    taskId: 'task-002',
    taskTitle: '《勇敢的小蜗牛》绘本配音',
    status: 'completed',
    recordings: [
      { sentenceId: 1, audioUrl: '', duration: 8 },
      { sentenceId: 2, audioUrl: '', duration: 7 },
      { sentenceId: 3, audioUrl: '', duration: 9 },
      { sentenceId: 4, audioUrl: '', duration: 10 }
    ],
    createdAt: '2026-04-20',
    updatedAt: '2026-04-24',
    price: 120
  },
  {
    id: 'order-004',
    taskId: 'task-005',
    taskTitle: '《小白兔学画画》儿童故事',
    status: 'rejected',
    recordings: [
      { sentenceId: 1, audioUrl: '', duration: 7 },
      { sentenceId: 2, audioUrl: '', duration: 6 }
    ],
    createdAt: '2026-04-22',
    updatedAt: '2026-04-26',
    price: 100
  },
  {
    id: 'order-005',
    taskId: 'task-007',
    taskTitle: '《森林防火》公益宣传',
    status: 'pending_settlement',
    recordings: [
      { sentenceId: 1, audioUrl: '', duration: 5 },
      { sentenceId: 2, audioUrl: '', duration: 6 }
    ],
    createdAt: '2026-04-15',
    updatedAt: '2026-04-20',
    price: 80
  }
];

export const mockEarnings: EarningRecord[] = [
  {
    id: 'earning-001',
    orderId: 'order-003',
    taskTitle: '《勇敢的小蜗牛》绘本配音',
    amount: 120,
    status: 'settled',
    createdAt: '2026-04-24'
  },
  {
    id: 'earning-002',
    orderId: 'order-005',
    taskTitle: '《森林防火》公益宣传',
    amount: 80,
    status: 'pending',
    createdAt: '2026-04-20'
  }
];

export const getOrdersByStatus = (status: Order['status']): Order[] => {
  return mockOrders.filter(order => order.status === status);
};

export const getOrdersByUser = (userId: string): Order[] => {
  return mockOrders;
};

export const getActiveOrderCount = (): number => {
  return mockOrders.filter(order => order.status === 'pending_record').length;
};
