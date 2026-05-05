import { create } from 'zustand';
import { Message } from '@/types';
import { mockMessages } from '@/data/users';

interface MessageState {
  messages: Message[];
  fetchMessages: () => void;
  getUnreadCount: () => number;
  markAsRead: (messageId: string) => void;
  markAllAsRead: () => void;
  addMessage: (message: Omit<Message, 'id' | 'createdAt'>) => void;
  sendMessage: (to: string, content: string, type?: string) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],

  fetchMessages: () => {
    set({ messages: mockMessages });
  },

  getUnreadCount: () => {
    const { messages } = get();
    return messages.filter(msg => !msg.read).length;
  },

  markAsRead: (messageId) => {
    set((state) => ({
      messages: state.messages.map(msg =>
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      messages: state.messages.map(msg => ({ ...msg, read: true }))
    }));
  },

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toLocaleString('zh-CN')
    };
    set((state) => ({
      messages: [newMessage, ...state.messages]
    }));
  },

  sendMessage: (to, content, type = 'system') => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      from: 'system',
      to,
      content,
      type: type as 'order' | 'system' | 'reminder',
      read: false,
      createdAt: new Date().toLocaleString('zh-CN')
    };
    set((state) => ({
      messages: [newMessage, ...state.messages]
    }));
  }
}));
