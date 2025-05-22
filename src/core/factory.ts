import { CheckMethod, CheckOptions, VersionChecker } from '../types/core';
import { PollingChecker } from './polling';
import { WebSocketChecker } from './websocket';
import { SSEChecker } from './sse';

/**
 * 版本检查器工厂类
 * 用于根据不同的检查方法创建相应的版本检查器
 */
export class VersionCheckerFactory {
  /**
   * 创建一个版本检查器实例
   * @param method 检查方法，可以是'polling', 'websocket', 或 'sse'
   * @param options 检查方法的配置选项
   * @returns 返回一个具体版本检查器实例
   * @throws 如果提供的检查方法不支持，则抛出错误
   */
  static create(method: CheckMethod, options: CheckOptions): VersionChecker {
    // 根据不同的检查方法创建并返回对应的版本检查器实例
    switch (method) {
      case 'polling':
        return new PollingChecker(options); // 轮询检查器
      case 'websocket':
        return new WebSocketChecker(options); // WebSocket检查器
      case 'sse':
        return new SSEChecker(options);
      default:
        // 如果检查方法不支持，则抛出错误
        throw new Error(`【Easy-Version-Check】- Unsupported check method: ${method}`);
    }
  }
} 