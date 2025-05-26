// 导入 Vite 的配置定义函数
import { defineConfig } from 'vite'
// 导入 Vue 插件，用于支持 Vue 项目的编译
import vue from '@vitejs/plugin-vue'
// 导入 React 插件，用于支持 React 项目的编译
import react from '@vitejs/plugin-react'
// 导入 dts 插件，用于生成 TypeScript 类型定义文件
import dts from 'vite-plugin-dts'
// 导入进度条插件
import progress from 'vite-plugin-progress';
// import colors from 'picocolors'
// 导入 rollup-plugin-visualizer 插件，用于生成库的依赖关系图
import { visualizer } from 'rollup-plugin-visualizer';


// 定义并导出默认配置
export default defineConfig({
    // 配置构建选项
    build: {
        sourcemap: false, // 生成完整的 Sourcemap
        // 配置库的入口文件路径、库的名称和输出文件名
        lib: {
            entry: 'src/index.ts',
            name: 'EasyCheckVersion',
            formats: ['es', 'cjs', 'umd'], // 生成ESModule和CommonJS格式
            fileName: (format) => getFileName(format),
        },
        // 配置 Rollup 的选项，用于打包库
        rollupOptions: {
            // 配置外部依赖，不打包 'vue' 和 'react' 模块
            external: ['vue', 'react',],
            // 配置输出选项，指定全局变量名称
            output: {
                // 在UMD构建模式下为这些外部化的依赖提供全局变量
                globals: {
                    react: 'React',
                    vue: 'Vue',
                },
            }
        }
    },
    // 配置插件列表
    plugins: [
        // 显示构建进度条
        progress(),
        // 配置 Vue 插件
        vue(),
        // 配置 React 插件
        react(),
        // 生成 TypeScript 类型定义文件
        dts({
            insertTypesEntry: true, // 自动插入 types 字段到 package.json
            outDir: 'dist' // 输出目录
        }),
        // 生成库的依赖关系图
        visualizer({
            filename: 'analysis.html', // 输出文件名
            open: false, // 是否自动打开浏览器
        }),
        // 构建完成回调
        {
            name: 'build-complete',
            async closeBundle() {
                showLog()
            }
        }
    ],
})
const showLog = (): void => {
    console.log(
        ' .+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+. ' + '\n' +
        '(     _____                   ____ _               _     __     __            _                   )' + '\n' +
        ' )   | ____|__ _ ___ _   _   / ___| |__   ___  ___| | __ \\ \\   / /__ _ __ ___(_) ___  _ __       ( ' + '\n' +
        "(    |  _| / _` / __| | | | | |   | '_ \\ / _ \\/ __| |/ /  \\ \\ / / _ \\ '__/ __| |/ _ \\| '_ \\       )" + '\n' +
        ' )   | |__| (_| \\__ \\ |_| | | |___| | | |  __/ (__|   <    \\ V /  __/ |  \\__ \\ | (_) | | | |     ( ' + '\n' +
        '(    |_____\\__,_|___/\\__, |  \\____|_| |_|\\___|\\___|_|\\_\\    \\_/ \\___|_|  |___/_|\\___/|_| |_|      )' + '\n' +
        ' )                   |___/                                                                       ( ' + '\n' +
        '(                                                                                                 )' + '\n' +
        ' "+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+"+.+" ' + '\n'
    );
}

// 定义格式到文件后缀的映射关系
const formatToExtensionMap: Record<string, string> = {
    es: 'mjs',
    cjs: 'cjs',
    umd: 'umd.js',
};

// 获取文件名的函数（可复用、可扩展）
const getFileName = (format: string): string => {
    const ext = formatToExtensionMap[format] || 'js'; // 默认 fallback 到 js
    return `index.${ext}`;
};