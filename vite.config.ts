// 导入 Vite 的配置定义函数
import { defineConfig } from 'vite'
// 导入 Vue 插件，用于支持 Vue 项目的编译
import vue from '@vitejs/plugin-vue'
// 导入 React 插件，用于支持 React 项目的编译
import react from '@vitejs/plugin-react'
// 导入 dts 插件，用于生成 TypeScript 类型定义文件
import dts from 'vite-plugin-dts'

// 定义并导出默认配置
export default defineConfig({
  // 配置插件列表，同时使用 Vue 和 React 插件
  plugins: [
    vue(),
    react(),
    dts({
      insertTypesEntry: true, // 自动插入 types 字段到 package.json
      outDir: 'dist' // 输出目录
    })],
  // 配置构建选项
  build: {
    // 配置库的入口文件路径、库的名称和输出文件名
    lib: {
      entry: 'src/index.ts',
      name: 'EasyCheckVersion',
      fileName: 'easy-check-version'
    },
    // 配置 Rollup 的选项，用于打包库
    rollupOptions: {
      // 配置外部依赖，不打包 'vue' 和 'react' 模块
      external: ['vue', 'react'],
      // 配置输出选项，指定全局变量名称
      output: {
        globals: {
          vue: 'Vue',
          react: 'React'
        }
      }
    }
  }
})