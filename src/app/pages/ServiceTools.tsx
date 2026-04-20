import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ChevronUp, Plus, Check, ChevronDown, Bell, X } from 'lucide-react';
import TabBar from '../components/TabBar';

interface Tool {
  id: string;
  name: string;
  description: string;
  image: string;
  gradient: string;
  size: 'tall' | 'medium' | 'short';
  onClick: () => void;
}

interface Notification {
  id: number;
  taskName: string;
  taskType: 'exploration' | 'speech' | 'content';
  message: string;
  isRead: boolean;
  createTime: Date;
}

type NotificationFilter = 'all' | 'exploration' | 'speech' | 'content';

export default function ServiceTools() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [collectedTools, setCollectedTools] = useState<Set<string>>(new Set());
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<NotificationFilter>('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      taskName: '中海汇德里探盘任务',
      taskType: 'exploration',
      message: '2/4阶段进行中，请注意完成',
      isRead: false,
      createTime: new Date()
    },
    {
      id: 2,
      taskName: '万科城市之光话术训练',
      taskType: 'speech',
      message: '新任务已下发，请及时完成',
      isRead: false,
      createTime: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: 3,
      taskName: '朋友圈文案生成',
      taskType: 'content',
      message: '等待探盘完成后执行',
      isRead: true,
      createTime: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ]);

  const tools: Tool[] = [
    {
      id: 'good-house',
      name: '好房榜AI助手',
      description: '好房榜单，一键精准推荐',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=336&h=326&fit=crop',
      gradient: 'from-[rgba(255,183,77,0.6)] to-[rgba(255,107,53,0.85)]',
      size: 'medium',
      onClick: () => showMessage('好房榜AI助手')
    },
    {
      id: 'marketing',
      name: '房屋营销方案',
      description: '为您的房一键生成营销方案',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=336&h=448&fit=crop',
      gradient: 'from-[rgba(102,126,234,0.6)] to-[rgba(118,75,162,0.85)]',
      size: 'tall',
      onClick: () => showMessage('房屋营销方案')
    },
    {
      id: 'notes',
      name: '房源笔记生成器',
      description: '房源信息，智能整理编辑',
      image: 'https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=336&h=326&fit=crop',
      gradient: 'from-[rgba(236,72,153,0.6)] to-[rgba(190,24,93,0.85)]',
      size: 'medium',
      onClick: () => showMessage('房源笔记生成器')
    },
    {
      id: 'recommendation',
      name: '麦田推荐',
      description: '个性化推荐服务',
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=336&h=204&fit=crop',
      gradient: 'from-[rgba(239,68,68,0.6)] to-[rgba(185,28,28,0.85)]',
      size: 'short',
      onClick: () => showMessage('麦田推荐')
    },
    {
      id: 'speech-training',
      name: 'AI话术训练',
      description: '智能对话，仿真场景练习',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=336&h=326&fit=crop',
      gradient: 'from-[rgba(0,200,200,0.6)] to-[rgba(0,150,150,0.85)]',
      size: 'medium',
      onClick: () => showMessage('功能即将上线')
    },
    {
      id: 'assistant',
      name: '智能客服助手',
      description: '7x24在线解答',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=336&h=204&fit=crop',
      gradient: 'from-[rgba(0,184,148,0.6)] to-[rgba(0,150,136,0.85)]',
      size: 'short',
      onClick: () => showMessage('智能客服助手')
    },
    {
      id: 'audio-analysis',
      name: '约看录音分析',
      description: 'AI分析通话话术，提升成交率',
      image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=336&h=326&fit=crop',
      gradient: 'from-[rgba(22,93,255,0.6)] to-[rgba(22,93,255,0.85)]',
      size: 'medium',
      onClick: () => navigate('/audio-analysis')
    }
  ];

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const showMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const toggleCollect = (toolId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newCollected = new Set(collectedTools);
    if (newCollected.has(toolId)) {
      newCollected.delete(toolId);
      showMessage('已移除');
    } else {
      newCollected.add(toolId);
      showMessage('已添加');
    }
    setCollectedTools(newCollected);
  };

  const handleNotificationClick = (notification: Notification) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, isRead: true } : n))
    );
    setShowNotificationPanel(false);

    if (notification.taskType === 'exploration') {
      navigate('/tasks/1');
    } else if (notification.taskType === 'speech') {
      showMessage('功能即将上线');
    } else if (notification.taskType === 'content') {
      showMessage('日历功能即将上线');
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    showMessage('已清空全部通知');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '刚刚';
    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    if (days < 7) return `${days}天前`;
    return date.toLocaleDateString();
  };

  const getNotificationTypeLabel = (type: string) => {
    const labels = {
      exploration: '探盘',
      speech: '话术',
      content: '内容'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const filteredNotifications =
    notificationFilter === 'all'
      ? notifications
      : notifications.filter(n => n.taskType === notificationFilter);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getToolSizeClass = (size: string) => {
    if (size === 'tall') return 'min-h-[160px]';
    if (size === 'short') return 'min-h-[95px]';
    return 'min-h-[145px]';
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-32">
      {/* 标题栏 */}
      <header className="bg-white border-b border-[#F0F0F0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#FA8C16] to-[#FF8C5A] rounded-md flex items-center justify-center">
            <span className="text-white text-[12px] font-bold">AI</span>
          </div>
          <span className="text-[16px] font-semibold text-[#1D2129]">服务工具</span>
        </div>
        <button
          onClick={() => setShowNotificationPanel(true)}
          className="relative w-9 h-9 flex items-center justify-center text-[#4E5969] active:opacity-70 transition-opacity"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-[#FA5151] text-white text-[10px] rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </header>

      {/* 搜索栏 */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center gap-2 bg-[#F5F5F5] rounded-full px-4 h-11">
          <Search className="w-4 h-4 text-[#999]" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="输入工具名称"
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#333] placeholder:text-[#999]"
          />
          {searchText && (
            <button
              onClick={() => setSearchText('')}
              className="text-[13px] font-medium px-3 py-1 bg-gradient-to-r from-[#FA8C16] to-[#FF8C5A] text-white rounded-full active:scale-95 transition-transform"
            >
              清除
            </button>
          )}
        </div>
      </div>

      {/* 筛选区域 */}
      <div className="bg-white px-4 py-3 flex items-center justify-between mb-2">
        <div className="flex items-center gap-1 text-[#666] text-[14px]">
          <ChevronUp className="w-4 h-4" />
          <span>管理排序</span>
        </div>
        <div className="flex items-center gap-0.5 text-[#FA8C16] text-[14px]">
          <ChevronUp className="w-4 h-4" />
        </div>
      </div>

      {/* 横幅 */}
      <div className="px-4 pb-4">
        <div className="w-full h-[140px] rounded-2xl bg-gradient-to-br from-[#667eea] to-[#764ba2] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1557821552-17105176677c?w=690&h=288&fit=crop"
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 工具网格 */}
      <div className="grid grid-cols-2 gap-4 px-4 pb-4">
        {filteredTools.map((tool, index) => (
          <div
            key={tool.id}
            onClick={tool.onClick}
            className={`relative rounded-2xl overflow-hidden bg-[#E8E8E8] cursor-pointer active:scale-[0.98] transition-transform ${getToolSizeClass(
              tool.size
            )} animate-in delay-${Math.min(index % 4 + 1, 4)}`}
          >
            <img
              src={tool.image}
              alt={tool.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className={`absolute inset-0 bg-gradient-to-br ${tool.gradient} mix-blend-multiply`}
            />
            <div className="relative z-10 p-4 h-full flex flex-col justify-end">
              <button
                onClick={(e) => toggleCollect(tool.id, e)}
                className="absolute top-2.5 right-2.5 w-[26px] h-[26px] bg-white/30 backdrop-blur-md rounded-lg flex items-center justify-center text-white active:scale-90 transition-transform"
              >
                {collectedTools.has(tool.id) ? (
                  <Check className="w-3 h-3" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
              </button>
              <h4 className="text-[15px] font-bold text-white mb-1">{tool.name}</h4>
              <p className="text-[12px] text-white/90 leading-snug">{tool.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 搜索无结果 */}
      {searchText && filteredTools.length === 0 && (
        <div className="text-center py-12 text-[#86909C]">
          <p className="text-[14px]">未找到相关工具</p>
          <button
            onClick={() => setSearchText('')}
            className="mt-2 text-[13px] text-[#FA8C16] active:opacity-70"
          >
            清除搜索条件
          </button>
        </div>
      )}

      {/* 更多工具按钮 */}
      {!searchText && (
        <div className="px-4">
          <button
            onClick={() => showMessage('查看更多工具')}
            className="w-full py-3.5 bg-white rounded-2xl text-[#FA8C16] text-[14px] font-medium flex items-center justify-center gap-1 shadow-sm active:scale-[0.98] active:bg-[#F7F8FA] transition-all"
          >
            查看更多工具 <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 底部TabBar */}
      <TabBar />

      {/* 通知面板遮罩 */}
      {showNotificationPanel && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] transition-opacity"
          onClick={() => setShowNotificationPanel(false)}
        />
      )}

      {/* 通知面板 */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] z-[10000] transition-transform ${
          showNotificationPanel ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* 通知头部 */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#F0F0F0]">
          <span className="text-[15px] font-semibold text-[#1D2129]">通知</span>
          <div className="flex items-center gap-4">
            <button
              onClick={clearAllNotifications}
              className="text-[13px] text-[#FA8C16] active:opacity-70"
            >
              清空全部
            </button>
            <button onClick={() => setShowNotificationPanel(false)} className="p-1 text-[#999]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 通知标签 */}
        <div className="flex border-b border-[#F0F0F0]">
          {[
            { key: 'all', label: '全部' },
            { key: 'exploration', label: '探盘' },
            { key: 'speech', label: '话术' },
            { key: 'content', label: '内容' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setNotificationFilter(tab.key as NotificationFilter)}
              className={`flex-1 py-2 text-[14px] border-b-2 transition-colors ${
                notificationFilter === tab.key
                  ? 'text-[#FA8C16] border-[#FA8C16]'
                  : 'text-[#666] border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 通知列表 */}
        <div className="max-h-[50vh] overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-[#86909C]">暂无通知</div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`px-4 py-4 border-b border-[#F0F0F0] active:bg-[#F7F8FA] cursor-pointer ${
                  notification.isRead ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      notification.isRead ? 'bg-[#CCC]' : 'bg-[#FA5151]'
                    }`}
                  />
                  <span className="text-[14px] font-medium text-[#1D2129]">
                    {notification.taskName}
                  </span>
                  <span
                    className={`ml-auto text-[11px] px-1.5 py-0.5 rounded ${
                      notification.taskType === 'exploration'
                        ? 'bg-[#E8F3FF] text-[#165DFF]'
                        : notification.taskType === 'speech'
                        ? 'bg-[#F7F0FF] text-[#722ED1]'
                        : 'bg-[#FFF7E6] text-[#FA8C16]'
                    }`}
                  >
                    {getNotificationTypeLabel(notification.taskType)}
                  </span>
                </div>
                <div className="text-[13px] text-[#4E5969] mb-1">{notification.message}</div>
                <div className="text-[12px] text-[#86909C]">
                  {formatTime(notification.createTime)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,0,0,0.75)] text-white px-6 py-3 rounded-xl z-[99999] text-[14px] animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
