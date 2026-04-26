/**
 * @module customer/pages/CustomerList
 * @description 客户列表页面
 * 
 * 本文件实现客户列表的展示和交互功能，包括：
 * - 客户列表展示
 * - 搜索功能
 * - 筛选功能
 * - 点击跳转客户详情
 * 
 * 使用自定义 Hooks 封装业务逻辑
 */

import { useState } from 'react';
import { Search, Plus, ChevronRight, User, Sliders } from 'lucide-react';
import { useNavigate } from 'react-router';
import TabBar from '../../../components/TabBar';
import { useCustomerList, useCustomerNavigation } from '../hooks/useCustomers';

export default function CustomerList() {
  const navigate = useNavigate();
  const { customers } = useCustomerList();
  const { goToDetail, goToAdd } = useCustomerNavigation();
  
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('');

  // 筛选选项
  const filters = [
    { label: '全部', value: '' },
    { label: '高意向', value: 'high' },
    { label: '中意向', value: 'medium' },
    { label: '低意向', value: 'low' }
  ];

  // 搜索处理
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 过滤客户列表
  const filteredCustomers = customers.filter(customer => {
    const matchSearch = !searchText || 
      customer.name.includes(searchText) || 
      customer.phone.includes(searchText);
    const matchFilter = !activeFilter || true; // 实际项目中根据意向筛选
    return matchSearch && matchFilter;
  });

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F5]">
      {/* 顶部导航栏 */}
      <header className="bg-white border-b border-[#E5E6EB] px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-[17px] font-semibold text-[#1D2129]">客户管理</h1>
          <button
            onClick={goToAdd}
            className="p-2 bg-[#165DFF] text-white rounded-lg hover:bg-[#0E4FD1] transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86909C]" />
          <input
            type="text"
            placeholder="搜索客户姓名或手机号"
            value={searchText}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8FA] border border-[#E5E6EB] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#165DFF]/20 focus:border-[#165DFF]"
          />
        </div>

        {/* 筛选标签 */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto">
          <Sliders className="w-4 h-4 text-[#86909C] flex-shrink-0" />
          {filters.map(filter => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-3 py-1.5 rounded-full text-[13px] whitespace-nowrap transition-colors ${
                activeFilter === filter.value
                  ? 'bg-[#165DFF] text-white'
                  : 'bg-[#F7F8FA] text-[#4E5969] hover:bg-[#E5E6EB]'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </header>

      {/* 客户列表 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredCustomers.map(customer => (
            <div
              key={customer.id}
              onClick={() => goToDetail(customer.id)}
              className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#165DFF] to-[#722ED1] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-semibold text-[#1D2129] mb-1">
                      {customer.name}
                    </h3>
                    <p className="text-[13px] text-[#86909C]">{customer.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[13px] text-[#86909C]">
                      {customer.recordCount}条记录
                    </p>
                    <p className="text-[12px] text-[#86909C]">
                      创建于 {customer.createTime}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#86909C]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 空状态 */}
        {filteredCustomers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <User className="w-16 h-16 text-[#E5E6EB] mb-4" />
            <p className="text-[14px] text-[#86909C]">暂无客户数据</p>
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}
