/**
 * @module dashboard/pages/ServiceTools
 * @description 服务工具页面（仪表盘模块）
 * 
 * 本文件实现服务工具页面的展示和交互功能，包括：
 * - 工具卡片展示
 * - 工具收藏功能
 * - 通知面板
 * - 搜索功能
 * 
 * 使用自定义 Hooks 封装业务逻辑
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, ChevronUp, Plus, Check, ChevronDown, Bell, X, Star } from 'lucide-react';
import TabBar from '../../components/TabBar';

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
      message: '2/4 阶段进行中，请注意完成',
      isRead: false,
      createTime: new Date()
    },
    {
      id: 2,
      taskName: '万科城市之光话术训练',
      taskType: 'speech',
      message: '新任务已下发，请及时完成',
      isRead: false,
      createTime: new Date()
    },
    {
      id: 3,
      taskName: '内容生成任务完成',
      taskType: 'content',
      message: '您的文案已生成完成，请查看',
      isRead: true,
      createTime: new Date()
    }
  ]);

  // 工具列表数据
  const tools: Tool[] = [
    {
      id: '1',
      name: '探盘路书',
      description: '智能生成探盘路线和文案',
      image: '🗺️',
      gradient: 'from-[#FA8C16] to-[#D46B08]',
      size: 'tall',
      onClick: () => navigate('/tasks')
    },
    {
      id: '2',
      name: '话术训练',
      description: 'AI 陪练提升销售技巧',
      image: '🎤',
      gradient: 'from-[#165DFF] to-[#722ED1]',
      size: 'medium',
      onClick: () => navigate('/my-tasks')
    },
    {
      id: '3',
      name: '录音分析',
      description: '智能分析通话录音',
      image: '📊',
      gradient: 'from-[#00B42A] to-[#008B2A]',
      size: 'medium',
      onClick: () => navigate('/recording/list')
    },
    {
      id: '4',
      name: '客户管理',
      description: '客户关系维护工具',
      image: '👥',
      gradient: 'from-[#F5319D] to-[#C41D7F]',
      size: 'short',
      onClick: () => navigate('/customer/list')
    },
    {
      id: '5',
      name: '内容生成',
      description: 'AI 自动生成营销文案',
      image: '✍️',
      gradient: 'from-[#722ED1] to-[#165DFF]',
      size: 'short',
      onClick: () => navigate('/')
    },
    {
      id: '6',
      name: '数据分析',
      description: '业务数据可视化分析',
      image: '📈',
      gradient: 'from-[#13C2C2] to-[#08979C]',
      size: 'short',
      onClick: () => navigate('/profile')
    }
  ];

  // 切换收藏状态
  const toggleCollection = (toolId: string) => {
    setCollectedTools(prev => {
      const newSet = new Set(prev);
      if (newSet.has(toolId)) {
        newSet.delete(toolId);
        showToastMessage('已取消收藏');
      } else {
        newSet.add(toolId);
        showToastMessage('已加入收藏');
      }
      return newSet;
    });
  };

  // 显示提示消息
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 过滤通知
  const filteredNotifications = notifications.filter(notification => {
    if (notificationFilter === 'all') return true;
    return notification.taskType === notificationFilter;
  });

  // 标记为已读
  const markAsRead = (id: number) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  // 过滤工具
  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchText.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[17px] font-semibold text-[#1D2129]">服务工具</h1>
          <button
            onClick={() => setShowNotificationPanel(true)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-[#1D2129]" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FA5151] rounded-full" />
            )}
          </button>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" />
          <input
            type="text"
            placeholder="搜索工具"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FA] border border-[#E5E6EB] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#165DFF]/20 focus:border-[#165DFF]"
          />
        </div>
      </header>

      {/* 工具网格 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredTools.map(tool => (
            <div
              key={tool.id}
              onClick={tool.onClick}
              className={`relative bg-gradient-to-br ${tool.gradient} rounded-2xl p-4 cursor-pointer hover:shadow-lg transition-all ${
                tool.size === 'tall' ? 'row-span-2' : ''
              }`}
            >
              {/* 收藏按钮 */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollection(tool.id);
                }}
                className="absolute top-3 right-3 p-1.5 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <Star
                  className={`w-4 h-4 ${
                    collectedTools.has(tool.id)
                      ? 'text-white fill-white'
                      : 'text-white/70'
                  }`}
                />
              </button>

              {/* 工具内容 */}
              <div className="text-white">
                <div className="text-[32px] mb-2">{tool.image}</div>
                <h3 className="text-[16px] font-semibold mb-1">{tool.name}</h3>
                <p className="text-[12px] text-white/80">{tool.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 通知面板 */}
      {showNotificationPanel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-[#E5E6EB] flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-[16px] font-semibold text-[#1D2129]">通知</h2>
              <button
                onClick={() => setShowNotificationPanel(false)}
                className="p-2 hover:bg-gray-50 rounded-lg"
              >
                <ChevronDown className="w-5 h-5 text-[#86909C]" />
              </button>
            </div>

            {/* 筛选标签 */}
            <div className="p-4 border-b border-[#E5E6EB]">
              <div className="flex items-center gap-2">
                {[
                  { label: '全部', value: 'all' },
                  { label: '探盘', value: 'exploration' },
                  { label: '话术', value: 'speech' },
                  { label: '内容', value: 'content' }
                ].map(filter => (
                  <button
                    key={filter.value}
                    onClick={() => setNotificationFilter(filter.value as NotificationFilter)}
                    className={`px-3 py-1.5 rounded-full text-[13px] transition-colors ${
                      notificationFilter === filter.value
                        ? 'bg-[#165DFF] text-white'
                        : 'bg-[#F7F8FA] text-[#4E5969] hover:bg-[#E5E6EB]'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 通知列表 */}
            <div className="divide-y divide-[#E5E6EB]">
              {filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  onClick={() => markAsRead(notification.id)}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.isRead ? 'bg-[#F0F5FF]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[14px] font-medium text-[#1D2129]">
                      {notification.taskName}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-[#FA5151] rounded-full" />
                    )}
                  </div>
                  <p className="text-[13px] text-[#4E5969] mb-2">{notification.message}</p>
                  <span className="text-[12px] text-[#86909C]">
                    {notification.createTime.toLocaleString('zh-CN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast 提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 text-white px-6 py-3 rounded-xl z-50">
          {toastMessage}
        </div>
      )}

      <TabBar />
    </div>
  );
}
