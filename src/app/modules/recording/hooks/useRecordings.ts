/**
 * @module recording/hooks/useRecordings
 * @description 录音模块的自定义 Hooks
 * 
 * 本文件提供录音管理相关的业务逻辑封装，包括：
 * - useRecordingList: 获取和管理录音列表
 * - useRecordingDetail: 获取录音详情
 * - useRecordingNavigation: 录音导航跳转
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { RecordingRecord } from '../types';
import { mockRecordings } from '../data/mockRecordings';

/**
 * 获取和管理录音列表
 * @returns 录音列表、加载状态、刷新方法
 */
export function useRecordingList() {
  const [recordings, setRecordings] = useState<RecordingRecord[]>(mockRecordings);
  const [loading, setLoading] = useState(false);

  const refreshRecordings = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setRecordings(mockRecordings);
    setLoading(false);
  }, []);

  return { recordings, loading, refreshRecordings };
}

/**
 * 获取录音详情
 * @param recordingId 录音 ID
 * @returns 录音详情、加载状态
 */
export function useRecordingDetail(recordingId: string) {
  const [recording, setRecording] = useState<RecordingRecord | undefined>(
    mockRecordings.find(r => r.id === recordingId)
  );
  const [loading, setLoading] = useState(false);

  const fetchRecording = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setRecording(mockRecordings.find(r => r.id === recordingId));
    setLoading(false);
  }, [recordingId]);

  return { recording, loading, fetchRecording };
}

/**
 * 录音导航跳转
 * @returns 各种导航跳转方法
 */
export function useRecordingNavigation() {
  const navigate = useNavigate();

  const goToList = useCallback(() => {
    navigate('/recording/list');
  }, [navigate]);

  const goToUpload = useCallback(() => {
    navigate('/recording/upload');
  }, [navigate]);

  const goToResult = useCallback((id: string) => {
    navigate(`/recording/result/${id}`);
  }, [navigate]);

  const goToBuildingSelect = useCallback(() => {
    navigate('/recording/building-select');
  }, [navigate]);

  const goToCustomerSelect = useCallback(() => {
    navigate('/recording/customer-select');
  }, [navigate]);

  return {
    goToList,
    goToUpload,
    goToResult,
    goToBuildingSelect,
    goToCustomerSelect
  };
}
