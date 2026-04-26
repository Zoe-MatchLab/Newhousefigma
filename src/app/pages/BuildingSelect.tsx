import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export default function BuildingSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 楼盘数据
  const buildingData = [
    { id: 'B001', name: '中海汇德里', area: '浦东新区', decoration: '精装交付' },
    { id: 'B002', name: '万科翡翠公园', area: '浦西', decoration: '毛坯交付' },
    { id: 'B003', name: '龙湖天街', area: '徐汇区', decoration: '部分装修' },
    { id: 'B004', name: '华润城', area: '南山区', decoration: '精装交付' },
    { id: 'B005', name: '保利花园', area: '福田区', decoration: '毛坯交付' }
  ];

  const filteredBuildings = searchText
    ? buildingData.filter(b => b.name.includes(searchText))
    : buildingData;

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    const selectedBuilding = buildingData.find(b => b.id === selectedId);
    if (selectedBuilding) {
      // 返回到上传页面并传递选中的楼盘信息
      navigate('/recording/upload', {
        state: { selectedBuilding }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => navigate('/recording/upload')} className="flex items-center gap-1 text-[#FA8C16]">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[15px]">返回</span>
        </button>
        <span className="text-[17px] font-semibold text-[#1D2129]">选择楼盘</span>
        <div className="w-15"></div>
      </header>

      {/* 搜索框 */}
      <div className="bg-white px-4 py-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#86909C]" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索楼盘名称"
            className="w-full h-9 bg-[#F7F8FA] rounded-full px-12 py-2 text-[14px] border-none outline-none"
          />
        </div>
      </div>

      {/* 楼盘列表 */}
      <div className="px-4 py-2">
        {filteredBuildings.length === 0 ? (
          <div className="text-center py-12 text-[#86909C]">
            未找到相关楼盘
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBuildings.map((building, index) => (
              <div
                key={building.id}
                onClick={() => handleSelect(building.id)}
                className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${selectedId === building.id ? 'bg-[#FFF7E6] border-2 border-[#FA8C16]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center ${selectedId === building.id ? 'bg-[#FA8C16] border-[#FA8C16]' : 'border-[#E5E6EB]'}`}>
                    {selectedId === building.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="text-[15px] font-semibold text-[#1D2129]">{building.name}</div>
                    <div className="text-[12px] text-[#86909C] mt-1">
                      {building.area} · {building.decoration}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 底部确认按钮 */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-[#E5E6EB]">
        <button
          onClick={handleConfirm}
          disabled={!selectedId}
          className={`w-full h-12 rounded-xl flex items-center justify-center gap-2 transition-all ${selectedId ? 'bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white shadow-lg active:opacity-90' : 'bg-[#E5E6EB] text-[#86909C] cursor-not-allowed'}`}
        >
          确定
        </button>
      </div>
    </div>
  );
}