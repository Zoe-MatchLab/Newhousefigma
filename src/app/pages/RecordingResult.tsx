import { useState, useEffect } from 'react';
import { ChevronLeft, Play, Pause, Share2, ChevronDown, ChevronUp, User, FileText, Phone, Home, Clock, Upload } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

interface RecordingData {
  id: string;
  name: string;
  duration: string;
  size: string;
  building: string;
  customer: string | null;
  phone: string | null;
  agent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  score: number | null;
  time: Date;
  transcript?: Array<{ speaker: 'agent' | 'customer'; text: string }>;
  analysis?: {
    intentLevel: '高' | '中' | '低';
    speechSkills: {
      opening: number;
      needs: number;
      objection: number;
    };
    customerNeeds: string;
    extractedInfo: {
      name: string;
      phone: string;
      budget: string;
      layout: string;
      coreNeeds: string;
      purpose: string;
    };
    improvementSuggestions: string[];
  };
}

export default function RecordingResult() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [recording, setRecording] = useState<RecordingData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedTranscript, setExpandedTranscript] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [waveAnimation, setWaveAnimation] = useState<number[]>([]);

  useEffect(() => {
    // 模拟获取录音数据
    const mockRecordings: RecordingData[] = [
      {
        id: 'RECORD_001',
        name: '通话录音_20260412.wav',
        duration: '5分32秒',
        size: '3.2MB',
        building: '中海汇德里',
        customer: '张三',
        phone: '138****8821',
        agent: '陈佳佳',
        status: 'completed',
        score: 85,
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        transcript: [
          { speaker: 'agent', text: '喂您好张先生您好，我是咱们中海汇德里的置业顾问小李，您之前有咨询过我们项目不知道您还有印象吗？' },
          { speaker: 'customer', text: '哦有的有的，你们那个项目在哪个位置来着？' },
          { speaker: 'agent', text: '我们在浦东新区张江高科技园区这边，地铁13号线XXX站下来500米就到了。项目主打的是110-130㎡的三室户型，预算的话800-1000万之间可以看看。' },
          { speaker: 'customer', text: '哦800-1000万啊，那你们周边有什么学校吗？我小孩明年要上小学了。' },
          { speaker: 'agent', text: '张先生您问得太好了！我们项目旁边就是XX小学和XX中学，都是区重点的。项目还自带一个国际幼儿园，真正实现了目送式教育。' },
          { speaker: 'customer', text: '哦那挺好的。那个户型能看看吗？' },
          { speaker: 'agent', text: '当然可以张先生，这样我帮您约一个专属的带看时间，您看明天下午3点方便吗？' },
          { speaker: 'customer', text: '行啊，那明天下午3点我过去看看。' },
          { speaker: 'agent', text: '好的张先生，那我这边帮您安排好，到时候我到地铁口接您。您路上注意安全，明天见！' },
          { speaker: 'customer', text: '好的谢谢，明天见。' }
        ],
        analysis: {
          intentLevel: '高',
          speechSkills: {
            opening: 85,
            needs: 80,
            objection: 90
          },
          customerNeeds: '客户主要关注110-130㎡的三室户型，预算在800-1000万之间。对学区资源和周边地铁配套有明确需求，属于改善型购房客户。',
          extractedInfo: {
            name: '张先生',
            phone: '未在录音中提及',
            budget: '800-1000万',
            layout: '110-130㎡三室',
            coreNeeds: '学区资源、地铁配套',
            purpose: '改善型需求'
          },
          improvementSuggestions: [
            '建议加强需求挖掘环节，在客户回答后追加"为什么"类问题，深入了解真实需求和决策权重。',
            '异议处理环节表现较好，但可以更果断地给出解决方案，减少客户犹豫时间。',
            '开场白略显冗长，建议在前30秒内完成价值主张表达，提高客户注意力。'
          ]
        },
      },
      {
        id: 'RECORD_002',
        name: '20260411_100512.wav',
        duration: '4分18秒',
        size: '2.8MB',
        building: '万科翡翠公园',
        customer: '李四',
        phone: '139****6666',
        agent: '李明',
        status: 'processing',
        score: null,
        time: new Date(Date.now() - 26 * 60 * 60 * 1000),
      },
      {
        id: 'RECORD_003',
        name: '邀约录音_0411.mp3',
        duration: '3分05秒',
        size: '1.9MB',
        building: '华润外滩九里',
        customer: null,
        phone: null,
        agent: '王芳',
        status: 'pending',
        score: null,
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'RECORD_004',
        name: '20260410_161200.wav',
        duration: '6分22秒',
        size: '4.5MB',
        building: '龙湖天琅',
        customer: '王五',
        phone: '137****5555',
        agent: '赵伟',
        status: 'completed',
        score: 92,
        time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        transcript: [
          { speaker: 'agent', text: '您好王先生，我是龙湖天琅的置业顾问小赵，上次您来看过我们的样板间，今天给您做个回访。' },
          { speaker: 'customer', text: '哦对，我看了你们那个120平的户型，感觉还不错。' },
          { speaker: 'agent', text: '是的王先生，那个户型是我们的明星户型，南北通透，采光非常好。而且我们现在有个限时优惠活动，首付可以做到30%，利率也有优惠。' },
          { speaker: 'customer', text: '哦，首付30%啊，那还可以。你们周边有地铁吗？' },
          { speaker: 'agent', text: '有的王先生，我们项目距离地铁5号线XXX站只有800米，步行10分钟左右就能到。而且周边还有大型商场和医院，生活非常便利。' },
          { speaker: 'customer', text: '嗯，那挺好的。价格方面还有优惠吗？' },
          { speaker: 'agent', text: '王先生，我们现在的均价是85000元/㎡，如果您今天能定下来，我可以帮您申请一个额外的98折优惠，这样算下来能省不少钱。' },
          { speaker: 'customer', text: '好的，我考虑一下，明天给你答复。' },
          { speaker: 'agent', text: '没问题王先生，您考虑好了随时联系我，我的电话是138****1234。' },
          { speaker: 'customer', text: '好的，谢谢。' }
        ],
        analysis: {
          intentLevel: '中',
          speechSkills: {
            opening: 90,
            needs: 85,
            objection: 80
          },
          customerNeeds: '客户关注120㎡户型，对首付比例和利率有明确要求，注重交通便利性和周边配套设施，属于改善型购房客户。',
          extractedInfo: {
            name: '王先生',
            phone: '137****5555',
            budget: '约1000万',
            layout: '120㎡',
            coreNeeds: '交通便利、周边配套',
            purpose: '改善型需求'
          },
          improvementSuggestions: [
            '建议在客户表示考虑时，主动提供更多比较数据，帮助客户做出决策。',
            '可以更详细地介绍项目的投资价值和增值潜力。',
            '在价格谈判环节，可以更灵活地使用优惠策略，提高成交率。'
          ]
        },
      },
    ];

    const foundRecording = mockRecordings.find(r => r.id === id);
    setRecording(foundRecording || null);
  }, [id]);

  useEffect(() => {
    // 初始化波形动画数据
    const initialWave = Array(10).fill(0).map(() => Math.random() * 16 + 4);
    setWaveAnimation(initialWave);
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      // 播放时更新波形动画
      interval = setInterval(() => {
        setWaveAnimation(prev => prev.map(() => Math.random() * 16 + 4));
      }, 300);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleTranscript = () => {
    setExpandedTranscript(!expandedTranscript);
  };

  const showToast = (message: string) => {
    // 简单的Toast实现
    const toast = document.createElement('div');
    toast.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/75 text-white px-6 py-3 rounded-xl z-50 text-[14px]';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 200);
    }, 2000);
  };

  const handleShare = () => {
    showToast('已分享');
  };

  const handleChangeCustomer = () => {
    if (!recording?.customer) {
      selectCustomer();
      return;
    }
    setShowConfirmModal(true);
  };

  const selectCustomer = () => {
    // 跳转到客户选择页面
    navigate('/recording/customer-select', {
      state: { recordId: recording?.id }
    });
  };

  const confirmChangeCustomer = () => {
    setShowConfirmModal(false);
    showToast('已解除原客户关联');
    // 这里可以添加解除客户关联的逻辑
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  if (!recording) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <div className="text-[16px] font-semibold text-[#1D2129]">加载中...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-[#F0F0F0] px-4 py-3 flex items-center gap-2 sticky top-0 z-20">
        <button onClick={() => navigate('/recording/list')} className="text-[#FA8C16] p-1">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 text-center mr-10">
          <h1 className="text-[16px] font-semibold text-[#1D2129]">分析结果</h1>
        </div>
        <button onClick={handleShare} className="text-[#FA8C16] p-1">
          <Share2 className="w-5 h-5" />
        </button>
      </header>

      {/* 录音播放卡片 */}
      <div className="m-4 bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 cursor-pointer active:scale-[0.99] transition-transform">
        <button 
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ${isPlaying ? 'bg-[#FA5151]' : 'bg-[#FA8C16]'}`}
          onClick={handlePlay}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-semibold text-[#1D2129] truncate">{recording.name}</div>
          <div className="text-[12px] text-[#86909C] mt-1">
            {recording.customer ? `${recording.customer} · ` : ''}{recording.time.toLocaleString()} · {recording.duration}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 h-5 ${isPlaying ? 'opacity-100' : 'opacity-50'}`}>
            {waveAnimation.map((height, index) => (
              <span 
                key={index} 
                className={`w-1.5 rounded-full bg-[#FA8C16] ${isPlaying ? 'animate-wave' : ''}`}
                style={{ height: `${height}px` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 录音转文本 */}
      {recording.status === 'completed' && recording.transcript && (
        <div className="m-4 bg-white rounded-2xl shadow-sm overflow-hidden">
          <div 
            className="p-4 flex items-center justify-between cursor-pointer"
            onClick={toggleTranscript}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E6F7FF] text-[#1890FF] flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <span className="text-[15px] font-semibold text-[#1D2129]">录音转文本</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-[#86909C] transition-transform ${expandedTranscript ? 'rotate-180' : ''}`} />
          </div>
          {expandedTranscript && (
            <div className="px-4 pb-4">
              <div className="bg-[#F7F8FA] rounded-lg p-4">
                {recording.transcript.map((item, index) => (
                  <p key={index} className="mb-2 last:mb-0">
                    <span className={`font-semibold mr-2 ${item.speaker === 'agent' ? 'text-[#FA8C16]' : 'text-[#34D399]'}`}>
                      {item.speaker === 'agent' ? '经纪人：' : '客户：'}
                    </span>
                    {item.text}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 分析结果 */}
      {recording.status === 'completed' && recording.analysis && (
        <div className="m-4 bg-white rounded-2xl shadow-sm p-4">
          <div className="markdown-body">
            <h1 className="text-[18px] font-semibold text-[#1D2129] mb-4 pb-2 border-b-2 border-[#FA8C16]">📊 录音分析报告</h1>
            
            <h2 className="text-[15px] font-semibold text-[#1D2129] mt-6 mb-2">综合评分</h2>
            <p className="text-[14px] text-[#4E5969] mb-4">
              <strong>{recording.score}分</strong> {recording.analysis.intentLevel === '高' ? '↑' : recording.analysis.intentLevel === '中' ? '→' : '↓'} 购买意向{recording.analysis.intentLevel}
            </p>
            <blockquote className="bg-[#F7F8FA] border-l-3 border-[#FA8C16] rounded-r p-3 mb-6 text-[#86909C]">
              话术表现{recording.score >= 85 ? '优秀' : recording.score >= 70 ? '良好' : '一般'}，{recording.score >= 85 ? '继续保持' : '有小幅提升空间'}
            </blockquote>
            
            <hr className="border-t border-[#E5E6EB] my-4" />
            
            <h2 className="text-[15px] font-semibold text-[#1D2129] mt-6 mb-2">客户画像</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-[#F7F8FA]">
                  <th className="border border-[#E5E6EB] px-3 py-2 text-left text-[13px] font-semibold text-[#1D2129]">属性</th>
                  <th className="border border-[#E5E6EB] px-3 py-2 text-left text-[13px] font-semibold text-[#1D2129]">信息</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">客户姓名</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">{recording.analysis.extractedInfo.name}</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">手机号</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">{recording.analysis.extractedInfo.phone}</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">预算范围</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]"><strong>{recording.analysis.extractedInfo.budget}</strong></td>
                </tr>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">意向户型</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">{recording.analysis.extractedInfo.layout}</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">核心需求</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">{recording.analysis.extractedInfo.coreNeeds}</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">购房目的</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">{recording.analysis.extractedInfo.purpose}</td>
                </tr>
              </tbody>
            </table>
            
            <hr className="border-t border-[#E5E6EB] my-4" />
            
            <h2 className="text-[15px] font-semibold text-[#1D2129] mt-6 mb-2">话术技巧</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-[#F7F8FA]">
                  <th className="border border-[#E5E6EB] px-3 py-2 text-left text-[13px] font-semibold text-[#1D2129]">维度</th>
                  <th className="border border-[#E5E6EB] px-3 py-2 text-center text-[13px] font-semibold text-[#1D2129]">得分</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">开场白</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-center text-[13px] text-[#4E5969]"><strong>{recording.analysis.speechSkills.opening}</strong>分</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">需求挖掘</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-center text-[13px] text-[#4E5969]"><strong>{recording.analysis.speechSkills.needs}</strong>分</td>
                </tr>
                <tr>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-[13px] text-[#4E5969]">异议处理</td>
                  <td className="border border-[#E5E6EB] px-3 py-2 text-center text-[13px] text-[#4E5969]"><strong>{recording.analysis.speechSkills.objection}</strong>分</td>
                </tr>
              </tbody>
            </table>
            
            <hr className="border-t border-[#E5E6EB] my-4" />
            
            <h2 className="text-[15px] font-semibold text-[#1D2129] mt-6 mb-2">客户需求</h2>
            <p className="text-[14px] text-[#4E5969] mb-2"><strong>需求标签：</strong> 三室户型 | 价格敏感 | 关注学区 | 改善型需求</p>
            <p className="text-[14px] text-[#4E5969] mb-6">{recording.analysis.customerNeeds}</p>
            
            <hr className="border-t border-[#E5E6EB] my-4" />
            
            <h2 className="text-[15px] font-semibold text-[#1D2129] mt-6 mb-2">改进建议</h2>
            <ul className="list-disc pl-5 mb-6 space-y-2">
              {recording.analysis.improvementSuggestions.map((suggestion, index) => (
                <li key={index} className="text-[14px] text-[#4E5969]">{suggestion}</li>
              ))}
            </ul>
            
            <p className="text-[12px] text-[#86909C] italic">分析时间：{recording.time.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* 关联客户 */}
      {recording.status === 'completed' && (
        <div className="m-4 bg-white rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#E8FFEA] text-[#00B42A] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-[15px] font-semibold text-[#1D2129]">关联客户</span>
            </div>
            {recording.customer && (
              <button onClick={handleChangeCustomer} className="text-[13px] text-[#FA8C16]">更换客户</button>
            )}
          </div>
          {recording.customer ? (
            <div className="bg-[#F7F8FA] rounded-lg p-4 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-[#FFF7E6] text-[#FA8C16] flex items-center justify-center text-[18px] font-semibold">
                {recording.customer.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="text-[15px] font-semibold text-[#1D2129]">{recording.customer}</div>
                <div className="text-[13px] text-[#86909C]">{recording.phone}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-[#86909C]">
              <div className="text-[32px] mb-2 text-[#E5E6EB]">
                <User className="w-10 h-10" />
              </div>
              <div className="mb-4">暂未关联客户</div>
              <button 
                onClick={selectCustomer}
                className="w-full py-3 bg-[#FA8C16] text-white rounded-lg font-medium"
              >
                选择关联客户
              </button>
            </div>
          )}
        </div>
      )}

      {/* 处理中状态 */}
      {recording.status === 'processing' && (
        <div className="m-4 bg-white rounded-2xl p-10 text-center shadow-sm">
          <div className="text-[48px] text-[#E5E6EB] mb-4">
            <FileText className="w-12 h-12" />
          </div>
          <div className="text-[15px] font-semibold text-[#1D2129] mb-2">分析中</div>
          <div className="text-[13px] text-[#86909C] mb-6">正在分析录音内容，请稍候...</div>
          <div className="w-full h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
            <div className="h-full bg-[#FA8C16] rounded-full animate-progress" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {/* 待分析状态 */}
      {recording.status === 'pending' && (
        <div className="m-4 bg-white rounded-2xl p-10 text-center shadow-sm">
          <div className="text-[48px] text-[#E5E6EB] mb-4">
            <FileText className="w-12 h-12" />
          </div>
          <div className="text-[15px] font-semibold text-[#1D2129] mb-2">待分析</div>
          <div className="text-[13px] text-[#86909C] mb-6">录音已上传，等待分析...</div>
        </div>
      )}

      {/* 分析失败状态 */}
      {recording.status === 'failed' && (
        <div className="m-4 bg-white rounded-2xl p-10 text-center shadow-sm">
          <div className="text-[48px] text-[#FFECE8] mb-4">
            <FileText className="w-12 h-12" />
          </div>
          <div className="text-[15px] font-semibold text-[#FA5151] mb-2">分析失败</div>
          <div className="text-[13px] text-[#86909C] mb-6">录音分析失败，请重试</div>
          <button 
            className="px-6 py-2 bg-[#FA5151] text-white rounded-xl font-semibold active:opacity-90 transition-opacity"
            onClick={() => navigate('/recording/list')}
          >
            返回列表
          </button>
        </div>
      )}

      {/* 确认弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-[300px] text-center">
            <div className="w-12 h-12 rounded-full bg-[#FFF7E6] text-[#FA8C16] flex items-center justify-center mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-[18px] font-semibold text-[#1F1F1F] mb-2">确认更换客户？</h3>
            <p className="text-[14px] text-[#666] mb-6">更换客户后，原客户与该录音的关联将解除。</p>
            <div className="flex gap-3">
              <button 
                onClick={closeConfirmModal}
                className="flex-1 py-3 bg-[#F5F5F5] text-[#666] rounded-lg font-medium"
              >
                取消
              </button>
              <button 
                onClick={confirmChangeCustomer}
                className="flex-1 py-3 bg-[#FA8C16] text-white rounded-lg font-medium"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes wave {
          0% { transform: scaleY(0.4); }
          100% { transform: scaleY(1.2); }
        }
        .animate-wave {
          animation: wave 0.5s ease-in-out infinite alternate;
        }
      `}</style>
    </div>
  );
}
