import { CheckOptions, VersionChecker, VersionInfo } from '../types/core';

/**
 * 使用WebSocket实现的版本检查器
 * 它实现了VersionChecker接口，用于检查和通知版本更新
 */
export class WebSocketChecker implements VersionChecker {
    // WebSocket实例，用于连接服务器
    private ws: WebSocket | null = null;
    // 当前已知的版本号
    private currentVersion: string | null = null;

    /**
     * WebSocketChecker构造函数
     * @param options 版本检查的配置选项，包括WebSocket的URL、错误处理和更新回调
     */
    constructor(private options: CheckOptions) { }

    /**
     * 执行版本检查
     * 如果WebSocket连接未建立或已关闭，则创建新的连接
     * 监听WebSocket的消息，以获取版本信息
     * @returns 返回一个Promise，当成功接收到版本信息时解析
     */
    async check(): Promise<VersionInfo> {
        return new Promise((resolve, reject) => {
            // 检查WebSocket连接状态，必要时创建新连接
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.ws = new WebSocket(this.options.url);
            }

            // 处理WebSocket消息，解析版本信息
            this.ws.onmessage = (event) => {
                try {
                    const data: VersionInfo = JSON.parse(event.data);
                    // 检查是否有版本更新，并调用回调
                    if (this.currentVersion && this.currentVersion !== data.version + '-' + data.timestamp) {
                        this.options.onUpdate?.(data);
                    }
                    // 更新当前版本号
                    this.currentVersion = data.version + '-' + data.timestamp;
                    // 解析Promise，返回版本信息
                    resolve(data);
                } catch (error) {
                    // 在解析消息时发生错误，调用错误回调并拒绝Promise
                    const err = new Error(`【Easy-Version-Check】- ${error}`);
                    this.options.onError?.(err);
                    reject(err);
                }
            };

            // 处理WebSocket错误，调用错误回调并拒绝Promise
            this.ws.onerror = (error) => {
                const err = new Error(`【Easy-Version-Check】- ${error}`);
                this.options.onError?.(err);
                reject(err);
            };
        });
    }

    /**
     * 启动版本检查器
     * 如果WebSocket连接未建立，则创建并初始化
     */
    start(): void {
        // 避免重复建立WebSocket连接
        if (this.ws) return;
        // 执行版本检查
        this.check();
    }

    /**
     * 停止版本检查器
     * 关闭WebSocket连接并重置相关状态
     */
    stop(): void {
        // 关闭WebSocket连接并重置状态
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}