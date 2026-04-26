/**
 * @module routes
 * @description 应用路由配置
 * 
 * 本文件定义了整个应用的路由配置，采用模块化方式组织：
 * - 任务模块 (task): 任务列表、任务详情、任务执行等
 * - 客户模块 (customer): 客户列表、客户详情、客户管理等
 * - 录音模块 (recording): 录音列表、录音上传、录音结果等
 * - 仪表盘模块 (dashboard): 服务工具、个人中心等
 * 
 * 路由按业务功能分组，便于维护和扩展
 */

import { createBrowserRouter } from 'react-router';

// 任务模块页面
import TaskList from './modules/task/pages/TaskList';

// 客户模块页面
import CustomerList from './modules/customer/pages/CustomerList';

// 录音模块页面
import RecordingList from './modules/recording/pages/RecordingList';

// 仪表盘模块页面
import ServiceTools from './modules/dashboard/pages/ServiceTools';
import Profile from './modules/dashboard/pages/Profile';

// 临时导入旧页面（待迁移）
import TaskDetail from './pages/TaskDetail';
import TaskExecute from './pages/TaskExecute';
import RoadmapTask from './pages/RoadmapTask';
import SpeechTask from './pages/SpeechTask';
import AudioTask from './pages/AudioTask';
import CreateTask from './pages/CreateTask';
import MyTasks from './pages/MyTasks';
import PointDataCollection from './pages/PointDataCollection';
import ContentGeneration from './pages/ContentGeneration';
import MediaGeneration from './pages/MediaGeneration';
import CustomerDetail from './pages/CustomerDetail';
import CustomerAdd from './pages/CustomerAdd';
import CustomerEdit from './pages/CustomerEdit';
import CustomerRecordList from './pages/CustomerRecordList';
import BuildingSelect from './pages/BuildingSelect';
import CustomerSelect from './pages/CustomerSelect';
import RecordingUpload from './pages/RecordingUpload';
import RecordingResult from './pages/RecordingResult';

export const router = createBrowserRouter([
  // 首页重定向到任务列表
  {
    path: '/',
    Component: TaskList,
  },
  
  // 仪表盘模块路由
  {
    path: '/tools',
    Component: ServiceTools,
  },
  {
    path: '/profile',
    Component: Profile,
  },
  
  // 任务模块路由
  {
    path: '/my-tasks',
    Component: MyTasks,
  },
  {
    path: '/create',
    Component: CreateTask,
  },
  {
    path: '/tasks/:id',
    Component: TaskDetail,
  },
  {
    path: '/tasks/:id/execute',
    Component: TaskExecute,
  },
  {
    path: '/tasks/:id/checkin',
    Component: PointDataCollection,
  },
  {
    path: '/tasks/:id/content-generation',
    Component: ContentGeneration,
  },
  {
    path: '/tasks/:id/media-generation',
    Component: MediaGeneration,
  },
  {
    path: '/tasks/:id/roadmap',
    Component: RoadmapTask,
  },
  {
    path: '/tasks/:id/speech',
    Component: SpeechTask,
  },
  {
    path: '/tasks/:id/audio',
    Component: AudioTask,
  },
  
  // 客户模块路由
  {
    path: '/customer/list',
    Component: CustomerList,
  },
  {
    path: '/customer/detail/:id',
    Component: CustomerDetail,
  },
  {
    path: '/customer/add',
    Component: CustomerAdd,
  },
  {
    path: '/customer/edit/:id',
    Component: CustomerEdit,
  },
  {
    path: '/customer/record-list',
    Component: CustomerRecordList,
  },
  
  // 录音模块路由
  {
    path: '/recording/list',
    Component: RecordingList,
  },
  {
    path: '/recording/upload',
    Component: RecordingUpload,
  },
  {
    path: '/recording/result/:id',
    Component: RecordingResult,
  },
  {
    path: '/recording/building-select',
    Component: BuildingSelect,
  },
  {
    path: '/recording/customer-select',
    Component: CustomerSelect,
  },
]);
