import { useState } from 'react';
import { Filter, Bell, Plus, ChevronRight, MapPin, Mic, FileText } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../components/TabBar';

export default function TaskList() {
  const navigate = useNavigate();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [selectedDate, setSelectedDate] = useState(6);
  const [unreadCount] = useState(3);

  const [filters, setFilters] = useState({
    perspective: 'all',
    status: 'all',
    type: 'all'
  });

  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 7 + i);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      isToday: i === 7
    };
  });

  const tasks = [
    {
      id: 1,
      title: '中海汇德里探盘任务',
      type: '探盘',
      initiator: '张经理',
      deadline: '2026-04-19T18:00:00',
      status: 'in-progress',
      parallelTasks: {
        roadmap: {
          enabled: true,
          stages: [
            { name: '采集', status: 'completed' },
            { name: '文案', status: 'in-progress' },
            { name: '视频', status: 'pending' }
          ]
        },
        speech: {
          enabled: true,
          completed: 5,
          total: 10,
          status: 'in-progress'
        },
        audio: {
          enabled: true,
          uploaded: 3,
          total: 8,
          status: 'in-progress'
        }
      }
    },
    {
      id: 2,
      title: '绿地海湾探盘任务',
      type: '探盘',
      initiator: '李主管',
      deadline: '2026-04-21T12:00:00',
      status: 'not-started',
      parallelTasks: {
        roadmap: {
          enabled: true,
          stages: [
            { name: '采集', status: 'pending' },
            { name: '文案', status: 'pending' },
            { name: '视频', status: 'pending' }
          ]
        },
        speech: {
          enabled: true,
          completed: 0,
          total: 12,
          status: 'not-started'
        },
        audio: {
          enabled: false
        }
      }
    },
    {
      id: 3,
      title: '保利天悦综合任务',
      type: '综合',
      initiator: '王总监',
      deadline: '2026-04-19T10:00:00',
      status: 'overtime',
      parallelTasks: {
        roadmap: {
          enabled: true,
          stages: [
            { name: '采集', status: 'completed' },
            { name: '文案', status: 'completed' },
            { name: '视频', status: 'pending' }
          ]
        },
        speech: {
          enabled: true,
          completed: 8,
          total: 10,
          status: 'in-progress'
        },
        audio: {
          enabled: true,
          uploaded: 10,
          total: 10,
          status: 'completed'
        }
      }
    },
    {
      id: 4,
      title: '万科公园城市探盘任务',
      type: '探盘',
      initiator: '陈经理',
      deadline: '2026-04-19T16:00:00',
      status: 'completed',
      parallelTasks: {
        roadmap: {
          enabled: true,
          stages: [
            { name: '采集', status: 'completed' },
            { name: '文案', status: 'completed' },
            { name: '视频', status: 'completed' }
          ]
        },
        speech: {
          enabled: true,
          completed: 15,
          total: 15,
          status: 'completed'
        },
        audio: {
          enabled: false
        }
      }
    },
    {
      id: 5,
      title: '龙湖天街录音分析',
      type: '录音分析',
      initiator: '刘主管',
      deadline: '2026-04-18T14:00:00',
      status: 'stopped',
      parallelTasks: {
        roadmap: {
          enabled: false
        },
        speech: {
          enabled: false
        },
        audio: {
          enabled: true,
          uploaded: 4,
          total: 6,
          status: 'stopped'
        }
      }
    }
  ];

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
      time: '10分钟前',
      isRead: false
    },
    {
      id: 3,
      type: 'system',
      title: '系统通知',
      content: '系统将于今晚22:00进行维护',
      time: '1小时前',
      isRead: true
    }
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-started':
        return { text: '待开始', color: 'text-[#86909C]', bg: 'bg-[#F7F8FA]' };
      case 'in-progress':
        return { text: '进行中', color: 'text-[#FA8C16]', bg: 'bg-[#FFF7E6]' };
      case 'completed':
        return { text: '已完成', color: 'text-[#00B42A]', bg: 'bg-[#E8F5E9]' };
      case 'overtime':
        return { text: '已超时', color: 'text-[#FA5151]', bg: 'bg-[#FFECE8]' };
      case 'stopped':
        return { text: '已停止', color: 'text-[#4E5969]', bg: 'bg-[#E5E6EB]' };
      default:
        return { text: '未知', color: 'text-[#86909C]', bg: 'bg-[#F7F8FA]' };
    }
  };

  const getStageStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-[#00B42A]';
      case 'in-progress':
        return 'text-[#FA8C16]';
      case 'pending':
        return 'text-[#86909C]';
      default:
        return 'text-[#86909C]';
    }
  };

  const calculateTimeRemaining = (deadline: string) => {
    const now = new Date('2026-04-19T14:30:00'); // 当前时间
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

  const calculateTaskProgress = (parallelTasks: any) => {
    let totalTasks = 0;
    let completedTasks = 0;

    // 探盘路书
    if (parallelTasks.roadmap?.enabled) {
      totalTasks++;
      const stages = parallelTasks.roadmap.stages;
      const allStagesCompleted = stages.every((s: any) => s.status === 'completed');
      if (allStagesCompleted) {
        completedTasks++;
      }
    }

    // 话术训练
    if (parallelTasks.speech?.enabled) {
      totalTasks++;
      if (parallelTasks.speech.completed === parallelTasks.speech.total) {
        completedTasks++;
      }
    }

    // 录音分析
    if (parallelTasks.audio?.enabled) {
      totalTasks++;
      if (parallelTasks.audio.uploaded === parallelTasks.audio.total) {
        completedTasks++;
      }
    }

    return { completed: completedTasks, total: totalTasks };
  };

  const getSubTaskStatusInfo = (status: string) => {
    switch (status) {
      case 'not-started':
        return { text: '待开始', color: 'text-[#86909C]' };
      case 'in-progress':
        return { text: '进行中', color: 'text-[#FA8C16]' };
      case 'completed':
        return { text: '已完成', color: 'text-[#00B42A]' };
      case 'stopped':
        return { text: '已停止', color: 'text-[#4E5969]' };
      default:
        return { text: '', color: 'text-[#86909C]' };
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* 顶部导航栏 */}
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

      {/* 主内容区 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 左侧日期列表 */}
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
              const progressPercentage = progressInfo.total > 0 ? Math.round((progressInfo.completed / progressInfo.total) * 100) : 0;
              const deadlineDate = new Date(task.deadline);
              const formattedDeadline = `${deadlineDate.getMonth() + 1}月${deadlineDate.getDate()}日 ${String(deadlineDate.getHours()).padStart(2, '0')}:${String(deadlineDate.getMinutes()).padStart(2, '0')}截止`;

              return (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded-2xl shadow-sm"
                >
                  {/* 任务头部信息 */}
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

                  {/* 总状态和总进度 */}
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

                  {/* 并行任务列表（带状态） */}
                  <div className="space-y-2">
                    {/* 探盘路书 */}
                    {task.parallelTasks.roadmap?.enabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tasks/${task.id}/execute`);
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

                    {/* 话术训练 */}
                    {task.parallelTasks.speech?.enabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tasks/${task.id}/speech`);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-[#E8F3FF] rounded-lg hover:bg-[#BEDAFF] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-[#165DFF]" />
                          <span className="text-[13px] font-semibold text-[#1D2129]">话术训练</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#1D2129]">
                            {task.parallelTasks.speech.completed}/{task.parallelTasks.speech.total}
                          </span>
                          <span className={`text-[12px] ${getSubTaskStatusInfo(task.parallelTasks.speech.status).color}`}>
                            {getSubTaskStatusInfo(task.parallelTasks.speech.status).text}
                          </span>
                        </div>
                      </button>
                    )}

                    {/* 录音分析 */}
                    {task.parallelTasks.audio?.enabled && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/tasks/${task.id}/audio`);
                        }}
                        className="w-full flex items-center justify-between p-3 bg-[#E8F5E9] rounded-lg hover:bg-[#AFF0B5] transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4 text-[#00B42A]" />
                          <span className="text-[13px] font-semibold text-[#1D2129]">录音分析</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#1D2129]">
                            {task.parallelTasks.audio.uploaded}/{task.parallelTasks.audio.total}
                          </span>
                          <span className={`text-[12px] ${getSubTaskStatusInfo(task.parallelTasks.audio.status).color}`}>
                            {getSubTaskStatusInfo(task.parallelTasks.audio.status).text}
                          </span>
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

      {/* 悬浮创建按钮 */}
      <button
        onClick={() => navigate('/create')}
        className="fixed bottom-20 right-6 w-14 h-14 bg-gradient-to-br from-[#FA8C16] to-[#F76560] rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-40"
      >
        <Plus className="w-6 h-6 text-white" />
      </button>

      {/* 底部TabBar */}
      <TabBar />

      {/* 筛选弹窗 */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowFilterModal(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[17px] font-semibold text-[#1D2129] mb-4">筛选条件</h2>

            <div className="space-y-4">
              <div>
                <label className="text-[14px] text-[#4E5969] mb-2 block">视角</label>
                <div className="flex gap-2 flex-wrap">
                  {['全部', '我收到的', '我下发的'].map((item) => (
                    <button
                      key={item}
                      className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                        filters.perspective === item
                          ? 'bg-[#FA8C16] text-white'
                          : 'bg-[#F7F8FA] text-[#4E5969]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[14px] text-[#4E5969] mb-2 block">状态</label>
                <div className="flex gap-2 flex-wrap">
                  {['全部', '待执行', '进行中', '已完成', '已超时', '已停止'].map((item) => (
                    <button
                      key={item}
                      className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                        filters.status === item
                          ? 'bg-[#FA8C16] text-white'
                          : 'bg-[#F7F8FA] text-[#4E5969]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[14px] text-[#4E5969] mb-2 block">类型</label>
                <div className="flex gap-2 flex-wrap">
                  {['全部', '探盘任务', '话术训练', '录音分析', '文案生成'].map((item) => (
                    <button
                      key={item}
                      className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                        filters.type === item
                          ? 'bg-[#FA8C16] text-white'
                          : 'bg-[#F7F8FA] text-[#4E5969]'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 py-3 bg-[#F7F8FA] text-[#4E5969] rounded-full text-[15px] font-semibold">
                重置
              </button>
              <button
                onClick={() => setShowFilterModal(false)}
                className="flex-1 py-3 bg-[#FA8C16] text-white rounded-full text-[15px] font-semibold"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通知面板 */}
      {showNotificationPanel && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={() => setShowNotificationPanel(false)}>
          <div className="w-full bg-white rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-[17px] font-semibold text-[#1D2129] mb-4">通知</h2>

            <div className="flex gap-4 mb-4 border-b border-[#E5E6EB]">
              {['全部', '任务', '新盘', '系统'].map((tab) => (
                <button
                  key={tab}
                  className="pb-2 text-[14px] border-b-2 border-transparent text-[#FA8C16] font-semibold"
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-2xl transition-colors ${
                    notification.isRead ? 'bg-white' : 'bg-[#FFF7E6]'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-[14px] font-semibold text-[#1D2129]">
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-[#FA5151] rounded-full flex-shrink-0 mt-1.5" />
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
    </div>
  );
}
