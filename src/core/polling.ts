import { CheckOptions, VersionChecker, VersionInfo } from '../types/core';

/**
 * PollingChecker 类实现了 VersionChecker 接口，用于定期检查版本信息。
 * 它通过轮询的方式检查是否有新版本可用，并在版本更新时触发相应的回调函数。
 */
export class PollingChecker implements VersionChecker {
  // 定时器，用于记录轮询的间隔
  private timer: number | null = null;
  // 当前已知的版本号
  private currentVersion: string | null = null;

  /**
   * 构造函数，初始化 PollingChecker 实例。
   * @param options 检查选项，包括检查的URL、轮询间隔、更新和错误回调函数等。
   */
  constructor(private options: CheckOptions) { }

  /**
   * 执行版本检查，获取最新的版本信息并与当前已知的版本号进行比较。
   * 如果版本号不同且已提供更新回调，则调用更新回调。
   * @returns 返回最新的版本信息。
   */
  async check(): Promise<VersionInfo> {
    try {
      // 请求版本信息URL
      const response = await fetch(this.options.url);
      // 解析响应数据为 VersionInfo 类型
      const data: VersionInfo = await response.json();

      // 如果当前已知版本号不为空且与获取到的版本号不同，则调用更新回调函数
      if (this.currentVersion && this.currentVersion !== data.version + '-' + data.timestamp) {
        this.options.onUpdate?.(data);
      }

      // 更新当前已知的版本号
      this.currentVersion = data.version + '-' + data.timestamp;
      // 返回最新的版本信息
      return data;
    } catch (error) {
      // 如果发生错误且提供了错误回调，则调用错误回调函数
      const err = new Error(`【Easy-Version-Check】- ${error}`);
      this.options.onError?.(err);
      // 抛出错误
      throw err;
    }
  }

  /**
   * 启动版本检查轮询。
   * 如果轮询已经启动，则不执行任何操作。
   */
  start(): void {
    // 如果轮询已经启动，则直接返回
    if (this.timer) return;

    // 执行一次版本检查
    this.check();
    // 设置定时器，按照指定的间隔定期执行版本检查
    this.timer = window.setInterval(() => {
      this.check();
    }, this.options.interval || 60000);
  }

  /**
   * 停止版本检查轮询。
   * 如果轮询未启动，则不执行任何操作。
   */
  stop(): void {
    // 如果轮询已启动，则停止轮询并重置定时器
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}