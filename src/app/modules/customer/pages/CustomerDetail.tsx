import { useState } from 'react';
import { ChevronLeft, Edit, ChevronDown, Share2, Home, Edit2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import TabBar from '../components/TabBar';

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [openBlock, setOpenBlock] = useState('blockBuilding');

  // 模拟客户数据
  const customerData = {
    id: id || 'CUST_001',
    name: '张先生',
    phone: '138****8888',
    source: '自然到访',
    buildings: ['中海汇德里', '万科城市花园'],
    recordCount: 5,
    createTime: '2026-04-10',
    remark: '对中海汇德里感兴趣，预算800万左右。客户比较谨慎，需要多次跟进。'
  };

  const goBack = () => {
    navigate('/customer/list');
  };

  const editCustomer = () => {
    navigate(`/customer/edit/${customerData.id}`);
  };

  const viewRecordings = () => {
    navigate(`/customer/record-list?customerId=${customerData.id}&name=${encodeURIComponent(customerData.name)}`);
  };

  const toggleBlock = (blockId: string) => {
    setOpenBlock(openBlock === blockId ? '' : blockId);
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <button onClick={goBack} className="flex items-center gap-1 text-[#FA8C16]">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-[15px]">返回</span>
        </button>
        <span className="text-[17px] font-semibold text-[#1D2129]">客户详情</span>
        <button onClick={editCustomer} className="text-[#FA8C16]">
          <Edit className="w-5 h-5" />
        </button>
      </header>

      {/* 客户头部卡片 */}
      <div className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6">
          <div>
            <div className="text-[20px] font-semibold text-[#1D2129] mb-1">{customerData.name}</div>
            <div className="text-[15px] text-[#FA8C16] font-medium">{customerData.phone}</div>
            <div className="flex gap-8 mt-4 pt-4 border-t border-[#E5E6EB]">
              <div>
                <div className="text-[18px] font-semibold text-[#FA8C16]">{customerData.recordCount}</div>
                <div className="text-[12px] text-[#86909C] mt-1">关联录音</div>
              </div>
              <div>
                <div className="text-[18px] font-semibold text-[#1D2129]">{customerData.createTime}</div>
                <div className="text-[12px] text-[#86909C] mt-1">创建时间</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 信息折叠区 */}
      <div className="bg-white mx-4 mt-4 rounded-xl overflow-hidden shadow-sm">
        {/* 来源 */}
        <div className="border-b border-[#E5E6EB]">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#E8F4FF] text-[#1677FF] rounded-md flex items-center justify-center">
                <Share2 className="w-4 h-4" />
              </div>
              <span className="text-[14px] font-medium text-[#4E5969]">来源</span>
            </div>
            <span className="text-[14px] text-[#86909C]">{customerData.source}</span>
          </div>
        </div>

        {/* 意向楼盘 */}
        <div className={`border-b border-[#E5E6EB] ${openBlock === 'blockBuilding' ? 'open' : ''}`}>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleBlock('blockBuilding')}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#FFF7E6] text-[#FA8C16] rounded-md flex items-center justify-center">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-[14px] font-medium text-[#4E5969]">意向楼盘</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[14px] text-[#86909C]">{customerData.buildings.length}个楼盘</span>
              <ChevronDown className={`w-4 h-4 text-[#86909C] transition-transform ${openBlock === 'blockBuilding' ? 'rotate-180' : ''}`} />
            </div>
          </div>
          {openBlock === 'blockBuilding' && (
            <div className="p-4 pl-14">
              <div className="flex flex-wrap gap-2">
                {customerData.buildings.map((building, index) => (
                  <span key={index} className="px-3 py-1.5 bg-[#FFF7E6] border border-[#FFD580] rounded-full text-[13px] text-[#FA8C16] flex items-center gap-1">
                    <Home className="w-3 h-3" />
                    {building}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 备注 */}
        <div className={`${openBlock === 'blockRemark' ? 'open' : ''}`}>
          <div 
            className="flex items-center justify-between p-4 cursor-pointer"
            onClick={() => toggleBlock('blockRemark')}
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 bg-[#F0FDF4] text-[#00B42A] rounded-md flex items-center justify-center">
                <Edit2 className="w-4 h-4" />
              </div>
              <span className="text-[14px] font-medium text-[#4E5969]">备注</span>
            </div>
            <div className="flex items-center gap-2">
              <ChevronDown className={`w-4 h-4 text-[#86909C] transition-transform ${openBlock === 'blockRemark' ? 'rotate-180' : ''}`} />
            </div>
          </div>
          {openBlock === 'blockRemark' && (
            <div className="p-4 pl-14">
              <div className="text-[14px] text-[#86909C]">
                {customerData.remark || '暂无备注'}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部占位 */}
      <div className="h-4"></div>

      <TabBar />
    </div>
  );
}