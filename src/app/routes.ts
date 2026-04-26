import { createBrowserRouter } from 'react-router';
import TaskList from './pages/TaskList';
import TaskDetail from './pages/TaskDetail';
import TaskExecute from './pages/TaskExecute';
import RoadmapTask from './pages/RoadmapTask';
import SpeechTask from './pages/SpeechTask';
import AudioTask from './pages/AudioTask';
import CreateTask from './pages/CreateTask';
import Profile from './pages/Profile';
import MyTasks from './pages/MyTasks';
import PointDataCollection from './pages/PointDataCollection';
import ContentGeneration from './pages/ContentGeneration';
import MediaGeneration from './pages/MediaGeneration';
import ServiceTools from './pages/ServiceTools';
import RecordingList from './pages/RecordingList';
import RecordingUpload from './pages/RecordingUpload';
import RecordingResult from './pages/RecordingResult';
import CustomerList from './pages/CustomerList';
import CustomerDetail from './pages/CustomerDetail';
import CustomerAdd from './pages/CustomerAdd';
import CustomerEdit from './pages/CustomerEdit';
import CustomerRecordList from './pages/CustomerRecordList';
import BuildingSelect from './pages/BuildingSelect';
import CustomerSelect from './pages/CustomerSelect';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: TaskList,
  },
  {
    path: '/tools',
    Component: ServiceTools,
  },
  {
    path: '/profile',
    Component: Profile,
  },
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
  {
    path: '/recording/building-select',
    Component: BuildingSelect,
  },
  {
    path: '/recording/customer-select',
    Component: CustomerSelect,
  },
]);
