import { useState, useEffect } from 'react';
import { ArrowLeft, Mic, Shield, Info, ChevronRight, Check, X, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export default function RecordingUpload() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [building, setBuilding] = useState<any>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [remark, setRemark] = useState('');
  const [validationResults, setValidationResults] = useState({
    format: null,
    size: null,
    duration: null
  });

  // 接收从选择页面返回的数据
  useEffect(() => {
    if (location.state) {
      if (location.state.selectedBuilding) {
        setBuilding(location.state.selectedBuilding);
      }
      if (location.state.selectedCustomer) {
        setCustomer(location.state.selectedCustomer);
      }
      if (location.state.selectedFile) {
        setSelectedFile(location.state.selectedFile);
      }
    }
  }, [location.state]);

  const handleSelectFile = () => {
    // 模拟文件选择
    const mockFile = {
      name: '通话录音_' + new Date().toISOString().slice(0, 10) + '.wav',
      size: 3355443, // 3.2MB
      duration: 332  // 5分32秒
    };
    setSelectedFile(mockFile);
    validateFile(mockFile);
  };

  const validateFile = (file: any) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validFormat = ext && ['mp3', 'wav', 'amr'].includes(ext);
    const validSize = file.size <= 20 * 1024 * 1024;
    const validDuration = file.duration >= 180 && file.duration <= 1800;

    setValidationResults({
      format: validFormat,
      size: validSize,
      duration: validDuration
    });
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setValidationResults({
      format: null,
      size: null,
      duration: null
    });
  };

  const handleSubmit = () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    // 模拟上传进度
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        const newProgress = prev + Math.random() * 15;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            navigate('/recording/list'); // 导航到录音列表页面
            // navigate(-1); // 返回上一页
          }, 1000);
          return 100;
        }
        return newProgress;
      });
    }, 200);
  };

  const goToBuildingSelect = () => {
    navigate('/recording/building-select', {
      state: { 
        currentBuilding: building, 
        currentCustomer: customer,
        currentFile: selectedFile
      }
    });
  };

  const goToCustomerSelect = () => {
    navigate('/recording/customer-select', {
      state: { 
        currentBuilding: building, 
        currentCustomer: customer,
        currentFile: selectedFile
      }
    });
  };

  const clearBuilding = () => {
    setBuilding(null);
  };

  const clearCustomer = () => {
    setCustomer(null);
  };

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m + '分' + (s > 0 ? s + '秒' : '');
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + 'B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / (1024 * 1024)).toFixed(1) + 'MB';
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="w-8 h-8 flex items-center justify-center bg-white/20 rounded-lg active:bg-white/30 transition-colors">
          <ArrowLeft className="w-5 h-5 text-[#1D2129]" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#1D2129]">上传录音</h1>
        <div className="w-8" />
      </header>

      {/* 隐私保护Banner */}
      <div className="m-4 bg-[#FFF7E6] border border-[#FFD580] rounded-2xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#FA8C16] flex items-center justify-center flex-shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <div className="text-[14px] font-semibold text-[#1D2129]">隐私保护 · 严格保密</div>
          <div className="text-[12px] text-[#86909C] mt-1">您的录音仅用于个人能力提升</div>
        </div>
        <button 
          className="w-6 h-6 rounded-full bg-white border border-[#E5E6EB] flex items-center justify-center"
          onClick={() => setShowPrivacyModal(true)}
        >
          <Info className="w-4 h-4 text-[#FA8C16]" />
        </button>
      </div>

      {/* 上传区域 */}
      <div className="m-4 bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="p-8 flex flex-col items-center gap-4">
          <button 
            className="w-full max-w-[280px] h-30 border-2 border-dashed border-[#E5E6EB] rounded-2xl bg-[#F7F8FA] flex flex-col items-center justify-center gap-2 p-6 cursor-pointer transition-all hover:border-[#FA8C16] hover:bg-[#FFF7E6]"
            onClick={handleSelectFile}
          >
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#FA8C16] to-[#E67A0E] flex items-center justify-center shadow-lg">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div className="text-[15px] font-semibold text-[#1D2129]">上传录音</div>
            <div className="text-[12px] text-[#86909C]">点击选择文件上传</div>
          </button>
          <div className="flex items-center gap-1 px-4 py-2 bg-[#F7F8FA] rounded-full text-[12px] text-[#86909C]">
            <Info className="w-3.5 h-3.5 text-[#FA8C16]" />
            <span>支持 MP3、WAV、M4A 格式，时长 3-30 分钟</span>
          </div>
        </div>
      </div>

      {/* 已选文件 */}
      {selectedFile && (
        <div className="m-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#FFF7E6] text-[#FA8C16] flex items-center justify-center flex-shrink-0">
              <Mic className="w-5 h-5" />
            </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-[#1D2129] truncate">{selectedFile.name}</div>
                <div className="text-[12px] text-[#86909C] mt-1">
                  时长: {formatDuration(selectedFile.duration)} · 大小: {formatSize(selectedFile.size)}
                </div>
              </div>
              <button 
                className="text-[#FA5151] p-1"
                onClick={handleRemoveFile}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2">
              <div className={`flex items-center gap-2 text-[13px] ${validationResults.format === true ? 'text-[#00B42A]' : validationResults.format === false ? 'text-[#FA5151]' : 'text-[#86909C]'}`}>
                {validationResults.format === true ? (
                  <Check className="w-4 h-4" />
                ) : validationResults.format === false ? (
                  <X className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#86909C] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#86909C]" />
                  </div>
                )}
                格式校验（MP3、WAV）
              </div>
              <div className={`flex items-center gap-2 text-[13px] ${validationResults.size === true ? 'text-[#00B42A]' : validationResults.size === false ? 'text-[#FA5151]' : 'text-[#86909C]'}`}>
                {validationResults.size === true ? (
                  <Check className="w-4 h-4" />
                ) : validationResults.size === false ? (
                  <X className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#86909C] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#86909C]" />
                  </div>
                )}
                大小校验（≤20MB）
              </div>
              <div className={`flex items-center gap-2 text-[13px] ${validationResults.duration === true ? 'text-[#00B42A]' : validationResults.duration === false ? 'text-[#FA5151]' : 'text-[#86909C]'}`}>
                {validationResults.duration === true ? (
                  <Check className="w-4 h-4" />
                ) : validationResults.duration === false ? (
                  <X className="w-4 h-4" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-[#86909C] flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#86909C]" />
                  </div>
                )}
                时长校验（3-30分钟）
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 上传进度 */}
      {isUploading && (
        <div className="m-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <svg className="w-20 h-20 transform -rotate-90">
                <circle 
                  cx="40" cy="40" r="36" 
                  fill="none" 
                  stroke="#E5E6EB" 
                  strokeWidth="6"
                />
                <circle 
                  cx="40" cy="40" r="36" 
                  fill="none" 
                  stroke="#FA8C16" 
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray={226}
                  strokeDashoffset={226 * (1 - uploadProgress / 100)}
                  transition="stroke-dashoffset 0.3s"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] font-bold text-[#FA8C16]">
                {Math.round(uploadProgress)}%
              </div>
            </div>
            <div className="text-[14px] font-semibold text-[#1D2129] mb-1">上传中...</div>
            <div className="text-[12px] text-[#86909C]">请勿关闭页面</div>
          </div>
        </div>
      )}

      {/* 关联信息 */}
      <div className="m-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="text-[14px] font-semibold text-[#1D2129] mb-4 flex items-center gap-1">
            关联信息 <span className="text-[12px] font-normal text-[#86909C]">（可选）</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[13px] text-[#4E5969] mb-2">关联楼盘</label>
              <div 
                className={`flex items-center justify-between p-3 border border-[#E5E6EB] rounded-lg cursor-pointer transition-colors ${building ? 'border-[#FA8C16] bg-[#FFF7E6]' : 'hover:border-[#FA8C16]'}`}
                onClick={goToBuildingSelect}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${building ? 'bg-[#FA8C16] text-white' : 'bg-[#F7F8FA] text-[#86909C]'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 14h18v7a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/>
                      <path d="m8 14 3-3 3 3"/>
                      <path d="m2 2 7 3v16"/>
                      <path d="m22 2-7 3v16"/>
                    </svg>
                  </div>
                  <div>
                    {building ? (
                      <div className="text-[14px] font-medium text-[#1D2129]">{building.name}</div>
                    ) : (
                      <div className="text-[14px] text-[#86909C]">点击选择楼盘</div>
                    )}
                  </div>
                </div>
                {building ? (
                  <button 
                    className="w-5 h-5 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#86909C]"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearBuilding();
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#86909C]" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-[13px] text-[#4E5969] mb-2">关联客户</label>
              <div 
                className={`flex items-center justify-between p-3 border border-[#E5E6EB] rounded-lg cursor-pointer transition-colors ${customer ? 'border-[#FA8C16] bg-[#FFF7E6]' : 'hover:border-[#FA8C16]'}`}
                onClick={goToCustomerSelect}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${customer ? 'bg-[#FA8C16] text-white' : 'bg-[#F7F8FA] text-[#86909C]'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div>
                    {customer ? (
                      <div className="text-[14px] font-medium text-[#1D2129]">{customer.name}</div>
                    ) : (
                      <div className="text-[14px] text-[#86909C]">点击选择客户（可选）</div>
                    )}
                  </div>
                </div>
                {customer ? (
                  <button 
                    className="w-5 h-5 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#86909C]"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearCustomer();
                    }}
                  >
                    <X className="w-3 h-3" />
                  </button>
                ) : (
                  <ChevronRight className="w-4 h-4 text-[#86909C]" />
                )}
              </div>
            </div>
            <div>
              <label className="block text-[13px] text-[#4E5969] mb-2">备注</label>
              <textarea 
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="可填写本次通话的简要说明..."
                className="w-full min-h-20 p-3 border border-[#E5E6EB] rounded-lg text-[14px] text-[#1D2129] resize-none focus:outline-none focus:border-[#FA8C16]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 提交按钮 */}
      <div className="p-4 fixed bottom-0 left-0 right-0 bg-[#F7F8FA]">
        <button 
          onClick={handleSubmit}
          disabled={!selectedFile || isUploading}
          className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all ${selectedFile && !isUploading ? 'bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white shadow-lg active:opacity-90' : 'bg-[#E5E6EB] text-[#86909C] cursor-not-allowed'}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[15px] font-semibold">提交中...</span>
            </>
          ) : (
            <span className="text-[15px] font-semibold">开始客情分析</span>
          )}
        </button>
      </div>

      {/* 隐私协议弹窗 */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowPrivacyModal(false)}>
          <div className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-[#E5E6EB] flex items-center justify-between">
              <div className="text-[16px] font-semibold text-[#1D2129]">录音隐私保护说明</div>
              <button 
                className="w-7 h-7 rounded-full bg-[#F7F8FA] flex items-center justify-center text-[#4E5969]"
                onClick={() => setShowPrivacyModal(false)}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-[15px] font-semibold text-[#1D2129] mb-2">一、信息的收集与使用</h3>
                <p className="text-[14px] text-[#4E5969] mb-2">您的录音仅用于<strong>个人能力评估与分析</strong>，帮助您提升专业能力。</p>
                <p className="text-[14px] text-[#4E5969] mb-2">您的录音<strong>绝对不会</strong>用于：</p>
                <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#4E5969]">
                  <li>对外公开或商业展示</li>
                  <li>作为对您的评价依据（除非您主动授权）</li>
                  <li>提供给第三方机构</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1D2129] mb-2">二、数据存储与安全</h3>
                <p className="text-[14px] text-[#4E5969] mb-2">您的录音数据采用<strong>加密存储</strong>，仅您本人及授权管理员可访问。</p>
                <p className="text-[14px] text-[#4E5969]">录音数据将在分析完成后<strong>30天内</strong>自动删除。</p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1D2129] mb-2">三、您的权利</h3>
                <ul className="list-disc pl-5 space-y-1 text-[14px] text-[#4E5969]">
                  <li><strong>知情权</strong>：了解录音的使用目的和存储方式</li>
                  <li><strong>查看权</strong>：查看您的历史录音和分析报告</li>
                  <li><strong>删除权</strong>：随时申请删除您的录音数据</li>
                </ul>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1D2129] mb-2">四、免责条款</h3>
                <p className="text-[14px] text-[#4E5969]">您保证上传的录音为您本人或经他人授权录制，且录音内容不侵犯他人隐私或合法权益。</p>
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-[#1D2129] mb-2">五、联系我们</h3>
                <p className="text-[14px] text-[#4E5969]">如您有任何疑问，请联系客服：400-XXX-XXXX</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
