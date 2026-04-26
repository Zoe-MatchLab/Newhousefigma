import { useState } from 'react';
import { ChevronLeft, Plus, CheckCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../components/TabBar';

export default function CustomerAdd() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState('');
  const [remark, setRemark] = useState('');
  const [selectedBuildings, setSelectedBuildings] = useState<{ id: number; name: string }[]>([]);
  const [showBuildingPicker, setShowBuildingPicker] = useState(false);

  // 楼盘数据
  const buildingsData = [
    { id: 1, name: '万科城市花园' },
    { id: 2, name: '中海汇德里' },
    { id: 3, name: '保利中央公园' },
    { id: 4, name: '龙湖天璞' },
    { id: 5, name: '华润置地' },
    { id: 6, name: '金地集团' }
  ];

  const goBack = () => {
    navigate('/customer/list');
  };

  const validateForm = () => {
    if (!name.trim()) {
      alert('请输入客户姓名');
      return false;
    }
    return true;
  };

  const saveCustomer = () => {
    if (!validateForm()) {
      return;
    }

    const customerData = {
      id: 'CUST_' + Date.now(),
      name: name.trim(),
      phone: phone.trim(),
      buildings: selectedBuildings.map(b => b.name),
      source: source.trim(),
      remark: remark.trim(),
      createTime: new Date().toLocaleDateString()
    };

    console.log('保存客户信息:', customerData);

    alert('保存成功');
    navigate('/customer/list');
  };

  const toggleBuilding = (id: number) => {
    const building = buildingsData.find(b => b.id === id);
    if (!building) return;

    setSelectedBuildings(prev => {
      const index = prev.findIndex(b => b.id === id);
      if (index > -1) {
        return prev.filter(b => b.id !== id);
      } else {
        return [...prev, building];
      }
    });
  };

  const removeBuilding = (id: number) => {
    setSelectedBuildings(prev => prev.filter(b => b.id !== id));
  };

  const confirmBuildingSelection = () => {
    setShowBuildingPicker(false);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={goBack} className="flex items-center gap-1 text-[#FA8C16]">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[15px]">返回</span>
        </button>
        <span className="text-[17px] font-semibold text-[#1D2129]">新增客户</span>
        <div className="w-15"></div>
      </header>

      {/* 说明 */}
      <div className="px-4 py-4 bg-[#F7F8FA] flex items-start gap-2">
        <div className="text-[#86909C] mt-0.5">
          <i className="text-[14px]">ℹ️</i>
        </div>
        <span className="text-[13px] text-[#86909C]">填写客户信息，用于关联录音分析</span>
      </div>

      {/* 表单卡片 */}
      <div className="bg-white mx-4 rounded-xl overflow-hidden">
        {/* 客户姓名 */}
        <div className="border-b border-[#E5E6EB]">
          <div className="flex items-center p-4">
            <div className="w-17 text-[15px] text-[#1D2129] font-medium">
              姓名 <span className="text-[#FA5151]">*</span>
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入客户姓名"
                maxLength={20}
                className="w-full text-[15px] text-[#1D2129] border-none outline-none"
              />
            </div>
          </div>
        </div>

        {/* 手机号 */}
        <div className="border-b border-[#E5E6EB]">
          <div className="flex items-center p-4">
            <div className="w-17 text-[15px] text-[#1D2129] font-medium">
              手机号
            </div>
            <div className="flex-1">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="选填"
                maxLength={11}
                className="w-full text-[15px] text-[#1D2129] border-none outline-none"
              />
            </div>
          </div>
        </div>

        {/* 意向楼盘 */}
        <div className="border-b border-[#E5E6EB]">
          <div className="flex items-start p-4">
            <div className="w-17 text-[15px] text-[#1D2129] font-medium pt-1">
              意向楼盘
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mt-1">
                {selectedBuildings.map((building) => (
                  <span key={building.id} className="px-2.5 py-1 bg-[#FFF7E6] text-[#FA8C16] rounded-full text-[13px] flex items-center gap-1">
                    {building.name}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeBuilding(building.id);
                      }}
                      className="text-[#FA8C16] opacity-60 hover:opacity-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={() => setShowBuildingPicker(true)}
                  className="px-2.5 py-1 bg-[#F7F8FA] text-[#4E5969] rounded-full text-[13px] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  添加楼盘
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 客户来源 */}
        <div className="border-b border-[#E5E6EB]">
          <div className="flex items-center p-4">
            <div className="w-17 text-[15px] text-[#1D2129] font-medium">
              来源
            </div>
            <div className="flex-1">
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="请输入客户来源，如：线上获客、转介绍等"
                maxLength={50}
                className="w-full text-[15px] text-[#1D2129] border-none outline-none"
              />
            </div>
          </div>
        </div>

        {/* 备注 */}
        <div>
          <div className="flex items-start p-4">
            <div className="w-17 text-[15px] text-[#1D2129] font-medium pt-1">
              备注
            </div>
            <div className="flex-1">
              <textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="选填，可记录客户偏好、需求等信息"
                rows={3}
                maxLength={200}
                className="w-full text-[15px] text-[#1D2129] border-none outline-none resize-none min-h-[60px]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 底部保存按钮 */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-[#E5E6EB]">
        <button
          onClick={saveCustomer}
          className="w-full h-11 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-full font-semibold active:opacity-90 transition-opacity"
        >
          保存
        </button>
      </div>

      {/* 楼盘选择弹窗 */}
      {showBuildingPicker && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBuildingPicker(false)} />
          <div className="bg-white rounded-t-2xl w-full max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-[#E5E6EB]">
              <button onClick={() => setShowBuildingPicker(false)} className="text-[14px] text-[#4E5969]">
                取消
              </button>
              <span className="text-[16px] font-semibold text-[#1D2129]">选择意向楼盘</span>
              <button onClick={confirmBuildingSelection} className="text-[14px] text-[#FA8C16] font-medium">
                确定
              </button>
            </div>
            <div className="p-4">
              {buildingsData.length === 0 ? (
                <div className="text-center py-10 text-[#86909C]">暂无可选楼盘</div>
              ) : (
                buildingsData.map((building) => {
                  const isSelected = selectedBuildings.some(b => b.id === building.id);
                  return (
                    <div
                      key={building.id}
                      onClick={() => toggleBuilding(building.id)}
                      className="flex items-center justify-between py-3 border-b border-[#E5E6EB]"
                    >
                      <span className="text-[15px] text-[#1D2129]">{building.name}</span>
                      <CheckCircle className={`w-5 h-5 ${isSelected ? 'text-[#FA8C16]' : 'text-transparent'}`} />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      <TabBar />
    </div>
  );
}