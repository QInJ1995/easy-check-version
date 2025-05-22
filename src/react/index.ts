import { useEffect, useRef } from 'react';
import { CheckMethod, CheckOptions, VersionChecker } from '../types/core';
import { VersionCheckerFactory } from '../core/factory';

/**
 * 版本检查钩子
 * 
 * 该钩子用于在组件中进行版本检查它根据提供的配置创建一个版本检查器，并在组件挂载和卸载时管理其生命周期
 * 
 * @param options 包含版本检查配置的选项对象，以及可选的检查方法
 * @returns 返回一个包含检查、启动和停止版本检查方法的对象
 */
export function useVersionCheck(options: CheckOptions & { method?: CheckMethod }) {
  // 用于存储版本检查器实例的引用
  const checkerRef = useRef<VersionChecker | null>(null);

  // 在组件挂载和配置变化时创建并启动版本检查器
  useEffect(() => {
    // 创建版本检查器实例
    checkerRef.current = VersionCheckerFactory.create(
      options.method || 'polling',
      options
    );

    // 启动版本检查
    checkerRef.current.start();

    // 在组件卸载时停止版本检查
    return () => {
      checkerRef.current?.stop();
    };
  }, [options.url, options.method]);

  // 返回版本检查器的方法
  return {
    check: () => checkerRef.current?.check(),
    stop: () => checkerRef.current?.stop(),
    start: () => checkerRef.current?.start()
  };
}

// 导出类型供外部使用
export type { VersionChecker, CheckMethod, CheckOptions };