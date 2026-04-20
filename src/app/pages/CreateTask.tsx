import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';

type TaskType = '' | 'explore' | 'speech' | 'audio' | 'content' | 'custom';

interface CollectionPoint {
  id: string;
  name: string;
  required: boolean;
  types: string[];
}

export default function CreateTask() {
  const navigate = useNavigate();

  // 面板展开状态
  const [expandedPanels, setExpandedPanels] = useState({
    basicInfo: true,
    config: true,
    execution: true
  });

  // 表单数据
  const [taskType, setTaskType] = useState<TaskType>('');
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [checkInRange, setCheckInRange] = useState('200');
  const [aiReview, setAiReview] = useState(true);
  const [contentGeneration, setContentGeneration] = useState(true);
  const [mediaGeneration, setMediaGeneration] = useState(true);
  const [speechTraining, setSpeechTraining] = useState(false);
  const [audioAnalysis, setAudioAnalysis] = useState(false);
  const [selectedTrainingItems, setSelectedTrainingItems] = useState(['产品介绍', '价格谈判', '异议处理']);
  const [selectedAnalysisDimensions, setSelectedAnalysisDimensions] = useState<string[]>([]);
  const [executors, setExecutors] = useState<string[]>([]);
  const [notifiers, setNotifiers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [startReminder, setStartReminder] = useState('2');
  const [lightReminder, setLightReminder] = useState('48');
  const [mediumReminder, setMediumReminder] = useState('24');
  const [heavyReminder, setHeavyReminder] = useState('2');

  // 部门树选择弹窗
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [selectingType, setSelectingType] = useState<'executor' | 'notifier'>('executor');

  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([
    { id: '1', name: '接待处', required: true, types: ['图片', '视频'] },
    { id: '2', name: '沙盘区', required: true, types: ['图片', '视频', '音频'] },
    { id: '3', name: '样板间', required: false, types: ['图片', '视频'] }
  ]);

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const addCollectionPoint = () => {
    const newPoint: CollectionPoint = {
      id: Date.now().toString(),
      name: '新点位',
      required: false,
      types: ['图片']
    };
    setCollectionPoints([...collectionPoints, newPoint]);
  };

  const removeCollectionPoint = (id: string) => {
    setCollectionPoints(collectionPoints.filter(p => p.id !== id));
  };

  const handleCreateTask = () => {
    // 验证表单
    if (!taskType) {
      alert('请选择任务类型');
      return;
    }
    if (!taskTitle.trim()) {
      alert('请输入任务标题');
      return;
    }
    if (executors.length === 0) {
      alert('请选择执行人');
      return;
    }
    if (!startDate || !endDate) {
      alert('请选择任务时间');
      return;
    }

    // 提交任务
    console.log('创建任务', {
      taskType,
      taskTitle,
      taskDesc,
      executors,
      notifiers,
      startDate,
      endDate
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-20">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1D2129]" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#1D2129]">创建任务</h1>
        <button className="text-[14px] text-[#FA8C16] px-2 py-1 hover:bg-[#FFF7E6] rounded transition-colors">
          存草稿
        </button>
      </header>

      {/* 主内容区 */}
      <div className="p-4 space-y-3">
        {/* 基本信息面板 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <button
            onClick={() => togglePanel('basicInfo')}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#1D2129]">基本信息</span>
              <span className="px-2 py-0.5 bg-[#FA5151] text-white text-[11px] rounded">必填</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-[#86909C] transition-transform ${
                expandedPanels.basicInfo ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedPanels.basicInfo && (
            <div className="px-4 pb-4 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-[14px] text-[#1D2129] w-[70px]">
                    任务类型<span className="text-[#FA5151]">*</span>
                  </label>
                </div>
                <select
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value as TaskType)}
                  className="w-full h-12 px-3 border border-[#E5E6EB] rounded-lg text-[15px] text-[#1D2129] bg-white"
                >
                  <option value="">请选择任务类型</option>
                  <option value="explore">探盘任务</option>
                  <option value="speech">话术训练任务</option>
                  <option value="audio">录音分析任务</option>
                  <option value="content">文案生成任务</option>
                  <option value="custom">自定义任务</option>
                </select>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-[14px] text-[#1D2129] w-[70px]">
                    标题<span className="text-[#FA5151]">*</span>
                  </label>
                </div>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value.slice(0, 50))}
                  placeholder="请输入任务标题"
                  className="w-full px-3 py-2 border-b border-[#E5E6EB] text-[15px] focus:outline-none focus:border-[#FA8C16]"
                />
                <p className="text-[11px] text-[#86909C] mt-1 text-right">{taskTitle.length}/50</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-[14px] text-[#1D2129] w-[70px]">描述</label>
                </div>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value.slice(0, 200))}
                  placeholder="请输入任务描述"
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E6EB] rounded-lg text-[14px] resize-none focus:outline-none focus:border-[#FA8C16]"
                />
                <p className="text-[11px] text-[#86909C] mt-1 text-right">{taskDesc.length}/200</p>
              </div>
            </div>
          )}
        </div>

        {/* 配置信息面板 */}
        {taskType && (
          <div className="bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => togglePanel('config')}
              className="w-full px-4 py-3 flex items-center justify-between"
            >
              <span className="text-[15px] font-semibold text-[#1D2129]">配置信息</span>
              <ChevronDown
                className={`w-5 h-5 text-[#86909C] transition-transform ${
                  expandedPanels.config ? 'rotate-180' : ''
                }`}
              />
            </button>
            {expandedPanels.config && (
              <div className="px-4 pb-4 space-y-4">
                {taskType === 'explore' ? (
                  <>
                    {/* 楼盘信息 */}
                    <div className="p-3 bg-[#F7F8FA] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-[14px] font-semibold text-[#1D2129]">中海汇德里</h3>
                        <span className="text-[14px] text-[#FA8C16] font-semibold">35000元/㎡</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        <div className="text-[#86909C]">物业类型：住宅</div>
                        <div className="text-[#86909C]">开发商：中海地产</div>
                        <div className="text-[#86909C]">建筑面积：120-180㎡</div>
                        <div className="text-[#86909C]">交付时间：2027年6月</div>
                      </div>
                    </div>

                    {/* 打卡配置 */}
                    <div>
                      <label className="text-[14px] text-[#1D2129] mb-2 block">打卡范围</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={checkInRange}
                          onChange={(e) => setCheckInRange(e.target.value)}
                          className="flex-1 h-10 px-3 border border-[#E5E6EB] rounded-lg text-[14px]"
                        />
                        <span className="text-[14px] text-[#86909C]">米</span>
                      </div>
                    </div>

                    {/* 采集点位配置 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[14px] text-[#1D2129]">采集点位</label>
                        <div className="flex items-center gap-2">
                          <span className="text-[12px] text-[#86909C]">AI自动审核</span>
                          <label className="relative inline-block w-11 h-6">
                            <input
                              type="checkbox"
                              checked={aiReview}
                              onChange={(e) => setAiReview(e.target.checked)}
                              className="sr-only peer"
                            />
                            <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                            <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {collectionPoints.map((point) => (
                          <div key={point.id} className="p-3 bg-[#F5F5F5] rounded-xl">
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
                              {!point.required && (
                                <div className="flex items-center gap-1">
                                  <button className="p-1 hover:bg-white rounded transition-colors">
                                    <Edit2 className="w-4 h-4 text-[#86909C]" />
                                  </button>
                                  <button
                                    onClick={() => removeCollectionPoint(point.id)}
                                    className="p-1 hover:bg-white rounded transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 text-[#FA5151]" />
                                  </button>
                                </div>
                              )}
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
                        <button
                          onClick={addCollectionPoint}
                          className="w-full py-2 border border-dashed border-[#FA8C16] text-[#FA8C16] rounded-lg flex items-center justify-center gap-1 hover:bg-[#FFF7E6] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[14px]">添加点位</span>
                        </button>
                      </div>
                    </div>

                    {/* 内容生成配置 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#1D2129]">文案内容生成</span>
                        <label className="relative inline-block w-11 h-6">
                          <input
                            type="checkbox"
                            checked={contentGeneration}
                            onChange={(e) => setContentGeneration(e.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </label>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#1D2129]">图片/视频生成</span>
                        <label className="relative inline-block w-11 h-6">
                          <input
                            type="checkbox"
                            checked={mediaGeneration}
                            onChange={(e) => setMediaGeneration(e.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </label>
                      </div>
                    </div>

                    {/* 话术训练配置 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#1D2129]">启用话术训练</span>
                        <label className="relative inline-block w-11 h-6">
                          <input
                            type="checkbox"
                            checked={speechTraining}
                            onChange={(e) => setSpeechTraining(e.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </label>
                      </div>
                      {speechTraining && (
                        <div className="flex flex-wrap gap-2">
                          {selectedTrainingItems.map((item) => (
                            <span
                              key={item}
                              className="px-3 py-1 bg-[#FFF7E6] text-[#FA8C16] text-[13px] rounded-full flex items-center gap-1"
                            >
                              {item}
                              <button
                                onClick={() => setSelectedTrainingItems(selectedTrainingItems.filter(i => i !== item))}
                                className="hover:bg-[#FA8C16] hover:text-white rounded-full p-0.5 transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 录音分析配置 */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[14px] text-[#1D2129]">启用录音分析</span>
                        <label className="relative inline-block w-11 h-6">
                          <input
                            type="checkbox"
                            checked={audioAnalysis}
                            onChange={(e) => setAudioAnalysis(e.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
                        </label>
                      </div>
                      {audioAnalysis && (
                        <div className="text-[13px] text-[#86909C]">
                          分析维度：话术规范、情绪识别、关键词覆盖、邀约意向
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center text-[#86909C] text-[14px]">
                    该任务类型配置暂未开放
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 执行信息面板 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <button
            onClick={() => togglePanel('execution')}
            className="w-full px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[#1D2129]">执行信息</span>
              <span className="px-2 py-0.5 bg-[#FA5151] text-white text-[11px] rounded">必填</span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-[#86909C] transition-transform ${
                expandedPanels.execution ? 'rotate-180' : ''
              }`}
            />
          </button>
          {expandedPanels.execution && (
            <div className="px-4 pb-4 space-y-4">
              {/* 任务时间 */}
              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">任务时间</label>
                <div className="space-y-3">
                  <div>
                    <label className="text-[13px] text-[#86909C] mb-1 block">开始时间</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full h-10 px-3 border border-[#E5E6EB] rounded-lg text-[14px]"
                    />
                  </div>
                  <div>
                    <label className="text-[13px] text-[#86909C] mb-1 block">结束时间</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full h-10 px-3 border border-[#E5E6EB] rounded-lg text-[14px]"
                    />
                  </div>
                </div>
              </div>

              {/* 通知时间 */}
              <div>
                <label className="text-[14px] text-[#1D2129] mb-3 block">通知时间</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#E8F3FF] text-[#165DFF] text-[11px] rounded">开始前</span>
                      <span className="text-[13px] text-[#4E5969]">提前</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={startReminder}
                        onChange={(e) => setStartReminder(e.target.value)}
                        className="w-12 h-7 px-2 border border-[#E5E6EB] rounded text-[12px] text-center"
                      />
                      <span className="text-[13px] text-[#86909C]">小时</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 提醒时间 */}
              <div>
                <label className="text-[14px] text-[#1D2129] mb-3 block">提醒时间</label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#E8F5E9] text-[#00B42A] text-[11px] rounded">轻度</span>
                      <span className="text-[13px] text-[#4E5969]">截止前</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={lightReminder}
                        onChange={(e) => setLightReminder(e.target.value)}
                        className="w-12 h-7 px-2 border border-[#E5E6EB] rounded text-[12px] text-center"
                      />
                      <span className="text-[13px] text-[#86909C]">小时</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FFF7E6] text-[#FA8C16] text-[11px] rounded">中度</span>
                      <span className="text-[13px] text-[#4E5969]">截止前</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={mediumReminder}
                        onChange={(e) => setMediumReminder(e.target.value)}
                        className="w-12 h-7 px-2 border border-[#E5E6EB] rounded text-[12px] text-center"
                      />
                      <span className="text-[13px] text-[#86909C]">小时</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-[#FFECE8] text-[#FA5151] text-[11px] rounded">重度</span>
                      <span className="text-[13px] text-[#4E5969]">截止前</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={heavyReminder}
                        onChange={(e) => setHeavyReminder(e.target.value)}
                        className="w-12 h-7 px-2 border border-[#E5E6EB] rounded text-[12px] text-center"
                      />
                      <span className="text-[13px] text-[#86909C]">小时</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 执行人 */}
              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">执行人</label>
                <button
                  onClick={() => {
                    setSelectingType('executor');
                    setShowDeptModal(true);
                  }}
                  className="w-full h-10 px-3 border border-[#E5E6EB] rounded-lg text-[14px] text-[#86909C] text-left hover:border-[#FA8C16] transition-colors"
                >
                  {executors.length > 0 ? `已选择 ${executors.length} 人` : '请选择执行人'}
                </button>
                {executors.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {executors.map((executor) => (
                      <span
                        key={executor}
                        className="px-3 py-1 bg-[#FFF7E6] text-[#FA8C16] text-[13px] rounded-full flex items-center gap-1"
                      >
                        {executor}
                        <button
                          onClick={() => setExecutors(executors.filter(e => e !== executor))}
                          className="hover:bg-[#FA8C16] hover:text-white rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 通知人 */}
              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">通知人</label>
                <button
                  onClick={() => {
                    setSelectingType('notifier');
                    setShowDeptModal(true);
                  }}
                  className="w-full h-10 px-3 border border-[#E5E6EB] rounded-lg text-[14px] text-[#86909C] text-left hover:border-[#FA8C16] transition-colors"
                >
                  {notifiers.length > 0 ? `已选择 ${notifiers.length} 人` : '请选择通知人'}
                </button>
                {notifiers.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {notifiers.map((notifier) => (
                      <span
                        key={notifier}
                        className="px-3 py-1 bg-[#E8F3FF] text-[#165DFF] text-[13px] rounded-full flex items-center gap-1"
                      >
                        {notifier}
                        <button
                          onClick={() => setNotifiers(notifiers.filter(n => n !== notifier))}
                          className="hover:bg-[#165DFF] hover:text-white rounded-full p-0.5 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[#E5E6EB]">
        <button
          onClick={handleCreateTask}
          className="w-full h-12 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white text-[16px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          创建任务
        </button>
      </div>

      {/* 部门树选择弹窗 */}
      {showDeptModal && (
        <DepartmentSelector
          type={selectingType}
          onClose={() => setShowDeptModal(false)}
          onConfirm={(selectedPeople) => {
            if (selectingType === 'executor') {
              setExecutors([...executors, ...selectedPeople]);
            } else {
              setNotifiers([...notifiers, ...selectedPeople]);
            }
            setShowDeptModal(false);
          }}
        />
      )}
    </div>
  );
}

// 部门选择器组件
interface DepartmentSelectorProps {
  type: 'executor' | 'notifier';
  onClose: () => void;
  onConfirm: (selectedPeople: string[]) => void;
}

function DepartmentSelector({ type, onClose, onConfirm }: DepartmentSelectorProps) {
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['sales']);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

  // 模拟部门树数据
  const departments = [
    {
      id: 'sales',
      name: '销售部',
      children: [
        { id: 'sales-1', name: '一组', members: ['张三', '李四', '王五'] },
        { id: 'sales-2', name: '二组', members: ['赵六', '钱七', '孙八'] }
      ]
    },
    {
      id: 'marketing',
      name: '市场部',
      children: [
        { id: 'marketing-1', name: '策划组', members: ['周九', '吴十'] },
        { id: 'marketing-2', name: '推广组', members: ['郑十一', '冯十二'] }
      ]
    },
    {
      id: 'tech',
      name: '技术部',
      children: [
        { id: 'tech-1', name: '研发组', members: ['陈十三', '褚十四'] }
      ]
    }
  ];

  const toggleDept = (deptId: string) => {
    if (expandedDepts.includes(deptId)) {
      setExpandedDepts(expandedDepts.filter(id => id !== deptId));
    } else {
      setExpandedDepts([...expandedDepts, deptId]);
    }
  };

  const togglePerson = (person: string) => {
    if (selectedPeople.includes(person)) {
      setSelectedPeople(selectedPeople.filter(p => p !== person));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={onClose}>
      <div
        className="w-full bg-white rounded-t-3xl max-h-[80vh] flex flex-col animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 标题 */}
        <div className="px-4 py-4 border-b border-[#E5E6EB] flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#1D2129]">
            {type === 'executor' ? '选择执行人' : '选择通知人'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded transition-colors">
            <X className="w-5 h-5 text-[#86909C]" />
          </button>
        </div>

        {/* 部门树 */}
        <div className="flex-1 overflow-y-auto p-4">
          {departments.map((dept) => (
            <div key={dept.id} className="mb-2">
              <button
                onClick={() => toggleDept(dept.id)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F7F8FA] rounded-lg transition-colors"
              >
                <ChevronRight
                  className={`w-4 h-4 text-[#86909C] transition-transform ${
                    expandedDepts.includes(dept.id) ? 'rotate-90' : ''
                  }`}
                />
                <span className="text-[14px] font-semibold text-[#1D2129]">{dept.name}</span>
              </button>

              {expandedDepts.includes(dept.id) && (
                <div className="ml-6 mt-1">
                  {dept.children.map((group) => (
                    <div key={group.id} className="mb-2">
                      <div className="px-3 py-1 text-[13px] text-[#86909C]">{group.name}</div>
                      {group.members.map((member) => (
                        <label
                          key={member}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-[#F7F8FA] rounded-lg cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPeople.includes(member)}
                            onChange={() => togglePerson(member)}
                            className="w-4 h-4 accent-[#FA8C16] rounded"
                          />
                          <span className="text-[14px] text-[#4E5969]">{member}</span>
                        </label>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 底部按钮 */}
        <div className="p-4 border-t border-[#E5E6EB] flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-10 border border-[#E5E6EB] text-[#4E5969] rounded-lg hover:bg-[#F7F8FA] transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(selectedPeople)}
            className="flex-1 h-10 bg-[#FA8C16] text-white rounded-lg hover:bg-[#E67E00] transition-colors"
          >
            确定 {selectedPeople.length > 0 && `(${selectedPeople.length})`}
          </button>
        </div>
      </div>
    </div>
  );
}
