// 动态获取后端地址
const getApiBase = () => {
  // 开发环境使用本地
  if (import.meta.env.DEV) {
    return '/api';
  }
  // 生产环境使用 Render 后端地址（你部署后需要改成自己的）
  return import.meta.env.VITE_API_URL || 'https://your-render-backend.onrender.com';
};

const API_BASE = getApiBase();

async function request(endpoint: string, options: any = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API请求失败:', error);
    throw error;
  }
}

export const api = {
  tasks: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/tasks${query ? `?${query}` : ''}`);
    },
    get: (id) => request(`/tasks/${id}`),
    create: (data) => request('/tasks', { method: 'POST', body: JSON.stringify(data) }),
    updateStatus: (id, status) => request(`/tasks/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
  },
  orders: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ''}`);
    },
    get: (id) => request(`/orders/${id}`),
    create: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/orders/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  },
  users: {
    voiceActors: {
      list: () => request('/users/voice-actors'),
      login: (phone) => request('/users/voice-actors/login', { method: 'POST', body: JSON.stringify({ phone }) }),
    },
    clients: {
      list: () => request('/users/clients'),
      login: (phone) => request('/users/clients/login', { method: 'POST', body: JSON.stringify({ phone }) }),
      register: (data) => request('/users/clients/register', { method: 'POST', body: JSON.stringify(data) }),
    },
    notifications: {
      list: (params = {}) => {
        const query = new URLSearchParams(params).toString();
        return request(`/users/notifications${query ? `?${query}` : ''}`);
      },
      markRead: (id) => request(`/users/notifications/${id}/read`, { method: 'PUT' }),
    },
  },
  expenses: {
    list: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/expenses${query ? `?${query}` : ''}`);
    },
    create: (data) => request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
  },
};

export default api;
