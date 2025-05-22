/**
 * 版本信息接口
 * 包含版本号、时间戳和可选的强制更新标志
 */
export interface VersionInfo {
  version: string; // 版本号
  timestamp: number; // 时间戳，表示版本发布的时间
  forceUpdate?: boolean; // 是否强制更新
}

/**
 * 检查选项接口
 * 包含检查版本的URL、可选的检查间隔时间和回调函数
 */
export interface CheckOptions {
  url: string; // 用于检查版本的URL
  interval?: number; // 检查间隔时间（毫秒），不指定则使用默认值
  onUpdate?: (info: VersionInfo) => void; // 版本更新时的回调函数
  onError?: (error: Error) => void; // 发生错误时的回调函数
}

/**
 * 检查方法类型
 * 定义了支持的版本检查方法：轮询、WebSocket和服务器发送事件（SSE）
 */
export type CheckMethod = 'polling' | 'websocket' | 'sse';

/**
 * 版本检查器接口
 * 定义了启动、停止和检查版本的方法
 */
export interface VersionChecker {
  start(): void; // 启动版本检查
  stop(): void; // 停止版本检查
  check(): Promise<VersionInfo>; // 执行版本检查并返回版本信息的Promise
}