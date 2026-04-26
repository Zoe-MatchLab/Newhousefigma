import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Check, ChevronDown, Bell, Search, X, Building2, Calendar, Users, AlertCircle, MessageSquare } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import TabBar from '../../../components/TabBar';

type ExecutorStatus = 'all' | 'pending' | 'in-progress' | 'completed' | 'expired' | 'rejected';

interface Stage {
  id: string;
  name: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'pending';
}

interface SubTask {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress?: number;
}

interface ExecutorSubTask {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress: { completed: number; total: number };
  children?: Array<{
    name: string;
    status: 'completed' | 'in-progress' | 'pending';
    progress?: number;
  }>;
}

interface Executor {
  id: string;
  name: string;
  avatar: string;
  status: ExecutorStatus;
  startTime?: string;
  completedTime?: string;
  progress: { completed: number; total: number };
  rejectReason?: string;
  subTasks: ExecutorSubTask[];
}

interface TaskDetailData {
  id: string;
  name: string;
  description: string;
  type: string;
  status: 'draft' | 'pending' | 'in-progress' | 'completed' | 'stopped' | 'expired';
  deadline: string;
  createTime: string;
  startTime: string;
  checkinPoints: Array<{ id: string; name: string; type: string[]; required: boolean }>;
  location: string;
  buildingInfo: {
    name: string;
    price: string;
    propertyType: string;
    developer: string;
    area: string;
    deliveryTime: string;
    address: string;
  };
  checkinConfig: {
    range: number;
  };
  speechTrainingConfig: {
    enabled: boolean;
    projects?: Array<{ name: string; trainingCount: number; scoreTarget: number }>;
  };
  audioAnalysisConfig: {
    enabled: boolean;
    dimensions?: string[];
  };
  executors: Executor[];
  notifiers: string[];
  remindConfig: {
    beforeStart: string;
    levels: Array<{ level: string; time: string; color: string }>;
  };
}

export default function TaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'config' | 'execute'>('config');
  const [expandedExecutors, setExpandedExecutors] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<ExecutorStatus>('all');
  const [searchName, setSearchName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showRejectModal, setShowRejectModal] = useState<Executor | null>(null);

  const taskData: TaskDetailData = {
    id: id || '1',
    name: '中海汇德里探盘任务',
    description: '对中海汇德里楼盘进行实地探盘，收集楼盘信息，生成推广文案和宣传素材。',
    type: '探盘',
    status: 'in-progress',
    deadline: '2026-04-19T18:00:00',
    createTime: '2026-04-16 10:00',
    startTime: '2026-04-16 00:00',
    location: '浦东新区张江高科技园区',
    checkinPoints: [
      { id: '1', name: '接待处', type: ['图片', '视频'], required: true },
      { id: '2', name: '沙盘区', type: ['图片', '视频', '音频'], required: true },
      { id: '3', name: '样板间A', type: ['图片', '视频'], required: true },
      { id: '4', name: '样板间B', type: ['图片', '视频'], required: false },
      { id: '5', name: '小区环境', type: ['图片'], required: false },
    ],
    buildingInfo: {
      name: '中海汇德里',
      price: '35000元/㎡',
      propertyType: '住宅',
      developer: '中海地产',
      area: '120-180㎡',
      deliveryTime: '2027年6月',
      address: '浦东新区张江高科技园区',
    },
    checkinConfig: {
      range: 200,
    },
    speechTrainingConfig: {
      enabled: true,
      projects: [
        { name: '产品介绍', trainingCount: 3, scoreTarget: 85 },
        { name: '价格谈判', trainingCount: 3, scoreTarget: 80 },
        { name: '异议处理', trainingCount: 2, scoreTarget: 85 },
        { name: '需求挖掘', trainingCount: 2, scoreTarget: 80 },
      ],
    },
    audioAnalysisConfig: {
      enabled: true,
      dimensions: ['话术规范', '情绪识别', '关键词覆盖', '邀约意向'],
    },
    executors: [
      {
        id: '1',
        name: '张三',
        avatar: '张',
        status: 'in-progress',
        startTime: '2026-04-16 10:30',
        progress: { completed: 1, total: 3 },
        subTasks: [
          {
            name: '探盘路书',
            status: 'in-progress',
            progress: { completed: 1, total: 3 },
            children: [
              { name: '点位资料收集', status: 'completed', progress: 100 },
              { name: '文案生成', status: 'in-progress', progress: 60 },
              { name: '图片视频生成', status: 'pending', progress: 0 },
            ],
          },
          {
            name: '话术训练',
            status: 'pending',
            progress: { completed: 0, total: 4 },
            children: [
              { name: '产品介绍', status: 'pending' },
              { name: '价格谈判', status: 'pending' },
              { name: '异议处理', status: 'pending' },
              { name: '需求挖掘', status: 'pending' },
            ],
          },
          {
            name: '录音分析',
            status: 'pending',
            progress: { completed: 0, total: 4 },
            children: [
              { name: '话术规范', status: 'pending' },
              { name: '情绪识别', status: 'pending' },
              { name: '关键词覆盖', status: 'pending' },
              { name: '邀约意向', status: 'pending' },
            ],
          },
        ],
      },
      {
        id: '2',
        name: '李四',
        avatar: '李',
        status: 'completed',
        startTime: '2026-04-15 09:00',
        completedTime: '2026-04-15 18:00',
        progress: { completed: 3, total: 3 },
        subTasks: [
          {
            name: '探盘路书',
            status: 'completed',
            progress: { completed: 3, total: 3 },
            children: [
              { name: '点位资料收集', status: 'completed', progress: 100 },
              { name: '文案生成', status: 'completed', progress: 100 },
              { name: '图片视频生成', status: 'completed', progress: 100 },
            ],
          },
          {
            name: '话术训练',
            status: 'completed',
            progress: { completed: 4, total: 4 },
            children: [
              { name: '产品介绍', status: 'completed' },
              { name: '价格谈判', status: 'completed' },
              { name: '异议处理', status: 'completed' },
              { name: '需求挖掘', status: 'completed' },
            ],
          },
          {
            name: '录音分析',
            status: 'completed',
            progress: { completed: 4, total: 4 },
            children: [
              { name: '话术规范', status: 'completed' },
              { name: '情绪识别', status: 'completed' },
              { name: '关键词覆盖', status: 'completed' },
              { name: '邀约意向', status: 'completed' },
            ],
          },
        ],
      },
      {
        id: '3',
        name: '王五',
        avatar: '王',
        status: 'pending',
        progress: { completed: 0, total: 1 },
        subTasks: [
          {
            name: '探盘路书',
            status: 'pending',
            progress: { completed: 0, total: 3 },
            children: [
              { name: '点位资料收集', status: 'pending' },
              { name: '文案生成', status: 'pending' },
              { name: '图片视频生成', status: 'pending' },
            ],
          },
        ],
      },
      {
        id: '4',
        name: '赵六',
        avatar: '赵',
        status: 'expired',
        startTime: '2026-04-14 10:00',
        progress: { completed: 1, total: 2 },
        subTasks: [
          {
            name: '探盘路书',
            status: 'completed',
            progress: { completed: 3, total: 3 },
            children: [
              { name: '点位资料收集', status: 'completed', progress: 100 },
              { name: '文案生成', status: 'completed', progress: 100 },
              { name: '图片视频生成', status: 'completed', progress: 100 },
            ],
          },
          {
            name: '话术训练',
            status: 'in-progress',
            progress: { completed: 2, total: 4 },
            children: [
              { name: '产品介绍', status: 'completed' },
              { name: '价格谈判', status: 'completed' },
              { name: '异议处理', status: 'pending' },
              { name: '需求挖掘', status: 'pending' },
            ],
          },
        ],
      },
      {
        id: '5',
        name: '钱七',
        avatar: '钱',
        status: 'rejected',
        rejectReason: '家中有事，无法参与本次探盘任务，请重新安排其他人。',
        progress: { completed: 0, total: 1 },
        subTasks: [],
      },
    ],
    notifiers: ['区域经理A', '销售总监B'],
    remindConfig: {
      beforeStart: '2小时',
      levels: [
        { level: '轻度', time: '48小时', color: 'bg-[#E8F5E9] text-[#00B42A]' },
        { level: '中度', time: '24小时', color: 'bg-[#FFF7E6] text-[#FA8C16]' },
        { level: '重度', time: '2小时', color: 'bg-[#FFECE8] text-[#FA5151]' },
      ],
    },
  };

  const isDraft = taskData.status === 'draft';

  const stages: Stage[] = [
    { id: '1', name: '点位资料收集', progress: 80, status: 'in-progress' },
    { id: '2', name: '文案生成', progress: 60, status: 'in-progress' },
    { id: '3', name: '图片视频生成', progress: 20, status: 'pending' },
  ];

  const totalExecutors = taskData.executors.length;
  const completedCount = taskData.executors.filter((e) => e.status === 'completed').length;
  const pendingCount = taskData.executors.filter((e) => e.status === 'pending').length;
  const inProgressCount = taskData.executors.filter((e) => e.status === 'in-progress').length;
  const expiredCount = taskData.executors.filter((e) => e.status === 'expired').length;
  const rejectedCount = taskData.executors.filter((e) => e.status === 'rejected').length;

  const statusOptions: Array<{ key: ExecutorStatus; label: string; count: number }> = [
    { key: 'all', label: '全部', count: totalExecutors },
    { key: 'pending', label: '待开始', count: pendingCount },
    { key: 'in-progress', label: '进行中', count: inProgressCount },
    { key: 'completed', label: '已完成', count: completedCount },
    { key: 'expired', label: '已超时', count: expiredCount },
    { key: 'rejected', label: '已拒绝', count: rejectedCount },
  ];

  const filteredExecutors = taskData.executors
    .filter((e) => (statusFilter === 'all' ? true : e.status === statusFilter))
    .filter((e) => (searchName === '' ? true : e.name.includes(searchName)));

  const toggleExecutor = (executorId: string) => {
    if (expandedExecutors.includes(executorId)) {
      setExpandedExecutors(expandedExecutors.filter((id) => id !== executorId));
    } else {
      setExpandedExecutors([...expandedExecutors, executorId]);
    }
  };

  const getExecutorStatusInfo = (status: ExecutorStatus) => {
    switch (status) {
      case 'pending':
        return { text: '待开始', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]', badgeBg: 'bg-gray-100', badgeColor: 'text-gray-500' };
      case 'in-progress':
        return { text: '进行中', bg: 'bg-[#FFF7E6]', color: 'text-[#FA8C16]', badgeBg: 'bg-orange-100', badgeColor: 'text-orange-500' };
      case 'completed':
        return { text: '已完成', bg: 'bg-[#E8F5E9]', color: 'text-[#00B42A]', badgeBg: 'bg-green-100', badgeColor: 'text-green-500' };
      case 'expired':
        return { text: '已超时', bg: 'bg-[#FFECE8]', color: 'text-[#FA5151]', badgeBg: 'bg-red-100', badgeColor: 'text-red-500' };
      case 'rejected':
        return { text: '已拒绝', bg: 'bg-[#FFF1F0]', color: 'text-[#FF4D4F]', badgeBg: 'bg-red-50', badgeColor: 'text-red-500' };
      default:
        return { text: '未知', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]', badgeBg: 'bg-gray-100', badgeColor: 'text-gray-500' };
    }
  };

  const getSubTaskStatusInfo = (status: string, progress?: number) => {
    switch (status) {
      case 'completed':
        return { text: '已完成', bg: 'bg-[#E8F5E9]', color: 'text-[#00B42A]' };
      case 'in-progress':
        return { text: `进行中 ${progress || 0}%`, bg: 'bg-[#FFF7E6]', color: 'text-[#FA8C16]' };
      case 'pending':
        return { text: '待执行', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]' };
      default:
        return { text: '未知', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]' };
    }
  };

  const showMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleUrge = () => {
    const uncompletedCount = taskData.executors.filter((e) => e.status !== 'completed').length;
    showMessage(`已向 ${uncompletedCount} 位未完成人员发送催办提醒`);
  };

  const handleCancelTask = (executor: Executor) => {
    showMessage(`已取消 ${executor.name} 的任务，已通知相关人员`);
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-br from-[#FA8C16] to-[#FF9500] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate('/')} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg active:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-[17px] font-semibold text-white">任务详情</h1>
        <div className="w-8" />
      </header>

      {/* 任务基本信息卡片 */}
      <div className="bg-white px-4 py-4 mt-2">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-[18px] font-bold text-[#1D2129] mb-2">{taskData.name}</h2>
            <p className="text-[13px] text-[#86909C] leading-relaxed">{taskData.description}</p>
          </div>
          <span className={`px-2 py-1 rounded text-[12px] font-medium ${getExecutorStatusInfo(taskData.status as ExecutorStatus).bg} ${getExecutorStatusInfo(taskData.status as ExecutorStatus).color}`}>
            {taskData.status === 'draft' ? '草稿' : taskData.status === 'in-progress' ? '进行中' : taskData.status === 'completed' ? '已完成' : taskData.status === 'stopped' ? '已停止' : '已超时'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 text-[13px]">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#FA8C16]" />
            <div>
              <div className="text-[#86909C]">任务地点</div>
              <div className="text-[#1D2129]">{taskData.location}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FA5151]" />
            <div>
              <div className="text-[#86909C]">截止时间</div>
              <div className="text-[#FA5151]">{formatDeadline(taskData.deadline)}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#165DFF]" />
            <div>
              <div className="text-[#86909C]">创建时间</div>
              <div className="text-[#1D2129]">{taskData.createTime}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#00B42A]" />
            <div>
              <div className="text-[#86909C]">任务进度</div>
              <div className="text-[#00B42A] font-semibold">{completedCount}/{totalExecutors} 完成</div>
            </div>
          </div>
        </div>

     
        
      </div>

      {/* Tab切换 */}
      <div className="flex bg-white border-b border-[#E5E6EB] mt-4">
        <button onClick={() => setActiveTab('config')} className={`flex-1 py-3 text-[15px] relative ${activeTab === 'config' ? 'text-[#FA8C16] font-semibold' : 'text-[#86909C]'}`}>
          配置信息
          {activeTab === 'config' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FA8C16] rounded-full" />}
        </button>
        <button onClick={() => setActiveTab('execute')} className={`flex-1 py-3 text-[15px] relative ${activeTab === 'execute' ? 'text-[#FA8C16] font-semibold' : 'text-[#86909C]'}`}>
          执行情况
          {activeTab === 'execute' && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FA8C16] rounded-full" />}
        </button>
      </div>

      {/* 配置信息内容 */}
      {activeTab === 'config' && (
        <div className="p-4 space-y-4">
          {/* 楼盘信息 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">楼盘信息</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-[15px] font-semibold text-[#1D2129]">{taskData.buildingInfo.name}</h3>
                <span className="text-[15px] text-[#FA8C16] font-semibold">{taskData.buildingInfo.price}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <span className="text-[#86909C]">物业类型：</span>
                  <span className="text-[#1D2129]">{taskData.buildingInfo.propertyType}</span>
                </div>
                <div>
                  <span className="text-[#86909C]">开发商：</span>
                  <span className="text-[#1D2129]">{taskData.buildingInfo.developer}</span>
                </div>
                <div>
                  <span className="text-[#86909C]">建筑面积：</span>
                  <span className="text-[#1D2129]">{taskData.buildingInfo.area}</span>
                </div>
                <div>
                  <span className="text-[#86909C]">交付时间：</span>
                  <span className="text-[#1D2129]">{taskData.buildingInfo.deliveryTime}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#86909C]">地址：</span>
                  <span className="text-[#1D2129]">{taskData.buildingInfo.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 打卡配置 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">打卡配置</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">打卡范围</span>
                <span className="text-[14px] text-[#1D2129] font-medium">{taskData.checkinConfig.range}米</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">AI审核</span>
                <span className="text-[13px] px-2 py-0.5 bg-[#E8F5E9] text-[#00B42A] rounded">已启用</span>
              </div>
            </div>
          </div>

          {/* 采集点位配置 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">采集点位配置</span>
            </div>
            <div className="p-4 space-y-3">
              {taskData.checkinPoints.map((point) => (
                <div key={point.id} className="p-3 bg-[#F7F8FA] rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#1D2129]">{point.name}</span>
                      <span className={`px-2 py-0.5 text-[11px] rounded ${point.required ? 'bg-[#FFECE8] text-[#FA5151]' : 'bg-[#E8F3FF] text-[#165DFF]'}`}>
                        {point.required ? '必打卡' : '选打卡'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {point.type.map((type) => (
                      <span key={type} className="px-2 py-1 bg-white text-[#FA8C16] text-[11px] rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 话术训练配置 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">话术训练配置</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#1D2129]">状态</span>
                <span className={`text-[13px] px-2 py-0.5 rounded ${taskData.speechTrainingConfig.enabled ? 'bg-[#E8F5E9] text-[#00B42A]' : 'bg-[#F7F8FA] text-[#86909C]'}`}>
                  {taskData.speechTrainingConfig.enabled ? '已启用' : '未启用'}
                </span>
              </div>
              {taskData.speechTrainingConfig.enabled && taskData.speechTrainingConfig.projects && (
                <div className="space-y-2">
                  {taskData.speechTrainingConfig.projects.map((project, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-[#F0F0F0] last:border-0">
                      <span className="text-[13px] text-[#1D2129]">{project.name}</span>
                      <div className="flex items-center gap-3 text-[12px]">
                        <span className="text-[#86909C]">训练{project.trainingCount}次</span>
                        <span className="text-[#FA8C16]">目标{project.scoreTarget}分</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 录音分析配置 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">录音分析配置</span>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[13px] text-[#1D2129]">状态</span>
                <span className={`text-[13px] px-2 py-0.5 rounded ${taskData.audioAnalysisConfig.enabled ? 'bg-[#E8F5E9] text-[#00B42A]' : 'bg-[#F7F8FA] text-[#86909C]'}`}>
                  {taskData.audioAnalysisConfig.enabled ? '已启用' : '未启用'}
                </span>
              </div>
              {taskData.audioAnalysisConfig.enabled && taskData.audioAnalysisConfig.dimensions && (
                <div className="flex flex-wrap gap-2">
                  {taskData.audioAnalysisConfig.dimensions.map((dim, index) => (
                    <span key={index} className="px-3 py-1.5 bg-[#F7F8FA] text-[#1D2129] text-[12px] rounded-lg">
                      {dim}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 执行信息配置 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">执行信息配置</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">开始时间</span>
                <span className="text-[13px] text-[#1D2129] font-medium">{formatDeadline(taskData.startTime)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">结束时间</span>
                <span className="text-[13px] text-[#1D2129] font-medium">{formatDeadline(taskData.deadline)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">提前提醒</span>
                <span className="text-[13px] text-[#1D2129] font-medium">{taskData.remindConfig.beforeStart}</span>
              </div>
              <div>
                <div className="text-[13px] text-[#86909C] mb-2">执行人</div>
                <div className="flex flex-wrap gap-2">
                  {taskData.executors.map((executor) => (
                    <span key={executor.id} className="px-3 py-1 bg-[#FFF7E6] text-[#FA8C16] text-[12px] rounded-full">
                      {executor.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#86909C] mb-2">通知人</div>
                <div className="flex flex-wrap gap-2">
                  {taskData.notifiers.map((notifier) => (
                    <span key={notifier} className="px-3 py-1 bg-[#E8F3FF] text-[#165DFF] text-[12px] rounded-full">
                      {notifier}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 提醒配置 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">提醒配置</span>
            </div>
            <div className="p-4 space-y-2">
              {taskData.remindConfig.levels.map((level, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[11px] rounded ${level.color}`}>{level.level}</span>
                    <span className="text-[13px] text-[#4E5969]">截止前提醒</span>
                  </div>
                  <span className="text-[13px] text-[#1D2129] font-medium">{level.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 执行情况内容 */}
      {activeTab === 'execute' && (
        <>
          {isDraft ? (
            <div className="p-8 text-center">
              <div className="text-[#86909C] text-[14px]">草稿状态的任务暂无执行信息</div>
            </div>
          ) : (
            <div className="p-4 space-y-4">
              {/* 统计信息 */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-[24px] font-bold text-[#1D2129]">{totalExecutors}</div>
                    <div className="text-[12px] text-[#86909C]">总执行人</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[24px] font-bold text-[#00B42A]">{completedCount}</div>
                    <div className="text-[12px] text-[#86909C]">已完成</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[24px] font-bold text-[#FA8C16]">{totalExecutors - completedCount}</div>
                    <div className="text-[12px] text-[#86909C]">未完成</div>
                  </div>
                </div>
              </div>

              {/* 状态筛选 */}
              <div className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => setStatusFilter(option.key)}
                      className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-all ${statusFilter === option.key
                        ? 'bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white shadow-sm'
                        : 'bg-[#F7F8FA] text-[#86909C] active:bg-[#E5E6EB]'
                      }`}
                    >
                      {option.label}({option.count})
                    </button>
                  ))}
                </div>

                {/* 姓名搜索 */}
                <div className="relative mt-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" />
                  <input
                    type="text"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    placeholder="搜索执行人姓名"
                    className="w-full h-10 pl-10 pr-10 bg-[#F7F8FA] border border-[#E5E6EB] rounded-lg text-[14px] text-[#1D2129] placeholder:text-[#86909C] focus:outline-none focus:border-[#FA8C16] focus:bg-white transition-colors"
                  />
                  {searchName && (
                    <button onClick={() => setSearchName('')} className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#E5E6EB] rounded-full flex items-center justify-center active:bg-[#D0D1D5] transition-colors">
                      <X className="w-3 h-3 text-[#4E5969]" />
                    </button>
                  )}
                </div>
              </div>

              {/* 搜索结果提示 */}
              {(searchName || statusFilter !== 'all') && filteredExecutors.length > 0 && (
                <div className="flex items-center justify-between px-1">
                  <div className="text-[13px] text-[#86909C]">
                    共找到 <span className="text-[#FA8C16] font-medium">{filteredExecutors.length}</span> 位执行人
                  </div>
                  <button onClick={() => { setSearchName(''); setStatusFilter('all'); }} className="text-[12px] text-[#FA8C16] active:opacity-70">
                    清除筛选
                  </button>
                </div>
              )}

              {/* 执行人列表 */}
              {filteredExecutors.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <div className="text-[#86909C] text-[14px]">
                    {searchName ? `未找到姓名包含"${searchName}"的执行人` : '暂无符合条件的执行人'}
                  </div>
                </div>
              ) : (
                filteredExecutors.map((executor) => {
                  const statusInfo = getExecutorStatusInfo(executor.status);
                  const isExpanded = expandedExecutors.includes(executor.id);

                  return (
                    <div key={executor.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                      {/* 执行人卡片头部 */}
                      <div className="px-4 py-3">
                        {/* 第一行：头像、姓名、状态、操作按钮 */}
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-[18px] font-semibold flex-shrink-0 ${executor.status === 'completed' ? 'bg-[#00B42A]' : executor.status === 'in-progress' ? 'bg-[#FA8C16]' : executor.status === 'expired' ? 'bg-[#FA5151]' : executor.status === 'rejected' ? 'bg-[#FF4D4F]' : 'bg-[#86909C]'}`}>
                            {executor.avatar}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-[16px] font-semibold text-[#1D2129]">{executor.name}</h3>
                              <span className={`px-2.5 py-0.5 ${statusInfo.bg} ${statusInfo.color} text-[11px] rounded-full`}>
                                {statusInfo.text}
                              </span>
                              {executor.status === 'rejected' && (
                                <button onClick={() => setShowRejectModal(executor)} className="flex items-center gap-1 text-[11px] text-[#165DFF]">
                                  <MessageSquare className="w-3 h-3" />
                                  查看原因
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* 催办按钮 */}
                            {executor.status !== 'completed' && executor.status !== 'rejected' && (
                              <button onClick={() => showMessage(`已向 ${executor.name} 发送催办提醒`)} className="flex items-center gap-1 px-3 py-1.5 bg-[#FFF7E6] text-[#FA8C16] text-[12px] rounded-lg hover:bg-[#FFE7BA] transition-colors">
                                <Bell className="w-4 h-4" />
                                催办
                              </button>
                            )}
                            {/* 取消任务按钮 */}
                            {executor.status !== 'completed' && executor.status !== 'rejected' && (
                              <button onClick={() => handleCancelTask(executor)} className="flex items-center gap-1 px-3 py-1.5 bg-[#FFF1F0] text-[#FF4D4F] text-[12px] rounded-lg hover:bg-[#FFCCC7] transition-colors">
                                <X className="w-4 h-4" />
                                取消
                              </button>
                            )}
                            {/* 展开按钮 */}
                            {executor.subTasks.length > 0 && (
                              <button onClick={() => toggleExecutor(executor.id)} className="p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors">
                                <ChevronDown className={`w-5 h-5 text-[#86909C] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                              </button>
                            )}
                          </div>
                        </div>
                        {/* 第二行：详细信息 */}
                        <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
                          <div className="flex flex-wrap items-center gap-4 text-[12px]">
                            {executor.startTime && (
                              <div className="flex items-center gap-1">
                                <span className="text-[#86909C]">开始：</span>
                                <span className="text-[#1D2129]">{executor.startTime}</span>
                              </div>
                            )}
                            {executor.completedTime && (
                              <div className="flex items-center gap-1">
                                <span className="text-[#86909C]">完成：</span>
                                <span className="text-[#00B42A]">{executor.completedTime}</span>
                              </div>
                            )}
                            {executor.status === 'pending' && (
                              <div className="text-[#86909C]">尚未开始</div>
                            )}
                            <div className="flex items-center gap-1">
                              <span className="text-[#86909C]">完成：</span>
                              <span className={executor.progress.completed === executor.progress.total ? 'text-[#00B42A] font-semibold' : 'text-[#FA8C16] font-semibold'}>
                                {executor.progress.completed}/{executor.progress.total}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 子任务详情 */}
                      {isExpanded && executor.subTasks.length > 0 && (
                        <div className="px-4 pb-4 space-y-3">
                          {executor.subTasks.map((subTask, index) => (
                            <div key={index} className="bg-[#F7F8FA] rounded-xl overflow-hidden">
                              {/* 子任务头部 */}
                              <div className="p-3">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${subTask.status === 'completed' ? 'bg-[#00B42A]' : subTask.status === 'in-progress' ? 'bg-[#FA8C16]' : 'bg-[#E5E6EB]'}`}>
                                      {subTask.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                                      {subTask.status === 'in-progress' && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                                    </div>
                                    <span className={`text-[14px] font-medium ${subTask.status === 'completed' ? 'text-[#86909C] line-through' : 'text-[#1D2129]'}`}>
                                      {subTask.name}
                                    </span>
                                    {subTask.name === '探盘路书' && subTask.status !== 'pending' && (
                                      <button className="text-[11px] px-2 py-1 bg-[#E8F3FF] text-[#165DFF] rounded hover:bg-[#D4E8FF] transition-colors">
                                        查看详情
                                      </button>
                                    )}
                                  </div>
                                  <span className="text-[12px] text-[#FA8C16] font-medium">
                                    {subTask.progress.completed}/{subTask.progress.total}
                                  </span>
                                </div>

                                {/* 阶段详情 */}
                                {subTask.children && subTask.children.length > 0 && (
                                  <div className="space-y-2">
                                    {subTask.children.map((child, childIndex) => {
                                      const childStatusInfo = getSubTaskStatusInfo(child.status, child.progress);
                                      return (
                                        <div key={childIndex} className="flex items-center gap-3 pl-7">
                                          <div className={`w-4 h-4 rounded-full flex items-center justify-center ${child.status === 'completed' ? 'bg-[#00B42A]' : child.status === 'in-progress' ? 'bg-[#FA8C16]' : 'bg-[#E5E6EB]'}`}>
                                            {child.status === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                                            {child.status === 'in-progress' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                                          </div>
                                          <span className={`flex-1 text-[12px] ${child.status === 'completed' ? 'text-[#86909C] line-through' : 'text-[#4E5969]'}`}>
                                            {child.name}
                                          </span>
                                          <span className={`px-2 py-0.5 ${childStatusInfo.bg} ${childStatusInfo.color} text-[10px] rounded`}>
                                            {childStatusInfo.text}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      {/* 底部按钮 */}
      {!isDraft && activeTab === 'execute' && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
          <button onClick={handleUrge} className="w-full h-12 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-xl flex items-center justify-center gap-2 active:opacity-90 transition-opacity shadow-lg">
            <Bell className="w-5 h-5" />
            <span className="text-[16px] font-semibold">催办</span>
          </button>
        </div>
      )}

      {/* 拒绝原因弹窗 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center" onClick={() => setShowRejectModal(null)}>
          <div className="bg-white rounded-t-2xl w-full max-w-md p-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-[#FF4D4F]" />
              <h3 className="text-[16px] font-semibold text-[#1D2129]">拒绝原因</h3>
            </div>
            <div className="bg-[#FFF1F0] rounded-lg p-4 mb-4">
              <div className="text-[14px] text-[#1D2129] mb-2">{showRejectModal.name}</div>
              <p className="text-[13px] text-[#FF4D4F]">{showRejectModal.rejectReason}</p>
            </div>
            <button onClick={() => setShowRejectModal(null)} className="w-full py-2.5 bg-[#FA8C16] text-white rounded-lg">
              我知道了
            </button>
          </div>
        </div>
      )}

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1D2129]/90 backdrop-blur-sm text-white px-6 py-3.5 rounded-2xl text-[14px] z-[10000] animate-fade-in pointer-events-none max-w-[80vw] text-center shadow-2xl">
          {toastMessage}
        </div>
      )}

      {/* 底部TabBar */}
      {/* <TabBar /> */}
    </div>
  );
}