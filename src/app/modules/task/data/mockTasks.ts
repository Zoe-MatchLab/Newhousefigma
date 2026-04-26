/**
 * @module task/data/mockTasks
 * @description 任务模块的模拟数据
 * 
 * 本文件提供任务列表的 mock 数据，用于开发和测试阶段。
 * 包含多个不同类型的任务示例，展示各种状态和并行任务配置。
 */

import { Task } from '../types';

export const mockTasks: Task[] = [
  {
    id: 1,
    title: '中海汇德里探盘任务',
    type: '探盘',
    initiator: '张经理',
    deadline: '2026-04-19T18:00:00',
    status: 'in-progress',
    parallelTasks: {
      roadmap: {
        enabled: true,
        stages: [
          { name: '采集', status: 'completed' },
          { name: '文案', status: 'in-progress' },
          { name: '视频', status: 'pending' }
        ]
      },
      speech: {
        enabled: true,
        completed: 5,
        total: 10,
        status: 'in-progress'
      },
      audio: {
        enabled: true,
        uploaded: 3,
        total: 8,
        status: 'in-progress'
      }
    }
  },
  {
    id: 2,
    title: '绿地海湾探盘任务',
    type: '探盘',
    initiator: '李主管',
    deadline: '2026-04-21T12:00:00',
    status: 'not-started',
    parallelTasks: {
      roadmap: {
        enabled: true,
        stages: [
          { name: '采集', status: 'pending' },
          { name: '文案', status: 'pending' },
          { name: '视频', status: 'pending' }
        ]
      },
      speech: {
        enabled: false,
        completed: 0,
        total: 0,
        status: 'not-started'
      },
      audio: {
        enabled: false,
        uploaded: 0,
        total: 0,
        status: 'not-started'
      }
    }
  },
  {
    id: 3,
    title: '万科翡翠公园话术训练',
    type: '话术',
    initiator: '王总监',
    deadline: '2026-04-20T09:00:00',
    status: 'in-progress',
    parallelTasks: {
      speech: {
        enabled: true,
        completed: 3,
        total: 5,
        status: 'in-progress'
      }
    }
  },
  {
    id: 4,
    title: '华润外滩九里内容生成',
    type: '内容生成',
    initiator: '赵经理',
    deadline: '2026-04-18T15:00:00',
    status: 'completed',
    parallelTasks: {
      roadmap: {
        enabled: true,
        stages: [
          { name: '采集', status: 'completed' },
          { name: '文案', status: 'completed' },
          { name: '视频', status: 'completed' }
        ]
      }
    }
  },
  {
    id: 5,
    title: '龙湖天琅媒体生成任务',
    type: '媒体生成',
    initiator: '刘主管',
    deadline: '2026-04-22T10:00:00',
    status: 'in-progress',
    parallelTasks: {
      audio: {
        enabled: true,
        uploaded: 2,
        total: 6,
        status: 'in-progress'
      }
    }
  }
];
