import { useState, useMemo } from 'react';
import { ChevronLeft, Play, Pause, Trash2, Lock, Search, Sliders, X, ChevronRight, Clock, Upload } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router';
import TabBar from '../../../components/TabBar';

export default function CustomerRecordList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get('customerId') || 'CUST_001';
  const customerName = searchParams.get('name') || '张先生';
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    sort: 'newest'
  });
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [tempFilters, setTempFilters] = useState(filters);

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

  // 过滤和排序后的录音数据
  const filteredRecords = useMemo(() => {
    let result = [...records];

    // 搜索
    if (searchText) {
      result = result.filter(record => 
        record.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 状态筛选
    if (filters.status) {
      result = result.filter(record => record.status === filters.status);
    }

    // 排序
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'newest':
          return b.time.getTime() - a.time.getTime();
        case 'oldest':
          return a.time.getTime() - b.time.getTime();
        case 'scoreDesc':
          return (b.score || 0) - (a.score || 0);
        case 'scoreAsc':
          return (a.score || 0) - (b.score || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [records, searchText, filters]);

  // 统计数据
  const stats = useMemo(() => {
    return {
      total: filteredRecords.length,
      completed: filteredRecords.filter(r => r.status === 'completed').length,
      processing: filteredRecords.filter(r => r.status === 'processing').length,
      pending: filteredRecords.filter(r => r.status === 'pending').length
    };
  }, [filteredRecords]);

  const goBack = () => {
    navigate(`/customer/detail/${customerId}`);
  };

  const goToRecordingResult = (recordId: string) => {
    navigate(`/recording/result/${recordId}`);
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
      completed: 'bg-[#E6FFF1] text-[#00B42A]',
      failed: 'bg-[#FFF1F0] text-[#FA5151]'
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

  // 打开筛选抽屉
  const openFilterDrawer = () => {
    setTempFilters(filters);
    setShowFilterDrawer(true);
  };

  // 关闭筛选抽屉
  const closeFilterDrawer = () => {
    setShowFilterDrawer(false);
  };

  // 应用筛选
  const applyFilter = () => {
    setFilters(tempFilters);
    setShowFilterDrawer(false);
  };

  // 重置筛选
  const resetFilter = () => {
    setTempFilters({ status: '', sort: 'newest' });
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

      {/* 统计卡片 */}
      <div className="px-4 py-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4">
          <div className="flex-1 text-center">
            <div className="text-[24px] font-bold text-[#00B42A]">{stats.completed}</div>
            <div className="text-[12px] text-[#86909C] mt-1">已完成</div>
          </div>
          <div className="w-px bg-[#E5E6EB]"></div>
          <div className="flex-1 text-center">
            <div className="text-[24px] font-bold text-[#FA8C16]">{stats.processing}</div>
            <div className="text-[12px] text-[#86909C] mt-1">分析中</div>
          </div>
          <div className="w-px bg-[#E5E6EB]"></div>
          <div className="flex-1 text-center">
            <div className="text-[24px] font-bold text-[#86909C]">{stats.pending}</div>
            <div className="text-[12px] text-[#86909C] mt-1">待分析</div>
          </div>
          <div className="w-px bg-[#E5E6EB]"></div>
          <div className="flex-1 text-center">
            <div className="text-[24px] font-bold text-[#1D2129]">{stats.total}</div>
            <div className="text-[12px] text-[#86909C] mt-1">总条数</div>
          </div>
        </div>
      </div>

      {/* 搜索栏 */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#86909C]" />
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="搜索录音名称"
              className="w-full h-10 bg-white border border-[#E5E6EB] rounded-full px-12 py-2 text-[14px] outline-none focus:border-[#FA8C16] focus:shadow-[0_0_0_2px_#FFF7E6] transition-all"
            />
          </div>
          <button
            onClick={openFilterDrawer}
            className={`w-10 h-10 bg-white border border-[#E5E6EB] rounded-full flex items-center justify-center text-[#4E5969] transition-all ${
              (filters.status || filters.sort !== 'newest') ? 'bg-[#FFF7E6] border-[#FA8C16] text-[#FA8C16]' : ''
            }`}
          >
            <Sliders className="w-5 h-5" />
            {(filters.status || filters.sort !== 'newest') && (
              <div className="absolute w-4 h-4 bg-[#FA8C16] text-white text-[10px] rounded-full flex items-center justify-center -mt-6 -mr-6">
                {!!filters.status + (filters.sort !== 'newest' ? 1 : 0)}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* 录音列表 */}
      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {filteredRecords.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-[48px] text-[#E5E6EB] mb-4">
              <Lock />
            </div>
            <div className="text-[15px] font-semibold text-[#1D2129] mb-2">暂无录音记录</div>
            <div className="text-[13px] text-[#86909C]">该客户暂无关联录音</div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div 
                key={record.id} 
                onClick={() => goToRecordingResult(record.id)}
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-[#1D2129] truncate">{record.name}</div>
                  </div>
                  <span className={`px-2 py-1 rounded text-[12px] font-medium ${getStatusClass(record.status)}`}>
                    {getStatusLabel(record.status)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1 text-[13px] text-[#86909C]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{record.duration}</span>
                  </div>
                  {record.score && (
                    <div className="flex items-center gap-1 text-[13px] text-[#86909C]">
                      <span>评分：</span>
                      <span className={`font-semibold ${
                        record.score >= 90 ? 'text-[#00B42A]' :
                        record.score >= 80 ? 'text-[#FA8C16]' :
                        record.score >= 70 ? 'text-[#FF7D00]' :
                        'text-[#FA5151]'
                      }`}>{record.score}分</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#E5E6EB]">
                  <div className="flex items-center gap-1 text-[12px] text-[#86909C]">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{formatTime(record.time)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[13px] text-[#FA8C16]">
                    <span>查看详情</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 筛选抽屉 */}
      {showFilterDrawer && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center">
          <div className="bg-white rounded-t-2xl w-full max-h-[70vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-[#E5E6EB] rounded-full mx-auto mt-3" />
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E6EB]">
              <span className="text-[16px] font-semibold text-[#1D2129]">筛选</span>
              <button onClick={closeFilterDrawer} className="w-8 h-8 flex items-center justify-center text-[#86909C]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-6">
              {/* 状态筛选 */}
              <div>
                <div className="text-[13px] text-[#86909C] mb-3">状态</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: '', label: '全部' },
                    { value: 'completed', label: '已完成' },
                    { value: 'processing', label: '分析中' },
                    { value: 'pending', label: '待分析' },
                    { value: 'failed', label: '分析失败' }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setTempFilters(prev => ({ ...prev, status: item.value }))}
                      className={`px-4 py-2 rounded-full text-[13px] transition-all ${
                        tempFilters.status === item.value
                          ? 'bg-[#FFF7E6] border border-[#FA8C16] text-[#FA8C16]'
                          : 'bg-[#F7F8FA] border border-[#E5E6EB] text-[#4E5969]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* 排序 */}
              <div>
                <div className="text-[13px] text-[#86909C] mb-3">排序</div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'newest', label: '最新优先' },
                    { value: 'oldest', label: '最早优先' },
                    { value: 'scoreDesc', label: '评分最高' },
                    { value: 'scoreAsc', label: '评分最低' }
                  ].map((item) => (
                    <button
                      key={item.value}
                      onClick={() => setTempFilters(prev => ({ ...prev, sort: item.value }))}
                      className={`px-4 py-2 rounded-full text-[13px] transition-all ${
                        tempFilters.sort === item.value
                          ? 'bg-[#FFF7E6] border border-[#FA8C16] text-[#FA8C16]'
                          : 'bg-[#F7F8FA] border border-[#E5E6EB] text-[#4E5969]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-4 py-4 border-t border-[#E5E6EB]">
              <button
                onClick={resetFilter}
                className="flex-1 h-11 bg-[#F7F8FA] text-[#4E5969] rounded-xl font-semibold active:bg-[#E5E6EB] transition-colors"
              >
                重置
              </button>
              <button
                onClick={applyFilter}
                className="flex-1 h-11 bg-[#FA8C16] text-white rounded-xl font-semibold active:bg-[#E67A0E] transition-colors"
              >
                应用
              </button>
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}