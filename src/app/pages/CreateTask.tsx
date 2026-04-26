import { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronRight, Plus, X, Edit2, Trash2, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

type TaskType = '' | 'explore' | 'speech' | 'audio' | 'content' | 'custom';

interface CollectionPoint {
  id: string;
  name: string;
  description: string;
  types: string[];
  required: boolean;
  editable: boolean;
}

interface TrainingProject {
  id: string;
  name: string;
  completionType: 'count' | 'score';
  count: number;
  score: number;
}

interface Policy {
  id: string;
  startDate: string;
  endDate: string;
  description: string;
  specialNote: string;
}

export default function CreateTask() {
  const navigate = useNavigate();

  const [expandedPanels, setExpandedPanels] = useState({
    basicInfo: true,
    config: true,
    execution: true
  });

  const [taskType, setTaskType] = useState<TaskType>('');
  const [taskTitle, setTaskTitle] = useState('');

  // 生成默认标题
  const generateDefaultTitle = (type: TaskType) => {
    if (!type) return '';
    
    // 获取当前日期
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    // 姓名（使用默认值，实际项目中可能从登录信息获取）
    const userName = '管理员';
    
    // 任务类型名称
    let typeName = '';
    switch (type) {
      case 'explore':
        typeName = '新盘集攻活动';
        break;
      case 'speech':
        typeName = 'AI顾问陪练';
        break;
      case 'audio':
        typeName = 'AI客情分析';
        break;
      case 'content':
        typeName = '每日选题';
        break;
      default:
        typeName = '';
    }
    
    return `${dateStr}-${userName}-${typeName}`;
  };
  const [taskDesc, setTaskDesc] = useState('');

  const [checkInEnabled, setCheckInEnabled] = useState(false);
  const [checkInRange, setCheckInRange] = useState('200');
  
  const [aiReview, setAiReview] = useState(false);
  const [contentGeneration, setContentGeneration] = useState(true);
  const [mediaGeneration, setMediaGeneration] = useState(true);
  
  const [speechTraining, setSpeechTraining] = useState(false);
  const [trainingProjects, setTrainingProjects] = useState<TrainingProject[]>([
    { id: '1', name: '中海汇德里产品力训练', completionType: 'count', count: 3, score: 85 }
  ]);
  
  const [audioAnalysis, setAudioAnalysis] = useState(false);
  const [audioCount, setAudioCount] = useState('1');

  const [policies, setPolicies] = useState<Policy[]>([]);

  const [allowReject, setAllowReject] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');

  const [startReminder, setStartReminder] = useState({
    normal: { days: '', time: '' },
    important: { days: '', time: '' },
    urgent: { days: '', time: '' }
  });
  const [endReminder, setEndReminder] = useState({
    normal: { days: '', time: '' },
    important: { days: '', time: '' },
    urgent: { days: '', time: '' }
  });

  const [executors, setExecutors] = useState<string[]>([]);
  const [notifiers, setNotifiers] = useState<string[]>([]);

  const [showDeptModal, setShowDeptModal] = useState(false);
  const [selectingType, setSelectingType] = useState<'executor' | 'notifier'>('executor');

  const [showPointModal, setShowPointModal] = useState(false);
  const [editingPoint, setEditingPoint] = useState<CollectionPoint | null>(null);
  const [pointForm, setPointForm] = useState({
    name: '',
    description: '',
    types: [] as string[],
    required: false
  });

  const openPointModal = (point?: CollectionPoint) => {
    if (point) {
      setEditingPoint(point);
      setPointForm({
        name: point.name,
        description: point.description,
        types: [...point.types],
        required: point.required
      });
    } else {
      setEditingPoint(null);
      setPointForm({
        name: '',
        description: '',
        types: [],
        required: false
      });
    }
    setShowPointModal(true);
  };

  const closePointModal = () => {
    setShowPointModal(false);
    setEditingPoint(null);
  };

  const savePoint = () => {
    if (!pointForm.name.trim()) {
      alert('请输入打卡点名称');
      return;
    }
    if (pointForm.name.length > 32) {
      alert('打卡点名称不能超过32个字符');
      return;
    }

    if (editingPoint) {
      setCollectionPoints(collectionPoints.map(p => 
        p.id === editingPoint.id ? { ...p, ...pointForm } : p
      ));
    } else {
      const newPoint: CollectionPoint = {
        id: Date.now().toString(),
        name: pointForm.name,
        description: pointForm.description,
        types: [...pointForm.types],
        required: pointForm.required,
        editable: true
      };
      setCollectionPoints([...collectionPoints, newPoint]);
    }
    closePointModal();
  };

  const togglePointType = (type: string) => {
    setPointForm(prev => ({
      ...prev,
      types: prev.types.includes(type)
        ? prev.types.filter(t => t !== type)
        : [...prev.types, type]
    }));
  };

  const [collectionPoints, setCollectionPoints] = useState<CollectionPoint[]>([
    { id: '1', name: '接待处', description: '', types: ['图片', '视频'], required: true, editable: false },
    { id: '2', name: '沙盘区', description: '', types: ['图片', '视频', '音频'], required: true, editable: true },
    { id: '3', name: '样板间A', description: '', types: ['图片', '视频'], required: true, editable: true },
    { id: '4', name: '样板间B', description: '', types: ['图片', '视频'], required: false, editable: true },
    { id: '5', name: '小区环境', description: '', types: ['图片'], required: false, editable: true },
  ]);

  const togglePanel = (panel: keyof typeof expandedPanels) => {
    setExpandedPanels(prev => ({ ...prev, [panel]: !prev[panel] }));
  };

  const handleContentGenerationChange = (checked: boolean) => {
    setContentGeneration(checked);
    if (!checked) {
      setMediaGeneration(false);
    }
  };

  const addCollectionPoint = () => {
    const newPoint: CollectionPoint = {
      id: Date.now().toString(),
      name: '新点位',
      description: '',
      types: ['图片'],
      required: false,
      editable: true
    };
    setCollectionPoints([...collectionPoints, newPoint]);
  };

  const removeCollectionPoint = (id: string) => {
    const point = collectionPoints.find(p => p.id === id);
    if (point && !point.editable) {
      alert('该点位不可删除');
      return;
    }
    setCollectionPoints(collectionPoints.filter(p => p.id !== id));
  };

  const updateCollectionPoint = (id: string, field: keyof CollectionPoint, value: string | boolean | string[]) => {
    setCollectionPoints(collectionPoints.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addTrainingProject = () => {
    const newProject: TrainingProject = {
      id: Date.now().toString(),
      name: 'AI邀约话术陪练',
      completionType: 'count',
      count: 1,
      score: 60
    };
    setTrainingProjects([...trainingProjects, newProject]);
  };

  const removeTrainingProject = (id: string) => {
    setTrainingProjects(trainingProjects.filter(p => p.id !== id));
  };

  const addPolicy = () => {
    const newPolicy: Policy = {
      id: Date.now().toString(),
      startDate: '',
      endDate: '',
      description: '',
      specialNote: ''
    };
    setPolicies([...policies, newPolicy]);
  };

  const removePolicy = (id: string) => {
    setPolicies(policies.filter(p => p.id !== id));
  };

  const updatePolicy = (id: string, field: keyof Policy, value: string) => {
    setPolicies(policies.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleCreateTask = () => {
    if (!taskType) {
      alert('请选择任务类型');
      return;
    }
    if (!taskTitle.trim()) {
      alert('请输入任务标题');
      return;
    }
    if (taskTitle.length > 32) {
      alert('任务标题最多32字');
      return;
    }
    if (checkInEnabled && (!checkInRange || parseInt(checkInRange) < 100 || parseInt(checkInRange) > 9999)) {
      alert('打卡范围需在100-9999米之间');
      return;
    }
    if (!startDate || !startTime || !endDate || !endTime) {
      alert('请选择任务时间');
      return;
    }
    if (executors.length === 0) {
      alert('请选择执行人');
      return;
    }

    console.log('创建任务', {
      taskType,
      taskTitle,
      taskDesc,
      checkInEnabled,
      checkInRange,
      aiReview,
      contentGeneration,
      mediaGeneration,
      speechTraining,
      trainingProjects,
      audioAnalysis,
      audioCount,
      policies,
      allowReject,
      startDate,
      startTime,
      endDate,
      endTime,
      startReminder,
      endReminder,
      executors,
      notifiers
    });

    navigate('/');
  };

  const dataTypes = ['文本', '图片', '视频', '音频'];

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1D2129]" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#1D2129]">新建</h1>
        <button className="text-[14px] text-[#FA8C16] px-2 py-1 hover:bg-[#FFF7E6] rounded transition-colors">
          存草稿
        </button>
      </header>

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
                <label className="text-[14px] text-[#1D2129] mb-2 block">
                  任务类型<span className="text-[#FA5151]">*</span>
                </label>
                <select
                  value={taskType}
                  onChange={(e) => {
                    const newType = e.target.value as TaskType;
                    setTaskType(newType);
                    // 生成默认标题
                    setTaskTitle(generateDefaultTitle(newType));
                  }}
                  className="w-full h-12 px-3 border border-[#E5E6EB] rounded-lg text-[15px] text-[#1D2129] bg-white"
                >
                  <option value="">请选择任务类型</option>
                  <option value="explore">新盘集攻活动</option>
                  <option value="speech">AI顾问陪练</option>
                  <option value="audio">AI客情分析</option>
                  <option value="content">每日选题</option>
                </select>
              </div>

              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">
                  任务名称<span className="text-[#FA5151]">*</span>
                </label>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value.slice(0, 32))}
                  placeholder="请输入任务名称（最多32字）"
                  className="w-full px-3 py-3 border border-[#E5E6EB] rounded-lg text-[15px] focus:outline-none focus:border-[#FA8C16]"
                />
                <p className="text-[11px] text-[#86909C] mt-1 text-right">{taskTitle.length}/32</p>
              </div>

              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">任务描述</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value.slice(0, 200))}
                  placeholder="请输入任务描述（最多200字）"
                  rows={3}
                  className="w-full px-3 py-3 border border-[#E5E6EB] rounded-lg text-[14px] resize-none focus:outline-none focus:border-[#FA8C16]"
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
              <div className="px-4 pb-4 space-y-5">
                {taskType === 'explore' && (
                  <>
                    {/* 楼盘信息 */}
                    <div className="p-4 bg-[#F7F8FA] rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-[15px] font-semibold text-[#1D2129]">中海汇德里</h3>
                        <span className="text-[15px] text-[#FA8C16] font-semibold">35000元/㎡</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[13px] text-[#86909C]">
                        <div>物业类型：住宅</div>
                        <div>开发商：中海地产</div>
                        <div>建筑面积：120-180㎡</div>
                        <div>交付时间：2027年6月</div>
                        <div colSpan={2}>地址：浦东新区张江高科技园区</div>
                      </div>
                    </div>

                    {/* 项目政策 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[14px] text-[#1D2129]">项目政策</label>
                        <button
                          onClick={addPolicy}
                          className="flex items-center gap-1 text-[13px] text-[#FA8C16]"
                        >
                          <Plus className="w-4 h-4" />
                          新增政策
                        </button>
                      </div>
                      {policies.length === 0 ? (
                        <div className="text-center py-6 text-[14px] text-[#86909C]">暂无项目政策</div>
                      ) : (
                        <div className="space-y-3">
                          {policies.map((policy) => (
                            <div key={policy.id} className="p-3 bg-[#F7F8FA] rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-[13px] font-medium text-[#1D2129]">政策 {policies.indexOf(policy) + 1}</span>
                                <button onClick={() => removePolicy(policy.id)} className="p-1 hover:bg-white rounded">
                                  <X className="w-4 h-4 text-[#FA5151]" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-[13px]">
                                <div>
                                  <label className="text-[#86909C] mb-1 block">政策有效期-开始</label>
                                  <input
                                    type="date"
                                    value={policy.startDate}
                                    onChange={(e) => updatePolicy(policy.id, 'startDate', e.target.value)}
                                    className="w-full h-8 px-2 border border-[#E5E6EB] rounded text-[12px]"
                                  />
                                </div>
                                <div>
                                  <label className="text-[#86909C] mb-1 block">政策有效期-结束</label>
                                  <input
                                    type="date"
                                    value={policy.endDate}
                                    onChange={(e) => updatePolicy(policy.id, 'endDate', e.target.value)}
                                    className="w-full h-8 px-2 border border-[#E5E6EB] rounded text-[12px]"
                                  />
                                </div>
                              </div>
                              <div className="mt-2">
                                <label className="text-[#86909C] mb-1 block">政策描述</label>
                                <textarea
                                  value={policy.description}
                                  onChange={(e) => updatePolicy(policy.id, 'description', e.target.value.slice(0, 300))}
                                  rows={2}
                                  placeholder="请输入政策描述（最多300字）"
                                  className="w-full px-2 py-1.5 border border-[#E5E6EB] rounded text-[12px] resize-none"
                                />
                              </div>
                              <div className="mt-2">
                                <label className="text-[#86909C] mb-1 block">特殊说明</label>
                                <textarea
                                  value={policy.specialNote}
                                  onChange={(e) => updatePolicy(policy.id, 'specialNote', e.target.value.slice(0, 300))}
                                  rows={2}
                                  placeholder="请输入特殊说明（最多300字）"
                                  className="w-full px-2 py-1.5 border border-[#E5E6EB] rounded text-[12px] resize-none"
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 打卡范围配置 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[14px] text-[#1D2129]">打卡范围配置</label>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            checked={checkInEnabled}
                            onChange={(e) => setCheckInEnabled(e.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                        </label>
                      </div>
                      {checkInEnabled && (
                        <div className="flex items-center gap-2 p-3 bg-[#FFF7E6] rounded-xl">
                          <div className="flex-1">
                            <label className="text-[13px] text-[#86909C] mb-1 block">打卡范围</label>
                            <input
                              type="number"
                              value={checkInRange}
                              onChange={(e) => setCheckInRange(e.target.value)}
                              min="100"
                              max="9999"
                              placeholder="100-9999米"
                              className="w-full h-10 px-3 border border-[#FA8C16] rounded-lg text-[14px]"
                            />
                          </div>
                          <span className="text-[14px] text-[#FA8C16] font-medium self-end mb-3">米</span>
                        </div>
                      )}
                    </div>

                    {/* 点位采集 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[14px] text-[#1D2129]">点位采集</label>
                      </div>
                      
                      <div className="flex items-center justify-between mb-3 p-3 bg-[#F7F8FA] rounded-xl">
                        <span className="text-[13px] text-[#4E5969]">AI审核</span>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            checked={aiReview}
                            onChange={(e) => setAiReview(e.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                        </label>
                      </div>

                      <div className="space-y-2 mb-3">
                        {collectionPoints.map((point) => (
                          <div key={point.id} className="p-3 bg-[#F7F8FA] rounded-xl">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <span className="text-[14px] font-medium text-[#1D2129]">{point.name}</span>
                                {point.description && (
                                  <p className="text-[12px] text-[#86909C] mt-1">{point.description}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-1 ml-2">
                                <span className={`px-2 py-0.5 text-[11px] rounded ${
                                  point.required ? 'bg-[#FFECE8] text-[#FA5151]' : 'bg-[#E8F3FF] text-[#165DFF]'
                                }`}>
                                  {point.required ? '必填' : '选填'}
                                </span>
                                {point.editable && (
                                  <>
                                    <button 
                                      onClick={() => openPointModal(point)} 
                                      className="p-1 hover:bg-white rounded"
                                    >
                                      <Edit2 className="w-4 h-4 text-[#86909C]" />
                                    </button>
                                    <button onClick={() => removeCollectionPoint(point.id)} className="p-1 hover:bg-white rounded">
                                      <Trash2 className="w-4 h-4 text-[#FA5151]" />
                                    </button>
                                  </>
                                )}
                                {!point.editable && (
                                  <span className="text-[10px] text-[#86909C] ml-1">系统配置</span>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {point.types.map((type) => (
                                <span
                                  key={type}
                                  className="px-2 py-0.5 bg-[#FA8C16] text-white text-[11px] rounded"
                                >
                                  {type}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => openPointModal()}
                          className="w-full py-2 border border-dashed border-[#FA8C16] text-[#FA8C16] rounded-lg flex items-center justify-center gap-1 hover:bg-[#FFF7E6] transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                          <span className="text-[14px]">添加点位</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-xl">
                          <span className="text-[13px] text-[#4E5969]">AI一键成稿</span>
                          <label className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              checked={contentGeneration}
                              onChange={(e) => handleContentGenerationChange(e.target.checked)}
                              className="sr-only peer"
                            />
                            <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                            <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                          </label>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-xl">
                          <span className="text-[13px] text-[#4E5969]">AI图文视频创作</span>
                          <label className="relative inline-block w-12 h-6">
                            <input
                              type="checkbox"
                              checked={mediaGeneration}
                              onChange={(e) => {
                                if (contentGeneration) setMediaGeneration(e.target.checked);
                              }}
                              disabled={!contentGeneration}
                              className="sr-only peer"
                            />
                            <span className={`absolute inset-0 rounded-full transition-colors ${
                              contentGeneration ? (mediaGeneration ? 'bg-[#FA8C16]' : 'bg-[#ccc]') : 'bg-[#E5E6EB]'
                            }`} />
                            <span className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full transition-transform ${
                              contentGeneration && mediaGeneration ? 'translate-x-6 bg-white' : 'bg-[#C0C0C0]'
                            }`} />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* AI顾问陪练配置 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[14px] text-[#1D2129]">AI顾问陪练</label>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            checked={speechTraining}
                            onChange={(e) => setSpeechTraining(e.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                        </label>
                      </div>
                      {speechTraining && (
                        <div className="space-y-3">
                          {trainingProjects.map((project) => (
                            <div key={project.id} className="p-3 bg-[#F7F8FA] rounded-xl">
                              <div className="flex items-center justify-between mb-2">
                                <input
                                  type="text"
                                  value={project.name}
                                  onChange={(e) => {
                                    setTrainingProjects(trainingProjects.map(p => 
                                      p.id === project.id ? { ...p, name: e.target.value } : p
                                    ));
                                  }}
                                  className="flex-1 px-2 py-1 text-[14px] font-medium text-[#1D2129] bg-transparent border-b border-[#E5E6EB] focus:border-[#FA8C16] focus:outline-none"
                                />
                                <button onClick={() => removeTrainingProject(project.id)} className="p-1 hover:bg-white rounded">
                                  <X className="w-4 h-4 text-[#FA5151]" />
                                </button>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`completion-${project.id}`}
                                      checked={project.completionType === 'count'}
                                      onChange={() => {
                                        setTrainingProjects(trainingProjects.map(p => 
                                          p.id === project.id ? { ...p, completionType: 'count' } : p
                                        ));
                                      }}
                                      className="w-4 h-4 accent-[#FA8C16]"
                                    />
                                    <span className="text-[13px] text-[#4E5969]">训练次数</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={project.count}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value) || 1;
                                      setTrainingProjects(trainingProjects.map(p => 
                                        p.id === project.id ? { ...p, count: Math.min(99, Math.max(1, val)) } : p
                                      ));
                                    }}
                                    min="1"
                                    max="99"
                                    disabled={project.completionType !== 'count'}
                                    className={`w-16 h-8 px-2 border rounded text-[13px] text-center ${
                                      project.completionType === 'count'
                                        ? 'border-[#E5E6EB]'
                                        : 'border-[#E5E6EB] bg-[#F0F0F0]'
                                    }`}
                                  />
                                </div>
                                <div className="flex items-center justify-between p-2 bg-white rounded-lg">
                                  <label className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      name={`completion-${project.id}`}
                                      checked={project.completionType === 'score'}
                                      onChange={() => {
                                        setTrainingProjects(trainingProjects.map(p => 
                                          p.id === project.id ? { ...p, completionType: 'score' } : p
                                        ));
                                      }}
                                      className="w-4 h-4 accent-[#FA8C16]"
                                    />
                                    <span className="text-[13px] text-[#4E5969]">目标分数</span>
                                  </label>
                                  <input
                                    type="number"
                                    value={project.score}
                                    onChange={(e) => {
                                      const val = parseFloat(e.target.value) || 60;
                                      setTrainingProjects(trainingProjects.map(p => 
                                        p.id === project.id ? { ...p, score: Math.min(100, Math.max(0, val)) } : p
                                      ));
                                    }}
                                    min="0"
                                    max="100"
                                    disabled={project.completionType !== 'score'}
                                    className={`w-16 h-8 px-2 border rounded text-[13px] text-center ${
                                      project.completionType === 'score'
                                        ? 'border-[#E5E6EB]'
                                        : 'border-[#E5E6EB] bg-[#F0F0F0]'
                                    }`}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <button
                            onClick={addTrainingProject}
                            className="w-full py-2 border border-dashed border-[#FA8C16] text-[#FA8C16] rounded-lg flex items-center justify-center gap-1 hover:bg-[#FFF7E6] transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                            <span className="text-[14px]">添加训练项目</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {/* 录音分析配置 */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-[14px] text-[#1D2129]">AI客情分析</label>
                        <label className="relative inline-block w-12 h-6">
                          <input
                            type="checkbox"
                            checked={audioAnalysis}
                            onChange={(e) => setAudioAnalysis(e.target.checked)}
                            className="sr-only peer"
                          />
                          <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                          <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                        </label>
                      </div>
                      {audioAnalysis && (
                        <div className="p-3 bg-[#F7F8FA] rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className="text-[13px] text-[#4E5969]">上传录音数</span>
                            <input
                              type="number"
                              value={audioCount}
                              onChange={(e) => setAudioCount(e.target.value)}
                              min="1"
                              max="999"
                              className="w-16 h-8 px-2 border border-[#E5E6EB] rounded text-[13px] text-center"
                            />
                            <span className="text-[13px] text-[#86909C]">条</span>
                          </div>
                          <div className="mt-2 text-[12px] text-[#86909C]">
                            分析维度：话术规范、情绪识别、关键词覆盖、邀约意向
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {taskType === 'speech' && (
                  <>
                    <div className="space-y-3">
                      {trainingProjects.map((project) => (
                        <div key={project.id} className="p-3 bg-[#F7F8FA] rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <input
                              type="text"
                              value={project.name}
                              onChange={(e) => {
                                setTrainingProjects(trainingProjects.map(p => 
                                  p.id === project.id ? { ...p, name: e.target.value } : p
                                ));
                              }}
                              className="flex-1 px-2 py-1 text-[14px] font-medium text-[#1D2129] bg-transparent border-b border-[#E5E6EB] focus:border-[#FA8C16] focus:outline-none"
                            />
                            {trainingProjects.length > 1 && (
                              <button onClick={() => removeTrainingProject(project.id)} className="p-1 hover:bg-white rounded">
                                <X className="w-4 h-4 text-[#FA5151]" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[12px] text-[#86909C] mb-1 block">训练次数</label>
                              <input
                                type="number"
                                value={project.count}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 1;
                                  setTrainingProjects(trainingProjects.map(p => 
                                    p.id === project.id ? { ...p, count: Math.min(99, Math.max(1, val)) } : p
                                  ));
                                }}
                                min="1"
                                max="99"
                                className="w-full h-8 px-2 border border-[#E5E6EB] rounded text-[13px] text-center"
                              />
                            </div>
                            <div>
                              <label className="text-[12px] text-[#86909C] mb-1 block">目标分数</label>
                              <input
                                type="number"
                                value={project.score}
                                onChange={(e) => {
                                  const val = parseFloat(e.target.value) || 60;
                                  setTrainingProjects(trainingProjects.map(p => 
                                    p.id === project.id ? { ...p, score: Math.min(100, Math.max(0, val)) } : p
                                  ));
                                }}
                                min="0"
                                max="100"
                                className="w-full h-8 px-2 border border-[#E5E6EB] rounded text-[13px] text-center"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={addTrainingProject}
                        className="w-full py-2 border border-dashed border-[#FA8C16] text-[#FA8C16] rounded-lg flex items-center justify-center gap-1 hover:bg-[#FFF7E6] transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        <span className="text-[14px]">添加训练项目</span>
                      </button>
                    </div>
                  </>
                )}

                {taskType === 'audio' && (
                  <div className="p-4 bg-[#F7F8FA] rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[14px] text-[#4E5969]">上传录音数</span>
                      <input
                        type="number"
                        value={audioCount}
                        onChange={(e) => setAudioCount(e.target.value)}
                        min="1"
                        max="999"
                        className="w-20 h-10 px-3 border border-[#E5E6EB] rounded-lg text-[14px] text-center"
                      />
                      <span className="text-[14px] text-[#86909C]">条</span>
                    </div>
                    <div className="text-[13px] text-[#86909C]">
                      分析维度：话术规范、情绪识别、关键词覆盖、邀约意向
                    </div>
                  </div>
                )}

                {taskType === 'content' && (
                  <div className="py-8 text-center text-[14px] text-[#86909C]">
                    每日选题任务无需额外配置
                  </div>
                )}

                {taskType === 'custom' && (
                  <div className="py-8 text-center text-[14px] text-[#86909C]">
                    自定义任务无需额外配置
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
            <div className="px-4 pb-4 space-y-5">
              {/* 允许拒绝 */}
              <div className="flex items-center justify-between p-3 bg-[#F7F8FA] rounded-xl">
                <span className="text-[14px] text-[#4E5969]">允许拒绝</span>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={allowReject}
                    onChange={(e) => setAllowReject(e.target.checked)}
                    className="sr-only peer"
                  />
                  <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                </label>
              </div>

              {/* 任务时间 */}
              <div>
                <label className="text-[14px] text-[#1D2129] mb-3 block">行动时间</label>
                <div className="space-y-4">
                  <div>
                    <label className="text-[12px] text-[#86909C] mb-2 block">开始</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="flex-[1.2] h-11 px-3 border border-[#E5E6EB] rounded-lg text-[14px] bg-white"
                      />
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="flex-[0.8] h-11 px-3 border border-[#E5E6EB] rounded-lg text-[14px] bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] text-[#86909C] mb-2 block">截止</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="flex-[1.2] h-11 px-3 border border-[#E5E6EB] rounded-lg text-[14px] bg-white"
                      />
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="flex-[0.8] h-11 px-3 border border-[#E5E6EB] rounded-lg text-[14px] bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 智能提醒 */}
              <div>
                <label className="text-[14px] text-[#1D2129] mb-3 block">智能提醒</label>
                
                {/* 开始前提醒 */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-[#FA8C16] rounded-full"></div>
                    <span className="text-[13px] font-medium text-[#1D2129]">开始前提醒</span>
                  </div>
                  <div className="space-y-2 ml-3">
                    <div className="flex items-center gap-2 p-3 bg-[#F7F8FA] rounded-xl">
                      <span className="px-2 py-1 bg-[#E8F5E9] text-[#00B42A] text-[12px] rounded-shrink">普通</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={startReminder.normal.days}
                            onChange={(e) => setStartReminder(prev => ({ ...prev, normal: { ...prev.normal, days: e.target.value } }))}
                            min="0"
                            placeholder="0"
                            className="w-14 h-8 px-2 border border-[#E5E6EB] rounded text-[12px] text-center"
                          />
                          <span className="text-[12px] text-[#86909C] ml-1">天</span>
                        </div>
                        <span className="text-[12px] text-[#86909C]">前</span>
                        <input
                          type="time"
                          value={startReminder.normal.time}
                          onChange={(e) => setStartReminder(prev => ({ ...prev, normal: { ...prev.normal, time: e.target.value } }))}
                          className="flex-1 h-8 px-2 border border-[#E5E6EB] rounded text-[12px]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-[#F7F8FA] rounded-xl">
                      <span className="px-2 py-1 bg-[#FFF7E6] text-[#FA8C16] text-[12px] rounded-shrink">重要</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={startReminder.important.days}
                            onChange={(e) => setStartReminder(prev => ({ ...prev, important: { ...prev.important, days: e.target.value } }))}
                            min="0"
                            placeholder="0"
                            disabled={!startReminder.normal.days && !startReminder.normal.time}
                            className={`w-14 h-8 px-2 border rounded text-[12px] text-center ${
                              startReminder.normal.days || startReminder.normal.time
                                ? 'border-[#E5E6EB]'
                                : 'border-[#E5E6EB] bg-[#F0F0F0]'
                            }`}
                          />
                          <span className="text-[12px] text-[#86909C] ml-1">天</span>
                        </div>
                        <span className="text-[12px] text-[#86909C]">前</span>
                        <input
                          type="time"
                          value={startReminder.important.time}
                          onChange={(e) => setStartReminder(prev => ({ ...prev, important: { ...prev.important, time: e.target.value } }))}
                          disabled={!startReminder.normal.days && !startReminder.normal.time}
                          className={`flex-1 h-8 px-2 border rounded text-[12px] ${
                            startReminder.normal.days || startReminder.normal.time
                              ? 'border-[#E5E6EB]'
                              : 'border-[#E5E6EB] bg-[#F0F0F0]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-[#F7F8FA] rounded-xl">
                      <span className="px-2 py-1 bg-[#FFECE8] text-[#FA5151] text-[12px] rounded-shrink">紧急</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={startReminder.urgent.days}
                            onChange={(e) => setStartReminder(prev => ({ ...prev, urgent: { ...prev.urgent, days: e.target.value } }))}
                            min="0"
                            placeholder="0"
                            disabled={!startReminder.important.days && !startReminder.important.time}
                            className={`w-14 h-8 px-2 border rounded text-[12px] text-center ${
                              startReminder.important.days || startReminder.important.time
                                ? 'border-[#E5E6EB]'
                                : 'border-[#E5E6EB] bg-[#F0F0F0]'
                            }`}
                          />
                          <span className="text-[12px] text-[#86909C] ml-1">天</span>
                        </div>
                        <span className="text-[12px] text-[#86909C]">前</span>
                        <input
                          type="time"
                          value={startReminder.urgent.time}
                          onChange={(e) => setStartReminder(prev => ({ ...prev, urgent: { ...prev.urgent, time: e.target.value } }))}
                          disabled={!startReminder.important.days && !startReminder.important.time}
                          className={`flex-1 h-8 px-2 border rounded text-[12px] ${
                            startReminder.important.days || startReminder.important.time
                              ? 'border-[#E5E6EB]'
                              : 'border-[#E5E6EB] bg-[#F0F0F0]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 结束前提醒 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-4 bg-[#165DFF] rounded-full"></div>
                    <span className="text-[13px] font-medium text-[#1D2129]">结束前提醒</span>
                  </div>
                  <div className="space-y-2 ml-3">
                    <div className="flex items-center gap-2 p-3 bg-[#F7F8FA] rounded-xl">
                      <span className="px-2 py-1 bg-[#E8F5E9] text-[#00B42A] text-[12px] rounded-shrink">普通</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={endReminder.normal.days}
                            onChange={(e) => setEndReminder(prev => ({ ...prev, normal: { ...prev.normal, days: e.target.value } }))}
                            min="0"
                            placeholder="0"
                            className="w-14 h-8 px-2 border border-[#E5E6EB] rounded text-[12px] text-center"
                          />
                          <span className="text-[12px] text-[#86909C] ml-1">天</span>
                        </div>
                        <span className="text-[12px] text-[#86909C]">前</span>
                        <input
                          type="time"
                          value={endReminder.normal.time}
                          onChange={(e) => setEndReminder(prev => ({ ...prev, normal: { ...prev.normal, time: e.target.value } }))}
                          className="flex-1 h-8 px-2 border border-[#E5E6EB] rounded text-[12px]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-[#F7F8FA] rounded-xl">
                      <span className="px-2 py-1 bg-[#FFF7E6] text-[#FA8C16] text-[12px] rounded-shrink">重要</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={endReminder.important.days}
                            onChange={(e) => setEndReminder(prev => ({ ...prev, important: { ...prev.important, days: e.target.value } }))}
                            min="0"
                            placeholder="0"
                            disabled={!endReminder.normal.days && !endReminder.normal.time}
                            className={`w-14 h-8 px-2 border rounded text-[12px] text-center ${
                              endReminder.normal.days || endReminder.normal.time
                                ? 'border-[#E5E6EB]'
                                : 'border-[#E5E6EB] bg-[#F0F0F0]'
                            }`}
                          />
                          <span className="text-[12px] text-[#86909C] ml-1">天</span>
                        </div>
                        <span className="text-[12px] text-[#86909C]">前</span>
                        <input
                          type="time"
                          value={endReminder.important.time}
                          onChange={(e) => setEndReminder(prev => ({ ...prev, important: { ...prev.important, time: e.target.value } }))}
                          disabled={!endReminder.normal.days && !endReminder.normal.time}
                          className={`flex-1 h-8 px-2 border rounded text-[12px] ${
                            endReminder.normal.days || endReminder.normal.time
                              ? 'border-[#E5E6EB]'
                              : 'border-[#E5E6EB] bg-[#F0F0F0]'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-[#F7F8FA] rounded-xl">
                      <span className="px-2 py-1 bg-[#FFECE8] text-[#FA5151] text-[12px] rounded-shrink">紧急</span>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={endReminder.urgent.days}
                            onChange={(e) => setEndReminder(prev => ({ ...prev, urgent: { ...prev.urgent, days: e.target.value } }))}
                            min="0"
                            placeholder="0"
                            disabled={!endReminder.important.days && !endReminder.important.time}
                            className={`w-14 h-8 px-2 border rounded text-[12px] text-center ${
                              endReminder.important.days || endReminder.important.time
                                ? 'border-[#E5E6EB]'
                                : 'border-[#E5E6EB] bg-[#F0F0F0]'
                            }`}
                          />
                          <span className="text-[12px] text-[#86909C] ml-1">天</span>
                        </div>
                        <span className="text-[12px] text-[#86909C]">前</span>
                        <input
                          type="time"
                          value={endReminder.urgent.time}
                          onChange={(e) => setEndReminder(prev => ({ ...prev, urgent: { ...prev.urgent, time: e.target.value } }))}
                          disabled={!endReminder.important.days && !endReminder.important.time}
                          className={`flex-1 h-8 px-2 border rounded text-[12px] ${
                            endReminder.important.days || endReminder.important.time
                              ? 'border-[#E5E6EB]'
                              : 'border-[#E5E6EB] bg-[#F0F0F0]'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 执行人 */}
              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">
                  执行人<span className="text-[#FA5151]">*</span>
                </label>
                <button
                  onClick={() => {
                    setSelectingType('executor');
                    setShowDeptModal(true);
                  }}
                  className="w-full h-11 px-3 border border-[#E5E6EB] rounded-lg text-[14px] text-[#86909C] text-left hover:border-[#FA8C16] transition-colors flex items-center gap-2"
                >
                  {executors.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {executors.map((executor, idx) => (
                        <span key={executor} className="px-2 py-1 bg-[#FFF7E6] text-[#FA8C16] text-[12px] rounded-full">
                          {executor}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span>请选择执行人</span>
                  )}
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
                  className="w-full h-11 px-3 border border-[#E5E6EB] rounded-lg text-[14px] text-[#86909C] text-left hover:border-[#FA8C16] transition-colors flex items-center gap-2"
                >
                  {notifiers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {notifiers.map((notifier, idx) => (
                        <span key={notifier} className="px-2 py-1 bg-[#E8F3FF] text-[#165DFF] text-[12px] rounded-full">
                          {notifier}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span>请选择通知人</span>
                  )}
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
          创建日历
        </button>
      </div>

      {/* 点位编辑弹窗 */}
      {showPointModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end" onClick={closePointModal}>
          <div
            className="w-full bg-white rounded-t-3xl max-h-[80vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-4 border-b border-[#E5E6EB] flex items-center justify-between">
              <h2 className="text-[17px] font-semibold text-[#1D2129]">
                {editingPoint ? '编辑点位' : '新增点位'}
              </h2>
              <button onClick={closePointModal} className="p-1 hover:bg-gray-50 rounded transition-colors">
                <X className="w-5 h-5 text-[#86909C]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">
                  名称<span className="text-[#FA5151]">*</span>
                </label>
                <input
                  type="text"
                  value={pointForm.name}
                  onChange={(e) => setPointForm(prev => ({ ...prev, name: e.target.value.slice(0, 32) }))}
                  placeholder="请输入打卡点名称（最多32字符）"
                  className="w-full h-11 px-3 border border-[#E5E6EB] rounded-lg text-[14px] focus:outline-none focus:border-[#FA8C16]"
                />
                <p className="text-[11px] text-[#86909C] mt-1 text-right">{pointForm.name.length}/32</p>
              </div>

              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">描述</label>
                <textarea
                  value={pointForm.description}
                  onChange={(e) => setPointForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="请输入点位描述"
                  rows={3}
                  className="w-full px-3 py-2 border border-[#E5E6EB] rounded-lg text-[14px] resize-none focus:outline-none focus:border-[#FA8C16]"
                />
              </div>

              <div>
                <label className="text-[14px] text-[#1D2129] mb-2 block">资料类型</label>
                <div className="flex flex-wrap gap-2">
                  {['文本', '图片', '视频', '音频'].map((type) => (
                    <button
                      key={type}
                      onClick={() => togglePointType(type)}
                      className={`px-4 py-2 rounded-full text-[14px] transition-colors ${
                        pointForm.types.includes(type)
                          ? 'bg-[#FA8C16] text-white'
                          : 'bg-[#F7F8FA] text-[#4E5969]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-[#F7F8FA] rounded-xl">
                <span className="text-[14px] text-[#4E5969]">设为必填</span>
                <label className="relative inline-block w-12 h-6">
                  <input
                    type="checkbox"
                    checked={pointForm.required}
                    onChange={(e) => setPointForm(prev => ({ ...prev, required: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <span className="absolute inset-0 bg-[#ccc] peer-checked:bg-[#FA8C16] rounded-full transition-colors" />
                  <span className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6" />
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-[#E5E6EB] flex gap-3">
              <button
                onClick={closePointModal}
                className="flex-1 h-11 border border-[#E5E6EB] text-[#4E5969] rounded-lg hover:bg-[#F7F8FA] transition-colors"
              >
                取消
              </button>
              <button
                onClick={savePoint}
                className="flex-1 h-11 bg-[#FA8C16] text-white rounded-lg hover:bg-[#E67E00] transition-colors"
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

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

interface DepartmentSelectorProps {
  type: 'executor' | 'notifier';
  onClose: () => void;
  onConfirm: (selectedPeople: string[]) => void;
}

function DepartmentSelector({ type, onClose, onConfirm }: DepartmentSelectorProps) {
  const [expandedDepts, setExpandedDepts] = useState<string[]>(['sales']);
  const [selectedPeople, setSelectedPeople] = useState<string[]>([]);

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
        <div className="px-4 py-4 border-b border-[#E5E6EB] flex items-center justify-between">
          <h2 className="text-[17px] font-semibold text-[#1D2129]">
            {type === 'executor' ? '选择执行人' : '选择通知人'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-50 rounded transition-colors">
            <X className="w-5 h-5 text-[#86909C]" />
          </button>
        </div>

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