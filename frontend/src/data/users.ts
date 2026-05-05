import { User, Client, Admin, Message, VoiceActor, Organization } from '@/types';

export const mockUser: User = {
  id: 'user-001',
  name: '王小明',
  account: 'U20240001',
  abilityLevel: 2,
  counselorId: 'counselor-001',
  counselorName: '李老师',
  counselorPhone: '13800138000',
  totalEarnings: 280,
  withdrawable: 200,
  completedOrders: 5,
  avatar: ''
};

export const mockUsers: User[] = [
  mockUser,
  {
    id: 'user-002',
    name: '张小华',
    account: 'U20240002',
    abilityLevel: 3,
    counselorId: 'counselor-001',
    counselorName: '李老师',
    totalEarnings: 450,
    withdrawable: 300,
    completedOrders: 8
  },
  {
    id: 'user-003',
    name: '李小红',
    account: 'U20240003',
    abilityLevel: 1,
    counselorId: 'counselor-002',
    counselorName: '王老师',
    totalEarnings: 120,
    withdrawable: 120,
    completedOrders: 2
  },
  {
    id: 'user-004',
    name: '陈大力',
    account: 'U20240004',
    abilityLevel: 4,
    counselorId: 'counselor-001',
    counselorName: '李老师',
    totalEarnings: 680,
    withdrawable: 400,
    completedOrders: 12
  },
  {
    id: 'user-005',
    name: '赵美丽',
    account: 'U20240005',
    abilityLevel: 2,
    counselorId: 'counselor-002',
    counselorName: '王老师',
    totalEarnings: 220,
    withdrawable: 150,
    completedOrders: 4
  }
];

export const mockClient: Client = {
  id: 'client-001',
  companyName: '北京童趣出版社',
  phone: '13900139000',
  verified: true,
  contactPerson: '张经理'
};

export const mockClients: Client[] = [
  mockClient,
  {
    id: 'client-002',
    companyName: '上海公益基金会',
    phone: '13900139001',
    verified: true,
    contactPerson: '李总监'
  },
  {
    id: 'client-003',
    companyName: '深圳纪录影视公司',
    phone: '13900139002',
    verified: false,
    contactPerson: '王制片'
  }
];

export const mockAdmin: Admin = {
  id: 'admin-001',
  username: 'admin',
  role: 'operator',
  name: '系统管理员'
};

export const mockAdmins: Admin[] = [
  mockAdmin,
  {
    id: 'admin-002',
    username: 'counselor',
    role: 'counselor',
    name: '辅导员小明'
  },
  {
    id: 'admin-003',
    username: 'reviewer',
    role: 'reviewer',
    name: '审核员小红'
  }
];

export const mockMessages: Message[] = [
  {
    id: 'msg-001',
    title: '新任务上架通知',
    content: '《小兔子找朋友》儿童故事已上架，快来接单吧！',
    type: 'order',
    read: false,
    createdAt: '2026-05-01 10:00',
    relatedId: 'task-001'
  },
  {
    id: 'msg-002',
    title: '订单审核通过',
    content: '恭喜！您的作品《关爱老人》已审核通过！',
    type: 'system',
    read: false,
    createdAt: '2026-04-28 15:30',
    relatedId: 'order-002'
  },
  {
    id: 'msg-003',
    title: '薪资到账提醒',
    content: '您有一笔80元的薪资已到账，请查收！',
    type: 'reminder',
    read: true,
    createdAt: '2026-04-25 09:00',
    relatedId: 'order-005'
  },
  {
    id: 'msg-004',
    title: '订单需要修改',
    content: '您的作品《小白兔学画画》需要修改，请重新录制。',
    type: 'system',
    read: true,
    createdAt: '2026-04-26 14:00',
    relatedId: 'order-004'
  }
];

export const mockVoiceActors: VoiceActor[] = [
  {
    id: 'user-001',
    name: '王小明',
    level: 2,
    completedOrders: 5,
    style: ['儿童故事', '绘本朗读'],
    available: true
  },
  {
    id: 'user-002',
    name: '张小华',
    level: 3,
    completedOrders: 8,
    style: ['纪录片', '公益广告'],
    available: true
  },
  {
    id: 'user-003',
    name: '李小红',
    level: 1,
    completedOrders: 2,
    style: ['简单对话'],
    available: true
  },
  {
    id: 'user-004',
    name: '陈大力',
    level: 4,
    completedOrders: 12,
    style: ['纪录片', '配音'],
    available: false
  }
];

export const mockOrganizations: Organization[] = [
  {
    id: 'org-001',
    name: '阳光康复中心',
    type: 'ngo',
    contactPerson: '刘主任',
    phone: '010-12345678',
    studentCount: 25,
    verified: true,
    createdAt: '2026-01-15'
  },
  {
    id: 'org-002',
    name: '希望社区工作站',
    type: 'government',
    contactPerson: '陈站长',
    phone: '010-23456789',
    studentCount: 18,
    verified: true,
    createdAt: '2026-02-20'
  },
  {
    id: 'org-003',
    name: '爱心企业联盟',
    type: 'enterprise',
    contactPerson: '赵经理',
    phone: '010-34567890',
    studentCount: 12,
    verified: false,
    createdAt: '2026-04-10'
  }
];

export const getUnreadMessageCount = (): number => {
  return mockMessages.filter(msg => !msg.read).length;
};

export const getVoiceActorById = (id: string): VoiceActor | undefined => {
  return mockVoiceActors.find(actor => actor.id === id);
};

export const getOrganizationById = (id: string): Organization | undefined => {
  return mockOrganizations.find(org => org.id === id);
};
