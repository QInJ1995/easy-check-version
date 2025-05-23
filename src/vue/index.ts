import type { Plugin } from 'vue';
import { VersionCheckPluginOptions } from '../types/vue';
import { VersionCheckerFactory } from '../core/factory';

/**
 * 版本检查插件，用于在Vue应用中集成版本检查功能
 * 支持 Vue 2 和 Vue 3
 */
const VersionCheckVuePlugin: Plugin = {
  /**
   * 安装插件
   * @param app Vue应用实例
   * @param options 插件配置选项
   */
  install: (app: any, options: VersionCheckPluginOptions) => {
    // 根据配置创建版本检查器实例
    const checker = VersionCheckerFactory.create(
      options.method || 'polling',
      options
    );

    // 判断是 Vue 2 还是 Vue 3
    if ('provide' in app) {
      // Vue 3
      app.provide('versionChecker', checker);
      app.config.globalProperties.$versionChecker = checker;
    } else {
      // Vue 2
      app.prototype.$versionChecker = checker;
    }
  }
};


export default { VersionCheckVuePlugin };
