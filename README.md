# easy-check-version

一个用于检查版本更新的工具

## 功能特点

- 支持多种版本检查方式：轮询（Polling）、WebSocket、SSE（Server-Sent Events）
- 支持 React 和 Vue 框架集成
- 可配置的检查间隔时间
- 支持强制更新功能
- 完善的错误处理机制

## 安装

```bash
npm install easy-check-version
# 或
yarn add easy-check-version
```

## 使用方法

### 基础用法

```typescript
import { createVersionChecker } from 'easy-check-version';

const checker = createVersionChecker('polling', {
  // url: '/test/version.json', // 项目本地version.json 文件的 URL json 格式为 { version: '1.0.0', timestamp: 1234567890, forceUpdate: true }
  url: 'https://your-api.com/version', // API 地址
  interval: 60000, // 可选，检查间隔（毫秒），默认 60000
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
checker.stop();

// 手动检查一次
checker.check();
```

### React 集成

```typescript
import { useReactVersionCheck } from 'easy-check-version/react';

function App() {
  const { check, start, stop } = useReactVersionCheck({
    url: 'https://your-api.com/version',
    method: 'polling', // 可选，默认为 'polling'
    interval: 60000,
    onUpdate: (info) => {
      console.log('发现新版本:', info.version);
    },
    onError: (error) => {
      console.error('检查版本时发生错误:', error);
    }
  });

  return (
    // 你的组件内容
  );
}
```

### Vue 集成

```typescript
import { VersionCheckVuePlugin } from 'easy-check-version/vue';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.use(VersionCheckVuePlugin, {
  url: 'https://your-api.com/version',
  method: 'polling', // 可选，默认为 'polling'
  interval: 60000,
  onUpdate: (info) => {
    console.log('发现新版本:', info.version);
  },
  onError: (error) => {
    console.error('检查版本时发生错误:', error);
  }
});

app.mount('#app');
```

## 版本信息格式

服务器返回的版本信息应遵循以下格式：

```typescript
interface VersionInfo {
  version: string;    // 版本号
  timestamp: number;  // 时间戳
  forceUpdate?: boolean; // 是否强制更新
}
```

## 配置选项

| 选项 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| url | string | 是 | - | 版本检查的 API 地址 |
| interval | number | 否 | 60000 | 轮询间隔（毫秒） |
| method | 'polling' \| 'websocket' \| 'sse' | 否 | 'polling' | 版本检查方式 |
| onUpdate | function | 否 | - | 发现新版本时的回调函数 |
| onError | function | 否 | - | 发生错误时的回调函数 |

## 注意事项

1. 确保服务器返回的版本信息符合指定的格式
2. WebSocket 和 SSE 方式需要服务器端支持相应的协议
3. 建议在生产环境中使用 WebSocket 或 SSE 方式，以减少服务器负载
4. 如果使用强制更新功能，请确保在 `onUpdate` 回调中正确处理 `forceUpdate` 标志

## 错误处理

工具会在以下情况触发错误回调：

- 网络请求失败
- 服务器返回的数据格式不正确
- WebSocket 连接失败
- SSE 连接失败

建议在 `onError` 回调中实现适当的错误处理逻辑，例如重试机制或用户提示。
