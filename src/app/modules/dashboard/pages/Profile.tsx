/**
 * @module dashboard/pages/Profile
 * @description 个人中心页面（仪表盘模块）
 * 
 * 本文件实现个人中心页面的展示和交互功能，包括：
 * - 用户信息展示
 * - 数据统计
 * - 功能菜单
 * 
 * 使用自定义 Hooks 封装业务逻辑
 */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Users,
  CalendarCheck,
  Zap,
  UserPlus,
  FileText,
  Star,
  MapPin,
  CreditCard,
  Settings,
  ChevronRight,
  Diamond,
  ClipboardList,
  AlertTriangle,
  CheckSquare
} from 'lucide-react';
import TabBar from '../../components/TabBar';

export default function Profile() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');

  // 菜单项配置
  const menuItems1 = [
    { icon: CheckSquare, title: '任务管理', path: '/my-tasks', badge: null },
    { icon: Users, title: '客户管理', path: '/customer/list', badge: null },
    { icon: CalendarCheck, title: '活动中心', path: null, badge: '签到有礼' },
    { icon: Zap, title: '算力', path: null, badge: null },
    { icon: UserPlus, title: '邀请', path: null, badge: null },
    { icon: FileText, title: '训练记录', path: null, badge: null }
  ];

  const menuItems2 = [
    { icon: Star, title: '收藏', path: null },
    { icon: MapPin, title: '足迹', path: null },
    { icon: CreditCard, title: '付费记录', path: null },
    { icon: Settings, title: '设置', path: null }
  ];

  // 处理菜单点击
  const handleMenuClick = (path: string | null) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* 顶部渐变区域 */}
      <div className="bg-gradient-to-b from-[#F7D9A7] to-[#F5F5F5] px-4 pt-3 pb-4">
        {/* 用户信息 */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-[#FA8C16] to-[#D46B08] rounded-full flex items-center justify-center">
            <span className="text-2xl text-white font-semibold">李</span>
          </div>
          <div className="flex-1">
            <h2 className="text-[18px] font-semibold text-[#1D2129]">李明</h2>
            <p className="text-[13px] text-[#86909C]">ID: 88888888</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 bg-[#FFF7E6] text-[#FA8C16] text-[11px] rounded-full">
                高级会员
              </span>
              <span className="text-[12px] text-[#86909C]">有效期至 2026-12-31</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#86909C]" />
        </div>

        {/* 数据统计 */}
        <div className="grid grid-cols-3 gap-3 bg-white rounded-xl p-3 shadow-sm">
          <div className="text-center">
            <p className="text-[20px] font-bold text-[#165DFF]">12</p>
            <p className="text-[12px] text-[#86909C] mt-1">进行中任务</p>
          </div>
          <div className="text-center border-x border-[#E5E6EB]">
            <p className="text-[20px] font-bold text-[#00B42A]">48</p>
            <p className="text-[12px] text-[#86909C] mt-1">已完成任务</p>
          </div>
          <div className="text-center">
            <p className="text-[20px] font-bold text-[#FA8C16]">156</p>
            <p className="text-[12px] text-[#86909C] mt-1">服务客户数</p>
          </div>
        </div>
      </div>

      {/* 时间筛选 */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-sm">
          {[
            { label: '今日', value: 'today' },
            { label: '本周', value: 'week' },
            { label: '本月', value: 'month' }
          ].map(item => (
            <button
              key={item.value}
              onClick={() => setTimeFilter(item.value as typeof timeFilter)}
              className={`flex-1 py-2 text-[13px] rounded-md transition-colors ${
                timeFilter === item.value
                  ? 'bg-[#165DFF] text-white'
                  : 'text-[#4E5969] hover:bg-[#F7F8FA]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 功能菜单区域 1 */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-3 divide-x divide-[#E5E6EB]">
            {menuItems1.slice(0, 3).map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.path)}
                className="relative p-4 flex flex-col items-center hover:bg-[#F7F8FA] transition-colors"
              >
                <item.icon className="w-6 h-6 text-[#165DFF] mb-2" />
                <span className="text-[13px] text-[#1D2129]">{item.title}</span>
                {item.badge && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#FA5151] text-white text-[10px] rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 divide-x divide-[#E5E6EB] border-t border-[#E5E6EB]">
            {menuItems1.slice(3).map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.path)}
                className="relative p-4 flex flex-col items-center hover:bg-[#F7F8FA] transition-colors"
              >
                <item.icon className="w-6 h-6 text-[#165DFF] mb-2" />
                <span className="text-[13px] text-[#1D2129]">{item.title}</span>
                {item.badge && (
                  <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-[#FA5151] text-white text-[10px] rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 功能菜单区域 2 */}
      <div className="px-4 mb-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {menuItems2.map((item, index) => (
            <button
              key={index}
              onClick={() => handleMenuClick(item.path)}
              className="w-full flex items-center justify-between p-4 hover:bg-[#F7F8FA] transition-colors border-b border-[#E5E6EB] last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-[#165DFF]" />
                <span className="text-[14px] text-[#1D2129]">{item.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#86909C]" />
            </button>
          ))}
        </div>
      </div>

      {/* 其他信息 */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[14px] font-semibold text-[#1D2129]">我的权益</h3>
            <ChevronRight className="w-5 h-5 text-[#86909C]" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Diamond className="w-4 h-4 text-[#FA8C16]" />
                <span className="text-[13px] text-[#4E5969]">算力点数</span>
              </div>
              <span className="text-[14px] font-semibold text-[#1D2129]">2,580</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#165DFF]" />
                <span className="text-[13px] text-[#4E5969]">可用次数</span>
              </div>
              <span className="text-[14px] font-semibold text-[#1D2129]">18 次</span>
            </div>
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}
