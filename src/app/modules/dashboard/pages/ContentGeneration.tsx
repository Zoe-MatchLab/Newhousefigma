import { useState } from 'react';
import { ArrowLeft, Sparkles, ChevronDown, ChevronUp, Check, Copy, RefreshCw, Share2, Eye, Zap, Wand2, Crown, Mic, Upload, Film, Play, X, Edit3 } from 'lucide-react';
import { useNavigate, useParams, useSearchParams } from 'react-router';

type Channel = 'speech' | 'xiaohongshu' | 'moments' | 'wechat' | 'video';
type VideoMethod = 'lightning' | 'normal' | 'master';

interface VideoTemplate {
  id: number;
  name: string;
  thumbnail: string;
  duration: string;
  style: string;
}

interface GeneratedContent {
  id: number;
  channel: Channel;
  title: string;
  content: string;
  selected: boolean;
}

const CHANNELS = [
  { id: 'speech', name: '推广话术', icon: '💬', tag: '' },
  { id: 'xiaohongshu', name: '小红书', icon: '📱', tag: '热门' },
  { id: 'moments', name: '朋友圈', icon: '🔥', tag: '' },
  { id: 'wechat', name: '公众号', icon: '📰', tag: '' },
  { id: 'video', name: '视频号', icon: '🎬', tag: 'AI' }
] as const;

const VIDEO_METHODS = [
  {
    id: 'lightning',
    name: '闪电生成',
    icon: Zap,
    badge: '秒出',
    desc: '即时',
    detail: '随机选择已有视频',
    color: 'warning'
  },
  {
    id: 'normal',
    name: '普通生成',
    icon: Wand2,
    badge: '混剪',
    desc: '~5分钟',
    detail: '声音克隆 + 视频混剪',
    color: 'info'
  },
  {
    id: 'master',
    name: '大师生成',
    icon: Crown,
    badge: '高质量',
    desc: '~1小时',
    detail: 'AI生成专属数字人视频',
    color: 'purple'
  }
];

export default function ContentGeneration() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const [selectedChannels, setSelectedChannels] = useState<Channel[]>([]);
  const [selectedVideoMethod, setSelectedVideoMethod] = useState<VideoMethod | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingProgress, setGeneratingProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [configExpanded, setConfigExpanded] = useState(true);
  const [expandedContentId, setExpandedContentId] = useState<number | null>(null);
  const [contents, setContents] = useState<GeneratedContent[]>([]);
  const [showVoiceUpload, setShowVoiceUpload] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [voiceUploaded, setVoiceUploaded] = useState(false);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');

  const videoTemplates: VideoTemplate[] = [
    { id: 1, name: '现代简约风', thumbnail: 'template1', duration: '30s', style: '简洁大气' },
    { id: 2, name: '温馨居家风', thumbnail: 'template2', duration: '45s', style: '温馨舒适' },
    { id: 3, name: '商务精英风', thumbnail: 'template3', duration: '60s', style: '专业稳重' },
    { id: 4, name: '活力青春风', thumbnail: 'template4', duration: '30s', style: '活力动感' },
    { id: 5, name: '高端奢华风', thumbnail: 'template5', duration: '50s', style: '奢华大气' },
    { id: 6, name: '自然清新风', thumbnail: 'template6', duration: '40s', style: '清新自然' }
  ];

  const houseName = '中海汇德里';
  const showVideoMethods = selectedChannels.includes('video');
  const needTemplateSelection = selectedVideoMethod === 'normal' || selectedVideoMethod === 'master';
  const canGenerate = selectedChannels.length > 0 &&
    (!showVideoMethods || selectedVideoMethod !== null) &&
    (!needTemplateSelection || selectedTemplate !== null);

  function toggleChannel(channelId: Channel) {
    if (channelId === 'video') {
      if (selectedChannels.includes('video')) {
        setSelectedChannels(prev => prev.filter(c => c !== 'video'));
        setSelectedVideoMethod(null);
        setVoiceUploaded(false);
        setImageUploaded(false);
      } else {
        setSelectedChannels(prev => [...prev, 'video']);
      }
    } else {
      setSelectedChannels(prev =>
        prev.includes(channelId)
          ? prev.filter(c => c !== channelId)
          : [...prev, channelId]
      );
    }
  }

  function selectVideoMethod(methodId: VideoMethod) {
    setSelectedVideoMethod(methodId);
    setSelectedTemplate(null);
    setVoiceUploaded(false);
    setImageUploaded(false);
  }

  function selectTemplate(templateId: number) {
    setSelectedTemplate(templateId);
    setShowTemplateModal(false);
  }

  function showMessage(msg: string) {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  }

  function handleVoiceUpload() {
    showMessage('录音上传成功');
    setVoiceUploaded(true);
    setShowVoiceUpload(false);
  }

  function handleImageUpload() {
    showMessage('形象上传成功');
    setImageUploaded(true);
    setShowImageUpload(false);
  }

  function handleGenerate() {
    if (!canGenerate) return;
    startGeneration();
  }

  function startGeneration() {
    setIsGenerating(true);
    setGeneratingProgress(0);
    setConfigExpanded(false); // 折叠配置

    const interval = setInterval(() => {
      setGeneratingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            setShowContent(true);
            generateMockContent();
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  }

  function generateMockContent() {
    const mockContents: GeneratedContent[] = [];
    let id = 1;

    selectedChannels.forEach(channel => {
      if (channel === 'speech') {
        mockContents.push({
          id: id++,
          channel: 'speech',
          title: '推广话术 - 开盘活动',
          content: '🏠 中海汇德里，浦东新区张江高科技园区核心地段！\n\n✨ 地铁500米，自驾方便\n📍 周边配套齐全，商业、学校、医院一应俱全\n🌳 园林景观优美，沙盘精致\n\n现在开盘特惠，诚邀您到访参观！',
          selected: false
        });
      } else if (channel === 'xiaohongshu') {
        mockContents.push({
          id: id++,
          channel: 'xiaohongshu',
          title: '小红书 - 探盘分享',
          content: '今天去看了中海汇德里！真的太惊喜了🎉\n\n📍位置：浦东张江高科技\n🚇交通：地铁500米\n🏫配套：学校+商业+医院全齐\n\n沙盘做的超精致，样板间也很用心💕\n园林景观看着就很舒服～\n\n姐妹们，这个盘可以冲！\n\n#上海买房 #浦东楼盘 #中海地产',
          selected: false
        });
      } else if (channel === 'moments') {
        mockContents.push({
          id: id++,
          channel: 'moments',
          title: '朋友圈 - 楼盘推荐',
          content: '【中海汇德里】浦东张江核心💎\n\n🚇 地铁500米，出行便利\n🏫 学校、商业、医院配套完善\n🌳 园林景观一流\n\n诚邀到访品鉴！',
          selected: false
        });
      } else if (channel === 'wechat') {
        mockContents.push({
          id: id++,
          channel: 'wechat',
          title: '公众号 - 楼盘详解',
          content: '中海汇德里 | 浦东张江高科技园区品质住宅\n\n项目位于浦东新区张江高科技园区核心位置，地铁500米直达，周边配套设施完善。\n\n【交通便利】地铁、公交多条线路，自驾出行方便\n【配套齐全】商业中心、学校、医院一应俱全\n【环境优美】园林景观精心打造，生活品质有保障\n\n欢迎预约看房，专业置业顾问为您服务。',
          selected: false
        });
      } else if (channel === 'video' && selectedVideoMethod === 'master') {
        // 只有大师生成才显示短视频脚本
        mockContents.push({
          id: id++,
          channel: 'video',
          title: '视频号 - 短视频脚本',
          content: '【开场】\n大家好，今天带大家看看中海汇德里这个楼盘\n\n【沙盘展示】\n这是项目沙盘，可以看到整体规划非常完善\n\n【样板间】\n样板间设计很用心，采光通风都做得很好\n\n【周边配套】\n地铁500米，周边商业、学校、医院配套齐全\n\n【园林景观】\n园林景观打造得很漂亮，生活环境舒适\n\n【结尾】\n感兴趣的朋友可以联系我预约看房',
          selected: false
        });
      }
    });

    setContents(mockContents);
  }

  function toggleContentSelection(contentId: number) {
    setContents(prev => prev.map(c =>
      c.id === contentId ? { ...c, selected: !c.selected } : c
    ));
  }

  function regenerateContent(contentId: number) {
    const content = contents.find(c => c.id === contentId);
    if (!content) return;

    setRegeneratingId(contentId);

    // 模拟重新生成过程
    setTimeout(() => {
      const newContent = generateSingleContent(content.channel);
      setContents(prev => prev.map(c =>
        c.id === contentId ? { ...c, content: newContent, selected: false } : c
      ));
      setRegeneratingId(null);
      showMessage('重新生成成功');
    }, 1500);
  }

  function regenerateAll() {
    if (regeneratingId !== null) return;

    setIsGenerating(true);
    setGeneratingProgress(0);

    const interval = setInterval(() => {
      setGeneratingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsGenerating(false);
            generateMockContent();
            showMessage('全部重新生成完成');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  }

  function startEdit(contentId: number) {
    const content = contents.find(c => c.id === contentId);
    if (!content) return;
    setEditingId(contentId);
    setEditingContent(content.content);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingContent('');
  }

  function saveEdit() {
    if (editingId === null) return;
    setContents(prev => prev.map(c =>
      c.id === editingId ? { ...c, content: editingContent } : c
    ));
    showMessage('保存成功');
    setEditingId(null);
    setEditingContent('');
  }

  function generateSingleContent(channel: Channel): string {
    const variants = {
      speech: [
        '🏠 中海汇德里，浦东新区张江高科技园区核心地段！\n\n✨ 地铁500米，自驾方便\n📍 周边配套齐全，商业、学校、医院一应俱全\n🌳 园林景观优美，沙盘精致\n\n现在开盘特惠，诚邀您到访参观！',
        '✨ 中海汇德里，张江高科技园区的璀璨明珠！\n\n🚇 地铁直达，出行无忧\n🏫 名校环绕，教育资源丰富\n🛍️ 商业配套完善，生活便捷\n🌿 生态园林设计，宜居首选\n\n限时优惠，欢迎咨询！',
        '🌟 中海汇德里，品质生活新标杆！\n\n📍 浦东张江核心位置\n🚗 交通便利，四通八达\n🏥 医疗、教育、商业配套齐全\n🎨 精装设计，拎包入住\n\n诚邀品鉴，专车接送！'
      ],
      xiaohongshu: [
        '今天去看了中海汇德里！真的太惊喜了🎉\n\n📍位置：浦东张江高科技\n🚇交通：地铁500米\n🏫配套：学校+商业+医院全齐\n\n沙盘做的超精致，样板间也很用心💕\n园林景观看着就很舒服～\n\n姐妹们，这个盘可以冲！\n\n#上海买房 #浦东楼盘 #中海地产',
        '探盘｜中海汇德里实地测评📝\n\n💰价格：合理，性价比高\n🏘️户型：方正实用，南北通透\n🌳环境：园林设计超赞\n🚇交通：地铁500米，超方便\n\n重点：配套真的太全了！\n学校医院商场都有，适合刚需和改善！\n\n#楼盘测评 #张江买房 #上海置业',
        '姐妹们！发现宝藏楼盘啦🎊\n\n中海汇德里，张江核心地段\n✅ 交通：地铁近在咫尺\n✅ 配套：吃喝玩乐全搞定\n✅ 品质：大牌开发商保障\n✅ 环境：绿化率超高\n\n实地看了觉得很不错！\n推荐给想在浦东买房的姐妹～\n\n#上海买房攻略 #浦东楼盘推荐'
      ],
      moments: [
        '【中海汇德里】浦东张江核心💎\n\n🚇 地铁500米，出行便利\n🏫 学校、商业、医院配套完善\n🌳 园林景观一流\n\n诚邀到访品鉴！',
        '【中海汇德里】品质生活新选择🏡\n\n✨ 张江高科技园区核心位置\n🚗 交通便捷，配套齐全\n💎 中海品牌，品质保证\n\n欢迎预约看房！',
        '【中海汇德里】理想之家在此🌟\n\n🏠 浦东张江优质楼盘\n🌿 生态园林，宜居环境\n📚 教育医疗资源丰富\n\n现场品鉴，期待您的到来！'
      ],
      wechat: [
        '中海汇德里 | 浦东张江高科技园区品质住宅\n\n项目位于浦东新区张江高科技园区核心位置，地铁500米直达，周边配套设施完善。\n\n【交通便利】地铁、公交多条线路，自驾出行方便\n【配套齐全】商业中心、学校、医院一应俱全\n【环境优美】园林景观精心打造，生活品质有保障\n\n欢迎预约看房，专业置业顾问为您服务。',
        '中海汇德里 | 张江核心区域理想居所\n\n作为浦东张江高科技园区的优质项目，中海汇德里凭借优越的地理位置和完善的配套设施，成为众多购房者的首选。\n\n【区位优势】地处张江核心，地铁站步行可达\n【生活配套】周边商业、教育、医疗资源丰富\n【品质保证】中海地产倾力打造，品质有保障\n【园林景观】专业设计团队打造，营造舒适居住环境\n\n更多详情，欢迎到访咨询。',
        '中海汇德里 | 开启品质生活新篇章\n\n项目坐落于浦东新区张江高科技园区，是中海地产精心打造的高品质住宅社区。\n\n【便捷交通】地铁500米，公交多线路覆盖\n【完善配套】商业综合体、知名学府、三甲医院环伺\n【优质环境】园林景观设计，绿化率高，环境宜人\n【精工品质】中海品牌实力保障，工艺精湛\n\n专业团队为您提供一对一置业服务，欢迎莅临。'
      ],
      video: [
        '【开场】\n大家好，今天带大家看看中海汇德里这个楼盘\n\n【沙盘展示】\n这是项目沙盘，可以看到整体规划非常完善\n\n【样板间】\n样板间设计很用心，采光通风都做得很好\n\n【周边配套】\n地铁500米，周边商业、学校、医院配套齐全\n\n【园林景观】\n园林景观打造得很漂亮，生活环境舒适\n\n【结尾】\n感兴趣的朋友可以联系我预约看房',
        '【开场白】\n各位朋友好，我是你们的置业顾问\n今天为大家介绍中海汇德里\n\n【项目位置】\n项目位于浦东张江高科技园区核心地段\n交通便利，地铁站就在附近\n\n【户型介绍】\n户型设计合理，采光充足\n南北通透，居住舒适度很高\n\n【配套设施】\n周边教育、医疗、商业配套应有尽有\n生活非常便利\n\n【社区环境】\n园林景观精心设计，环境优美\n适合家庭居住\n\n【结束语】\n更多详情欢迎联系我，为您提供专业服务',
        '【引入】\n中海汇德里，浦东张江的理想之家\n跟我一起来探索这个项目\n\n【区位优势】\n地处张江高科技园区中心\n地铁、公交四通八达\n\n【实地展示】\n现场环境非常不错\n绿化做得很到位，空气清新\n\n【户型亮点】\n户型方正，空间利用率高\n每个房间都有窗户，通风采光好\n\n【配套资源】\n教育资源丰富，名校环绕\n商业配套成熟，生活便捷\n\n【总结】\n这个项目值得考虑\n欢迎预约实地看房'
      ]
    };

    const options = variants[channel] || [];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }

  function handleSubmit() {
    const selectedCount = contents.filter(c => c.selected).length;
    if (selectedCount === 0) {
      showMessage('请至少选择一条内容');
      return;
    }
    showMessage('文案确认成功！');
    setTimeout(() => {
      // 跳转到图片视频生成页面
      navigate(`/tasks/${id}/media-generation`);
    }, 1500);
  }

  const getChannelColor = (channel: Channel) => {
    const colors: Record<Channel, string> = {
      speech: 'bg-[#FFE7D6] text-[#FA8C16]',
      xiaohongshu: 'bg-[#FFE7D6] text-[#FA8C16]',
      moments: 'bg-[#FFE5F0] text-[#FF6B9D]',
      wechat: 'bg-[#E8FFEA] text-[#00B42A]',
      video: 'bg-[#E8F3FF] text-[#165DFF]'
    };
    return colors[channel] || 'bg-[#F7F8FA] text-[#86909C]';
  };

  const getMethodColor = (color: string) => {
    const colors = {
      warning: 'bg-[#FFF3E0] text-[#FF7D00]',
      info: 'bg-[#E8F3FF] text-[#165DFF]',
      purple: 'bg-[#F7F0FF] text-[#722ED1]'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-32">
      {/* 顶部导航栏 */}
      <header className="bg-gradient-to-br from-[#FA8C16] to-[#FF9500] px-4 pt-3 pb-6 sticky top-0 z-20 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(`/tasks/${id}/execute?step=1`)}
            className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center active:bg-white/30 transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-[18px] font-semibold text-white">文案生成</h1>
          <div className="w-9"></div>
        </div>

        {/* 任务信息卡片 */}
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">🏠</span>
            <span className="text-[16px] font-bold text-[#1D2129]">{houseName}</span>
          </div>
        </div>
      </header>

      {/* 生成中状态 */}
      {isGenerating && (
        <div className="mx-4 mt-4 mb-4 p-4 bg-gradient-to-r from-[#722ED1] to-[#8B5CF6] rounded-2xl text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span className="font-semibold">AI生成中...</span>
            </div>
            <span className="text-sm opacity-90">{generatingProgress}%</span>
          </div>
          <div className="h-1.5 bg-white/30 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-white rounded-full transition-all duration-300" style={{ width: `${generatingProgress}%` }}></div>
          </div>
          <div className="text-xs opacity-90 space-y-1">
            <div>✓ 分析素材内容</div>
            <div>✓ 生成营销文案</div>
            <div>✓ 优化表达效果</div>
            {selectedVideoMethod === 'master' && (
              <div className="mt-2 pt-2 border-t border-white/20">
                💡 大师生成模式：视频将在后台生成，预计1小时完成
              </div>
            )}
          </div>
        </div>
      )}

      {/* 配置区域（生成后可折叠） */}
      {!isGenerating && (
        <div className="px-4 mt-4">
          {showContent && (
            <button
              onClick={() => setConfigExpanded(!configExpanded)}
              className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-between mb-4 active:bg-[#F7F8FA] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FA8C16]" />
                <span className="text-[14px] font-semibold text-[#1D2129]">生成配置</span>
              </div>
              {configExpanded ? <ChevronUp className="w-5 h-5 text-[#86909C]" /> : <ChevronDown className="w-5 h-5 text-[#86909C]" />}
            </button>
          )}
        </div>
      )}

      {/* 配置内容 */}
      {!isGenerating && configExpanded && (
        <div className="px-4 space-y-4 mt-4">
          {/* 素材提示 */}
          <div className="bg-[#E8F3FF] border-l-4 border-[#165DFF] rounded-xl px-4 py-3 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#165DFF] flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-[13px] text-[#165DFF] leading-relaxed">
              AI将基于阶段1收集的素材，为您生成专业营销内容
            </div>
          </div>

          {/* 渠道选择 */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[13px] font-semibold text-[#86909C]">选择生成渠道</span>
              <Sparkles className="w-3.5 h-3.5 text-[#FA8C16]" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CHANNELS.map(channel => (
                <div
                  key={channel.id}
                  onClick={() => toggleChannel(channel.id as Channel)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all active:scale-95 ${
                    selectedChannels.includes(channel.id as Channel)
                      ? 'border-[#FA8C16] bg-[#FFF7E6]'
                      : 'border-[#E5E6EB] bg-[#F7F8FA]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedChannels.includes(channel.id as Channel)
                      ? 'border-[#FA8C16] bg-[#FA8C16]'
                      : 'border-[#E5E6EB]'
                  }`}>
                    {selectedChannels.includes(channel.id as Channel) && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 flex items-center gap-1.5">
                    <span className="text-[15px]">{channel.icon}</span>
                    <span className="text-[13px] font-semibold text-[#1D2129]">{channel.name}</span>
                    {channel.tag && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#FA8C16]/10 text-[#FA8C16] rounded">
                        {channel.tag}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 视频生成方式 */}
          {showVideoMethods && (
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[13px] font-semibold text-[#86909C]">视频生成方式</span>
                <Film className="w-3.5 h-3.5 text-[#FA8C16]" />
              </div>
              <div className="space-y-2">
                {VIDEO_METHODS.map(method => {
                  const Icon = method.icon;
                  return (
                    <div
                      key={method.id}
                      onClick={() => selectVideoMethod(method.id as VideoMethod)}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all active:scale-95 ${
                        selectedVideoMethod === method.id
                          ? 'border-[#FA8C16] bg-[#FFF7E6]'
                          : 'border-[#E5E6EB] bg-[#F7F8FA]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedVideoMethod === method.id
                          ? 'border-[#FA8C16] bg-[#FA8C16]'
                          : 'border-[#E5E6EB]'
                      }`}>
                        {selectedVideoMethod === method.id && (
                          <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                        )}
                      </div>
                      <Icon className="w-5 h-5 text-[#4E5969]" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-[#1D2129]">{method.name}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${getMethodColor(method.color)}`}>
                            {method.badge}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#86909C] mt-0.5">{method.detail}</div>
                      </div>
                      <span className="text-[11px] text-[#86909C]">{method.desc}</span>
                    </div>
                  );
                })}
              </div>

              {/* 视频模板选择 */}
              {needTemplateSelection && (
                <div className="mt-3 p-3 bg-[#F7F8FA] rounded-xl border border-[#E5E6EB]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Film className="w-4 h-4 text-[#FA8C16]" />
                      <span className="text-[12px] font-medium text-[#1D2129]">视频模板</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#FA5151] text-white rounded">必选</span>
                    </div>
                    {selectedTemplate && (
                      <span className="text-[11px] text-[#00B42A] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 已选择
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setShowTemplateModal(true)}
                    className="w-full py-2.5 bg-white border-2 border-[#E5E6EB] rounded-lg text-[12px] font-medium flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <Film className="w-4 h-4" />
                    {selectedTemplate ? videoTemplates.find(t => t.id === selectedTemplate)?.name : '选择视频模板'}
                  </button>
                </div>
              )}

              {/* 录音上传（可选） */}
              {needTemplateSelection && (
                <div className="mt-3 p-3 bg-[#F7F8FA] rounded-xl border border-[#E5E6EB]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-[#FA8C16]" />
                      <span className="text-[12px] font-medium text-[#1D2129]">声音克隆</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#F7F8FA] text-[#86909C] rounded border border-[#E5E6EB]">可选</span>
                    </div>
                    {voiceUploaded && (
                      <span className="text-[11px] text-[#00B42A] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 已上传
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#86909C] mb-2">上传60秒录音，视频将使用您的声音</div>
                  {!voiceUploaded ? (
                    <button
                      onClick={() => setShowVoiceUpload(true)}
                      className="w-full py-2.5 bg-white border-2 border-dashed border-[#E5E6EB] rounded-lg text-[12px] text-[#4E5969] flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      点击上传录音
                    </button>
                  ) : (
                    <button
                      onClick={() => setVoiceUploaded(false)}
                      className="w-full py-2.5 bg-white border border-[#E5E6EB] rounded-lg text-[12px] text-[#00B42A] flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      已上传录音（点击移除）
                    </button>
                  )}
                </div>
              )}

              {/* 形象上传（可选，仅大师生成） */}
              {selectedVideoMethod === 'master' && (
                <div className="mt-3 p-3 bg-[#F7F8FA] rounded-xl border border-[#E5E6EB]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-[#722ED1]" />
                      <span className="text-[12px] font-medium text-[#1D2129]">人物形象</span>
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#F7F8FA] text-[#86909C] rounded border border-[#E5E6EB]">可选</span>
                    </div>
                    {imageUploaded && (
                      <span className="text-[11px] text-[#00B42A] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> 已上传
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#86909C] mb-2">上传形象照片，生成专属数字人</div>
                  {!imageUploaded ? (
                    <button
                      onClick={() => setShowImageUpload(true)}
                      className="w-full py-2.5 bg-white border-2 border-dashed border-[#E5E6EB] rounded-lg text-[12px] text-[#4E5969] flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Upload className="w-4 h-4" />
                      点击上传形象照片
                    </button>
                  ) : (
                    <button
                      onClick={() => setImageUploaded(false)}
                      className="w-full py-2.5 bg-white border border-[#E5E6EB] rounded-lg text-[12px] text-[#00B42A] flex items-center justify-center gap-2 active:scale-95 transition-all"
                    >
                      <Check className="w-4 h-4" />
                      已上传照片（点击移除）
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 已生成内容 */}
      {showContent && (
        <div className="px-4 mt-4 space-y-3">
          {/* 操作栏 */}
          <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FA8C16]" />
              <span className="text-[13px] font-semibold text-[#1D2129]">已生成内容</span>
              <span className="text-[11px] px-2 py-0.5 bg-[#FA8C16]/10 text-[#FA8C16] rounded">{contents.length}条</span>
            </div>
            <button
              onClick={regenerateAll}
              disabled={isGenerating || regeneratingId !== null}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F7F8FA] border border-[#E5E6EB] rounded-lg text-[11px] text-[#4E5969] font-medium active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              重新生成全部
            </button>
          </div>

          {contents.map(content => (
            <div
              key={content.id}
              className={`bg-white rounded-2xl shadow-sm border-2 transition-all ${
                content.selected ? 'border-[#FA8C16] shadow-lg' : 'border-[#E5E6EB]'
              }`}
            >
              <div
                className="flex items-center gap-3 p-4 cursor-pointer active:bg-[#F7F8FA] transition-colors"
                onClick={() => setExpandedContentId(expandedContentId === content.id ? null : content.id)}
              >
                <input
                  type="checkbox"
                  checked={content.selected}
                  onChange={() => toggleContentSelection(content.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 accent-[#FA8C16]"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${getChannelColor(content.channel)}`}>
                      {CHANNELS.find(c => c.id === content.channel)?.name}
                    </span>
                    {content.channel === 'video' && selectedVideoMethod && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-[#F7F0FF] text-[#722ED1] rounded">
                        {selectedVideoMethod === 'lightning' && '闪电生成'}
                        {selectedVideoMethod === 'normal' && '普通生成'}
                        {selectedVideoMethod === 'master' && '大师生成'}
                      </span>
                    )}
                  </div>
                  <div className="text-[14px] font-medium text-[#1D2129]">{content.title}</div>
                </div>
                <ChevronDown className={`w-5 h-5 text-[#86909C] transition-transform ${expandedContentId === content.id ? 'rotate-180' : ''}`} />
              </div>

              {expandedContentId === content.id && (
                <div className="border-t border-[#E5E6EB] p-4 bg-[#FAFBFC]">
                  {editingId === content.id ? (
                    // 编辑模式
                    <div className="space-y-3">
                      <textarea
                        value={editingContent}
                        onChange={(e) => setEditingContent(e.target.value)}
                        className="w-full bg-white rounded-xl p-4 text-[14px] leading-relaxed text-[#4E5969] border-2 border-[#FA8C16] focus:outline-none resize-none"
                        rows={10}
                        placeholder="请输入内容"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={cancelEdit}
                          className="flex-1 py-2.5 bg-white border border-[#E5E6EB] rounded-lg text-[12px] text-[#4E5969] font-medium active:scale-95 transition-all"
                        >
                          取消
                        </button>
                        <button
                          onClick={saveEdit}
                          className="flex-1 py-2.5 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-lg text-[12px] font-semibold active:scale-95 transition-all"
                        >
                          保存
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 查看模式
                    <div className="space-y-3">
                      <div className="bg-white rounded-xl p-4 text-[14px] leading-relaxed text-[#4E5969] whitespace-pre-wrap">
                        {content.content}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(content.id)}
                          className="flex-1 py-2.5 bg-white border border-[#E5E6EB] rounded-lg text-[12px] text-[#4E5969] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          编辑
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(content.content);
                            showMessage('复制成功');
                          }}
                          className="flex-1 py-2.5 bg-white border border-[#E5E6EB] rounded-lg text-[12px] text-[#4E5969] flex items-center justify-center gap-1.5 active:scale-95 transition-all"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          复制
                        </button>
                        <button
                          onClick={() => regenerateContent(content.id)}
                          disabled={regeneratingId === content.id}
                          className={`flex-1 py-2.5 bg-white border border-[#E5E6EB] rounded-lg text-[12px] flex items-center justify-center gap-1.5 active:scale-95 transition-all ${
                            regeneratingId === content.id ? 'text-[#FA8C16]' : 'text-[#4E5969]'
                          }`}
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${regeneratingId === content.id ? 'animate-spin' : ''}`} />
                          {regeneratingId === content.id ? '生成中' : '重新生成'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 底部操作栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm px-4 py-4 shadow-[0_-2px_20px_rgba(0,0,0,0.08)] border-t border-[#E5E6EB] z-50">
        {!showContent ? (
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className={`w-full py-4 rounded-xl text-[16px] font-semibold transition-all flex items-center justify-center gap-2 ${
              canGenerate
                ? 'bg-gradient-to-r from-[#722ED1] to-[#8B5CF6] text-white shadow-lg active:scale-[0.98]'
                : 'bg-[#E5E6EB] text-[#86909C] cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            开始生成内容
            {!canGenerate && needTemplateSelection && !selectedTemplate && (
              <span className="text-[12px] opacity-80">（请先选择视频模板）</span>
            )}
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="w-full py-4 rounded-xl text-[16px] font-semibold bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-5 h-5" />
            确认文案（{contents.filter(c => c.selected).length}）
          </button>
        )}
      </div>

      {/* 视频模板选择弹窗 */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-end justify-center" onClick={() => setShowTemplateModal(false)}>
          <div className="bg-white rounded-t-3xl w-full max-w-[500px] p-6 pb-8 shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <div className="text-[18px] font-bold text-[#1D2129]">选择视频模板</div>
              <button onClick={() => setShowTemplateModal(false)} className="w-8 h-8 bg-[#F7F8FA] rounded-full flex items-center justify-center active:bg-[#E5E6EB] transition-colors">
                <ChevronDown className="w-4 h-4 text-[#4E5969]" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {videoTemplates.map(template => (
                <div
                  key={template.id}
                  onClick={() => selectTemplate(template.id)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all active:scale-95 ${
                    selectedTemplate === template.id ? 'ring-2 ring-[#FA8C16] shadow-lg' : ''
                  }`}
                >
                  {/* 缩略图 */}
                  <div className="relative aspect-[9/16] bg-gradient-to-br from-[#FA8C16] to-[#FF9500]">
                    <img
                      src={`https://picsum.photos/seed/${template.thumbnail}/300/500`}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                    {/* 播放图标 */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                        <Play className="w-6 h-6 text-[#FA8C16] ml-1" fill="#FA8C16" />
                      </div>
                    </div>
                    {/* 时长标签 */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-[10px] text-white">
                      {template.duration}
                    </div>
                    {/* 选中标记 */}
                    {selectedTemplate === template.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-[#FA8C16] rounded-full flex items-center justify-center shadow-md">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  {/* 模板信息 */}
                  <div className="p-3 bg-white">
                    <div className="text-[13px] font-semibold text-[#1D2129] mb-1">{template.name}</div>
                    <div className="text-[11px] text-[#86909C]">{template.style}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowTemplateModal(false)}
              className="w-full mt-4 py-3.5 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-xl font-semibold shadow-md active:scale-95 transition-all"
            >
              确定
            </button>
          </div>
        </div>
      )}

      {/* 录音上传弹窗 */}
      {showVoiceUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center px-4" onClick={() => setShowVoiceUpload(false)}>
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-6 shadow-2xl animate-fade-in relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVoiceUpload(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F7F8FA] rounded-full flex items-center justify-center active:bg-[#E5E6EB] transition-colors"
            >
              <X className="w-4 h-4 text-[#4E5969]" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] rounded-full flex items-center justify-center mx-auto mb-3">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1D2129] mb-2">上传录音</h3>
              <p className="text-[13px] text-[#86909C]">请上传60秒的录音文件用于声音克隆</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleVoiceUpload}
                className="w-full py-3.5 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-xl font-semibold active:scale-95 transition-all"
              >
                选择文件上传
              </button>
              <button
                onClick={() => setShowVoiceUpload(false)}
                className="w-full py-3.5 bg-[#F7F8FA] text-[#4E5969] rounded-xl font-semibold active:scale-95 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 形象上传弹窗 */}
      {showImageUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center px-4" onClick={() => setShowImageUpload(false)}>
          <div className="bg-white rounded-3xl w-full max-w-[360px] p-6 shadow-2xl animate-fade-in relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowImageUpload(false)}
              className="absolute top-4 right-4 w-8 h-8 bg-[#F7F8FA] rounded-full flex items-center justify-center active:bg-[#E5E6EB] transition-colors"
            >
              <X className="w-4 h-4 text-[#4E5969]" />
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#722ED1] to-[#8B5CF6] rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-[18px] font-bold text-[#1D2129] mb-2">上传人物形象</h3>
              <p className="text-[13px] text-[#86909C]">请上传清晰的正面照片用于数字人生成</p>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleImageUpload}
                className="w-full py-3.5 bg-gradient-to-r from-[#722ED1] to-[#8B5CF6] text-white rounded-xl font-semibold active:scale-95 transition-all"
              >
                选择照片上传
              </button>
              <button
                onClick={() => setShowImageUpload(false)}
                className="w-full py-3.5 bg-[#F7F8FA] text-[#4E5969] rounded-xl font-semibold active:scale-95 transition-all"
              >
                取消
              </button>
            </div>
          </div>
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
