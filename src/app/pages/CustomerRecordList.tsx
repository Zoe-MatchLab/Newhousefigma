import { useState } from 'react';
import { ChevronLeft, Play, Pause, Trash2, Lock } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import TabBar from '../components/TabBar';

export default function CustomerRecordList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId') || 'CUST_001';
  const customerName = searchParams.get('name') || '张先生';
  const [playingId, setPlayingId] = useState<string | null>(null);

  // 模拟录音数据
  const records = [
    {
      id: 'RECORD_001',
      name: '通话录音_20260412.wav',
      duration: '5分32秒',
      size: '3.2MB',
      building: '中海汇德里',
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
      agent: '陈佳佳',
      status: 'completed',
      score: 78,
      time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
    }
  ];

  const goBack = () => {
    navigate(`/customer/detail/${customerId}`);
  };

  const handlePlayRecord = (id: string) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
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

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={goBack} className="flex items-center gap-1 text-[#FA8C16]">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[15px]">返回</span>
        </button>
        <span className="text-[17px] font-semibold text-[#1D2129]">{customerName}的录音</span>
        <div className="w-15"></div>
      </header>

      {/* 录音列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] font-semibold text-[#1D2129]">录音记录</span>
          <span className="text-[12px] text-[#86909C]">共 {records.length} 条</span>
        </div>

        {records.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-[48px] text-[#E5E6EB] mb-4">
              <Lock />
            </div>
            <div className="text-[15px] font-semibold text-[#1D2129] mb-2">暂无录音记录</div>
            <div className="text-[13px] text-[#86909C]">该客户暂无关联录音</div>
          </div>
        ) : (
          <div className="space-y-3">
            {records.map((record) => (
              <div 
                key={record.id} 
                className="bg-white rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <button 
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white flex-shrink-0 ${record.status === 'completed' ? 'bg-[#FA8C16]' : 'bg-[#F7F8FA] text-[#86909C]'}`}
                    onClick={() => {
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
                      {record.building} · {record.duration}
                    </div>
                  </div>
                  {record.status === 'completed' && record.score && (
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center text-[14px] font-bold border-2 ${getScoreClass(record.score)}`}>
                      {record.score}
                    </div>
                  )}
                  <button 
                    className="w-8 h-8 bg-[#F7F8FA] rounded-full flex items-center justify-center text-[#86909C]"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#86909C]">{formatTime(record.time)}</span>
                  <span className={`px-2 py-1 rounded-full text-[12px] font-medium ${getStatusClass(record.status)}`}>
                    {getStatusLabel(record.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}