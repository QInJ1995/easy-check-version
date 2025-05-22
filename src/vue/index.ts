import { App } from 'vue';
import { CheckMethod, CheckOptions, VersionChecker } from '../types/core';
import { VersionCheckPluginOptions } from '../types/vue';
import { VersionCheckerFactory } from '../core/factory';

/**
 * 版本检查插件，用于在Vue应用中集成版本检查功能
 */
export const VersionCheckPlugin = {
  /**
   * 安装插件
   * @param app Vue应用实例
   * @param options 插件配置选项
   */
  install: (app: App, options: VersionCheckPluginOptions) => {
    // 根据配置创建版本检查器实例
    const checker = VersionCheckerFactory.create(
      options.method || 'polling',
      options
    );

    // 将版本检查器注入到Vue应用中，以便在任何地方可以访问
    app.provide('versionChecker', checker);
    // 在全局属性中添加版本检查器，便于在应用中的任何地方访问
    app.config.globalProperties.$versionChecker = checker;
  }
};

// 导出类型，以便在其他地方可以引用
export type { VersionChecker, CheckMethod, CheckOptions };