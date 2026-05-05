import { create } from 'zustand';
import { api } from '@/services/api';

export interface User {
  id: number;
  name: string;
  phone: string;
  account?: string;
  avatar?: string;
  role: string;
  abilityLevel?: number;
  totalEarnings?: number;
  withdrawable?: number;
  completedOrders?: number;
  counselorId?: string;
  counselorName?: string;
  counselorPhone?: string;
}

interface UserState {
  currentUser: User | null;
  isLoggedIn: boolean;
  fontSize: number;
  voiceEnabled: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => void;
  setFontSize: (size: number) => void;
  setVoiceEnabled: (enabled: boolean) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  currentUser: null,
  isLoggedIn: false,
  fontSize: 24,
  voiceEnabled: true,
  isLoading: false,

  login: async (phone: string) => {
    set({ isLoading: true });
    try {
      const response = await api.users.voiceActors.login(phone);
      if (response.success) {
        const userData = response.data;
        set({
          currentUser: {
            id: userData.id,
            name: userData.name || '配音员',
            phone: userData.phone,
            avatar: userData.avatar || '',
            role: 'user',
            abilityLevel: userData.abilityLevel || 1,
            totalEarnings: userData.totalEarnings || 0,
            withdrawable: userData.withdrawable || 0,
            completedOrders: userData.completedOrders || 0
          },
          isLoggedIn: true,
          isLoading: false
        });
        localStorage.setItem('voice_actor_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('登录失败:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      currentUser: null,
      isLoggedIn: false
    });
    localStorage.removeItem('voice_actor_user');
  },

  setFontSize: (size: number) => {
    set({ fontSize: size });
  },

  setVoiceEnabled: (enabled: boolean) => {
    set({ voiceEnabled: enabled });
  },

  updateUser: (data: Partial<User>) => {
    set((state) => ({
      currentUser: state.currentUser ? { ...state.currentUser, ...data } : null
    }));
  }
}));
