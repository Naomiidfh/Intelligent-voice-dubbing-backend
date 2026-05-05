import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useVoice } from '@/hooks/useVoice';
import { useMessageStore } from '@/stores/messageStore';
import { Message } from '@/types';
import Header from '@/components/Header';
import Card from '@/components/Card';
import { Bell, FileText, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();
  const { speak } = useVoice();
  const { messages, fetchMessages, markAsRead, markAllAsRead } = useMessageStore();

  useEffect(() => {
    fetchMessages();
    const unreadCount = messages.filter(m => !m.read).length;
    const message = `消息通知页面，您有${unreadCount}条未读消息`;
    speak(message);
  }, [fetchMessages, speak]);

  const handleMessageClick = (msg: Message) => {
    if (!msg.read) {
      markAsRead(msg.id);
    }
    
    const typeLabel = msg.type === 'order' ? '订单' : msg.type === 'reminder' ? '提醒' : '系统';
    speak(`${msg.title}，${msg.content}`);
    
    if (msg.relatedId) {
      if (msg.relatedId.startsWith('task-')) {
        navigate('/user/tasks');
      } else if (msg.relatedId.startsWith('order-')) {
        navigate('/user/orders');
      }
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead();
    speak('已标记所有消息为已读');
  };

  const handleSpeakUnread = () => {
    const unreadMessages = messages.filter(m => !m.read);
    if (unreadMessages.length === 0) {
      speak('您已阅读所有消息');
      return;
    }
    const titles = unreadMessages.map(m => m.title).join('、');
    speak(`您有${unreadMessages.length}条未读消息：${titles}`);
  };

  const getTypeIcon = (type: Message['type']) => {
    const icons = {
      order: <FileText className="w-5 h-5" />,
      system: <CheckCircle className="w-5 h-5" />,
      reminder: <Clock className="w-5 h-5" />
    };
    return icons[type];
  };

  const getTypeColor = (type: Message['type']) => {
    const colors = {
      order: 'bg-primary-100 text-primary-600',
      system: 'bg-success-100 text-success-600',
      reminder: 'bg-warning-100 text-warning-600'
    };
    return colors[type];
  };

  const getTypeLabel = (type: Message['type']) => {
    const labels = {
      order: '订单',
      system: '系统',
      reminder: '提醒'
    };
    return labels[type];
  };

  const unreadMessages = messages.filter(m => !m.read);

  return (
    <div className="min-h-screen bg-gray-50 pb-6">
      <Header title="消息通知" showBack={true} />

      <div className="max-w-lg mx-auto px-4 pt-4">
        {unreadMessages.length > 0 && (
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-danger-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-danger-600" />
              </div>
              <div>
                <p className="font-bold text-gray-800">您有 {unreadMessages.length} 条未读消息</p>
                <p className="text-sm text-gray-500">点击消息查看详情</p>
              </div>
            </div>
            <button
              onClick={handleSpeakUnread}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl text-gray-600 transition-colors"
            >
              朗读未读
            </button>
          </div>
        )}

        {messages.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500">暂无消息</p>
            <p className="text-base text-gray-400 mt-2">接单后会有通知消息</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <Card
                key={msg.id}
                variant={msg.read ? 'default' : 'elevated'}
                onClick={() => handleMessageClick(msg)}
                className={`transition-all ${msg.read ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getTypeColor(msg.type)}`}>
                    {getTypeIcon(msg.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className={`font-bold ${msg.read ? 'text-gray-600' : 'text-gray-800'}`}>
                          {msg.title}
                        </h3>
                        {!msg.read && (
                          <span className="w-2 h-2 bg-danger-500 rounded-full" />
                        )}
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${msg.read ? 'bg-gray-100 text-gray-500' : 'bg-primary-100 text-primary-600'}`}>
                        {getTypeLabel(msg.type)}
                      </span>
                    </div>
                    <p className={`text-base ${msg.read ? 'text-gray-400' : 'text-gray-600'} line-clamp-2`}>
                      {msg.content}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">{msg.createdAt}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {messages.length > 0 && unreadMessages.length > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="w-full mt-6 py-4 bg-white rounded-2xl text-primary-600 font-bold text-lg shadow-md hover:shadow-lg transition-all border-2 border-primary-200"
          >
            全部标为已读
          </button>
        )}
      </div>
    </div>
  );
}
