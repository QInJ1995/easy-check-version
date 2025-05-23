// 导入 Vite 的配置定义函数
import { defineConfig } from 'vite'
//  导入 createHtmlPlugin 插件，用于生成 HTML 文件
import { createHtmlPlugin } from 'vite-plugin-html'


// 定义并导出默认配置
export default defineConfig({
    root: '.', // 指定项目根目录
    server: {
        port: 3001, // 自定义端口
        open: true  // 自动打开浏览器
    },
    // 配置插件列表，同时使用 Vue 和 React 插件
    plugins: [
        // 配置 HTML 文件路径
        createHtmlPlugin({
            template: './test/index.html',
        }),
    ],
    // 配置构建选项
    build: {
        sourcemap: true, // 生成完整的 Sourcemap
    }
})