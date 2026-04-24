import { useState } from 'react';
import { Search, Plus, ChevronRight, User, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../components/TabBar';

export default function CustomerList() {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('');
  const [customers, setCustomers] = useState([
    {
      id: 'CUST_001',
      name: '张先生',
      phone: '138****8888',
      recordCount: 5,
      createTime: '2026-04-10'
    },
    {
      id: 'CUST_002',
      name: '李女士',
      phone: '139****6666',
      recordCount: 3,
      createTime: '2026-04-12'
    },
    {
      id: 'CUST_003',
      name: '王先生',
      phone: '137****5555',
      recordCount: 1,
      createTime: '2026-04-14'
    },
    {
      id: 'CUST_004',
      name: '赵女士',
      phone: '136****4444',
      recordCount: 8,
      createTime: '2026-04-08'
    },
    {
      id: 'CUST_005',
      name: '刘先生',
      phone: '135****3333',
      recordCount: 2,
      createTime: '2026-04-15'
    }
  ]);

  const goToDetail = (customerId: string) => {
    navigate(`/customer/detail/${customerId}`);
  };

  const addCustomer = () => {
    navigate('/customer/add');
  };

  const filterByTag = (tag: string) => {
    setActiveFilter(tag);
  };

  const showFilterMenu = () => {
    // 筛选功能开发中
  };

  return (
    <div className="h-screen flex flex-col bg-[#F7F8FA]">
      {/* 顶部导航 */}
      <header className="bg-[#FA8C16] text-white px-4 py-3 flex items-center justify-center sticky top-0 z-20">
        <span className="text-[17px] font-semibold">我的客户</span>
      </header>

      {/* 搜索栏 */}
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

      {/* 筛选标签 */}
      <div className="flex gap-2 px-4 py-2 bg-white overflow-x-auto">
        <button
          onClick={() => filterByTag('')}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-colors ${
            activeFilter === '' ? 'bg-[#FFF7E6] text-[#FA8C16] border border-[#FA8C16]' : 'bg-[#F7F8FA] text-[#4E5969]'
          }`}
        >
          全部
        </button>
        <button
          onClick={() => filterByTag('today')}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-colors ${
            activeFilter === 'today' ? 'bg-[#FFF7E6] text-[#FA8C16] border border-[#FA8C16]' : 'bg-[#F7F8FA] text-[#4E5969]'
          }`}
        >
          今日新增
        </button>
        <button
          onClick={() => filterByTag('week')}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-colors ${
            activeFilter === 'week' ? 'bg-[#FFF7E6] text-[#FA8C16] border border-[#FA8C16]' : 'bg-[#F7F8FA] text-[#4E5969]'
          }`}
        >
          本周新增
        </button>
        <button
          onClick={showFilterMenu}
          className="flex-shrink-0 px-3 py-1.5 rounded-full text-[13px] bg-[#F7F8FA] text-[#86909C] flex items-center gap-1"
        >
          <Sliders className="w-4 h-4" />
          筛选
        </button>
      </div>

      {/* 列表提示 */}
      <div className="text-center py-2 text-[12px] text-[#86909C] bg-[#F7F8FA]">
        共 <span className="text-[#1D2129]">{customers.length}</span> 位客户
      </div>

      {/* 客户列表 */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {customers.length === 0 ? (
          <div className="p-16 text-center">
            <div className="text-[48px] text-[#E5E6EB] mb-4">
              <User />
            </div>
            <div className="text-[15px] font-semibold text-[#1D2129] mb-2">暂无客户信息</div>
            <div className="text-[13px] text-[#86909C] mb-6">点击下方按钮新增客户</div>
          </div>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => goToDetail(customer.id)}
                className="bg-white rounded-xl p-4 shadow-sm cursor-pointer transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[17px] font-semibold text-[#1D2129]">{customer.name}</span>
                      <ChevronRight className="w-4 h-4 text-[#86909C] opacity-0 transition-all" />
                    </div>
                    <div className="text-[13px] text-[#86909C] mt-1">{customer.phone}</div>
                  </div>
                  <span className="px-3 py-1 bg-[#FFF7E6] text-[#FA8C16] text-[12px] font-medium rounded-full">
                    {customer.recordCount}条录音
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#86909C]">创建于 {customer.createTime}</span>
                  <span className="text-[12px] text-[#FA8C16] opacity-0 transition-all">查看详情</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 新增按钮 */}
      <div className="fixed bottom-6 left-0 right-0 px-4">
        <button
          onClick={addCustomer}
          className="w-full h-12 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white rounded-full flex items-center justify-center gap-2 active:opacity-90 transition-opacity shadow-lg"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[16px] font-semibold">新增客户</span>
        </button>
      </div>

      <TabBar />
    </div>
  );
}