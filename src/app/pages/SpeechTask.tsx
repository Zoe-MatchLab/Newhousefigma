import { ArrowLeft, FileText } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';

export default function SpeechTask() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate('/')}
          className="p-2 -ml-2 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-[#1D2129]" />
        </button>
        <h1 className="text-[17px] font-semibold text-[#1D2129]">话术训练</h1>
        <div className="w-9" />
      </header>

      {/* 任务内容 */}
      <div className="p-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
          <FileText className="w-12 h-12 text-[#165DFF] mx-auto mb-4" />
          <h2 className="text-[17px] font-semibold text-[#1D2129] mb-2">话术训练执行页</h2>
          <p className="text-[14px] text-[#86909C]">任务 ID: {id}</p>
          <p className="text-[13px] text-[#4E5969] mt-4">这里是话术训练任务的执行界面</p>
        </div>
      </div>
    </div>
  );
}
