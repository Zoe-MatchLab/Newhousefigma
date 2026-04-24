import { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, Download, Share2, ChevronDown, ChevronUp, Clock, FileText, Mic, Building2, User, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

interface RecordingData {
  id: string;
  name: string;
  duration: string;
  size: string;
  building: string;
  customer: string | null;
  agent: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  score: number | null;
  time: Date;
  analysis?: {
    keywords: string[];
    summary: string;
    suggestions: string[];
    quality: {
      clarity: number;
      fluency: number;
      professionalism: number;
    };
  };
}

export default function RecordingResult() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [recording, setRecording] = useState<RecordingData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    keywords: false,
    suggestions: false,
    quality: false,
  });

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
        agent: '陈佳佳',
        status: 'completed',
        score: 85,
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        analysis: {
          keywords: ['房源介绍', '价格谈判', '看房时间', '优惠政策', '贷款流程'],
          summary: '本次通话主要围绕中海汇德里的房源介绍展开，客户对价格有一定疑虑，销售顾问详细解释了优惠政策和贷款流程，并成功约定了看房时间。',
          suggestions: [
            '可以更详细地介绍楼盘的周边配套设施',
            '在价格谈判环节可以更灵活一些',
            '建议提前准备好贷款计算工具，方便客户现场了解',
          ],
          quality: {
            clarity: 90,
            fluency: 85,
            professionalism: 88,
          },
        },
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
        time: new Date(Date.now() - 26 * 60 * 60 * 1000),
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
        time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
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
        time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        analysis: {
          keywords: ['房源推荐', '户型介绍', '交通便利', '学区优势', '投资价值'],
          summary: '销售顾问针对客户的需求，推荐了龙湖天琅的合适户型，详细介绍了交通便利和学区优势，并分析了该楼盘的投资价值，客户表示有兴趣进一步了解。',
          suggestions: [
            '可以提供更多关于周边商业配套的信息',
            '建议准备一些客户见证或案例分享',
            '在介绍投资价值时可以提供一些数据支持',
          ],
          quality: {
            clarity: 95,
            fluency: 92,
            professionalism: 90,
          },
        },
      },
    ];

    const foundRecording = mockRecordings.find(r => r.id === id);
    setRecording(foundRecording || null);
  }, [id]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const getScoreClass = (score: number | null) => {
    if (!score) return '';
    if (score >= 85) return 'bg-[#E8FFEA] text-[#00B42A] border-[#00B42A]';
    if (score >= 70) return 'bg-[#FFF7E6] text-[#FA8C16] border-[#FA8C16]';
    return 'bg-[#FFECE8] text-[#FA5151] border-[#FA5151]';
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
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => navigate('/recording/list')} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg active:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1D2129]" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#1D2129]">录音分析结果</h1>
        <div className="w-8" />
      </header>

      {/* 录音基本信息 */}
      <div className="m-4 bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <button 
            className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FA8C16] to-[#E67A0E] flex items-center justify-center shadow-lg"
            onClick={handlePlay}
          >
            {isPlaying ? <Pause className="w-6 h-6 text-white" /> : <Play className="w-6 h-6 text-white" />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="text-[16px] font-semibold text-[#1D2129] truncate">{recording.name}</div>
            <div className="text-[13px] text-[#86909C] mt-1">
              {recording.customer ? `${recording.customer} · ` : ''}{recording.building} · {recording.duration}
            </div>
          </div>
          {recording.status === 'completed' && recording.score && (
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-[16px] font-bold border-2 ${getScoreClass(recording.score)}`}>
              {recording.score}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#86909C]" />
            <span className="text-[13px] text-[#86909C]">{recording.time.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#86909C]" />
            <span className="text-[13px] text-[#86909C]">{recording.size}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4 text-[#86909C]" />
            <span className="text-[13px] text-[#86909C]">{recording.agent}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 h-10 bg-[#F7F8FA] text-[#1D2129] rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold active:bg-[#E5E6EB] transition-colors">
            <Download className="w-4 h-4" />
            <span>下载录音</span>
          </button>
          <button className="flex-1 h-10 bg-[#F7F8FA] text-[#1D2129] rounded-xl flex items-center justify-center gap-2 text-[14px] font-semibold active:bg-[#E5E6EB] transition-colors">
            <Share2 className="w-4 h-4" />
            <span>分享结果</span>
          </button>
        </div>
      </div>

      {/* 分析结果 */}
      {recording.status === 'completed' && recording.analysis && (
        <div className="m-4 space-y-4">
          {/* 对话摘要 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button 
              className="w-full px-5 py-4 flex items-center justify-between text-left"
              onClick={() => toggleSection('summary')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF7E6] text-[#FA8C16] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-semibold text-[#1D2129]">对话摘要</span>
              </div>
              {expandedSections.summary ? <ChevronUp className="w-5 h-5 text-[#86909C]" /> : <ChevronDown className="w-5 h-5 text-[#86909C]" />}
            </button>
            {expandedSections.summary && (
              <div className="px-5 pb-5">
                <p className="text-[14px] text-[#4E5969] leading-relaxed">{recording.analysis.summary}</p>
              </div>
            )}
          </div>

          {/* 关键词 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button 
              className="w-full px-5 py-4 flex items-center justify-between text-left"
              onClick={() => toggleSection('keywords')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F5FF] text-[#1890FF] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-semibold text-[#1D2129]">关键词</span>
              </div>
              {expandedSections.keywords ? <ChevronUp className="w-5 h-5 text-[#86909C]" /> : <ChevronDown className="w-5 h-5 text-[#86909C]" />}
            </button>
            {expandedSections.keywords && (
              <div className="px-5 pb-5">
                <div className="flex flex-wrap gap-2">
                  {recording.analysis.keywords.map((keyword, index) => (
                    <span key={index} className="px-3 py-1 bg-[#F7F8FA] text-[#4E5969] rounded-full text-[13px]">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 改进建议 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button 
              className="w-full px-5 py-4 flex items-center justify-between text-left"
              onClick={() => toggleSection('suggestions')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8FFEA] text-[#00B42A] flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-semibold text-[#1D2129]">改进建议</span>
              </div>
              {expandedSections.suggestions ? <ChevronUp className="w-5 h-5 text-[#86909C]" /> : <ChevronDown className="w-5 h-5 text-[#86909C]" />}
            </button>
            {expandedSections.suggestions && (
              <div className="px-5 pb-5">
                <ul className="space-y-2">
                  {recording.analysis.suggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#FA8C16] mt-2 flex-shrink-0" />
                      <span className="text-[14px] text-[#4E5969]">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 质量评估 */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm">
            <button 
              className="w-full px-5 py-4 flex items-center justify-between text-left"
              onClick={() => toggleSection('quality')}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF0F0] text-[#FA5151] flex items-center justify-center">
                  <Star className="w-4 h-4" />
                </div>
                <span className="text-[15px] font-semibold text-[#1D2129]">质量评估</span>
              </div>
              {expandedSections.quality ? <ChevronUp className="w-5 h-5 text-[#86909C]" /> : <ChevronDown className="w-5 h-5 text-[#86909C]" />}
            </button>
            {expandedSections.quality && (
              <div className="px-5 pb-5 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-[#4E5969]">清晰度</span>
                    <span className="text-[13px] font-semibold text-[#1D2129]">{recording.analysis.quality.clarity}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FA8C16] rounded-full transition-all duration-500"
                      style={{ width: `${recording.analysis.quality.clarity}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-[#4E5969]">流畅度</span>
                    <span className="text-[13px] font-semibold text-[#1D2129]">{recording.analysis.quality.fluency}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FA8C16] rounded-full transition-all duration-500"
                      style={{ width: `${recording.analysis.quality.fluency}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] text-[#4E5969]">专业度</span>
                    <span className="text-[13px] font-semibold text-[#1D2129]">{recording.analysis.quality.professionalism}%</span>
                  </div>
                  <div className="w-full h-2 bg-[#F7F8FA] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#FA8C16] rounded-full transition-all duration-500"
                      style={{ width: `${recording.analysis.quality.professionalism}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 处理中状态 */}
      {recording.status === 'processing' && (
        <div className="m-4 bg-white rounded-2xl p-10 text-center shadow-sm">
          <div className="text-[48px] text-[#E5E6EB] mb-4">
            <Mic />
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
            <Mic />
          </div>
          <div className="text-[15px] font-semibold text-[#1D2129] mb-2">待分析</div>
          <div className="text-[13px] text-[#86909C] mb-6">录音已上传，等待分析...</div>
        </div>
      )}

      {/* 分析失败状态 */}
      {recording.status === 'failed' && (
        <div className="m-4 bg-white rounded-2xl p-10 text-center shadow-sm">
          <div className="text-[48px] text-[#FFECE8] mb-4">
            <Mic />
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
    </div>
  );
}
