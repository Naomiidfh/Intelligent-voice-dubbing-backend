import { create } from 'zustand';

export interface Admin {
  id: number;
  username: string;
  role: 'operator' | 'counselor' | 'reviewer';
  name?: string;
}

interface AdminState {
  currentAdmin: Admin | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, role: string) => Promise<void>;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  currentAdmin: null,
  isLoggedIn: false,
  isLoading: false,

  login: async (username: string, role: string) => {
    set({ isLoading: true });
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const adminData: Admin = {
        id: 1,
        username,
        role: role as Admin['role'],
        name: username
      };
      
      set({
        currentAdmin: adminData,
        isLoggedIn: true,
        isLoading: false
      });
      
      localStorage.setItem('admin_user', JSON.stringify(adminData));
    } catch (error) {
      console.error('登录失败:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      currentAdmin: null,
      isLoggedIn: false
    });
    localStorage.removeItem('admin_user');
  }
}));
