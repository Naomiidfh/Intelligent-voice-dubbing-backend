import { create } from 'zustand';
import { api } from '@/services/api';

export interface Sentence {
  id: number;
  text: string;
  pinyin?: string;
}

export interface Task {
  id: number;
  client_id: number;
  task_type: string;
  content: string;
  sentences: Sentence[];
  styles: string[];
  budget: number;
  deadline: string;
  status: string;
  company_name?: string;
  created_at: string;
}

interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  isLoading: boolean;
  error: string | null;
  fetchTasks: (params?: { status?: string }) => Promise<void>;
  fetchTask: (id: number) => Promise<void>;
  createTask: (data: Partial<Task>) => Promise<Task>;
  updateTaskStatus: (id: number, status: string) => Promise<void>;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  currentTask: null,
  isLoading: false,
  error: null,

  fetchTasks: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.tasks.list(params);
      if (response.success) {
        set({ tasks: response.data, isLoading: false });
      }
    } catch (error) {
      console.error('获取任务列表失败:', error);
      set({ error: '获取任务列表失败', isLoading: false });
    }
  },

  fetchTask: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.tasks.get(id);
      if (response.success) {
        set({ currentTask: response.data, isLoading: false });
      }
    } catch (error) {
      console.error('获取任务详情失败:', error);
      set({ error: '获取任务详情失败', isLoading: false });
    }
  },

  createTask: async (data: Partial<Task>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.tasks.create(data);
      if (response.success) {
        const newTask = response.data;
        set((state) => ({
          tasks: [newTask, ...state.tasks],
          isLoading: false
        }));
        return newTask;
      }
      throw new Error(response.message || '创建任务失败');
    } catch (error) {
      console.error('创建任务失败:', error);
      set({ error: '创建任务失败', isLoading: false });
      throw error;
    }
  },

  updateTaskStatus: async (id: number, status: string) => {
    try {
      const response = await api.tasks.updateStatus(id, status);
      if (response.success) {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status } : task
          ),
          currentTask: state.currentTask?.id === id
            ? { ...state.currentTask, status }
            : state.currentTask
        }));
      }
    } catch (error) {
      console.error('更新任务状态失败:', error);
      throw error;
    }
  }
}));
