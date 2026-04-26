/**
 * @module recording/data/mockRecordings
 * @description 录音模块的模拟数据
 * 
 * 本文件提供录音列表的 mock 数据，用于开发和测试阶段。
 */

import { RecordingRecord } from '../types';

export const mockRecordings: RecordingRecord[] = [
  {
    id: 'RECORD_001',
    name: '通话录音_20260412.wav',
    duration: '5 分 32 秒',
    size: '3.2MB',
    building: '中海汇德里',
    customer: '张三',
    agent: '陈佳佳',
    status: 'completed',
    score: 85,
    time: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'RECORD_002',
    name: '20260411_100512.wav',
    duration: '4 分 18 秒',
    size: '2.8MB',
    building: '万科翡翠公园',
    customer: '李四',
    agent: '李明',
    status: 'processing',
    score: null,
    time: new Date(Date.now() - 26 * 60 * 60 * 1000)
  },
  {
    id: 'RECORD_003',
    name: '邀约录音_0411.mp3',
    duration: '3 分 05 秒',
    size: '1.9MB',
    building: '华润外滩九里',
    customer: null,
    agent: '王芳',
    status: 'pending',
    score: null,
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 'RECORD_004',
    name: '20260410_161200.wav',
    duration: '6 分 22 秒',
    size: '4.5MB',
    building: '龙湖天琅',
    customer: '王女士',
    agent: '赵敏',
    status: 'failed',
    score: null,
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  }
];
