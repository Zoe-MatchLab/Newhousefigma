/**
 * @module task/types
 * @description 任务模块的类型定义
 * 
 * 本文件定义了任务管理相关的所有 TypeScript 类型和接口，包括：
 * - Task: 任务基本信息
 * - ParallelTasks: 并行任务（路线图、话术、录音）
 * - TaskStatus: 任务状态枚举
 * - TaskType: 任务类型枚举
 */

export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'overdue';
export type TaskType = '探盘' | '话术' | '内容生成' | '媒体生成';
export type StageStatus = 'pending' | 'in-progress' | 'completed';

export interface Stage {
  name: string;
  status: StageStatus;
}

export interface RoadmapTask {
  enabled: boolean;
  stages: Stage[];
}

export interface SpeechTask {
  enabled: boolean;
  completed: number;
  total: number;
  status: TaskStatus;
}

export interface AudioTask {
  enabled: boolean;
  uploaded: number;
  total: number;
  status: TaskStatus;
}

export interface ParallelTasks {
  roadmap?: RoadmapTask;
  speech?: SpeechTask;
  audio?: AudioTask;
}

export interface Task {
  id: number;
  title: string;
  type: TaskType;
  initiator: string;
  deadline: string;
  status: TaskStatus;
  parallelTasks?: ParallelTasks;
}
