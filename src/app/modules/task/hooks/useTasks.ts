/**
 * @module task/hooks/useTasks
 * @description 任务模块的自定义 Hooks
 * 
 * 本文件提供任务管理相关的业务逻辑封装，包括：
 * - useTaskList: 获取和管理任务列表
 * - useTaskDetail: 获取任务详情
 * - useTaskStatus: 管理任务状态
 * - useFilterTasks: 任务筛选逻辑
 * - useTaskNavigation: 任务导航跳转
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Task, TaskStatus, TaskType } from '../types';
import { mockTasks } from '../data/mockTasks';

/**
 * 获取和管理任务列表
 * @returns 任务列表、加载状态、刷新方法
 */
export function useTaskList() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [loading, setLoading] = useState(false);

  const refreshTasks = useCallback(async () => {
    setLoading(true);
    // 模拟异步请求
    await new Promise(resolve => setTimeout(resolve, 500));
    setTasks(mockTasks);
    setLoading(false);
  }, []);

  return { tasks, loading, refreshTasks };
}

/**
 * 获取任务详情
 * @param taskId 任务 ID
 * @returns 任务详情、加载状态
 */
export function useTaskDetail(taskId: number) {
  const [task, setTask] = useState<Task | undefined>(mockTasks.find(t => t.id === taskId));
  const [loading, setLoading] = useState(false);

  const fetchTask = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setTask(mockTasks.find(t => t.id === taskId));
    setLoading(false);
  }, [taskId]);

  return { task, loading, fetchTask };
}

/**
 * 管理任务状态更新
 * @param taskId 任务 ID
 * @returns 更新状态的方法
 */
export function useTaskStatus(taskId: number) {
  const [status, setStatus] = useState<TaskStatus | null>(
    mockTasks.find(t => t.id === taskId)?.status || null
  );

  const updateStatus = useCallback((newStatus: TaskStatus) => {
    setStatus(newStatus);
    // 这里可以添加 API 调用逻辑
    console.log(`Task ${taskId} status updated to ${newStatus}`);
  }, [taskId]);

  return { status, updateStatus };
}

/**
 * 任务筛选逻辑
 * @returns 筛选后的任务列表、筛选条件、设置方法
 */
export function useFilterTasks() {
  const [filterType, setFilterType] = useState<TaskType | ''>('');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');

  const filteredTasks = mockTasks.filter(task => {
    if (filterType && task.type !== filterType) return false;
    if (filterStatus && task.status !== filterStatus) return false;
    return true;
  });

  return {
    filteredTasks,
    filterType,
    filterStatus,
    setFilterType,
    setFilterStatus
  };
}

/**
 * 任务导航跳转
 * @returns 各种导航跳转方法
 */
export function useTaskNavigation() {
  const navigate = useNavigate();

  const goToDetail = useCallback((id: number) => {
    navigate(`/tasks/${id}`);
  }, [navigate]);

  const goToExecute = useCallback((id: number) => {
    navigate(`/tasks/${id}/execute`);
  }, [navigate]);

  const goToPointData = useCallback((id: number) => {
    navigate(`/tasks/${id}/checkin`);
  }, [navigate]);

  const goToContentGeneration = useCallback((id: number) => {
    navigate(`/tasks/${id}/content-generation`);
  }, [navigate]);

  const goToMediaGeneration = useCallback((id: number) => {
    navigate(`/tasks/${id}/media-generation`);
  }, [navigate]);

  const goToRoadmap = useCallback((id: number) => {
    navigate(`/tasks/${id}/roadmap`);
  }, [navigate]);

  const goToSpeech = useCallback((id: number) => {
    navigate(`/tasks/${id}/speech`);
  }, [navigate]);

  const goToAudio = useCallback((id: number) => {
    navigate(`/tasks/${id}/audio`);
  }, [navigate]);

  return {
    goToDetail,
    goToExecute,
    goToPointData,
    goToContentGeneration,
    goToMediaGeneration,
    goToRoadmap,
    goToSpeech,
    goToAudio
  };
}
