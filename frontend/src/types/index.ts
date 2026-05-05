export type UserRole = 'user' | 'client' | 'admin';

export type AbilityLevel = 1 | 2 | 3 | 4 | 5;

export type TaskType = 'children_book' | 'picture_book' | 'documentary' | 'charity';

export type OrderStatus = 'pending_record' | 'accepted' | 'pending_review' | 'pending_acceptance' | 'pending_settlement' | 'completed' | 'rejected';

export interface Sentence {
  id: number;
  text: string;
  pinyin?: string;
  pauseTag?: string;
}

export interface Task {
  id: string;
  title: string;
  type: TaskType;
  price: number;
  wordCount: number;
  difficulty: 1 | 2 | 3;
  requiredLevel: AbilityLevel;
  deadline: string;
  content: string;
  sentences: Sentence[];
  status?: 'available' | 'taken';
}

export interface Recording {
  sentenceId: number;
  audioUrl: string;
  duration: number;
  blob?: Blob;
}

export interface Order {
  id: string;
  taskId: string;
  taskTitle: string;
  status: OrderStatus;
  recordings: Recording[];
  createdAt: string;
  updatedAt: string;
  price: number;
  task_type?: string;
  task_content?: string;
  voice_actor_id?: number;
  voice_actor_name?: string;
  audio_url?: string;
  admin_feedback?: string;
  submitted_at?: string;
  completed_at?: string;
}

export interface User {
  id: string;
  name: string;
  account: string;
  abilityLevel: AbilityLevel;
  counselorId?: string;
  counselorName?: string;
  counselorPhone?: string;
  totalEarnings: number;
  withdrawable: number;
  completedOrders: number;
  avatar?: string;
}

export interface Client {
  id: string;
  companyName: string;
  phone: string;
  verified: boolean;
  contactPerson: string;
}

export interface Admin {
  id: string;
  username: string;
  role: 'operator' | 'counselor' | 'reviewer';
  name?: string;
}

export interface Message {
  id: string;
  title?: string;
  content: string;
  type: 'order' | 'system' | 'reminder';
  read: boolean;
  createdAt: string;
  relatedId?: string;
  from?: string;
  to?: string;
}

export interface EarningRecord {
  id: string;
  orderId: string;
  taskTitle: string;
  amount: number;
  status: 'pending' | 'settled';
  createdAt: string;
}

export interface VoiceActor {
  id: string;
  name: string;
  level: AbilityLevel;
  completedOrders: number;
  sampleUrl?: string;
  style: string[];
  available: boolean;
}

export interface Organization {
  id: string;
  name: string;
  type: 'government' | 'ngo' | 'enterprise';
  contactPerson: string;
  phone: string;
  studentCount: number;
  verified: boolean;
  createdAt: string;
}
