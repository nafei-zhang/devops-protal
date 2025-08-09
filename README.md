# CDP Devops Portal

**English** | [中文](./README.md)

## Introduction

CDP Devops Portal is a middle and back-office solution based on React Hooks, Vite, and TypeScript.

## Technology Stack

- **Frontend Framework**: [React Hooks](https://react.dev/)、[TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **UI Component Library**: [Ant Design](https://ant.design/)、[Tailwind CSS](https://tailwindcss.com/docs/installation)
- **Router Management**: [React Router](https://reactrouter.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Internationalization**: [I18n](https://react.i18next.com/)
- **HTTP Requests**: [Ky](https://github.com/sindresorhus/ky)、[@tanstack/react-query](https://tanstack.com/query/latest/docs/framework/react/overview)
- **Code Standards**: [ESLint Flat Config](https://eslint.org/docs/latest/use/configure/configuration-files-new/)
- **Component Caching**: [keepalive-for-react](https://github.com/irychen/keepalive-for-react)
- **API Mocking**: [vite-plugin-fake-server](https://fakerjs.dev/)

## Features

- **Permission Management**: Supports both frontend static routing and backend dynamic routing
- **Theme Configuration**: Built-in multiple theme configurations, supports dark theme, and unified color system for Ant Design and Tailwind CSS
- **Component Caching**: Route-level component caching to enhance user experience
- **Internationalization**: Support for multiple language switching
- **Responsive Design**: Adapts to different screen sizes and devices
- **Mock Data**: Built-in API mocking functionality for front-end and back-end separated development

## How to Run

### Environment Preparation

- Node.js 18.x or higher
- pnpm 8.x or higher

### Install Dependencies

```bash
# Enable corepack (Node.js 16.17.0 and above)
corepack enable/disabled

# Install dependencies
pnpm install
```

### Local Development

```bash
# Start development server
pnpm run dev
```

After successful startup, the browser will automatically open [http://localhost:3333](http://localhost:3333) to access the project.

### Common Commands

```bash
# Type checking
pnpm run typecheck

# Code linting
pnpm run lint

# Code linting with auto-fix
pnpm run lint:fix

# Dependency update check
pnpm run npm-check

# Run tests
pnpm run test
```

## How to Deploy

### Build Production Version

```bash
# Build production code
pnpm run build
```

After the build is complete, the output will be in the `build` directory.

### Preview Production Build Locally

```bash
# Preview production build locally
pnpm run preview
```

### Deploy to Server

#### Static Server Deployment

Upload the build output (all files in the `build` directory) to the root directory or specified directory of your static server.

Note: If deploying to a subdirectory, you need to modify the `base` configuration in `vite.config.ts`:

```typescript
base: isDev ? "/" : "/your-sub-directory/",
```

#### Deploy with Docker

1. Create a Dockerfile:

```dockerfile
FROM nginx:alpine
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create nginx.conf:

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
        # Configure backend API proxy
        proxy_pass http://your-backend-api/;
    }
}
```

3. Build and run Docker image:

```bash
# Build image
docker build -t cdp-devops-portal .

# Run container
docker run -d -p 80:80 cdp-devops-portal
```

#### Automated Deployment with CI/CD

The project has configured GitHub Actions workflow that automatically builds and deploys to GitHub Pages when commits with `v*` tags are pushed.

To customize the CI/CD process, refer to the `.github/workflows/deploy.yml` file for modifications.

## Contribution Guidelines

Issues and improvement suggestions are welcome. If you want to contribute code, please follow these steps:

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
