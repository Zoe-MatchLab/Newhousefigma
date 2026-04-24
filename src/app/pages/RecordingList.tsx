import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Trash2, Play, Pause, Lock, Loader2, RefreshCw, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../components/TabBar';

export default function RecordingList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState([
    {
      id: 'RECORD_001',
      name: '通话录音_20260412.wav',
      duration: '5分32秒',
      size: '3.2MB',
      building: '中海汇德里',
      customer: '张三',
      agent: '陈佳佳',
      status: 'completed' as 'pending' | 'processing' | 'completed' | 'failed',
      score: 85,
      time: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'RECORD_002',
      name: '20260411_100512.wav',
      duration: '4分18秒',
      size: '2.8MB',
      building: '万科翡翠公园',
      customer: '李四',
      agent: '李明',
      status: 'processing',
      score: null,
      time: new Date(Date.now() - 26 * 60 * 60 * 1000)
    },
    {
      id: 'RECORD_003',
      name: '邀约录音_0411.mp3',
      duration: '3分05秒',
      size: '1.9MB',
      building: '华润外滩九里',
      customer: null,
      agent: '王芳',
      status: 'pending',
      score: null,
      time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'RECORD_004',
      name: '20260410_161200.wav',
      duration: '6分22秒',
      size: '4.5MB',
      building: '龙湖天琅',
      customer: '王五',
      agent: '赵伟',
      status: 'completed',
      score: 92,
      time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'RECORD_005',
      name: '客户回访_0410.wav',
      duration: '4分55秒',
      size: '3.1MB',
      building: '中海汇德里',
      customer: '赵六',
      agent: '陈佳佳',
      status: 'completed',
      score: 78,
      time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    },
    {
      id: 'RECORD_006',
      name: '新客户初访_0409.mp3',
      duration: '5分10秒',
      size: '3.3MB',
      building: '万科翡翠公园',
      customer: '钱七',
      agent: '李明',
      status: 'failed',
      score: null,
      time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    }
  ]);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [stats, setStats] = useState({
    total: 6,
    pending: 2,
    avgScore: 85
  });

  useEffect(() => {
    updateStats();
  }, [records]);

  const updateStats = () => {
    const total = records.length;
    const pending = records.filter(r => r.status === 'pending' || r.status === 'processing').length;
    const completedRecords = records.filter(r => r.status === 'completed' && r.score);
    const avgScore = completedRecords.length > 0
      ? Math.round(completedRecords.reduce((sum, r) => sum + (r.score || 0), 0) / completedRecords.length)
      : 0;

    setStats({ total, pending, avgScore });
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

  const getScoreClass = (score: number | null) => {
    if (!score) return '';
    if (score >= 85) return 'bg-[#E8FFEA] text-[#00B42A] border-[#00B42A]';
    if (score >= 70) return 'bg-[#FFF7E6] text-[#FA8C16] border-[#FA8C16]';
    return 'bg-[#FFECE8] text-[#FA5151] border-[#FA5151]';
  };

  const getStatusLabel = (status: string) => {
    const map: Record<string, string> = {
      pending: '待分析',
      processing: '分析中',
      completed: '已完成',
      failed: '分析失败'
    };
    return map[status] || status;
  };

  const getStatusClass = (status: string) => {
    const map: Record<string, string> = {
      pending: 'bg-[#F7F8FA] text-[#86909C]',
      processing: 'bg-[#FFF7E8] text-[#FA8C16]',
      completed: 'bg-[#E8FFEA] text-[#00B42A]',
      failed: 'bg-[#FFECE8] text-[#FA5151]'
    };
    return map[status] || 'bg-[#F7F8FA] text-[#86909C]';
  };

  const handlePlayRecord = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  const handleRetryRecord = (id: string) => {
    setRecords(prev => prev.map(r => 
      r.id === id ? { ...r, status: 'processing', score: null } : r
    ));
  };

  const handleDeleteRecord = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setRecords(prev => prev.filter(r => r.id !== deleteTargetId));
      setShowDeleteDialog(false);
      setDeleteTargetId(null);
    }
  };

  const goUpload = () => {
    navigate('/recording/upload');
  };

  const goResult = (id: string) => {
    navigate(`/recording/result/${id}`);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => navigate('/')} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg active:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1D2129]" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#1D2129]">约看录音分析</h1>
        <div className="w-8" />
      </header>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-2 p-4 bg-white">
        <div className="bg-[#F7F8FA] rounded-lg p-4 text-center">
          <div className="text-[22px] font-bold text-[#FA8C16]">{stats.total}</div>
          <div className="text-[11px] text-[#86909C] mt-1">录音总数</div>
        </div>
        <div className="bg-[#F7F8FA] rounded-lg p-4 text-center">
          <div className="text-[22px] font-bold text-[#FA8C16]">{stats.pending}</div>
          <div className="text-[11px] text-[#86909C] mt-1">待分析</div>
        </div>
        <div className="bg-[#F7F8FA] rounded-lg p-4 text-center">
          <div className="text-[22px] font-bold text-[#00B42A]">{stats.avgScore}</div>
          <div className="text-[11px] text-[#86909C] mt-1">平均评分</div>
        </div>
      </div>

      {/* 上传按钮 */}
      <div className="p-4">
        <button 
          onClick={goUpload}
          className="w-full h-12 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-xl flex items-center justify-center gap-2 active:opacity-90 transition-opacity shadow-lg"
        >
          <Mic className="w-5 h-5" />
          <span className="text-[15px] font-semibold">上传录音</span>
        </button>
      </div>

      {/* 录音列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold text-[#1D2129]">录音记录</span>
          <span className="text-[12px] text-[#86909C]">共 {records.length} 条</span>
        </div>

        {records.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-[48px] text-[#E5E6EB] mb-4">
              <Mic />
            </div>
            <div className="text-[15px] font-semibold text-[#1D2129] mb-2">暂无录音记录</div>
            <div className="text-[13px] text-[#86909C] mb-6">点击上方按钮上传录音，开启AI分析</div>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record, index) => (
              <div 
                key={record.id} 
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md"
                onClick={() => goResult(record.id)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <button 
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 ${record.status === 'completed' ? 'bg-[#FA8C16]' : 'bg-[#F7F8FA] text-[#86909C]'}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (record.status === 'completed') {
                        handlePlayRecord(record.id);
                      }
                    }}
                    disabled={record.status !== 'completed'}
                  >
                    {record.status === 'completed' ? (
                      playingId === record.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold text-[#1D2129] truncate">{record.name}</div>
                    <div className="text-[12px] text-[#86909C] mt-1">
                      {record.customer ? `${record.customer} · ` : ''}{record.building} · {record.duration}
                    </div>
                  </div>
                  {record.status === 'completed' && record.score && (
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold border-2 ${getScoreClass(record.score)}`}>
                      {record.score}
                    </div>
                  )}
                  <button 
                    className="w-8 h-8 bg-[#F7F8FA] rounded-full flex items-center justify-center text-[#86909C]"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteRecord(record.id);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#86909C]">{formatTime(record.time)}</span>
                  {record.status === 'processing' ? (
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusClass(record.status)}`}>
                        <Loader2 className="w-3 h-3 inline animate-spin mr-1" />
                        分析中
                      </span>
                      <div className="w-16 h-1 bg-[#F7F8FA] rounded-full overflow-hidden">
                        <div className="h-full bg-[#FA8C16] rounded-full animate-progress" style={{ width: '60%' }} />
                      </div>
                    </div>
                  ) : record.status === 'failed' ? (
                    <button 
                      className="flex items-center gap-1 px-3 py-1 bg-[#FA5151] text-white text-[12px] font-semibold rounded-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRetryRecord(record.id);
                      }}
                    >
                      <RefreshCw className="w-3 h-3" />
                      重试
                    </button>
                  ) : (
                    <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusClass(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[calc(100%-64px)] max-w-xs">
            <div className="text-[16px] font-semibold text-[#1D2129] mb-2">确认删除</div>
            <div className="text-[13px] text-[#4E5969] mb-6">删除后无法恢复，确定要删除这条录音吗？</div>
            <div className="flex gap-2">
              <button 
                className="flex-1 h-11 bg-[#F7F8FA] text-[#4E5969] rounded-xl font-semibold"
                onClick={() => setShowDeleteDialog(false)}
              >
                取消
              </button>
              <button 
                className="flex-1 h-11 bg-[#FA5151] text-white rounded-xl font-semibold"
                onClick={confirmDelete}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
