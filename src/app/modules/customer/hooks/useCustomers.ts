/**
 * @module customer/hooks/useCustomers
 * @description 客户模块的自定义 Hooks
 * 
 * 本文件提供客户管理相关的业务逻辑封装，包括：
 * - useCustomerList: 获取和管理客户列表
 * - useCustomerDetail: 获取客户详情
 * - useCustomerNavigation: 客户导航跳转
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { Customer } from '../types';
import { mockCustomers } from '../data/mockCustomers';

/**
 * 获取和管理客户列表
 * @returns 客户列表、加载状态、刷新方法
 */
export function useCustomerList() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [loading, setLoading] = useState(false);

  const refreshCustomers = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setCustomers(mockCustomers);
    setLoading(false);
  }, []);

  return { customers, loading, refreshCustomers };
}

/**
 * 获取客户详情
 * @param customerId 客户 ID
 * @returns 客户详情、加载状态
 */
export function useCustomerDetail(customerId: string) {
  const [customer, setCustomer] = useState<Customer | undefined>(
    mockCustomers.find(c => c.id === customerId)
  );
  const [loading, setLoading] = useState(false);

  const fetchCustomer = useCallback(async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setCustomer(mockCustomers.find(c => c.id === customerId));
    setLoading(false);
  }, [customerId]);

  return { customer, loading, fetchCustomer };
}

/**
 * 客户导航跳转
 * @returns 各种导航跳转方法
 */
export function useCustomerNavigation() {
  const navigate = useNavigate();

  const goToDetail = useCallback((id: string) => {
    navigate(`/customer/detail/${id}`);
  }, [navigate]);

  const goToAdd = useCallback(() => {
    navigate('/customer/add');
  }, [navigate]);

  const goToEdit = useCallback((id: string) => {
    navigate(`/customer/edit/${id}`);
  }, [navigate]);

  const goToRecordList = useCallback(() => {
    navigate('/customer/record-list');
  }, [navigate]);

  return {
    goToDetail,
    goToAdd,
    goToEdit,
    goToRecordList
  };
}
