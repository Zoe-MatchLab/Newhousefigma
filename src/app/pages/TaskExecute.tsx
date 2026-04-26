import { useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical, MapPin, Clock, ChevronRight, RefreshCw, Edit, Eye, Lock } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

export default function TaskExecute() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const currentStep = parseInt(searchParams.get('step') || '0');
  const readonly = searchParams.get('readonly') === 'true';
  const executorName = searchParams.get('executor') || '';
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 模拟任务数据
  const taskData = {
    houseName: '中海汇德里集攻活动',
    address: '浦东新区张江高科技园区',
    deadline: '2026-04-08 18:00',
    currentStage: currentStep
  };

  // 根据当前阶段计算各阶段状态
  const calculateStages = () => {
    const current = taskData.currentStage;
    return [
      {
        id: 1,
        name: 'AI卖点采集',
        status: current >= 1 ? 'completed' : 'pending',
        time: current >= 1 ? '10:30:00' : ''
      },
      {
        id: 2,
        name: 'AI一键成稿',
        status: current >= 2 ? 'completed' : (current >= 1 ? 'active' : 'pending')
      },
      {
        id: 3,
        name: 'AI图文视频',
        status: current >= 3 ? 'completed' : (current >= 2 ? 'active' : 'pending')
      }
    ];
  };

  const stages = calculateStages();
  const completedCount = stages.filter(s => s.status === 'completed').length;
  const totalCount = stages.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const getStageIcon = (status: string) => {
    if (status === 'completed') return '✅';
    if (status === 'active') return '🔄';
    return '⬜';
  };

  const showMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  // 检查位置是否在范围内（模拟）
  const checkLocationBeforeEntry = () => {
    const randomOffset = Math.floor(Math.random() * 800);
    return {
      isInRange: randomOffset <= 500,
      offset: randomOffset
    };
  };

  const handleCheckin = () => {
    const result = checkLocationBeforeEntry();
    if (!result.isInRange) {
      showMessage(`不在范围内，偏离点位${result.offset}米，请先进入指定区域`);
      return;
    }
    // 跳转到点位签到页面
    navigate(`/tasks/${id}/checkin`);
  };

  const handleContentGeneration = () => {
    // 进入阶段2：文案生成
    navigate(`/tasks/${id}/content-generation`);
  };

  const handleConfirm = () => {
    // 重新进入阶段2查看/编辑文案
    navigate(`/tasks/${id}/content-generation`);
  };

  const handleVideoResult = () => {
    // 查看图片视频生成结果
    navigate(`/tasks/${id}/media-generation`);
  };

  const renderStageCard = (stage: any) => {
    const cardClass = stage.status === 'completed' ? 'border-l-[#00B42A]' : stage.status === 'active' ? 'border-l-[#FA8C16]' : 'border-l-[#E5E6EB]';

    return (
      <div
        key={stage.id}
        className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${cardClass} transition-all`}
      >
        {/* 标题行 */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[16px]">{getStageIcon(stage.status)}</span>
          <span className="text-[15px] font-semibold text-[#1D2129]">【阶段{stage.id}】{stage.name}</span>
        </div>

        {/* 状态和操作区 */}
        {stage.status === 'completed' && (
          <div className="flex items-center justify-between">
            <span className="text-[13px] text-[#00B42A]">
              {stage.id === 1 && '✅ AI卖点采集完成'}
              {stage.id === 2 && '✅ AI一键成稿完成'}
              {stage.id === 3 && '✅ AI图文视频完成'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (readonly) {
                  if (stage.id === 1) navigate(`/tasks/${id}/checkin?readonly=true`);
                  else if (stage.id === 2) navigate(`/tasks/${id}/content-generation?readonly=true`);
                  else if (stage.id === 3) navigate(`/tasks/${id}/media-generation?readonly=true`);
                } else {
                  if (stage.id === 1) handleCheckin();
                  else if (stage.id === 2) handleConfirm();
                  else if (stage.id === 3) handleVideoResult();
                }
              }}
              className="w-8 h-8 bg-[#FFF7E6] text-[#FA8C16] rounded-full flex items-center justify-center active:bg-[#FFE7CC] active:scale-90 transition-all"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {stage.status === 'active' && (
          <div className="space-y-3">
            {stage.id === 1 && (
              <p className="text-[13px] text-[#86909C]">请到达楼盘现场进行AI卖点采集</p>
            )}
            {stage.id === 2 && (
              <p className="text-[13px] text-[#86909C]">AI将根据采集的卖点一键生成营销文案</p>
            )}
            {stage.id === 3 && (
              <p className="text-[13px] text-[#86909C]">AI将根据文案进行图文视频创作</p>
            )}
            {readonly ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (stage.id === 1) navigate(`/tasks/${id}/checkin?readonly=true`);
                  else if (stage.id === 2) navigate(`/tasks/${id}/content-generation?readonly=true`);
                  else if (stage.id === 3) navigate(`/tasks/${id}/media-generation?readonly=true`);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-[#E8F3FF] text-[#165DFF] border-2 border-[#165DFF] rounded-xl text-[14px] font-medium active:scale-[0.98] transition-all"
              >
                <Eye className="w-4 h-4" />
                查看详情
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (stage.id === 1) handleCheckin();
                  else if (stage.id === 2) handleContentGeneration();
                  else if (stage.id === 3) handleVideoResult();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-xl text-[14px] font-medium active:scale-[0.98] transition-all shadow-sm"
              >
                {stage.id === 1 && '开始AI卖点采集'}
                {stage.id === 2 && '开始AI一键成稿'}
                {stage.id === 3 && '查看AI图文视频结果'}
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {stage.status === 'pending' && (
          <div className="space-y-3">
            <p className="text-[13px] text-[#86909C]">
              {stage.id === 1 && '请到达楼盘现场进行AI卖点采集'}
              {stage.id === 2 && '请先完成AI卖点采集'}
              {stage.id === 3 && '请先完成AI一键成稿'}
            </p>
            {readonly ? (
              <div className="w-full flex items-center justify-center gap-2 py-3 bg-[#F7F8FA] text-[#86909C] rounded-xl text-[13px]">
                <Lock className="w-4 h-4" />
                <span>暂未完成</span>
              </div>
            ) : stage.id === 1 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCheckin();
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-xl text-[14px] font-medium active:scale-[0.98] transition-all shadow-sm"
              >
                开始AI卖点采集 <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-full flex items-center justify-center gap-2 py-3 bg-[#F7F8FA] text-[#86909C] rounded-xl text-[13px]">
                <Lock className="w-4 h-4" />
                <span>需完成上一阶段</span>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-8">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center gap-4 sticky top-0 z-10">
        <button
          onClick={() => navigate(readonly ? `/tasks/${id}` : '/')}
          className="w-8 h-8 bg-[#F7F8FA] rounded-full flex items-center justify-center hover:bg-[#E5E6EB] active:scale-95 transition-all"
        >
          <ArrowLeft className="w-4 h-4 text-[#1D2129]" />
        </button>
        <div className="flex-1 text-center">
          <h1 className="text-[17px] font-semibold text-[#1D2129]">
            {readonly ? '查看执行详情' : '集攻活动详情'}
          </h1>
          {readonly && executorName && (
            <div className="text-[12px] text-[#86909C] mt-0.5">执行人：{executorName}</div>
          )}
        </div>
        {!readonly && (
          <button
            onClick={() => showMessage('更多功能')}
            className="w-8 h-8 flex items-center justify-center text-[#86909C]"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        )}
        {readonly && <div className="w-8"></div>}
      </header>

      {/* 只读模式提示 */}
      {readonly && (
        <div className="bg-[#E8F3FF] border-l-4 border-[#165DFF] mx-4 mt-4 px-4 py-3 rounded-r-xl">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-[#165DFF] flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-[13px] text-[#165DFF] font-medium mb-1">查看模式</div>
              <div className="text-[12px] text-[#4E5969] leading-relaxed">
                您正在查看执行人的任务执行情况，所有操作已禁用
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 楼盘信息区 */}
      <div className="bg-white px-4 py-6">
        <h2 className="text-[20px] font-bold text-[#1D2129] mb-2 flex items-center gap-2">
          <span className="text-[20px]">🏠</span>
          {taskData.houseName}
        </h2>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-[13px] text-[#4E5969]">
            <MapPin className="w-4 h-4 text-[#FA8C16]" />
            <span>{taskData.address}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-[#FA5151]">
            <Clock className="w-4 h-4" />
            <span>4月8日 18:00截止</span>
          </div>
        </div>
      </div>

      {/* 总进度条 */}
      <div className="bg-white px-4 py-4 border-t border-[#E5E6EB]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[13px] text-[#86909C]">完成进度</span>
          <span className="text-[13px] font-semibold text-[#FA8C16]">
            {completedCount}/{totalCount} ({progressPercent}%)
          </span>
        </div>
        <div className="h-1.5 bg-[#F7F8FA] rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-[#FA8C16] to-[#FF9500] rounded-full transition-all duration-400"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className={`w-2 h-2 rounded-full transition-all ${
                stage.status === 'completed'
                  ? 'bg-[#00B42A]'
                  : stage.status === 'active'
                  ? 'bg-[#FA8C16] scale-125'
                  : 'bg-[#E5E6EB]'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 阶段入口列表 */}
      <div className="p-4 space-y-4">
        {stages.map(renderStageCard)}
      </div>

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1D2129]/90 text-white px-6 py-3 rounded-xl text-[14px] z-[10000] animate-fade-in pointer-events-none">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
