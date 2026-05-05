import { MessageCircleWarning } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  showMessage?: boolean;
  unreadCount?: number;
  onBack?: () => void;
}

export default function Header({ 
  title, 
  showBack = false, 
  showMessage = false, 
  unreadCount = 0,
  onBack 
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleMessageClick = () => {
    navigate('/user/notifications');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 max-w-lg mx-auto">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
              aria-label="返回"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          {title && (
            <h1 className="text-xl font-bold text-gray-800">{title}</h1>
          )}
        </div>
        
        {showMessage && (
          <button
            onClick={handleMessageClick}
            className="relative w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="消息"
          >
            <MessageCircleWarning className="w-6 h-6 text-gray-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
