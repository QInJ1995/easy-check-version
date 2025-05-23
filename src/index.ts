// 导入版本检查工厂类，用于创建不同策略的版本检查器
import { VersionCheckerFactory } from './core/factory';

// 导出核心模块中的类型定义，以便外部使用
export * from './types/core';
// 导出Vue相关模块，可能包含与Vue集成的版本检查组件或工具
import vueCfg from './vue';
// 导出React相关模块，可能包含与React集成的版本检查组件或工具
import reactCfg from './react';

export const VersionCheckVuePlugin = vueCfg.VersionCheckVuePlugin;
export const useReactVersionCheck = reactCfg.useReactVersionCheck;

/**
 * 创建版本检查器的函数，根据指定的方法和选项配置
 * @param method 版本检查的方法，可以是轮询、WebSocket或服务器发送事件
 * @param options 版本检查的配置选项
 * @param options.url 版本检查的服务器地址
 * @param options.interval 可选，轮询方法中的检查间隔，以毫秒为单位
 * @param options.onUpdate 可选，当有新版本时的回调函数，接收版本信息作为参数
 * @param options.onError 可选，遇到错误时的回调函数，接收错误对象作为参数
 * @returns 返回一个版本检查器实例
 */
export function createVersionChecker(method: 'polling' | 'websocket' | 'sse', options: {
  url: string;
  interval?: number;
  onUpdate?: (info: { version: string; timestamp: number; forceUpdate?: boolean }) => void;
  onError?: (error: Error) => void;
}) {
  // 使用工厂类创建并返回版本检查器实例
  return VersionCheckerFactory.create(method, options);
}

export default {
  VersionCheckVuePlugin,
  useReactVersionCheck,
  createVersionChecker
}