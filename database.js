import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'data.json');

let db = {
  users: [],
  client_users: [],
  counselors: [],
  tasks: [],
  orders: [],
  messages: [],
  notifications: [],
  helpRequests: [],
  expenses: [],
  _id_counters: {
    users: 1,
    client_users: 1,
    counselors: 1,
    tasks: 1,
    orders: 1,
    messages: 1,
    notifications: 1,
    helpRequests: 1,
    expenses: 1
  }
};

function loadDb() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf-8');
      db = JSON.parse(data);
    } else {
      initializeData();
    }
  } catch (error) {
    console.error('加载数据库失败:', error);
    initializeData();
  }
}

function saveDb() {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  } catch (error) {
    console.error('保存数据库失败:', error);
  }
}

function initializeData() {
  db.counselors = [
    {
      id: 1,
      name: '张辅导员',
      phone: '13800001001',
      email: 'zhang@zhisheng.com',
      region: '北京',
      status: 'active',
      students: 15,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: '李辅导员',
      phone: '13800001002',
      email: 'li@zhisheng.com',
      region: '上海',
      status: 'active',
      students: 12,
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: '王辅导员',
      phone: '13800001003',
      email: 'wang@zhisheng.com',
      region: '广州',
      status: 'active',
      students: 10,
      created_at: new Date().toISOString()
    }
  ];

  db.client_users = [
    {
      id: 1,
      phone: '13800138000',
      company_name: '测试甲方公司',
      contact_name: '张经理',
      verified: true,
      created_at: new Date().toISOString()
    }
  ];

  db.users = [
    {
      id: 1,
      phone: '13900139000',
      name: '李配音员',
      role: 'voice_actor',
      avatar: null,
      created_at: new Date().toISOString()
    }
  ];

  db.tasks = [
    {
      id: 1,
      client_id: 1,
      task_type: 'children_book',
      content: '从前有一只小兔子，它住在森林里。小兔子每天都会去采集胡萝卜。森林里的动物们都很喜欢小兔子，因为它乐于助人。',
      sentences: [
        { id: 1, text: '从前有一只小兔子，它住在森林里。', pinyin: 'cóng qián yǒu yì zhī xiǎo tù zi，tā zhù zài sēn lín lǐ。' },
        { id: 2, text: '小兔子每天都会去采集胡萝卜。', pinyin: 'xiǎo tù zi měi tiān dōu huì qù cǎi jí hú luó bo。' },
        { id: 3, text: '森林里的动物们都很喜欢小兔子，因为它乐于助人。', pinyin: 'sēn lín lǐ de dòng wù men dōu hěn xǐ huān xiǎo tù zi，yīn wèi tā lè yú zhù rén。' }
      ],
      styles: ['朗读', '讲述'],
      budget: 200,
      deadline: '2026-06-01',
      status: 'approved',
      company_name: '测试甲方公司',
      created_at: new Date().toISOString()
    }
  ];

  db.orders = [];
  db.messages = [];
  db.notifications = [];
  db.helpRequests = [];
  db._id_counters = {
    users: 2,
    client_users: 2,
    counselors: 4,
    tasks: 2,
    orders: 1,
    messages: 1,
    notifications: 1,
    helpRequests: 1
  };

  saveDb();
  console.log('✅ 数据库初始化完成');
}

function getNextId(collection) {
  const id = db._id_counters[collection] || 1;
  db._id_counters[collection] = id + 1;
  return id;
}

export const database = {
  users: {
    findAll: () => db.users,
    findById: (id) => db.users.find(u => u.id === id),
    findByPhone: (phone) => db.users.find(u => u.phone === phone),
    create: (data) => {
      const user = { id: getNextId('users'), ...data, created_at: new Date().toISOString() };
      db.users.push(user);
      saveDb();
      return user;
    },
    update: (id, data) => {
      const index = db.users.findIndex(u => u.id === id);
      if (index !== -1) {
        db.users[index] = { ...db.users[index], ...data };
        saveDb();
        return db.users[index];
      }
      return null;
    }
  },
  client_users: {
    findAll: () => db.client_users,
    findById: (id) => db.client_users.find(c => c.id === id),
    findByPhone: (phone) => db.client_users.find(c => c.phone === phone),
    create: (data) => {
      const client = { id: getNextId('client_users'), ...data, created_at: new Date().toISOString() };
      db.client_users.push(client);
      saveDb();
      return client;
    }
  },
  tasks: {
    findAll: (filters = {}) => {
      let tasks = [...db.tasks];
      if (filters.status) {
        tasks = tasks.filter(t => t.status === filters.status);
      }
      if (filters.client_id) {
        tasks = tasks.filter(t => t.client_id === filters.client_id);
      }
      return tasks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    findById: (id) => db.tasks.find(t => t.id === id),
    create: (data) => {
      const task = { id: getNextId('tasks'), ...data, created_at: new Date().toISOString() };
      db.tasks.push(task);
      saveDb();
      return task;
    },
    update: (id, data) => {
      const index = db.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        db.tasks[index] = { ...db.tasks[index], ...data };
        saveDb();
        return db.tasks[index];
      }
      return null;
    },
    delete: (id) => {
      const index = db.tasks.findIndex(t => t.id === id);
      if (index !== -1) {
        db.tasks.splice(index, 1);
        saveDb();
        return true;
      }
      return false;
    }
  },
  orders: {
    findAll: (filters = {}) => {
      let orders = [...db.orders];
      if (filters.voice_actor_id) {
        orders = orders.filter(o => o.voice_actor_id === filters.voice_actor_id);
      }
      if (filters.task_id) {
        orders = orders.filter(o => o.task_id === filters.task_id);
      }
      if (filters.status) {
        orders = orders.filter(o => o.status === filters.status);
      }
      return orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    findById: (id) => db.orders.find(o => o.id === id),
    findByTaskAndActor: (task_id, voice_actor_id) => 
      db.orders.find(o => o.task_id === task_id && o.voice_actor_id === voice_actor_id),
    create: (data) => {
      const order = { id: getNextId('orders'), ...data, created_at: new Date().toISOString() };
      db.orders.push(order);
      saveDb();
      return order;
    },
    update: (id, data) => {
      const index = db.orders.findIndex(o => o.id === id);
      if (index !== -1) {
        db.orders[index] = { ...db.orders[index], ...data };
        saveDb();
        return db.orders[index];
      }
      return null;
    }
  },
  notifications: {
    findAll: (filters = {}) => {
      let notifications = [...db.notifications];
      if (filters.user_id) {
        notifications = notifications.filter(n => n.user_id === filters.user_id || n.user_id === 0);
      }
      if (filters.user_type) {
        notifications = notifications.filter(n => n.user_type === filters.user_type || n.user_type === 'all');
      }
      return notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    create: (data) => {
      const notification = { id: getNextId('notifications'), ...data, is_read: false, created_at: new Date().toISOString() };
      db.notifications.push(notification);
      saveDb();
      return notification;
    },
    markRead: (id) => {
      const index = db.notifications.findIndex(n => n.id === id);
      if (index !== -1) {
        db.notifications[index].is_read = true;
        saveDb();
        return true;
      }
      return false;
    }
  },
  counselors: {
    findAll: (filters = {}) => {
      let counselors = [...db.counselors];
      if (filters.status) {
        counselors = counselors.filter(c => c.status === filters.status);
      }
      return counselors;
    },
    findById: (id) => db.counselors.find(c => c.id === id),
    create: (data) => {
      const counselor = { id: getNextId('counselors'), ...data, created_at: new Date().toISOString() };
      db.counselors.push(counselor);
      saveDb();
      return counselor;
    },
    update: (id, data) => {
      const index = db.counselors.findIndex(c => c.id === id);
      if (index !== -1) {
        db.counselors[index] = { ...db.counselors[index], ...data };
        saveDb();
        return db.counselors[index];
      }
      return null;
    }
  },
  helpRequests: {
    findAll: (filters = {}) => {
      let requests = [...db.helpRequests];
      if (filters.counselor_id) {
        requests = requests.filter(r => r.counselor_id === filters.counselor_id || r.counselor_id === null);
      }
      if (filters.user_id) {
        requests = requests.filter(r => r.user_id === filters.user_id);
      }
      if (filters.status) {
        requests = requests.filter(r => r.status === filters.status);
      }
      return requests.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    findById: (id) => db.helpRequests.find(r => r.id === id),
    create: (data) => {
      const request = { id: getNextId('helpRequests'), ...data, created_at: new Date().toISOString() };
      db.helpRequests.push(request);
      saveDb();
      return request;
    },
    update: (id, data) => {
      const index = db.helpRequests.findIndex(r => r.id === id);
      if (index !== -1) {
        db.helpRequests[index] = { ...db.helpRequests[index], ...data };
        saveDb();
        return db.helpRequests[index];
      }
      return null;
    }
  },
  expenses: {
    findAll: (filters = {}) => {
      let expenses = [...db.expenses];
      if (filters.client_id) {
        expenses = expenses.filter(e => e.client_id === filters.client_id);
      }
      return expenses.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },
    findById: (id) => db.expenses.find(e => e.id === id),
    create: (data) => {
      const expense = { id: getNextId('expenses'), ...data, created_at: new Date().toISOString() };
      db.expenses.push(expense);
      saveDb();
      return expense;
    }
  }
};

export function initDatabase() {
  loadDb();
}

export { database as db };
