import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '@/hooks/useVoice';
import { useUserStore } from '@/stores/userStore';
import { useMessageStore } from '@/stores/messageStore';
import { useOrderStore } from '@/stores/orderStore';
import { ShoppingBag, FileText, GraduationCap, Wallet, Headphones, Bell, Star } from 'lucide-react';
import Header from '@/components/Header';
import Card from '@/components/Card';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  description: string;
}

export default function Home() {
  const navigate = useNavigate();
  const { speak, speaking } = useVoice();
  const { currentUser, isLoggedIn } = useUserStore();
  const unreadCount = useMessageStore((state) => state.getUnreadCount());
  const activeOrders = useOrderStore((state) => state.orders.filter(o => o.status === 'pending_record').length);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/user/login');
    }
  }, [isLoggedIn, navigate]);

  const menuItems: MenuItem[] = [
    {
      id: 'tasks',
      title: '任务广场',
      icon: <ShoppingBag className="w-12 h-12" />,
      path: '/user/tasks',
      description: '浏览和接取配音任务'
    },
    {
      id: 'orders',
      title: '我的订单',
      icon: <FileText className="w-12 h-12" />,
      path: '/user/orders',
      badge: activeOrders > 0 ? activeOrders : undefined,
      description: '查看订单进行状态'
    },
    {
      id: 'learning',
      title: '学习测评',
      icon: <GraduationCap className="w-12 h-12" />,
      path: '/user/learning',
      description: '观看教程参加测评'
    },
    {
      id: 'wallet',
      title: '薪资钱包',
      icon: <Wallet className="w-12 h-12" />,
      path: '/user/wallet',
      description: '查看收益和提现'
    },
    {
      id: 'help',
      title: '帮扶求助',
      icon: <Headphones className="w-12 h-12" />,
      path: '/user/help',
      description: '联系辅导员获取帮助'
    },
    {
      id: 'notifications',
      title: '消息通知',
      icon: <Bell className="w-12 h-12" />,
      path: '/user/notifications',
      badge: unreadCount > 0 ? unreadCount : undefined,
      description: '查看系统消息'
    }
  ];

  useEffect(() => {
    const welcomeMessage = `欢迎回来，${currentUser?.name || '用户'}。您当前的能力等级是${currentUser?.abilityLevel || 1}级。点击任意卡片可以进入相应功能。`;
    const timer = setTimeout(() => {
      if (currentUser) {
        speak(welcomeMessage);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [currentUser, speak]);

  const handleMenuClick = (item: MenuItem) => {
    navigate(item.path);
  };

  const handleSpeakMenuItem = (item: MenuItem) => {
    const message = `${item.title}，${item.description}`;
    speak(message);
  };

  const getLevelLabel = (level: number) => {
    const labels = ['初级', '入门', '进阶', '熟练', '专业'];
    return labels[level - 1] || '初级';
  };

  const getLevelColor = (level: number) => {
    const colors = [
      'from-green-400 to-green-600',
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-orange-400 to-orange-600',
      'from-red-400 to-red-600'
    ];
    return colors[level - 1] || colors[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50 pb-8">
      <Header showMessage={true} unreadCount={unreadCount} />

      <div className="max-w-lg mx-auto px-4 pt-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xl text-gray-500 mb-1">您好，欢迎回来</p>
              <h2 className="text-3xl font-bold text-gray-800">
                {currentUser?.name || '用户'}
              </h2>
            </div>
            <div className={`px-5 py-3 rounded-2xl bg-gradient-to-r ${getLevelColor(currentUser?.abilityLevel || 1)} text-white shadow-lg`}>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                <span className="text-lg font-bold">
                  {getLevelLabel(currentUser?.abilityLevel || 1)}
                </span>
              </div>
              <p className="text-sm opacity-90 text-center">等级 {currentUser?.abilityLevel || 1}</p>
            </div>
          </div>
          
          <div className="mt-5 pt-5 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-3xl font-bold text-success-600">{currentUser?.completedOrders || 0}</p>
                <p className="text-base text-gray-500">已完成订单</p>
              </div>
              <div className="w-px h-12 bg-gray-200" />
              <div className="text-center flex-1">
                <p className="text-3xl font-bold text-primary-600">¥{currentUser?.withdrawable || 0}</p>
                <p className="text-base text-gray-500">可提现金额</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menuItems.map((item, index) => (
            <Card
              key={item.id}
              variant="elevated"
              onClick={() => handleMenuClick(item)}
              className="relative overflow-hidden"
            >
              <div 
                className="absolute inset-0 opacity-0 hover:opacity-100 bg-primary-50 transition-opacity duration-300 flex items-center justify-center"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSpeakMenuItem(item);
                }}
              />
              
              <div className="relative z-10">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
                  index % 3 === 0 ? 'bg-primary-100 text-primary-600' :
                  index % 3 === 1 ? 'bg-success-100 text-success-600' :
                  'bg-warning-100 text-warning-600'
                }`}>
                  {item.icon}
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-danger-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                      {item.badge > 9 ? '9+' : item.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-5 text-white shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Headphones className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold">需要帮助？</p>
              <p className="text-sm opacity-90">您的辅导员：{currentUser?.counselorName || '李老师'}</p>
              <p className="text-sm opacity-90">电话：{currentUser?.counselorPhone || '13800138000'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
