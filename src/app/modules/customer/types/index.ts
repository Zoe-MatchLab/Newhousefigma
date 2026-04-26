/**
 * @module customer/types
 * @description 客户模块的类型定义
 * 
 * 本文件定义了客户管理相关的所有 TypeScript 类型和接口，包括：
 * - Customer: 客户基本信息
 * - CustomerRecord: 客户跟进记录
 */

export interface Customer {
  id: string;
  name: string;
  phone: string;
  recordCount: number;
  createTime: string;
}

export interface CustomerRecord {
  id: string;
  customerId: string;
  content: string;
  createTime: string;
  agent: string;
}
