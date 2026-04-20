import { useState } from 'react';
import { ArrowLeft, Plus, Search, Filter, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../components/TabBar';

export default function MyTasks() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed'>('all');

  const tasks = [
    {
      id: 1,
      title: '中海汇德里探盘任务',
      type: '探盘',
      createTime: '2026-04-16 10:00',
      deadline: '2026-04-19T18:00:00',
      status: 'in-progress',
      executors: 3,
      completed: 1
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
    }
  ];

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'not-started':
        return { text: '待开始', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]' };
      case 'in-progress':
        return { text: '进行中', bg: 'bg-[#FFF7E6]', color: 'text-[#FA8C16]' };
      case 'completed':
        return { text: '已完成', bg: 'bg-[#E8F5E9]', color: 'text-[#00B42A]' };
      default:
        return { text: '未知', bg: 'bg-[#F7F8FA]', color: 'text-[#86909C]' };
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'ongoing') return task.status === 'in-progress';
    if (activeTab === 'completed') return task.status === 'completed';
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
          <button className="w-10 h-10 flex items-center justify-center bg-[#F7F8FA] rounded-lg">
            <Filter className="w-4 h-4 text-[#86909C]" />
          </button>
        </div>
      </div>

      {/* Tab切换 */}
      <div className="flex bg-white border-b border-[#E5E6EB]">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-[15px] relative ${
            activeTab === 'all' ? 'text-[#FA8C16] font-semibold' : 'text-[#86909C]'
          }`}
        >
          全部
          {activeTab === 'all' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FA8C16] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('ongoing')}
          className={`flex-1 py-3 text-[15px] relative ${
            activeTab === 'ongoing' ? 'text-[#FA8C16] font-semibold' : 'text-[#86909C]'
          }`}
        >
          进行中
          {activeTab === 'ongoing' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FA8C16] rounded-full" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`flex-1 py-3 text-[15px] relative ${
            activeTab === 'completed' ? 'text-[#FA8C16] font-semibold' : 'text-[#86909C]'
          }`}
        >
          已完成
          {activeTab === 'completed' && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#FA8C16] rounded-full" />
          )}
        </button>
      </div>

      {/* 任务列表 */}
      <div className="p-4 space-y-3">
        {filteredTasks.map((task) => {
          const statusInfo = getStatusInfo(task.status);
          return (
            <div
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
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
                <ChevronRight className="w-5 h-5 text-[#86909C] flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E5E6EB]">
                <span className={`px-2 py-0.5 ${statusInfo.bg} ${statusInfo.color} text-[12px] rounded`}>
                  {statusInfo.text}
                </span>
                <div className="flex items-center gap-4 text-[12px] text-[#86909C]">
                  <span>
                    执行人：<span className="text-[#1D2129] font-medium">{task.executors}</span>
                  </span>
                  <span>
                    完成：
                    <span className={task.completed === task.executors ? 'text-[#00B42A]' : 'text-[#FA8C16]'}>
                      {task.completed}/{task.executors}
                    </span>
                  </span>
                </div>
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

      {/* 底部TabBar */}
      <TabBar />
    </div>
  );
}
