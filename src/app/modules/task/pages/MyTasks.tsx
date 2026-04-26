import { useState } from 'react';
import { ArrowLeft, Plus, Search, Filter, ChevronRight, Edit3, StopCircle, Trash2, Eye, X, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../components/TabBar';

interface Task {
  id: number;
  title: string;
  type: string;
  createTime: string;
  deadline: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'draft' | 'stopped' | 'expired' | 'rejected';
  executors: number;
  completed: number;
  rejectedCount?: number;
}

type StatusFilter = 'all' | 'draft' | 'not-started' | 'in-progress' | 'completed' | 'expired' | 'stopped';

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: '全部' },
  { value: 'draft', label: '草稿' },
  { value: 'not-started', label: '待开始' },
  { value: 'in-progress', label: '进行中' },
  { value: 'completed', label: '已完成' },
  { value: 'expired', label: '已超时' },
  { value: 'stopped', label: '已停止' },
];

export default function MyTasks() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed'>('all');
  const [deleteConfirmTask, setDeleteConfirmTask] = useState<Task | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([
    {
      id: 1,
      title: '中海汇德里探盘任务',
      type: '探盘',
      createTime: '2026-04-16 10:00',
      deadline: '2026-04-19T18:00:00',
      status: 'in-progress',
      executors: 3,
      completed: 1,
      rejectedCount: 1
    },
    {
      id: 2,
      title: '绿地海湾探盘任务',
      type: '探盘',
      createTime: '2026-04-17 09:00',
      deadline: '2026-04-21T12:00:00',
      status: 'not-started',
      executors: 2,
      completed: 0
    },
    {
      id: 3,
      title: '保利天悦话术训练',
      type: '话术训练',
      createTime: '2026-04-15 14:00',
      deadline: '2026-04-18T15:00:00',
      status: 'completed',
      executors: 5,
      completed: 5
    },
    {
      id: 4,
      title: '万科城营销方案',
      type: '文案',
      createTime: '2026-04-20 11:00',
      deadline: '2026-04-25T18:00:00',
      status: 'draft',
      executors: 1,
      completed: 0
    },
    {
      id: 5,
      title: '融创文旅城推广任务',
      type: '推广',
      createTime: '2026-04-10 08:00',
      deadline: '2026-04-15T18:00:00',
      status: 'stopped',
      executors: 4,
      completed: 2,
      rejectedCount: 2
    },
    {
      id: 6,
      title: '龙湖天街招商任务',
      type: '招商',
      createTime: '2026-04-05 10:00',
      deadline: '2026-04-10T18:00:00',
      status: 'expired',
      executors: 3,
      completed: 1
    }
  ]);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'not-started':
        return { text: '待开始', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]' };
      case 'in-progress':
        return { text: '进行中', bg: 'bg-[#FFF7E6]', color: 'text-[#FA8C16]' };
      case 'completed':
        return { text: '已完成', bg: 'bg-[#E8F5E9]', color: 'text-[#00B42A]' };
      case 'draft':
        return { text: '草稿', bg: 'bg-[#F0F5FF]', color: 'text-[#4E80FE]' };
      case 'stopped':
        return { text: '已停止', bg: 'bg-[#FFF1F0]', color: 'text-[#FF4D4F]' };
      case 'expired':
        return { text: '已超时', bg: 'bg-[#FFF7E6]', color: 'text-[#FA8C16]' };
      case 'rejected':
        return { text: '已拒绝', bg: 'bg-[#FFF1F0]', color: 'text-[#FF4D4F]' };
      default:
        return { text: '未知', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]' };
    }
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  const getRemainingTime = (deadline: string) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diff = deadlineDate.getTime() - now.getTime();
    
    if (diff < 0) {
      const hours = Math.floor(Math.abs(diff) / (1000 * 60 * 60));
      return `已超时${hours}小时`;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) {
      return `${days}天${hours}小时`;
    } else if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    } else {
      return `${minutes}分钟`;
    }
  };

  const canEdit = (status: string) => ['draft', 'stopped'].includes(status);
  const canStop = (status: string) => status === 'in-progress';
  const canDelete = (status: string) => ['draft', 'stopped'].includes(status);

  const handleDelete = (task: Task) => {
    setTaskList(prev => prev.filter(t => t.id !== task.id));
    setDeleteConfirmTask(null);
  };

  const handleFilter = () => {
    setShowFilterModal(false);
  };

  const handleReset = () => {
    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setShowFilterModal(false);
  };

  const filteredTasks = taskList.filter((task) => {
    if (activeTab === 'ongoing' && task.status !== 'in-progress') return false;
    if (activeTab === 'completed' && task.status !== 'completed') return false;
    if (statusFilter !== 'all' && task.status !== statusFilter) return false;
    if (startDate) {
      const taskStartDate = new Date(task.createTime.replace(' ', 'T'));
      const filterStartDate = new Date(startDate);
      if (taskStartDate < filterStartDate) return false;
    }
    if (endDate) {
      const taskDeadline = new Date(task.deadline);
      const filterEndDate = new Date(endDate);
      filterEndDate.setDate(filterEndDate.getDate() + 1);
      if (taskDeadline > filterEndDate) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1D2129]" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#1D2129]">我创建的任务</h1>
        <button
          onClick={() => navigate('/create')}
          className="p-2 -mr-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 text-[#FA8C16]" />
        </button>
      </header>

      {/* 搜索和筛选 */}
      <div className="bg-white px-4 py-3 border-b border-[#E5E6EB]">
        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#F7F8FA] rounded-lg">
            <Search className="w-4 h-4 text-[#86909C]" />
            <input
              type="text"
              placeholder="搜索任务"
              className="flex-1 bg-transparent text-[14px] outline-none placeholder:text-[#86909C]"
            />
          </div>
          <button
            onClick={() => setShowFilterModal(true)}
            className="w-10 h-10 flex items-center justify-center bg-[#F7F8FA] rounded-lg hover:bg-[#E5E6EB] transition-colors"
          >
            <Filter className="w-4 h-4 text-[#86909C]" />
          </button>
        </div>
      </div>

      {/* 任务列表 */}
      <div className="p-4 space-y-3">
        {filteredTasks.map((task) => {
          const statusInfo = getStatusInfo(task.status);
          return (
            <div
              key={task.id}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-[15px] font-semibold text-[#1D2129]">{task.title}</h3>
                    <span className="px-2 py-0.5 bg-[#E8F3FF] text-[#165DFF] text-[11px] rounded-full">
                      {task.type}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#86909C]">创建时间：{task.createTime}</div>
                </div>
                <span className={`px-2 py-0.5 ${statusInfo.bg} ${statusInfo.color} text-[12px] rounded whitespace-nowrap`}>
                  {statusInfo.text}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3 text-[12px]">
                <div className="flex items-center gap-1 text-[#86909C]">
                  <span>结束时间：</span>
                  <span className="text-[#1D2129]">{formatDeadline(task.deadline)}</span>
                </div>
                <div className="flex items-center gap-1 text-[#86909C]">
                  <span>剩余时间：</span>
                  <span className={new Date(task.deadline) < new Date() ? 'text-[#FF4D4F]' : 'text-[#FA8C16]'}>
                    {getRemainingTime(task.deadline)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#86909C]">
                  <span>执行人：</span>
                  <span className="text-[#1D2129]">{task.executors}人</span>
                </div>
                <div className="flex items-center gap-1 text-[#86909C]">
                  <span>完成情况：</span>
                  <span className={task.completed === task.executors ? 'text-[#00B42A]' : 'text-[#FA8C16]'}>
                    {task.completed}/{task.executors}
                  </span>
                </div>
                {task.rejectedCount && task.rejectedCount > 0 && (
                  <div className="flex items-center gap-1 text-[#86909C]">
                    <span>拒绝人数：</span>
                    <span className="text-[#FF4D4F]">{task.rejectedCount}人</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E5E6EB]">
                <div className="flex gap-2">
                  {canEdit(task.status) && (
                    <button
                      onClick={() => navigate(`/tasks/${task.id}/edit`)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#F7F8FA] text-[#1D2129] text-[12px] rounded-lg hover:bg-[#E5E6EB] transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      编辑
                    </button>
                  )}
                  {canStop(task.status) && (
                    <button
                      onClick={() => {}}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#FFF1F0] text-[#FF4D4F] text-[12px] rounded-lg hover:bg-[#FFCCC7] transition-colors"
                    >
                      <StopCircle className="w-4 h-4" />
                      停止
                    </button>
                  )}
                  {canDelete(task.status) && (
                    <button
                      onClick={() => setDeleteConfirmTask(task)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-[#FFF1F0] text-[#FF4D4F] text-[12px] rounded-lg hover:bg-[#FFCCC7] transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      删除
                    </button>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-[#FA8C16] text-white text-[12px] rounded-lg hover:bg-[#E57B0C] transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  详情
                </button>
              </div>
            </div>
          );
        })}

        {filteredTasks.length === 0 && (
          <div className="text-center py-20">
            <div className="text-[#86909C] text-[14px]">暂无任务</div>
          </div>
        )}
      </div>

      {/* 删除确认弹窗 */}
      {deleteConfirmTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-5 w-full max-w-sm">
            <div className="text-[16px] font-medium text-[#1D2129] mb-2">确认删除</div>
            <div className="text-[14px] text-[#86909C] mb-4">
              删除操作不可逆，请您确认是否要删除【{deleteConfirmTask.title}】？
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmTask(null)}
                className="flex-1 py-2 bg-[#F7F8FA] text-[#1D2129] text-[14px] rounded-lg hover:bg-[#E5E6EB] transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmTask)}
                className="flex-1 py-2 bg-[#FF4D4F] text-white text-[14px] rounded-lg hover:bg-[#E53935] transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 筛选弹窗 */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowFilterModal(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[70vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between z-10">
              <h3 className="text-[16px] font-semibold text-[#1D2129]">筛选</h3>
              <button
                onClick={() => setShowFilterModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-[#86909C]" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* 类型筛选 */}
              <div>
                <div className="text-[14px] font-medium text-[#1D2129] mb-3">类型</div>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setStatusFilter(option.value)}
                      className={`px-4 py-2 text-[13px] rounded-lg transition-colors ${
                        statusFilter === option.value
                          ? 'bg-[#FA8C16] text-white'
                          : 'bg-[#F7F8FA] text-[#86909C] hover:bg-[#E5E6EB]'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 时间筛选 */}
              <div>
                <div className="text-[14px] font-medium text-[#1D2129] mb-3">时间</div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" />
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      placeholder="开始时间"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#F7F8FA] text-[14px] rounded-lg outline-none focus:ring-2 focus:ring-[#FA8C16]"
                    />
                  </div>
                  <span className="text-[#86909C] text-[14px]">~</span>
                  <div className="flex-1 relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      placeholder="结束时间"
                      className="w-full pl-10 pr-3 py-2.5 bg-[#F7F8FA] text-[14px] rounded-lg outline-none focus:ring-2 focus:ring-[#FA8C16]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 底部按钮 */}
            <div className="sticky bottom-0 bg-white border-t border-[#E5E6EB] px-4 py-3 flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 py-2.5 bg-[#F7F8FA] text-[#1D2129] text-[14px] rounded-lg hover:bg-[#E5E6EB] transition-colors"
              >
                重置
              </button>
              <button
                onClick={handleFilter}
                className="flex-1 py-2.5 bg-[#FA8C16] text-white text-[14px] rounded-lg hover:bg-[#E57B0C] transition-colors"
              >
                筛选
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 底部TabBar */}
      {/* <TabBar /> */}
    </div>
  );
}