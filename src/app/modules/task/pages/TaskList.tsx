/**
 * @module task/pages/TaskList
 * @description 任务列表页面
 * 
 * 本文件实现任务列表的展示和交互功能，包括：
 * - 任务列表展示（按日期分组）
 * - 任务状态显示（待开始、进行中、已完成等）
 * - 并行任务进度展示（探盘路书、话术训练、录音分析）
 * - 筛选和通知功能
 * - 任务点击跳转详情
 * 
 * 使用自定义 Hooks 封装业务逻辑，保持组件简洁
 */

import { useState } from 'react';
import { Filter, Bell, ChevronRight, MapPin, Mic, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../../../components/TabBar';
import { useTaskList, useTaskNavigation } from '../hooks/useTasks';
import { Task } from '../types';

// 状态标签配置
const STATUS_CONFIG = {
  'not-started': { text: '待开始', color: 'text-[#86909C]', bg: 'bg-[#F7F8FA]' },
  'in-progress': { text: '进行中', color: 'text-[#FA8C16]', bg: 'bg-[#FFF7E6]' },
  'completed': { text: '已完成', color: 'text-[#00B42A]', bg: 'bg-[#E8F5E9]' },
  'overtime': { text: '已超时', color: 'text-[#FA5151]', bg: 'bg-[#FFECE8]' },
  'stopped': { text: '已停止', color: 'text-[#4E5969]', bg: 'bg-[#E5E6EB]' },
  'rejected': { text: '已拒绝', color: 'text-[#FF4D4F]', bg: 'bg-[#FFF1F0]' }
} as const;

// 阶段状态颜色配置
const STAGE_STATUS_COLOR = {
  'completed': 'text-[#00B42A]',
  'in-progress': 'text-[#FA8C16]',
  'pending': 'text-[#86909C]'
} as const;

export default function TaskList() {
  const navigate = useNavigate();
  const { tasks } = useTaskList();
  const { goToDetail, goToExecute, goToSpeech, goToAudio } = useTaskNavigation();
  
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [selectedDate, setSelectedDate] = useState(6);
  const [unreadCount] = useState(3);
  const [filters, setFilters] = useState({
    status: ['all'],
    type: ['all'],
    source: ['all']
  });

  // 生成日期数组
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 7 + i);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      isToday: i === 7
    };
  });

  // 通知数据
  const notifications = [
    {
      id: 1,
      type: 'task',
      title: '新任务分配',
      content: '你收到了一个新的探盘任务：中海汇德里',
      time: '刚刚',
      isRead: false
    },
    {
      id: 2,
      type: 'property',
      title: '新盘上线',
      content: '绿地海湾已上线，快去了解吧',
      time: '10 分钟前',
      isRead: false
    },
    {
      id: 3,
      type: 'system',
      title: '系统通知',
      content: '系统将于今晚 22:00 进行维护',
      time: '1 小时前',
      isRead: true
    }
  ];

  // 切换筛选条件
  const toggleFilter = (category: 'status' | 'type' | 'source', value: string) => {
    setFilters(prev => {
      const current = prev[category];
      if (value === 'all') {
        return { ...prev, [category]: ['all'] };
      }
      if (current.includes('all')) {
        return { ...prev, [category]: [value] };
      }
      if (current.includes(value)) {
        const newValues = current.filter(v => v !== value);
        return { ...prev, [category]: newValues.length === 0 ? ['all'] : newValues };
      }
      return { ...prev, [category]: [...current, value] };
    });
  };

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || 
           { text: '未知', color: 'text-[#86909C]', bg: 'bg-[#F7F8FA]' };
  };

  // 获取阶段状态颜色
  const getStageStatus = (status: string) => {
    return STAGE_STATUS_COLOR[status as keyof typeof STAGE_STATUS_COLOR] || 'text-[#86909C]';
  };

  // 计算剩余时间
  const calculateTimeRemaining = (deadline: string) => {
    const now = new Date('2026-04-19T14:30:00');
    const deadlineDate = new Date(deadline);
    const diffMs = deadlineDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffMs < 0) {
      const overdueDays = Math.abs(diffDays);
      const overdueHours = Math.abs(diffHours) % 24;
      return {
        text: overdueDays > 0 ? `已超时${overdueDays}天` : `已超时${overdueHours}小时`,
        color: 'text-[#FA5151]'
      };
    } else if (diffHours < 24) {
      return {
        text: `剩余${diffHours}小时`,
        color: 'text-[#FA8C16]'
      };
    } else {
      return {
        text: `剩余${diffDays}天`,
        color: 'text-[#4E5969]'
      };
    }
  };

  // 计算任务进度
  const calculateTaskProgress = (parallelTasks: any) => {
    let totalTasks = 0;
    let completedTasks = 0;

    if (parallelTasks.roadmap?.enabled) {
      totalTasks++;
      const stages = parallelTasks.roadmap.stages;
      const allStagesCompleted = stages.every((s: any) => s.status === 'completed');
      if (allStagesCompleted) {
        completedTasks++;
      }
    }

    if (parallelTasks.speech?.enabled) {
      totalTasks++;
      if (parallelTasks.speech.completed === parallelTasks.speech.total) {
        completedTasks++;
      }
    }

    if (parallelTasks.audio?.enabled) {
      totalTasks++;
      if (parallelTasks.audio.uploaded === parallelTasks.audio.total) {
        completedTasks++;
      }
    }

    return { completed: completedTasks, total: totalTasks };
  };

  // 处理任务点击
  const handleTaskClick = (task: Task) => {
    if (task.status === 'not-started') {
      // 可以在这里添加状态更新逻辑
    }
    goToDetail(task.id);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-[17px] font-semibold text-[#1D2129]">任务中心</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilterModal(true)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Filter className="w-5 h-5 text-[#1D2129]" />
          </button>
          <button
            onClick={() => setShowNotificationPanel(true)}
            className="p-2 hover:bg-gray-50 rounded-lg transition-colors relative"
          >
            <Bell className="w-5 h-5 text-[#1D2129]" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#FA5151] rounded-full" />
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* 左侧日期栏 */}
        <div className="w-20 bg-white border-r border-[#E5E6EB] overflow-y-auto">
          {dates.map((date, index) => (
            <button
              key={index}
              onClick={() => setSelectedDate(index)}
              className={`w-full py-4 flex flex-col items-center border-b border-[#E5E6EB] transition-colors ${
                selectedDate === index
                  ? 'bg-[#FFF7E6]'
                  : 'hover:bg-[#F7F8FA]'
              }`}
            >
              <span className={`text-[12px] mb-1 ${
                date.isToday ? 'text-[#FA8C16]' : 'text-[#86909C]'
              }`}>
                {date.month}月
              </span>
              <span className={`text-[20px] font-semibold ${
                selectedDate === index
                  ? 'text-[#FA8C16]'
                  : date.isToday
                  ? 'text-[#1D2129]'
                  : 'text-[#4E5969]'
              }`}>
                {date.day}
              </span>
              {date.isToday && (
                <span className="text-[10px] text-[#FA8C16] mt-1">今天</span>
              )}
            </button>
          ))}
        </div>

        {/* 右侧任务列表 */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {tasks.map((task) => {
              const statusInfo = getStatusLabel(task.status);
              const timeInfo = calculateTimeRemaining(task.deadline);
              const progressInfo = calculateTaskProgress(task.parallelTasks);
              const progressPercentage = progressInfo.total > 0 
                ? Math.round((progressInfo.completed / progressInfo.total) * 100) 
                : 0;
              const deadlineDate = new Date(task.deadline);
              const formattedDeadline = `${deadlineDate.getMonth() + 1}月${deadlineDate.getDate()}日 ${String(deadlineDate.getHours()).padStart(2, '0')}:${String(deadlineDate.getMinutes()).padStart(2, '0')}截止`;

              return (
                <div
                  key={task.id}
                  onClick={() => handleTaskClick(task)}
                  className={`bg-white p-4 rounded-2xl shadow-sm cursor-pointer transition-all hover:shadow-md ${
                    task.status === 'not-started' ? 'hover:ring-2 hover:ring-[#FA8C16]/30' : ''
                  }`}
                >
                  {/* 任务基本信息 */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-[15px] font-semibold text-[#1D2129]">
                          {task.title}
                        </h3>
                        <span className="px-2 py-0.5 bg-[#E8F3FF] text-[#165DFF] text-[11px] rounded-full">
                          {task.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[13px] text-[#86909C] mb-2">
                        <span>发起人：{task.initiator}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#86909C] flex-shrink-0" />
                  </div>

                  {/* 截止时间和剩余时间 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] text-[#86909C]">{formattedDeadline}</span>
                    <span className={`text-[13px] font-semibold ${timeInfo.color}`}>
                      {timeInfo.text}
                    </span>
                  </div>

                  {/* 状态和进度条 */}
                  <div className="mb-3 pb-3 border-b border-[#E5E6EB]">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-0.5 ${statusInfo.bg} ${statusInfo.color} text-[12px] rounded-full`}>
                        {statusInfo.text}
                      </span>
                      <span className="text-[13px] font-semibold text-[#1D2129]">
                        {progressInfo.completed}/{progressInfo.total} ({progressPercentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#F7F8FA] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FA8C16] rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* 并行任务按钮 */}
                  <div className="space-y-2">
                    {task.parallelTasks?.roadmap?.enabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToExecute(task.id);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-[#FFF7E6] rounded-lg hover:bg-[#FFE7BA] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#FA8C16]" />
                          <span className="text-[13px] font-semibold text-[#1D2129]">探盘路书</span>
                        </div>
                        <div className="flex items-center gap-2 text-[12px]">
                          {task.parallelTasks.roadmap.stages.map((stage: any, index: number) => (
                            <span key={index}>
                              <span className={getStageStatus(stage.status)}>
                                {stage.name}
                              </span>
                              {index < task.parallelTasks.roadmap.stages.length - 1 && (
                                <span className="text-[#E5E6EB] mx-1">/</span>
                              )}
                            </span>
                          ))}
                        </div>
                      </button>
                    )}

                    {task.parallelTasks?.speech?.enabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToSpeech(task.id);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-[#E8F3FF] rounded-lg hover:bg-[#D0E9FF] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4 text-[#165DFF]" />
                          <span className="text-[13px] font-semibold text-[#1D2129]">话术训练</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#165DFF]">
                            {task.parallelTasks.speech.completed}/{task.parallelTasks.speech.total}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#165DFF]" />
                        </div>
                      </button>
                    )}

                    {task.parallelTasks?.audio?.enabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          goToAudio(task.id);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-[#E8F5E9] rounded-lg hover:bg-[#D4EDDA] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#00B42A]" />
                          <span className="text-[13px] font-semibold text-[#1D2129]">录音分析</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#00B42A]">
                            {task.parallelTasks.audio.uploaded}/{task.parallelTasks.audio.total}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#00B42A]" />
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 筛选弹窗 */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b border-[#E5E6EB] flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-[16px] font-semibold text-[#1D2129]">筛选条件</h2>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-2 hover:bg-gray-50 rounded-lg"
              >
                <ChevronRight className="w-5 h-5 rotate-90 text-[#86909C]" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* 任务状态筛选 */}
              <div>
                <h3 className="text-[14px] font-medium text-[#1D2129] mb-3">任务状态</h3>
                <div className="flex flex-wrap gap-2">
                  {['all', 'not-started', 'in-progress', 'completed', 'overtime'].map(status => (
                    <button
                      key={status}
                      onClick={() => toggleFilter('status', status)}
                      className={`px-3 py-1.5 rounded-full text-[13px] transition-colors ${
                        filters.status.includes(status)
                          ? 'bg-[#165DFF] text-white'
                          : 'bg-[#F7F8FA] text-[#4E5969] hover:bg-[#E5E6EB]'
                      }`}
                    >
                      {status === 'all' ? '全部' : getStatusLabel(status).text}
                    </button>
                  ))}
                </div>
              </div>

              {/* 任务类型筛选 */}
              <div>
                <h3 className="text-[14px] font-medium text-[#1D2129] mb-3">任务类型</h3>
                <div className="flex flex-wrap gap-2">
                  {['all', '探盘', '话术训练', '录音分析'].map(type => (
                    <button
                      key={type}
                      onClick={() => toggleFilter('type', type)}
                      className={`px-3 py-1.5 rounded-full text-[13px] transition-colors ${
                        filters.type.includes(type)
                          ? 'bg-[#165DFF] text-white'
                          : 'bg-[#F7F8FA] text-[#4E5969] hover:bg-[#E5E6EB]'
                      }`}
                    >
                      {type === 'all' ? '全部' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 任务来源筛选 */}
              <div>
                <h3 className="text-[14px] font-medium text-[#1D2129] mb-3">任务来源</h3>
                <div className="flex flex-wrap gap-2">
                  {['all', '自主创建', '上级分配', '系统推荐'].map(source => (
                    <button
                      key={source}
                      onClick={() => toggleFilter('source', source)}
                      className={`px-3 py-1.5 rounded-full text-[13px] transition-colors ${
                        filters.source.includes(source)
                          ? 'bg-[#165DFF] text-white'
                          : 'bg-[#F7F8FA] text-[#4E5969] hover:bg-[#E5E6EB]'
                      }`}
                    >
                      {source === 'all' ? '全部' : source}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5E6EB] sticky bottom-0 bg-white">
              <button
                onClick={() => setShowFilterModal(false)}
                className="w-full bg-[#165DFF] text-white py-3 rounded-xl font-medium hover:bg-[#0E4FD1] transition-colors"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

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
                <ChevronRight className="w-5 h-5 rotate-90 text-[#86909C]" />
              </button>
            </div>

            <div className="divide-y divide-[#E5E6EB]">
              {notifications.map(notification => (
                <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-[14px] font-medium text-[#1D2129]">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-[#FA5151] rounded-full" />
                    )}
                  </div>
                  <p className="text-[13px] text-[#4E5969] mb-2">{notification.content}</p>
                  <span className="text-[12px] text-[#86909C]">{notification.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}
