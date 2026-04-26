/**
 * @module customer/data/mockCustomers
 * @description 客户模块的模拟数据
 * 
 * 本文件提供客户列表的 mock 数据，用于开发和测试阶段。
 */

import { Customer } from '../types';

export const mockCustomers: Customer[] = [
  {
    id: 'CUST_001',
    name: '张先生',
    phone: '138****8888',
    recordCount: 5,
    createTime: '2026-04-10'
  },
  {
    id: 'CUST_002',
    name: '李女士',
    phone: '139****6666',
    recordCount: 3,
    createTime: '2026-04-12'
  },
  {
    id: 'CUST_003',
    name: '王先生',
    phone: '137****5555',
    recordCount: 1,
    createTime: '2026-04-14'
  },
  {
    id: 'CUST_004',
    name: '赵女士',
    phone: '136****4444',
    recordCount: 8,
    createTime: '2026-04-08'
  },
  {
    id: 'CUST_005',
    name: '刘先生',
    phone: '135****3333',
    recordCount: 2,
    createTime: '2026-04-15'
  }
];
