/**
 * @module recording/pages/RecordingList
 * @description 录音列表页面
 * 
 * 本文件实现录音列表的展示和交互功能，包括：
 * - 录音列表展示
 * - 状态显示（待处理、处理中、已完成、失败）
 * - 播放控制
 * - 删除和锁定功能
 * - 点击查看详情
 * 
 * 使用自定义 Hooks 封装业务逻辑
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Trash2, Play, Pause, Lock, Loader2, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../../../components/TabBar';
import { useRecordingList, useRecordingNavigation } from '../hooks/useRecordings';
import { RecordingRecord } from '../types';

export default function RecordingList() {
  const navigate = useNavigate();
  const { recordings, refreshRecordings } = useRecordingList();
  const { goToResult, goToUpload } = useRecordingNavigation();
  
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [lockedIds, setLockedIds] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 模拟刷新
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshRecordings();
    setIsRefreshing(false);
  };

  // 切换播放状态
  const togglePlay = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayingId(prev => prev === id ? null : id);
  };

  // 切换锁定状态
  const toggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLockedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // 删除录音
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('确定要删除这条录音吗？')) {
      // 实际项目中调用 API 删除
      console.log('删除录音:', id);
    }
  };

  // 获取状态标签
  const getStatusInfo = (status: RecordingRecord['status']) => {
    switch (status) {
      case 'completed':
        return { text: '已完成', color: 'text-[#00B42A]', bg: 'bg-[#E8F5E9]' };
      case 'processing':
        return { text: '处理中', color: 'text-[#FA8C16]', bg: 'bg-[#FFF7E6]' };
      case 'pending':
        return { text: '待处理', color: 'text-[#86909C]', bg: 'bg-[#F7F8FA]' };
      case 'failed':
        return { text: '失败', color: 'text-[#FA5151]', bg: 'bg-[#FFECE8]' };
      default:
        return { text: '未知', color: 'text-[#86909C]', bg: 'bg-[#F7F8FA]' };
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) {
      return '刚刚';
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else if (days < 7) {
      return `${days}天前`;
    } else {
      return `${date.getMonth() + 1}月${date.getDate()}日`;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#1D2129]" />
            </button>
            <h1 className="text-[17px] font-semibold text-[#1D2129]">录音列表</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-[#1D2129] ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={goToUpload}
              className="p-2 bg-[#165DFF] text-white rounded-lg hover:bg-[#0E4FD1] transition-colors"
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="flex items-center gap-4 text-[13px] text-[#86909C]">
          <span>共 {recordings.length} 条录音</span>
          <span>已完成 {recordings.filter(r => r.status === 'completed').length}</span>
          <span>处理中 {recordings.filter(r => r.status === 'processing').length}</span>
        </div>
      </header>

      {/* 录音列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {recordings.map(recording => {
            const statusInfo = getStatusInfo(recording.status);
            const isPlaying = playingId === recording.id;
            const isLocked = lockedIds.has(recording.id);

            return (
              <div
                key={recording.id}
                onClick={() => goToResult(recording.id)}
                className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
              >
                {/* 第一行：标题和状态 */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      recording.status === 'completed' 
                        ? 'bg-gradient-to-br from-[#00B42A] to-[#008B2A]' 
                        : recording.status === 'processing'
                        ? 'bg-gradient-to-br from-[#FA8C16] to-[#D46B08]'
                        : 'bg-gradient-to-br from-[#86909C] to-[#4E5969]'
                    }`}>
                      <Mic className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-[15px] font-semibold text-[#1D2129] truncate">
                        {recording.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[12px] text-[#86909C]">
                          {recording.duration} · {recording.size}
                        </span>
                        <span className={`px-2 py-0.5 ${statusInfo.bg} ${statusInfo.color} text-[11px] rounded-full`}>
                          {statusInfo.text}
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#86909C] flex-shrink-0" />
                </div>

                {/* 第二行：关联信息 */}
                <div className="flex items-center gap-2 mb-3 text-[13px]">
                  {recording.building && (
                    <span className="px-2 py-1 bg-[#F7F8FA] text-[#4E5969] rounded-md">
                      🏢 {recording.building}
                    </span>
                  )}
                  {recording.customer && (
                    <span className="px-2 py-1 bg-[#E8F3FF] text-[#165DFF] rounded-md">
                      👤 {recording.customer}
                    </span>
                  )}
                  <span className="text-[#86909C]">👨‍💼 {recording.agent}</span>
                </div>

                {/* 第三行：操作按钮 */}
                <div className="flex items-center justify-between pt-3 border-t border-[#E5E6EB]">
                  <span className="text-[12px] text-[#86909C]">
                    {formatTime(recording.time)}
                  </span>
                  <div className="flex items-center gap-2">
                    {recording.status === 'completed' && (
                      <button
                        onClick={(e) => togglePlay(recording.id, e)}
                        className="p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
                      >
                        {isPlaying ? (
                          <Pause className="w-4 h-4 text-[#165DFF]" />
                        ) : (
                          <Play className="w-4 h-4 text-[#165DFF]" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={(e) => toggleLock(recording.id, e)}
                      className="p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
                    >
                      <Lock className={`w-4 h-4 ${isLocked ? 'text-[#FA8C16] fill-[#FA8C16]' : 'text-[#86909C]'}`} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(recording.id, e)}
                      className="p-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-[#FA5151]" />
                    </button>
                  </div>
                </div>

                {/* 处理中状态显示 */}
                {recording.status === 'processing' && (
                  <div className="mt-3 flex items-center gap-2 text-[13px] text-[#FA8C16]">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>正在分析处理中...</span>
                  </div>
                )}

                {/* 分数显示 */}
                {recording.score !== null && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[13px] text-[#86909C]">智能评分：</span>
                    <span className="text-[16px] font-bold text-[#FA8C16]">{recording.score}</span>
                    <span className="text-[12px] text-[#86909C]">/ 100</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 空状态 */}
        {recordings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <Mic className="w-16 h-16 text-[#E5E6EB] mb-4" />
            <p className="text-[14px] text-[#86909C]">暂无录音数据</p>
            <button
              onClick={goToUpload}
              className="mt-4 px-6 py-2 bg-[#165DFF] text-white rounded-lg hover:bg-[#0E4FD1] transition-colors"
            >
              上传录音
            </button>
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
