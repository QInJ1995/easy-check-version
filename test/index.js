import { createVersionChecker } from '/dist/easy-check-version'


const checker = createVersionChecker('polling', {
    // url: 'http://localhost:3000/version', // 接口
    url: '/test/version.json',
    interval: 10000, // 可选，检查间隔（毫秒），默认 60000
    onUpdate: (info) => {
        console.log('发现新版本:', info.version);
        // 处理版本更新逻辑
    },
    onError: (error) => {
        console.error('检查版本时发生错误:', error);
    }
});

// 开始检查
checker.start();

// 停止检查
// checker.stop();

// 手动检查一次
checker.check();

