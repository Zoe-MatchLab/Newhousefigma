import { useState, useEffect } from 'react';
import { ChevronLeft, Search, Check, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';

export default function CustomerSelect() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchText, setSearchText] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 客户数据
  const customerData = [
    { id: 'C001', name: '张先生', phone: '138****8821', building: '中海汇德里', recordCount: 5, createTime: '2026-04-10' },
    { id: 'C002', name: '李女士', phone: '139****7734', building: '万科翡翠公园', recordCount: 3, createTime: '2026-04-12' },
    { id: 'C003', name: '王先生', phone: '137****6655', building: '龙湖天街', recordCount: 1, createTime: '2026-04-14' },
    { id: 'C004', name: '赵女士', phone: '136****4444', building: '华润城', recordCount: 8, createTime: '2026-04-08' },
    { id: 'C005', name: '刘先生', phone: '135****3333', building: '保利花园', recordCount: 2, createTime: '2026-04-15' }
  ];

  const filteredCustomers = searchText
    ? customerData.filter(c =>
        c.name.includes(searchText) ||
        c.phone.includes(searchText) ||
        c.building.includes(searchText)
      )
    : customerData;

  const handleSelect = (id: string) => {
    setSelectedId(id);
  };

  const handleConfirm = () => {
    if (!selectedId) return;
    const selectedCustomer = customerData.find(c => c.id === selectedId);
    if (selectedCustomer) {
      // 返回到上传页面并传递选中的客户信息
      navigate('/recording/upload', {
        state: { selectedCustomer }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* 顶部导航 */}
      <header className="bg-[#FA8C16] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={() => navigate('/recording/upload')} className="flex items-center gap-1">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[15px]">返回</span>
        </button>
        <span className="text-[17px] font-semibold">选择客户</span>
        <div className="w-15"></div>
      </header>

      {/* 搜索框 */}
      <div className="bg-white px-4 py-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#86909C]" />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索姓名/电话..."
            className="w-full h-9 bg-[#F7F8FA] rounded-full px-12 py-2 text-[14px] border-none outline-none"
          />
        </div>
      </div>

      {/* 列表提示 */}
      <div className="text-center py-2 text-[12px] text-[#86909C] bg-[#F7F8FA]">
        共 <span className="text-[#1D2129]">{filteredCustomers.length}</span> 位客户
      </div>

      {/* 客户列表 */}
      <div className="px-4 py-2">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[48px] text-[#E5E6EB] mb-4">
              <User />
            </div>
            <div className="text-[14px] text-[#86909C]">未找到相关客户</div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCustomers.map((customer, index) => (
              <div
                key={customer.id}
                onClick={() => handleSelect(customer.id)}
                className={`bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md ${selectedId === customer.id ? 'bg-[#FFF7E6] border-2 border-[#FA8C16]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5.5 h-5.5 rounded-full border-2 flex items-center justify-center ${selectedId === customer.id ? 'bg-[#FA8C16] border-[#FA8C16]' : 'border-[#E5E6EB]'}`}>
                    {selectedId === customer.id && (
                      <Check className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div>
                        <div className="text-[15px] font-semibold text-[#1D2129]">{customer.name}</div>
                        <div className="text-[13px] text-[#86909C] mt-1">{customer.phone}</div>
                      </div>
                      <span className="px-2.5 py-0.5 bg-[#FFF7E6] text-[#FA8C16] text-[12px] font-medium rounded-full">
                        {customer.recordCount}条录音
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[12px] text-[#86909C]">
                      <span>{customer.building}</span>
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