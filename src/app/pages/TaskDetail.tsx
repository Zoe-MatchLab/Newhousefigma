import { useState } from 'react';
import { ArrowLeft, MapPin, Clock, Check, ChevronDown, Bell, Search, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

type ExecutorStatus = 'all' | 'in-progress' | 'completed' | 'pending';

interface SubTask {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress?: number;
}

interface Task {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  progress?: number | { completed: number; total: number };
  children?: SubTask[];
}

export default function TaskDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'config' | 'execute'>('config');
  const [expandedExecutors, setExpandedExecutors] = useState<string[]>(['1']);
  const [statusFilter, setStatusFilter] = useState<ExecutorStatus>('all');
  const [searchName, setSearchName] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const stages = [
    { id: 1, name: '点位资料收集', status: 'completed' },
    { id: 2, name: '文案生成', status: 'in-progress' },
    { id: 3, name: '图片视频生成', status: 'pending' }
  ];

  const totalStages = stages.length;
  const completedStages = stages.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedStages / totalStages) * 100;

  const allExecutors = [
    {
      id: '1',
      name: '张三',
      avatar: '张',
      status: 'in-progress' as const,
      startTime: '2026-04-16 10:30',
      progress: { completed: 1, total: 3 },
      subTasks: [
        {
          name: '探盘路书',
          status: 'in-progress',
          progress: { completed: 1, total: 3 },
          children: [
            { name: '点位资料收集', status: 'completed' },
            { name: '文案生成', status: 'in-progress', progress: 60 },
            { name: '图片视频生成', status: 'pending' }
          ]
        },
        {
          name: '话术训练',
          status: 'pending',
          progress: { completed: 0, total: 5 },
          children: [
            { name: '产品介绍', status: 'pending' },
            { name: '价格谈判', status: 'pending' },
            { name: '异议处理', status: 'pending' },
            { name: '需求挖掘', status: 'pending' },
            { name: '成交逼单', status: 'pending' }
          ]
        },
        {
          name: '录音分析',
          status: 'pending',
          progress: { completed: 0, total: 4 },
          children: [
            { name: '话术规范', status: 'pending' },
            { name: '情绪识别', status: 'pending' },
            { name: '关键词覆盖', status: 'pending' },
            { name: '邀约意向', status: 'pending' }
          ]
        }
      ]
    },
    {
      id: '2',
      name: '李四',
      avatar: '李',
      status: 'completed' as const,
      completedTime: '2026-04-15 18:00',
      progress: { completed: 3, total: 3 },
      subTasks: [
        {
          name: '探盘路书',
          status: 'completed',
          progress: { completed: 3, total: 3 },
          children: [
            { name: '点位资料收集', status: 'completed' },
            { name: '文案生成', status: 'completed' },
            { name: '图片视频生成', status: 'completed' }
          ]
        },
        {
          name: '话术训练',
          status: 'completed',
          progress: { completed: 5, total: 5 },
          children: [
            { name: '产品介绍', status: 'completed' },
            { name: '价格谈判', status: 'completed' },
            { name: '异议处理', status: 'completed' },
            { name: '需求挖掘', status: 'completed' },
            { name: '成交逼单', status: 'completed' }
          ]
        },
        {
          name: '录音分析',
          status: 'completed',
          progress: { completed: 4, total: 4 },
          children: [
            { name: '话术规范', status: 'completed' },
            { name: '情绪识别', status: 'completed' },
            { name: '关键词覆盖', status: 'completed' },
            { name: '邀约意向', status: 'completed' }
          ]
        }
      ]
    },
    {
      id: '3',
      name: '王五',
      avatar: '王',
      status: 'in-progress' as const,
      startTime: '2026-04-16 14:20',
      progress: { completed: 0, total: 1 },
      subTasks: [
        {
          name: '探盘路书',
          status: 'in-progress',
          progress: { completed: 0, total: 3 },
          children: [
            { name: '点位资料收集', status: 'in-progress', progress: 30 },
            { name: '文案生成', status: 'pending' },
            { name: '图片视频生成', status: 'pending' }
          ]
        }
      ]
    },
    {
      id: '4',
      name: '赵六',
      avatar: '赵',
      status: 'pending' as const,
      progress: { completed: 0, total: 1 },
      subTasks: [
        {
          name: '探盘路书',
          status: 'pending',
          progress: { completed: 0, total: 3 },
          children: [
            { name: '点位资料收集', status: 'pending' },
            { name: '文案生成', status: 'pending' },
            { name: '图片视频生成', status: 'pending' }
          ]
        }
      ]
    },
    {
      id: '5',
      name: '钱七',
      avatar: '钱',
      status: 'in-progress' as const,
      startTime: '2026-04-16 11:00',
      progress: { completed: 1, total: 2 },
      subTasks: [
        {
          name: '探盘路书',
          status: 'completed',
          progress: { completed: 3, total: 3 },
          children: [
            { name: '点位资料收集', status: 'completed' },
            { name: '文案生成', status: 'completed' },
            { name: '图片视频生成', status: 'completed' }
          ]
        },
        {
          name: '话术训练',
          status: 'in-progress',
          progress: { completed: 3, total: 5 },
          children: [
            { name: '产品介绍', status: 'completed' },
            { name: '价格谈判', status: 'completed' },
            { name: '异议处理', status: 'completed' },
            { name: '需求挖掘', status: 'in-progress', progress: 40 },
            { name: '成交逼单', status: 'pending' }
          ]
        },
        {
          name: '录音分析',
          status: 'pending',
          progress: { completed: 0, total: 4 },
          children: [
            { name: '话术规范', status: 'pending' },
            { name: '情绪识别', status: 'pending' },
            { name: '关键词覆盖', status: 'pending' },
            { name: '邀约意向', status: 'pending' }
          ]
        }
      ]
    }
  ];

  const executors = allExecutors
    .filter(e => statusFilter === 'all' || e.status === statusFilter)
    .filter(e => searchName === '' || e.name.includes(searchName));

  const toggleExecutor = (id: string) => {
    if (expandedExecutors.includes(id)) {
      setExpandedExecutors(expandedExecutors.filter(eid => eid !== id));
    } else {
      setExpandedExecutors([...expandedExecutors, id]);
    }
  };

  const getStageIcon = (status: string, index: number) => {
    if (status === 'completed') {
      return <Check className="w-3 h-3 text-white" />;
    } else if (status === 'in-progress') {
      return <span className="text-white text-[11px] font-semibold">{index + 1}</span>;
    } else {
      return <span className="text-[#86909C] text-[11px] font-semibold">{index + 1}</span>;
    }
  };

  const getExecutorStatusInfo = (status: string) => {
    switch (status) {
      case 'in-progress':
        return { text: '进行中', bg: 'bg-[#FFF7E6]', color: 'text-[#FA8C16]' };
      case 'completed':
        return { text: '已完成', bg: 'bg-[#E8F5E9]', color: 'text-[#00B42A]' };
      case 'pending':
        return { text: '待执行', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]' };
      default:
        return { text: '未知', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]' };
    }
  };

  const getSubTaskStatusInfo = (status: string, progress?: number) => {
    switch (status) {
      case 'completed':
        return { text: '已完成', bg: 'bg-[#E8F5E9]', color: 'text-[#00B42A]' };
      case 'in-progress':
        return { text: `进行中 ${progress}%`, bg: 'bg-[#FFF7E6]', color: 'text-[#FA8C16]' };
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
    const uncompletedCount = allExecutors.filter(e => e.status !== 'completed').length;
    showMessage(`已向 ${uncompletedCount} 位未完成人员发送催办提醒`);
  };

  const getFilterCount = (filter: ExecutorStatus) => {
    if (filter === 'all') return allExecutors.length;
    return allExecutors.filter(e => e.status === filter).length;
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-br from-[#FA8C16] to-[#FF9500] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg active:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-[17px] font-semibold text-white">任务详情</h1>
        <div className="w-8" />
      </header>

      {/* 任务信息卡片 */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-[20px]">🏠</span>
          <h2 className="text-[16px] font-semibold text-[#1D2129]">中海汇德里探盘任务</h2>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 bg-[#FFF7E6] text-[#FA8C16] text-[12px] rounded">进行中</span>
          <span className="text-[12px] text-[#86909C]">探盘任务</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[13px] text-[#4E5969]">
            <MapPin className="w-4 h-4 text-[#FA8C16]" />
            <span>浦东新区张江高科技园区</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#FA5151]">
            <Clock className="w-4 h-4" />
            <span>截止时间：2026-04-18 18:00</span>
          </div>
        </div>
      </div>

      {/* 进度卡片 */}
      <div className="bg-white mx-4 mt-4 p-4 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-[#86909C]">探盘进度</span>
          <span className="text-[13px] font-semibold text-[#FA8C16]">
            {completedStages}/{totalStages} 完成
          </span>
        </div>
        <div className="h-1.5 bg-[#E5E6EB] rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#FA8C16] to-[#FF9500] rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between">
          {stages.map((stage, index) => (
            <div key={stage.id} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center ${
                  stage.status === 'completed'
                    ? 'bg-[#00B42A]'
                    : stage.status === 'in-progress'
                    ? 'bg-[#FA8C16]'
                    : 'bg-[#E5E6EB]'
                }`}
              >
                {getStageIcon(stage.status, index)}
              </div>
              <span
                className={`text-[11px] text-center leading-tight max-w-[70px] ${
                  stage.status === 'completed'
                    ? 'text-[#00B42A] font-semibold'
                    : stage.status === 'in-progress'
                    ? 'text-[#FA8C16] font-semibold'
                    : 'text-[#86909C]'
                }`}
              >
                {stage.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex bg-white border-b border-[#E5E6EB] mt-4">
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-1 py-3 text-[15px] relative ${
            activeTab === 'config'
              ? 'text-[#FA8C16] font-semibold'
              : 'text-[#86909C]'
          }`}
        >
          配置信息
          {activeTab === 'config' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FA8C16] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('execute')}
          className={`flex-1 py-3 text-[15px] relative ${
            activeTab === 'execute'
              ? 'text-[#FA8C16] font-semibold'
              : 'text-[#86909C]'
          }`}
        >
          执行情况
          {activeTab === 'execute' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FA8C16] rounded-full" />
          )}
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
                <h3 className="text-[15px] font-semibold text-[#1D2129]">中海汇德里</h3>
                <span className="text-[15px] text-[#FA8C16] font-semibold">35000元/㎡</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[13px]">
                <div>
                  <span className="text-[#86909C]">物业类型：</span>
                  <span className="text-[#1D2129]">住宅</span>
                </div>
                <div>
                  <span className="text-[#86909C]">开发商：</span>
                  <span className="text-[#1D2129]">中海地产</span>
                </div>
                <div>
                  <span className="text-[#86909C]">建筑面积：</span>
                  <span className="text-[#1D2129]">120-180㎡</span>
                </div>
                <div>
                  <span className="text-[#86909C]">交付时间：</span>
                  <span className="text-[#1D2129]">2027年6月</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#86909C]">地址：</span>
                  <span className="text-[#1D2129]">浦东新区张江高科技园区</span>
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
            <div className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">打卡范围</span>
                <span className="text-[14px] text-[#1D2129] font-medium">200米</span>
              </div>
            </div>
          </div>

          {/* 采集点位 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">采集点位</span>
              <span className="ml-auto text-[12px] px-2 py-0.5 bg-[#E8F3FF] text-[#165DFF] rounded">
                AI自动审核
              </span>
            </div>
            <div className="p-4 space-y-2">
              {[
                { id: 1, name: '接待处', types: ['图片', '视频'], required: true },
                { id: 2, name: '沙盘区', types: ['图片', '视频', '音频'], required: true },
                { id: 3, name: '样板间', types: ['图片', '视频'], required: false }
              ].map((point) => (
                <div key={point.id} className="p-3 bg-[#F7F8FA] rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#1D2129]">{point.name}</span>
                      <span
                        className={`px-2 py-0.5 text-[11px] rounded ${
                          point.required
                            ? 'bg-[#FFECE8] text-[#FA5151]'
                            : 'bg-[#E8F3FF] text-[#165DFF]'
                        }`}
                      >
                        {point.required ? '必打卡' : '选打卡'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {point.types.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-white text-[#FA8C16] text-[11px] rounded"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 功能配置 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">功能配置</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#1D2129]">文案内容生成</span>
                <span className="text-[13px] px-2 py-0.5 bg-[#E8F5E9] text-[#00B42A] rounded">已启用</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#1D2129]">图片/视频生成</span>
                <span className="text-[13px] px-2 py-0.5 bg-[#E8F5E9] text-[#00B42A] rounded">已启用</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#1D2129]">话术训练</span>
                <span className="text-[13px] px-2 py-0.5 bg-[#F7F8FA] text-[#86909C] rounded">未启用</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#1D2129]">录音分析</span>
                <span className="text-[13px] px-2 py-0.5 bg-[#F7F8FA] text-[#86909C] rounded">未启用</span>
              </div>
            </div>
          </div>

          {/* 执行信息 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
            <div className="px-4 py-3 border-b border-[#E5E6EB] flex items-center gap-2">
              <div className="w-1 h-4 bg-[#FA8C16] rounded-full" />
              <span className="text-[15px] font-semibold text-[#1D2129]">执行信息</span>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">创建人</span>
                <span className="text-[13px] text-[#1D2129] font-medium">区域经理A</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">创建时间</span>
                <span className="text-[13px] text-[#1D2129] font-medium">2026-04-16 10:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">开始时间</span>
                <span className="text-[13px] text-[#1D2129] font-medium">2026-04-16 00:00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-[#86909C]">截止时间</span>
                <span className="text-[13px] text-[#1D2129] font-medium">2026-04-18 18:00</span>
              </div>
              <div>
                <div className="text-[13px] text-[#86909C] mb-2">执行人</div>
                <div className="flex flex-wrap gap-2">
                  {['张三', '李四', '王五', '赵六', '钱七'].map((executor) => (
                    <span
                      key={executor}
                      className="px-3 py-1 bg-[#FFF7E6] text-[#FA8C16] text-[12px] rounded-full"
                    >
                      {executor}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[13px] text-[#86909C] mb-2">通知人</div>
                <div className="flex flex-wrap gap-2">
                  {['区域经理A', '销售总监B'].map((notifier) => (
                    <span
                      key={notifier}
                      className="px-3 py-1 bg-[#E8F3FF] text-[#165DFF] text-[12px] rounded-full"
                    >
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
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#E8F3FF] text-[#165DFF] text-[11px] rounded">开始前</span>
                  <span className="text-[13px] text-[#4E5969]">提前通知</span>
                </div>
                <span className="text-[13px] text-[#1D2129] font-medium">2小时</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#00B42A] text-[11px] rounded">轻度</span>
                  <span className="text-[13px] text-[#4E5969]">截止前提醒</span>
                </div>
                <span className="text-[13px] text-[#1D2129] font-medium">48小时</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#FFF7E6] text-[#FA8C16] text-[11px] rounded">中度</span>
                  <span className="text-[13px] text-[#4E5969]">截止前提醒</span>
                </div>
                <span className="text-[13px] text-[#1D2129] font-medium">24小时</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#FFECE8] text-[#FA5151] text-[11px] rounded">重度</span>
                  <span className="text-[13px] text-[#4E5969]">截止前提醒</span>
                </div>
                <span className="text-[13px] text-[#1D2129] font-medium">2小时</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 执行情况内容 */}
      {activeTab === 'execute' && (
        <div className="p-4 space-y-4">
          {/* 统计信息 */}
          <div className="bg-white rounded-xl p-3 flex justify-around shadow-sm">
            <div className="text-center">
              <div className="text-[20px] font-bold text-[#1D2129]">{allExecutors.length}</div>
              <div className="text-[12px] text-[#86909C]">执行人</div>
            </div>
            <div className="text-center">
              <div className="text-[20px] font-bold text-[#FA8C16]">
                {allExecutors.filter(e => e.status === 'in-progress').length}
              </div>
              <div className="text-[12px] text-[#86909C]">进行中</div>
            </div>
            <div className="text-center">
              <div className="text-[20px] font-bold text-[#00B42A]">
                {allExecutors.filter(e => e.status === 'completed').length}
              </div>
              <div className="text-[12px] text-[#86909C]">已完成</div>
            </div>
          </div>

          {/* 人员筛选 */}
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex gap-2 mb-3">
              {[
                { key: 'all', label: '全部' },
                { key: 'in-progress', label: '进行中' },
                { key: 'completed', label: '已完成' },
                { key: 'pending', label: '待执行' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key as ExecutorStatus)}
                  className={`flex-1 py-2 px-3 rounded-lg text-[13px] font-medium transition-all ${
                    statusFilter === filter.key
                      ? 'bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white shadow-sm'
                      : 'bg-[#F7F8FA] text-[#86909C] active:bg-[#E5E6EB]'
                  }`}
                >
                  {filter.label}
                  <span className={`ml-1 text-[11px] ${
                    statusFilter === filter.key ? 'opacity-90' : 'opacity-70'
                  }`}>
                    ({getFilterCount(filter.key as ExecutorStatus)})
                  </span>
                </button>
              ))}
            </div>

            {/* 姓名搜索 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" />
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="搜索执行人姓名"
                className="w-full h-10 pl-10 pr-10 bg-[#F7F8FA] border border-[#E5E6EB] rounded-lg text-[14px] text-[#1D2129] placeholder:text-[#86909C] focus:outline-none focus:border-[#FA8C16] focus:bg-white transition-colors"
              />
              {searchName && (
                <button
                  onClick={() => setSearchName('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#E5E6EB] rounded-full flex items-center justify-center active:bg-[#D0D1D5] transition-colors"
                >
                  <X className="w-3 h-3 text-[#4E5969]" />
                </button>
              )}
            </div>
          </div>

          {/* 搜索结果提示 */}
          {(searchName || statusFilter !== 'all') && executors.length > 0 && (
            <div className="flex items-center justify-between px-1">
              <div className="text-[13px] text-[#86909C]">
                {searchName && statusFilter !== 'all' && `筛选"${statusFilter === 'in-progress' ? '进行中' : statusFilter === 'completed' ? '已完成' : '待执行'}"且姓名包含"${searchName}"的执行人`}
                {searchName && statusFilter === 'all' && `搜索姓名包含"${searchName}"的执行人`}
                {!searchName && statusFilter !== 'all' && `筛选状态为"${statusFilter === 'in-progress' ? '进行中' : statusFilter === 'completed' ? '已完成' : '待执行'}"的执行人`}
                <span className="ml-1 text-[#FA8C16] font-medium">共{executors.length}人</span>
              </div>
              {(searchName || statusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchName('');
                    setStatusFilter('all');
                  }}
                  className="text-[12px] text-[#FA8C16] active:opacity-70"
                >
                  清除筛选
                </button>
              )}
            </div>
          )}

          {/* 执行人列表 */}
          {executors.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <div className="text-[#86909C] text-[14px] mb-2">
                {searchName ? `未找到姓名包含"${searchName}"的执行人` : '暂无符合条件的执行人'}
              </div>
              {searchName && (
                <button
                  onClick={() => setSearchName('')}
                  className="text-[13px] text-[#FA8C16] active:opacity-70"
                >
                  清除搜索条件
                </button>
              )}
            </div>
          ) : (
            executors.map((executor) => {
              const statusInfo = getExecutorStatusInfo(executor.status);
              const isExpanded = expandedExecutors.includes(executor.id);

              return (
                <div key={executor.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggleExecutor(executor.id)}
                    className="w-full px-4 py-4 flex items-center gap-3 border-b border-[#E5E6EB] active:bg-[#F7F8FA]"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-[16px] font-semibold flex-shrink-0 ${
                        executor.status === 'completed'
                          ? 'bg-[#00B42A]'
                          : executor.status === 'in-progress'
                          ? 'bg-[#FA8C16]'
                          : 'bg-[#86909C]'
                      }`}
                    >
                      {executor.avatar}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-[15px] font-semibold text-[#1D2129] mb-1">{executor.name}</div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 ${statusInfo.bg} ${statusInfo.color} text-[11px] rounded flex-shrink-0`}>
                          {statusInfo.text}
                        </span>
                        <span className="text-[11px] text-[#86909C] truncate">
                          {executor.startTime && `开始 ${executor.startTime}`}
                          {executor.completedTime && `完成 ${executor.completedTime}`}
                          {executor.status === 'pending' && '尚未开始'}
                        </span>
                      </div>
                    </div>
                    <div className="text-[13px] text-[#FA8C16] font-medium flex-shrink-0">
                      {executor.progress.completed}/{executor.progress.total}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-[#86909C] transition-transform flex-shrink-0 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-[#F7F8FA] space-y-2">
                      {executor.subTasks.map((task, index) => {
                        const hasChildren = 'children' in task && task.children && task.children.length > 0;
                        const taskProgress = task.progress && typeof task.progress === 'object'
                          ? task.progress
                          : null;

                        return (
                          <div key={index}>
                            {/* 主任务 */}
                            <div className="bg-white rounded-lg overflow-hidden">
                              <div className="flex items-center gap-3 p-3">
                                <div
                                  className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    task.status === 'completed'
                                      ? 'bg-[#00B42A]'
                                      : task.status === 'in-progress'
                                      ? 'bg-[#FA8C16]'
                                      : 'bg-[#E5E6EB]'
                                  }`}
                                >
                                  {task.status === 'completed' && <Check className="w-3 h-3 text-white" />}
                                  {task.status === 'in-progress' && (
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                                  )}
                                </div>
                                <div
                                  className={`flex-1 text-[13px] font-medium ${
                                    task.status === 'completed'
                                      ? 'text-[#86909C] line-through'
                                      : 'text-[#1D2129]'
                                  }`}
                                >
                                  {task.name}
                                </div>
                                {taskProgress && (
                                  <span className="text-[12px] text-[#FA8C16] font-medium flex-shrink-0">
                                    {taskProgress.completed}/{taskProgress.total}
                                  </span>
                                )}
                                {task.name === '探盘路书' && task.status !== 'pending' && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      navigate(`/tasks/${id}/execute?step=${task.status === 'completed' ? 3 : executor.progress.completed}&readonly=true&executor=${executor.name}`);
                                    }}
                                    className="text-[11px] px-2 py-1 bg-[#E8F3FF] text-[#165DFF] rounded active:bg-[#D4E8FF] transition-colors flex-shrink-0"
                                  >
                                    查看详情
                                  </button>
                                )}
                              </div>

                              {/* 子任务 */}
                              {hasChildren && (
                                <div className="px-3 pb-3 space-y-1">
                                  {task.children!.map((child, childIndex) => {
                                    const childStatusInfo = getSubTaskStatusInfo(child.status, child.progress);
                                    return (
                                      <div key={childIndex} className="flex items-center gap-2 bg-[#F7F8FA] p-2 rounded-lg ml-5">
                                        <div
                                          className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                                            child.status === 'completed'
                                              ? 'bg-[#00B42A]'
                                              : child.status === 'in-progress'
                                              ? 'bg-[#FA8C16]'
                                              : 'bg-[#E5E6EB]'
                                          }`}
                                        >
                                          {child.status === 'completed' && <Check className="w-2.5 h-2.5 text-white" />}
                                          {child.status === 'in-progress' && (
                                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                          )}
                                        </div>
                                        <div
                                          className={`flex-1 text-[12px] ${
                                            child.status === 'completed'
                                              ? 'text-[#86909C] line-through'
                                              : 'text-[#4E5969]'
                                          }`}
                                        >
                                          {child.name}
                                        </div>
                                        <span className={`px-1.5 py-0.5 ${childStatusInfo.bg} ${childStatusInfo.color} text-[10px] rounded flex-shrink-0`}>
                                          {childStatusInfo.text}
                                        </span>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <button
          onClick={handleUrge}
          className="w-full h-12 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-xl flex items-center justify-center gap-2 active:opacity-90 transition-opacity shadow-lg"
        >
          <Bell className="w-5 h-5" />
          <span className="text-[16px] font-semibold">催办</span>
        </button>
      </div>

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1D2129]/90 backdrop-blur-sm text-white px-6 py-3.5 rounded-2xl text-[14px] z-[10000] animate-fade-in pointer-events-none max-w-[80vw] text-center shadow-2xl">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
