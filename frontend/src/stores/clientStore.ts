import { create } from 'zustand';
import { api } from '@/services/api';

interface ClientUser {
  id: number;
  phone: string;
  company_name: string;
  contact_name: string;
  verified: boolean;
}

interface ClientState {
  currentClient: ClientUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  logout: () => void;
}

export const useClientStore = create<ClientState>((set) => ({
  currentClient: null,
  isLoggedIn: false,
  isLoading: false,

  login: async (phone: string) => {
    set({ isLoading: true });
    try {
      const response = await api.users.clients.login(phone);
      if (response.success) {
        const clientData = response.data;
        set({
          currentClient: {
            id: clientData.id,
            phone: clientData.phone,
            company_name: clientData.company_name,
            contact_name: clientData.contact_name,
            verified: !!clientData.verified
          },
          isLoggedIn: true,
          isLoading: false
        });
        localStorage.setItem('client_user', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('甲方登录失败:', error);
      set({ isLoading: false });
      throw error;
    }
  },

  logout: () => {
    set({
      currentClient: null,
      isLoggedIn: false
    });
    localStorage.removeItem('client_user');
  }
}));
