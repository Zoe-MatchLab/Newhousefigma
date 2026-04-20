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
import TabBar from '../components/TabBar';

export default function Profile() {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');

  const menuItems1 = [
    { icon: CheckSquare, title: '任务管理', path: '/my-tasks', badge: null },
    { icon: Users, title: '客户管理', path: '/customers', badge: null },
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

  const handleMenuClick = (path: string | null) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pb-24">
      {/* 顶部渐变区域 */}
      <div className="bg-gradient-to-b from-[#F7D9A7] to-[#F5F5F5] px-4 pt-3 pb-4">
        {/* 导航栏 */}
        <div className="flex items-center justify-between mb-3">
          <button className="w-8 h-8" />
          <h1 className="text-[17px] font-semibold text-[#1D2129]">我的</h1>
          <button className="w-8 h-8 flex items-center justify-center">
            <div className="w-1 h-1 bg-[#1D2129] rounded-full" />
            <div className="w-1 h-1 bg-[#1D2129] rounded-full mx-1" />
            <div className="w-1 h-1 bg-[#1D2129] rounded-full" />
          </button>
        </div>

        {/* 用户信息 */}
        <div className="flex items-center px-1">
          <div className="w-15 h-15 rounded-full bg-[#E5E6EB] border-2 border-white shadow-md overflow-hidden">
            <svg viewBox="0 0 60 60" className="w-full h-full">
              <circle cx="30" cy="30" r="30" fill="#E5E6EB" />
              <circle cx="30" cy="22" r="10" fill="#C9CDD4" />
              <ellipse cx="30" cy="50" rx="18" ry="14" fill="#C9CDD4" />
            </svg>
          </div>
          <div className="flex-1 ml-3">
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-semibold text-[#1D2129]">陈佳佳</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white text-[11px] rounded-full">
                经纪人
              </span>
            </div>
          </div>
          <button className="px-3 py-1.5 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white text-[12px] font-medium rounded-full">
            会员兑换
          </button>
        </div>
      </div>

      {/* 会员卡 */}
      <div className="mx-4 mb-4 bg-gradient-to-br from-[#1D2129] to-[#2D3748] rounded-xl p-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-white text-[16px] font-semibold mb-1">
            <Diamond className="w-4 h-4 text-[#FFD700]" />
            <span>白银会员</span>
          </div>
          <div className="text-[12px] text-[#86909C]">15天后到期</div>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-[#FA8C16] to-[#FF9500] text-white text-[12px] font-medium rounded-full flex items-center gap-1">
          立即续费
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* 作业概览 */}
      <div className="mx-4 mb-4 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-[#FA8C16]" />
            <span className="text-[15px] font-semibold text-[#1D2129]">作业概览</span>
          </div>
          <div className="flex gap-1">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setTimeFilter(period)}
                className={`px-2.5 py-1 text-[12px] rounded-xl transition-colors ${
                  timeFilter === period
                    ? 'bg-[#FA8C16] text-white'
                    : 'bg-[#F7F8FA] text-[#86909C]'
                }`}
              >
                {period === 'today' ? '今日' : period === 'week' ? '本周' : '本月'}
              </button>
            ))}
          </div>
        </div>

        {/* 任务指标 */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 text-center p-3 bg-[#F7F8FA] rounded-lg">
            <div className="text-[24px] font-bold text-[#1D2129] leading-none">5</div>
            <div className="text-[12px] text-[#86909C] mt-1">总任务</div>
          </div>
          <div className="flex-1 text-center p-3 bg-[#F7F8FA] rounded-lg">
            <div className="text-[24px] font-bold text-[#FA8C16] leading-none">3/5</div>
            <div className="text-[12px] text-[#86909C] mt-1">已完成</div>
          </div>
          <div className="flex-1 text-center p-3 bg-[#F7F8FA] rounded-lg">
            <div className="text-[24px] font-bold text-[#1D2129] leading-none">60%</div>
            <div className="text-[12px] text-[#86909C] mt-1">完成率</div>
          </div>
        </div>

        {/* 话术评分 */}
        <div className="p-3 bg-gradient-to-br from-[#FFF7E6] to-[#FFF2E6] rounded-lg mb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-[13px] text-[#4E5969]">
              <Star className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
              话术评分
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[18px] font-bold text-[#FA8C16]">85</span>
              <span className="px-1.5 py-0.5 bg-[#00B42A]/10 text-[#00B42A] text-[12px] font-medium rounded">
                ↑+5
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-[#E5E6EB] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#FA8C16] to-[#FF9500] rounded-full" style={{ width: '85%' }} />
          </div>
          <div className="text-[11px] text-[#86909C] mt-1.5">较上周提升</div>
        </div>

        {/* 数据异常 */}
        <div className="flex items-center gap-2 p-2.5 bg-[#FA5151]/8 rounded-lg text-[#FA5151]">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-[13px]">2 条数据异常待处理</span>
        </div>
      </div>

      {/* 第一组菜单 */}
      <div className="mx-4 mb-2.5 bg-white rounded-xl overflow-hidden">
        {menuItems1.map((item, index) => (
          <button
            key={index}
            onClick={() => handleMenuClick(item.path)}
            className="w-full flex items-center px-4 py-3.5 border-b border-[#F2F3F5] last:border-b-0 active:bg-[#F7F8FA] transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFF7E6] to-[#FFF2E6] rounded-lg flex items-center justify-center mr-3">
              <item.icon className="w-4 h-4 text-[#FA8C16]" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[15px] text-[#1D2129] font-medium">{item.title}</div>
            </div>
            {item.badge && <span className="text-[12px] text-[#86909C] mr-2">{item.badge}</span>}
            <ChevronRight className="w-3.5 h-3.5 text-[#C9CDD4]" />
          </button>
        ))}
      </div>

      {/* 第二组菜单 */}
      <div className="mx-4 bg-white rounded-xl overflow-hidden">
        {menuItems2.map((item, index) => (
          <button
            key={index}
            onClick={() => handleMenuClick(item.path)}
            className="w-full flex items-center px-4 py-3.5 border-b border-[#F2F3F5] last:border-b-0 active:bg-[#F7F8FA] transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-[#FFF7E6] to-[#FFF2E6] rounded-lg flex items-center justify-center mr-3">
              <item.icon className="w-4 h-4 text-[#FA8C16]" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[15px] text-[#1D2129] font-medium">{item.title}</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#C9CDD4]" />
          </button>
        ))}
      </div>

      {/* 底部TabBar占位 */}
      <div className="h-20" />

      {/* 底部TabBar */}
      <TabBar />
    </div>
  );
}
