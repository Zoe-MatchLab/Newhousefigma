/**
 * @module recording/types
 * @description 录音模块的类型定义
 * 
 * 本文件定义了录音管理相关的所有 TypeScript 类型和接口，包括：
 * - RecordingRecord: 录音记录
 * - RecordingStatus: 录音状态
 */

export type RecordingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface RecordingRecord {
  id: string;
  name: string;
  duration: string;
  size: string;
  building: string | null;
  customer: string | null;
  agent: string;
  status: RecordingStatus;
  score: number | null;
  time: Date;
}
