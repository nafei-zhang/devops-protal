# CDP Devops Portal

**中文** | [English](./README.en.md)

## 项目介绍

CDP Devops Portal 是一个基于 React Hooks、Vite 和 TypeScript 的中后台解决方案。

## 技术栈

- **前端框架**：[React Hooks](https://react.dev/)、[TypeScript](https://www.typescriptlang.org/)
- **构建工具**：[Vite](https://vitejs.dev/)
- **UI 组件库**：[Ant Design](https://ant.design/index-cn/)、[Tailwind CSS](https://tailwindcss.com/docs/installation)
- **路由管理**：[React Router](https://reactrouter.com/)
- **状态管理**：[Zustand](https://zustand-demo.pmnd.rs/)
- **国际化**：[I18n](https://react.i18next.com/)
- **HTTP 请求**：[Ky](https://github.com/sindresorhus/ky)、[@tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/overview)
- **代码规范**：[ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new/)
- **组件缓存**：[keepalive-for-react](https://github.com/irychen/keepalive-for-react)
- **API 模拟**：[vite-plugin-fake-server](https://fakerjs.dev/)

## 功能特性

- **权限管理**：支持前端静态路由和后端动态路由
- **主题配置**：内置多种主题配置，支持暗黑主题，统一了 Ant Design 和 Tailwind CSS 的颜色体系
- **组件缓存**：路由级别的组件缓存，提升用户体验
- **国际化**：支持多语言切换
- **响应式设计**：适配不同尺寸的屏幕和设备
- **Mock 数据**：内置 API 模拟功能，便于前后端分离开发

## 如何运行

### 环境准备

- Node.js 18.x 或更高版本
- pnpm 8.x 或更高版本

### 安装依赖

```bash
# 启用 corepack（Node.js 16.17.0 及以上版本）
corepack enable

# 安装依赖
pnpm install
```

### 本地开发

```bash
# 启动开发服务器
pnpm run dev
```

启动成功后，浏览器会自动打开 [http://localhost:3333](http://localhost:3333) 访问项目。

### 常用命令

```bash
# 类型检查
pnpm run typecheck

# 代码检查
pnpm run lint

# 代码检查并自动修复
pnpm run lint:fix

# 依赖更新检查
pnpm run npm-check

# 运行测试
pnpm run test
```

## 如何部署

### 构建生产版本

```bash
# 构建生产环境代码
pnpm run build
```

构建完成后，产物会输出到 `build` 目录中。

### 本地预览生产构建

```bash
# 本地预览生产构建
pnpm run preview
```

### 部署到服务器

#### 静态服务器部署

将构建产物（`build` 目录下的所有文件）上传到静态服务器的根目录或指定目录。

注意：如果部署到子目录，需要修改 `vite.config.ts` 中的 `base` 配置：

```typescript
base: isDev ? "/" : "/your-sub-directory/",
```

#### 使用 Docker 部署

1. 创建 Dockerfile：

```dockerfile
FROM nginx:alpine
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. 创建 nginx.conf：

```nginx
server {
    listen 80;
    server_name localhost;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        # 配置后端 API 代理
        proxy_pass http://your-backend-api/;
    }
}
```

3. 构建并运行 Docker 镜像：

```bash
# 构建镜像
docker build -t cdp-devops-portal .

# 运行容器
docker run -d -p 80:80 cdp-devops-portal
```

#### 使用 CI/CD 自动部署

项目已配置 GitHub Actions 工作流，当推送带有 `v*` 标签的提交时，会自动构建并部署到 GitHub Pages。

如需自定义 CI/CD 流程，可参考 `.github/workflows/deploy.yml` 文件进行修改。

## 贡献指南

欢迎提交问题和改进建议。如果您想贡献代码，请遵循以下步骤：

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request
