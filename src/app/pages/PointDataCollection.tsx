import { useState } from 'react';
import { ArrowLeft, ChevronDown, Camera, Video, FileText, Mic, Tag as TagIcon, X, Play, Trash2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

type ContentType = 'photo' | 'video' | 'text' | 'audio' | 'tag';
type ReviewStatus = 'pending' | 'uploading' | 'reviewing' | 'approved' | 'rejected';

interface PointContent {
  photos: string[];
  videos: string[];
  text: string;
  audio: string[];
  tags: string[];
}

interface ReviewResult {
  approved: boolean;
  reason?: string;
  suggestion?: string;
}

interface Point {
  id: number;
  name: string;
  required: boolean;
  types: ContentType[];
  status: ReviewStatus;
  content: PointContent;
  reviewResult: ReviewResult | null;
  uploadProgress?: number;
}

const PRESET_TAGS = ['地铁', '商业', '学校', '医院', '公园', '银行', '餐饮', '超市'];

export default function PointDataCollection() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [expandedCardId, setExpandedCardId] = useState<number | null>(1);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [currentEditPointId, setCurrentEditPointId] = useState<number | null>(null);
  const [textModalValue, setTextModalValue] = useState('');
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImageSrc, setPreviewImageSrc] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [points, setPoints] = useState<Point[]>([
    {
      id: 1,
      name: '沙盘照片',
      required: true,
      types: ['photo'],
      status: 'approved',
      content: { photos: ['img_sandpan.jpg', 'img_sandpan2.jpg'], videos: [], text: '', audio: [], tags: [] },
      reviewResult: { approved: true }
    },
    {
      id: 2,
      name: '样板间视频',
      required: true,
      types: ['video'],
      status: 'approved',
      content: { photos: [], videos: ['video_sample.mp4'], text: '', audio: [], tags: [] },
      reviewResult: { approved: true }
    },
    {
      id: 3,
      name: '区位配套',
      required: false,
      types: ['photo', 'text'],
      status: 'pending',
      content: { photos: [], videos: [], text: '', audio: [], tags: [] },
      reviewResult: null
    },
    {
      id: 4,
      name: '周边交通',
      required: false,
      types: ['photo', 'video', 'text', 'audio', 'tag'],
      status: 'pending',
      content: { photos: [], videos: [], text: '', audio: [], tags: [] },
      reviewResult: null
    },
    {
      id: 5,
      name: '销售说辞',
      required: true,
      types: ['audio', 'text'],
      status: 'approved',
      content: { photos: [], videos: [], text: '地铁500米，自驾方便', audio: ['audio_sales.m4a'], tags: ['地铁', '商业'] },
      reviewResult: { approved: true }
    },
    {
      id: 6,
      name: '园林景观',
      required: false,
      types: ['photo', 'video'],
      status: 'rejected',
      content: { photos: ['img_garden.jpg'], videos: [], text: '', audio: [], tags: [] },
      reviewResult: { approved: false, reason: '照片逆光严重', suggestion: '请在光线充足时重新拍摄' }
    }
  ]);

  const houseName = '中海汇德里集攻活动';
  const completedCount = points.filter(p => hasContent(p)).length;
  const totalCount = points.length;
  const requiredPoints = points.filter(p => p.required);
  const requiredApproved = requiredPoints.filter(p => p.status === 'approved').length;
  const requiredTotal = requiredPoints.length;
  const allRequiredApproved = requiredPoints.every(p => p.status === 'approved');

  function hasContent(point: Point): boolean {
    const c = point.content;
    return c.photos.length > 0 || c.videos.length > 0 || !!c.text || c.audio.length > 0 || c.tags.length > 0;
  }

  function getContentCount(point: Point): number {
    const c = point.content;
    let count = 0;
    if (point.types.includes('photo')) count += c.photos.length;
    if (point.types.includes('video')) count += c.videos.length;
    if (point.types.includes('text') && c.text) count++;
    if (point.types.includes('audio')) count += c.audio.length;
    if (point.types.includes('tag')) count += c.tags.length;
    return count;
  }

  function getTypeIcon(type: ContentType) {
    const icons = {
      photo: Camera,
      video: Video,
      text: FileText,
      audio: Mic,
      tag: TagIcon
    };
    return icons[type];
  }

  function getTypeLabel(type: ContentType) {
    const labels = {
      photo: '拍照',
      video: '视频',
      text: '文字',
      audio: '语音',
      tag: '标签'
    };
    return labels[type];
  }

  function toggleCard(pointId: number) {
    setExpandedCardId(expandedCardId === pointId ? null : pointId);
  }

  function showMessage(msg: string) {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  function handlePhotoUpload(pointId: number) {
    const point = points.find(p => p.id === pointId);
    if (!point || !point.types.includes('photo')) return;

    const newPhoto = `photo_${Date.now()}.jpg`;
    updatePoint(pointId, p => ({
      ...p,
      content: { ...p.content, photos: [...p.content.photos, newPhoto] }
    }));
    simulateUpload(pointId);
  }

  function handleVideoUpload(pointId: number) {
    const point = points.find(p => p.id === pointId);
    if (!point || !point.types.includes('video')) return;

    const newVideo = `video_${Date.now()}.mp4`;
    updatePoint(pointId, p => ({
      ...p,
      content: { ...p.content, videos: [...p.content.videos, newVideo] }
    }));
    simulateUpload(pointId);
  }

  function handleAudioUpload(pointId: number) {
    const point = points.find(p => p.id === pointId);
    if (!point || !point.types.includes('audio')) return;

    const newAudio = `audio_${Date.now()}.m4a`;
    updatePoint(pointId, p => ({
      ...p,
      content: { ...p.content, audio: [...p.content.audio, newAudio] }
    }));
    simulateUpload(pointId);
  }

  function handleTextClick(pointId: number) {
    const point = points.find(p => p.id === pointId);
    if (!point) return;

    setCurrentEditPointId(pointId);
    setTextModalValue(point.content.text);
    setShowTextModal(true);
  }

  function saveText() {
    if (currentEditPointId === null) return;

    updatePoint(currentEditPointId, p => ({
      ...p,
      content: { ...p.content, text: textModalValue }
    }));

    setShowTextModal(false);

    const point = points.find(p => p.id === currentEditPointId);
    if (point && textModalValue && point.status === 'pending') {
      simulateUpload(currentEditPointId);
    }
  }

  function toggleTag(pointId: number, tag: string) {
    updatePoint(pointId, p => {
      const tags = p.content.tags || [];
      const idx = tags.indexOf(tag);
      if (idx >= 0) {
        return { ...p, content: { ...p.content, tags: tags.filter((_, i) => i !== idx) } };
      } else {
        return { ...p, content: { ...p.content, tags: [...tags, tag] } };
      }
    });
  }

  function removeTag(pointId: number, tag: string) {
    updatePoint(pointId, p => ({
      ...p,
      content: { ...p.content, tags: p.content.tags.filter(t => t !== tag) }
    }));
  }

  function deleteMedia(pointId: number, type: 'photo' | 'video' | 'audio', idx: number) {
    updatePoint(pointId, p => {
      const content = { ...p.content };
      if (type === 'photo') content.photos = content.photos.filter((_, i) => i !== idx);
      if (type === 'video') content.videos = content.videos.filter((_, i) => i !== idx);
      if (type === 'audio') content.audio = content.audio.filter((_, i) => i !== idx);

      const hasAnyContent = content.photos.length > 0 || content.videos.length > 0 || content.audio.length > 0 || !!content.text || content.tags.length > 0;
      if (!hasAnyContent) {
        return { ...p, content, status: 'pending', reviewResult: null };
      }
      return { ...p, content };
    });
  }

  function updatePoint(pointId: number, updater: (p: Point) => Point) {
    setPoints(prev => prev.map(p => p.id === pointId ? updater(p) : p));
  }

  function simulateUpload(pointId: number) {
    updatePoint(pointId, p => ({ ...p, status: 'uploading', uploadProgress: 0 }));

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        updatePoint(pointId, p => ({ ...p, uploadProgress: 100 }));
        setTimeout(() => startReview(pointId), 300);
      } else {
        updatePoint(pointId, p => ({ ...p, uploadProgress: Math.min(Math.round(progress), 99) }));
      }
    }, 300);
  }

  function startReview(pointId: number) {
    updatePoint(pointId, p => ({ ...p, status: 'reviewing', uploadProgress: 0 }));

    const delay = 3000 + Math.random() * 5000;
    setTimeout(() => {
      const passed = Math.random() > 0.3;
      if (passed) {
        updatePoint(pointId, p => ({
          ...p,
          status: 'approved',
          reviewResult: { approved: true }
        }));
        const point = points.find(p => p.id === pointId);
        showMessage(`✅ ${point?.name} 审核通过！`);
      } else {
        const reasons = [
          { reason: '照片清晰度不足', suggestion: '请在光线充足的环境下重新拍摄' },
          { reason: '未拍摄到楼盘标识', suggestion: '请确保画面中包含楼盘名称标识' },
          { reason: '视频抖动严重', suggestion: '建议使用稳定器或固定手机拍摄' },
          { reason: '内容与点位不相关', suggestion: '请上传与该点位相关的内容' }
        ];
        const r = reasons[Math.floor(Math.random() * reasons.length)];
        updatePoint(pointId, p => ({
          ...p,
          status: 'rejected',
          reviewResult: { approved: false, ...r }
        }));
        const point = points.find(p => p.id === pointId);
        showMessage(`⚠️ ${point?.name} 审核未通过`);
      }
    }, delay);
  }

  function handleSubmit() {
    if (!allRequiredApproved) {
      showMessage('请先完成所有必填点位');
      return;
    }
    setShowSubmitModal(true);
  }

  function confirmSubmit() {
    setShowSubmitModal(false);
    showMessage('素材提交成功！');
    setTimeout(() => {
      // 返回执行页面，阶段1已完成，进入阶段2
      navigate(`/tasks/${id}/execute?step=1`);
    }, 1500);
  }

  function previewImage(src: string) {
    setPreviewImageSrc(src);
    setShowImagePreview(true);
  }

  const getSubmitButtonClass = () => {
    if (allRequiredApproved) return 'bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white shadow-lg';
    return 'bg-[#E5E6EB] text-[#86909C] cursor-not-allowed';
  };

  const getSubmitButtonText = () => {
    if (allRequiredApproved) return '提交素材';
    if (requiredPoints.some(p => p.status === 'reviewing' || p.status === 'uploading')) return '等待审核完成';
    if (requiredPoints.some(p => p.status === 'rejected')) return '请修改失败内容后再提交';
    return '请先完成必填点位';
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-br from-[#FA8C16] to-[#FF9500] px-4 pt-3 pb-6 sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/tasks/${id}/execute?step=0`)}
            className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-[18px] font-semibold text-white">AI卖点采集</h1>
          <div className="w-9"></div>
        </div>

        {/* 任务信息卡片 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[20px]">🏠</span>
            <span className="text-[16px] font-bold text-[#1D2129]">{houseName}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7F8FA] rounded-xl px-3 py-2">
              <div className="text-[11px] text-[#86909C] mb-0.5">已完成点位</div>
              <div className="text-[18px] font-bold text-[#1D2129]">
                {completedCount}<span className="text-[14px] text-[#86909C] font-normal">/{totalCount}</span>
              </div>
            </div>
            <div className="bg-[#F7F8FA] rounded-xl px-3 py-2">
              <div className="text-[11px] text-[#86909C] mb-0.5">必填通过</div>
              <div className="text-[18px] font-bold text-[#1D2129]">
                {requiredApproved}<span className="text-[14px] text-[#86909C] font-normal">/{requiredTotal}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 点位列表 */}
      <div className="px-4 py-4 space-y-3">
        {points.map(point => (
          <div
            key={point.id}
            className="bg-white rounded-2xl shadow-sm border border-[#E5E6EB] overflow-hidden transition-all"
          >
            {/* 卡片头部 */}
            <div
              className="flex items-center gap-3 px-4 py-4 cursor-pointer active:bg-[#F7F8FA] transition-colors"
              onClick={() => toggleCard(point.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${point.required ? 'bg-[#FFF7E6] text-[#FA8C16]' : 'bg-[#F7F8FA] text-[#86909C]'}`}>
                    {point.required ? '必填' : '选填'}
                  </span>
                  <span className="text-[15px] font-semibold text-[#1D2129]">{point.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[12px] text-[#86909C]">
                  <span>已添加 {getContentCount(point)}/{point.types.length}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {point.types.map(type => {
                      const Icon = getTypeIcon(type);
                      return <Icon key={type} className="w-3.5 h-3.5" />;
                    })}
                  </div>
                </div>
              </div>

              {/* 状态图标 */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {point.status === 'approved' && (
                  <div className="flex items-center gap-1 text-[#00B42A]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                )}
                {point.status === 'rejected' && (
                  <div className="flex items-center gap-1 text-[#FA5151]">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                )}
                {(point.status === 'uploading' || point.status === 'reviewing') && (
                  <Loader2 className="w-5 h-5 text-[#FA8C16] animate-spin" />
                )}
                <ChevronDown className={`w-5 h-5 text-[#86909C] transition-transform ${expandedCardId === point.id ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* 卡片内容（展开态） */}
            {expandedCardId === point.id && (
              <div className="border-t border-[#E5E6EB] bg-[#FAFBFC]">
                <div className="px-4 py-4 space-y-4">
                  {/* 内容预览区 */}
                  {hasContent(point) && (
                    <div className="space-y-3">
                      {/* 图片预览 */}
                      {point.content.photos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {point.content.photos.map((photo, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F7F8FA] group">
                              <img
                                src={`https://picsum.photos/seed/${photo}/200/200`}
                                alt={`照片${idx + 1}`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => previewImage(`https://picsum.photos/seed/${photo}/600/600`)}
                              />
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteMedia(point.id, 'photo', idx); }}
                                className="absolute top-1 right-1 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 视频预览 */}
                      {point.content.videos.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {point.content.videos.map((video, idx) => (
                            <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#F7F8FA] group">
                              <img src={`https://picsum.photos/seed/${video}/200/200`} alt={`视频${idx + 1}`} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <Play className="w-6 h-6 text-white" fill="white" />
                              </div>
                              <div className="absolute bottom-1 right-1 text-[10px] text-white bg-black/70 backdrop-blur-sm px-1.5 py-0.5 rounded">0:32</div>
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteMedia(point.id, 'video', idx); }}
                                className="absolute top-1 right-1 w-6 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 文字预览 */}
                      {point.content.text && (
                        <div className="bg-white rounded-xl px-4 py-3 text-[13px] text-[#4E5969] leading-relaxed border border-[#E5E6EB]">
                          {point.content.text}
                        </div>
                      )}

                      {/* 语音预览 */}
                      {point.content.audio.length > 0 && (
                        <div className="space-y-2">
                          {point.content.audio.map((audio, idx) => (
                            <div key={idx} className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-[#E5E6EB]">
                              <button className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                <Play className="w-4 h-4" fill="white" />
                              </button>
                              <div className="flex-1 h-10 flex items-center gap-0.5">
                                {Array.from({ length: 32 }, (_, i) => {
                                  const h = 8 + Math.sin(i * 0.6) * 12 + Math.random() * 6;
                                  return <div key={i} className="w-1 bg-[#FA8C16] rounded-full opacity-60" style={{ height: `${h}px` }}></div>;
                                })}
                              </div>
                              <span className="text-[12px] text-[#86909C] flex-shrink-0 font-medium">0:{String(25 + idx * 13).padStart(2, '0')}</span>
                              <button onClick={() => deleteMedia(point.id, 'audio', idx)} className="text-[#FA5151] flex-shrink-0">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 标签预览 */}
                      {point.content.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {point.content.tags.map((tag, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-[#E8F3FF] text-[#165DFF] rounded-full text-[12px] font-medium border border-[#165DFF]/20">
                              <span>{tag}</span>
                              <button onClick={() => removeTag(point.id, tag)} className="text-[#165DFF] hover:text-[#0E42D2]">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 操作按钮网格 */}
                  <div className="grid grid-cols-2 gap-2">
                    {point.types.map(type => {
                      const Icon = getTypeIcon(type);
                      const label = getTypeLabel(type);
                      const hasThisContent =
                        (type === 'photo' && point.content.photos.length > 0) ||
                        (type === 'video' && point.content.videos.length > 0) ||
                        (type === 'text' && !!point.content.text) ||
                        (type === 'audio' && point.content.audio.length > 0) ||
                        (type === 'tag' && point.content.tags.length > 0);

                      return (
                        <button
                          key={type}
                          onClick={() => {
                            if (type === 'photo') handlePhotoUpload(point.id);
                            else if (type === 'video') handleVideoUpload(point.id);
                            else if (type === 'text') handleTextClick(point.id);
                            else if (type === 'audio') handleAudioUpload(point.id);
                          }}
                          className={`flex items-center justify-center gap-2 py-3.5 rounded-xl transition-all active:scale-95 ${
                            hasThisContent
                              ? 'bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white shadow-md'
                              : 'bg-white text-[#4E5969] border-2 border-[#E5E6EB]'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="text-[14px] font-medium">{label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 标签选择区 */}
                  {point.types.includes('tag') && (
                    <div className="bg-white rounded-xl p-4 border border-[#E5E6EB]">
                      <div className="text-[13px] font-medium text-[#1D2129] mb-3">选择标签</div>
                      <div className="flex flex-wrap gap-2">
                        {PRESET_TAGS.map(tag => (
                          <button
                            key={tag}
                            onClick={() => toggleTag(point.id, tag)}
                            className={`px-3 py-1.5 rounded-full text-[12px] font-medium border-2 transition-all ${
                              point.content.tags.includes(tag)
                                ? 'bg-[#E8F3FF] border-[#165DFF] text-[#165DFF]'
                                : 'bg-white border-[#E5E6EB] text-[#4E5969]'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 审核状态 */}
                  {point.status === 'pending' && (
                    <div className="bg-[#F7F8FA] border border-[#E5E6EB] text-[#86909C] px-4 py-3 rounded-xl text-[13px] text-center">
                      请上传{point.name}相关素材
                    </div>
                  )}
                  {point.status === 'uploading' && (
                    <div className="bg-[#E8F3FF] border border-[#165DFF]/20 px-4 py-3 rounded-xl">
                      <div className="flex items-center gap-2 text-[#165DFF] text-[13px] font-medium mb-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>上传中... {point.uploadProgress || 0}%</span>
                      </div>
                      <div className="h-2 bg-[#165DFF]/15 rounded-full overflow-hidden">
                        <div className="h-full bg-[#165DFF] rounded-full transition-all" style={{ width: `${point.uploadProgress || 0}%` }}></div>
                      </div>
                    </div>
                  )}
                  {point.status === 'reviewing' && (
                    <div className="bg-[#FFF7E6] border border-[#FA8C16]/20 px-4 py-3 rounded-xl">
                      <div className="flex items-center gap-2 text-[#FA8C16] text-[13px] font-medium mb-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI审核中...</span>
                      </div>
                      <div className="h-2 bg-[#FA8C16]/15 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FA8C16] rounded-full animate-pulse" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                  )}
                  {point.status === 'approved' && (
                    <div className="bg-[#E8FFEA] border border-[#00B42A]/20 px-4 py-3 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-[#00B42A] flex-shrink-0" />
                      <span className="text-[13px] font-medium text-[#00B42A]">审核通过</span>
                    </div>
                  )}
                  {point.status === 'rejected' && (
                    <div className="bg-[#FFECE8] border border-[#FA5151]/20 px-4 py-3.5 rounded-xl">
                      <div className="flex items-center gap-2 text-[#FA5151] font-semibold text-[13px] mb-2">
                        <AlertCircle className="w-4 h-4" />
                        <span>审核未通过</span>
                      </div>
                      {point.reviewResult?.reason && (
                        <div className="text-[12px] text-[#4E5969] mb-1">
                          <span className="font-medium">原因：</span>{point.reviewResult.reason}
                        </div>
                      )}
                      {point.reviewResult?.suggestion && (
                        <div className="text-[12px] text-[#4E5969]">
                          <span className="font-medium">建议：</span>{point.reviewResult.suggestion}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm px-4 py-4 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] border-t border-[#E5E6EB] z-50">
        <button
          onClick={handleSubmit}
          disabled={!allRequiredApproved}
          className={`w-full py-4 rounded-xl text-[16px] font-semibold transition-all flex items-center justify-center gap-2 ${getSubmitButtonClass()} ${allRequiredApproved ? 'active:scale-[0.98]' : ''}`}
        >
          {getSubmitButtonText()}
        </button>
      </div>

      {/* 提交确认弹窗 */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center px-4" onClick={() => setShowSubmitModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-[360px] overflow-hidden shadow-2xl animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 pt-6 pb-4">
              <div className="text-center text-[20px] font-bold text-[#1D2129] mb-3">确认提交全部素材？</div>

              {/* 警告提示 */}
              <div className="bg-[#FFF7E6] border-l-4 border-[#FA8C16] rounded-lg px-4 py-3 mb-4">
                <div className="flex items-start gap-2">
                  <span className="text-[#FA8C16] text-[16px] flex-shrink-0 mt-0.5">⚠️</span>
                  <div className="flex-1">
                    <div className="text-[13px] text-[#4E5969] leading-relaxed">
                      提交后将进入<span className="font-bold text-[#FA8C16]">【AI一键成稿】</span>阶段
                    </div>
                    <div className="text-[13px] text-[#4E5969] leading-relaxed mt-1">
                      当前阶段将<span className="font-bold text-[#FA8C16]">不可更改</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 统计信息 */}
              <div className="bg-[#F7F8FA] rounded-2xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#86909C]">已完成点位</span>
                  <span className="text-[16px] font-bold text-[#1D2129]">{completedCount}/{totalCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[13px] text-[#86909C]">必填通过</span>
                  <span className="text-[16px] font-bold text-[#00B42A]">{requiredApproved}/{requiredTotal}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-4 bg-[#F7F8FA]">
              <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-3.5 rounded-xl bg-white text-[#4E5969] font-semibold active:scale-95 transition-all shadow-sm">
                取消
              </button>
              <button onClick={confirmSubmit} className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white font-semibold active:scale-95 transition-all shadow-md">
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 文字输入弹窗 */}
      {showTextModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] flex items-end justify-center" onClick={() => setShowTextModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-[500px] p-6 pb-8 shadow-2xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="text-[18px] font-bold text-[#1D2129]">文字备注</div>
              <button onClick={() => setShowTextModal(false)} className="w-8 h-8 bg-[#F7F8FA] rounded-full flex items-center justify-center active:bg-[#E5E6EB] transition-colors">
                <X className="w-4 h-4 text-[#4E5969]" />
              </button>
            </div>
            <textarea
              value={textModalValue}
              onChange={(e) => setTextModalValue(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#E5E6EB] rounded-2xl text-[14px] resize-none outline-none focus:border-[#FA8C16] bg-white h-40 transition-colors"
              placeholder="请输入文字内容..."
              maxLength={500}
            />
            <div className="text-right text-[12px] text-[#86909C] mt-2 mb-4">
              {textModalValue.length}/500
            </div>
            <button onClick={saveText} className="w-full py-3.5 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-xl text-[15px] font-semibold shadow-md active:scale-95 transition-all">
              确定
            </button>
          </div>
        </div>
      )}

      {/* 图片预览 */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[9998] flex items-center justify-center p-4" onClick={() => setShowImagePreview(false)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all">
            <X className="w-5 h-5 text-white" />
          </button>
          <img src={previewImageSrc} alt="预览" className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl" />
        </div>
      )}

      {/* Toast提示 */}
      {showToast && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1D2129]/90 backdrop-blur-sm text-white px-6 py-3.5 rounded-2xl text-[14px] z-[10000] animate-fade-in pointer-events-none max-w-[80vw] text-center shadow-2xl">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
