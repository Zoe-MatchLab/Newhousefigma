import { useNavigate, useLocation } from 'react-router';
import { Rocket, Paintbrush, MessageCircle, Calendar, User } from 'lucide-react';
import { useState } from 'react';

export default function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const tabs = [
    { icon: Rocket, path: '/tools', name: '工具' },
    { icon: Paintbrush, path: null, name: 'AI设计' },
    { icon: MessageCircle, path: null, name: '对话' },
    { icon: Calendar, path: '/', name: '日历' },
    { icon: User, path: '/profile', name: '我的' }
  ];

  const handleTabClick = (path: string | null, name: string) => {
    if (path) {
      navigate(path);
    } else {
      setToastMessage(`跳转到${name}页面`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const isActive = (path: string | null) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <>
      {/* TabBar胶囊 */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-[#1D2129]/95 backdrop-blur-xl rounded-[28px] px-5 py-2 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.24)] flex gap-1">
        {tabs.map((tab, index) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);
          return (
            <button
              key={index}
              onClick={() => handleTabClick(tab.path, tab.name)}
              className={`w-11 h-9 flex items-center justify-center rounded-[18px] transition-all ${
                active
                  ? 'bg-[#FA8C16]/20 text-[#FA8C16]'
                  : 'text-white/50 hover:text-white/70'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </nav>

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1D2129]/90 text-white px-6 py-3 rounded-lg text-[14px] z-[10000] animate-fade-in">
          {toastMessage}
        </div>
      )}
    </>
  );
}
