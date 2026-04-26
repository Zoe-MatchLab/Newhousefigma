# Newhousefigma 项目概述

## 项目结构

### 技术栈
- React + TypeScript
- React Router
- Tailwind CSS
- Lucide Icons

### 目录结构
```
src/
├── app/
│   ├── components/      # 组件目录
│   │   ├── figma/       # Figma相关组件
│   │   └── ui/          # UI组件
│   ├── pages/           # 页面组件
│   │   ├── TaskList.tsx       # 任务列表
│   │   ├── TaskDetail.tsx     # 任务详情
│   │   ├── TaskExecute.tsx    # 任务执行
│   │   ├── RecordingList.tsx  # 录音列表
│   │   ├── RecordingUpload.tsx # 录音上传
│   │   └── ...               # 其他功能页面
│   ├── App.tsx         # 应用入口
│   └── routes.ts       # 路由配置
├── styles/             # 样式文件
└── main.tsx            # 主入口
```

## 核心功能

### 1. 任务管理
- **任务列表**：查看所有任务，支持筛选和排序
- **任务详情**：查看任务详细信息，包括配置和执行状态
- **任务执行**：执行各种类型的任务，如语音任务、音频任务等
- **任务创建**：创建新的任务

### 2. 录音管理
- **录音列表**：查看所有录音记录，包括状态和评分
- **录音上传**：上传新的录音文件，支持格式验证和隐私保护
- **录音分析**：查看录音分析结果和评分

### 3. 其他功能
- **个人中心**：查看个人信息和设置
- **服务工具**：访问各种服务工具
- **数据收集**：收集和管理数据

## 页面跳转逻辑

### 路由配置
```typescript
// src/app/routes.ts
export const router = createBrowserRouter([
  { path: '/', Component: TaskList },
  { path: '/tools', Component: ServiceTools },
  { path: '/profile', Component: Profile },
  { path: '/my-tasks', Component: MyTasks },
  { path: '/create', Component: CreateTask },
  { path: '/tasks/:id', Component: TaskDetail },
  { path: '/tasks/:id/execute', Component: TaskExecute },
  { path: '/tasks/:id/checkin', Component: PointDataCollection },
  { path: '/tasks/:id/content-generation', Component: ContentGeneration },
  { path: '/tasks/:id/media-generation', Component: MediaGeneration },
  { path: '/tasks/:id/roadmap', Component: RoadmapTask },
  { path: '/tasks/:id/speech', Component: SpeechTask },
  { path: '/tasks/:id/audio', Component: AudioTask },
  { path: '/recording/list', Component: RecordingList },
  { path: '/recording/upload', Component: RecordingUpload },
]);
```

### 页面跳转流程
1. **首页** -> 任务列表 (TaskList)
2. **任务列表** -> 任务详情 (TaskDetail)
3. **任务详情** -> 任务执行 (TaskExecute) 或其他任务相关页面
4. **录音列表** -> 录音上传 (RecordingUpload) 或录音结果 (RecordingResult)
5. **录音上传** -> 录音列表 (RecordingList)

## 录音功能详细说明

### 1. 录音列表 (RecordingList)
- **功能**：展示所有录音记录，包括状态、评分、时长等信息
- **操作**：
  - 播放录音（仅已完成分析的录音）
  - 删除录音
  - 重试分析（仅分析失败的录音）
  - 查看分析结果
- **统计**：显示录音总数、待分析数量和平均评分

### 2. 录音上传 (RecordingUpload)
- **功能**：上传新的录音文件，支持格式验证和隐私保护
- **验证**：
  - 格式验证（支持MP3、WAV、AMR）
  - 大小验证（≤20MB）
  - 时长验证（3-30分钟）
- **隐私保护**：
  - 隐私协议弹窗
  - 隐私确认勾选
- **关联信息**：
  - 关联楼盘
  - 关联客户
  - 备注

### 3. 录音结果 (RecordingResult)
- **功能**：展示录音分析结果，包括评分、关键词、对话摘要等
- **操作**：
  - 播放录音
  - 查看详细分析报告
  - 分享分析结果

## 技术实现

### 状态管理
- 使用React useState进行组件状态管理
- 使用useEffect处理副作用

### 样式设计
- 使用Tailwind CSS进行样式设计
- 响应式设计，适配移动端
- 统一的设计风格和颜色方案

### 组件化
- 采用组件化架构，提高代码复用性
- 模块化设计，便于维护和扩展

## 开发指南

### 安装依赖
```bash
pnpm install
```

### 开发服务器
```bash
pnpm dev
```

### 构建
```bash
pnpm build
```

## 未来计划

1. **实时录音功能**：支持实时录制通话
2. **更详细的分析报告**：提供更深入的语音分析
3. **导出功能**：支持导出分析报告
4. **多语言支持**：支持多语言界面
5. **云存储集成**：支持云存储录音文件
