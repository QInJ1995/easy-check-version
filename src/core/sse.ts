import { CheckOptions, VersionChecker, VersionInfo } from '../types/core';

/**
 * 使用Server-Sent Events (SSE) 实现的版本检查器
 * 该类用于检查和获取当前应用的版本信息
 */
export class SSEChecker implements VersionChecker {
  // EventSource对象用于接收SSE消息，初始化为null
  private eventSource: EventSource | null = null;
  // 当前应用的版本，初始化为null
  private currentVersion: string | null = null;

  /**
   * 构造函数
   * @param options 版本检查的配置选项，包括URL、更新回调函数和错误回调函数
   */
  constructor(private options: CheckOptions) { }

  /**
   * 执行版本检查
   * 创建一个新的EventSource连接，并监听消息和错误事件
   * @returns 返回一个Promise，当成功接收到版本信息时解析，否则拒绝
   */
  async check(): Promise<VersionInfo> {
    return new Promise((resolve, reject) => {
      // 如果已存在EventSource连接，则先关闭之前的连接
      if (this.eventSource) {
        this.eventSource.close();
      }

      // 创建新的EventSource连接
      this.eventSource = new EventSource(this.options.url);

      // 处理接收到的消息
      this.eventSource.onmessage = (event) => {
        try {
          // 解析接收到的消息数据为VersionInfo对象
          const data: VersionInfo = JSON.parse(event.data);
          // 如果当前版本不为空且与接收到的版本不同，则调用更新回调函数
          if (this.currentVersion && this.currentVersion !== data.version + '-' + data.timestamp) {
            this.options.onUpdate?.(data);
          }
          // 更新当前版本
          this.currentVersion = data.version + '-' + data.timestamp;
          // 解析Promise，返回版本信息
          resolve(data);
        } catch (error) {
          // 如果解析数据时发生错误，则调用错误回调函数并拒绝Promise
          const err = new Error(`【Easy-Version-Check】- ${error}`);
          this.options.onError?.(err);
          reject(err);
        }
      };

      // 处理发生的错误
      this.eventSource.onerror = (error) => {
        // 创建一个新的错误对象，如果原始错误不是Error实例
        const err = new Error(`【Easy-Version-Check】- ${error}`);
        // 调用错误回调函数
        this.options.onError?.(err);
        // 拒绝Promise
        reject(err);
      };
    });
  }

  /**
   * 启动版本检查
   * 如果当前没有EventSource连接，则调用check方法开始新的检查
   */
  start(): void {
    if (this.eventSource) return;
    this.check();
  }

  /**
   * 停止版本检查
   * 如果当前有EventSource连接，则关闭该连接并将其设置为null
   */
  stop(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}