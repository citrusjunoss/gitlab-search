import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '@umijs/max',
  },
  esbuildMinifyIIFE: true, // 解决 esbuild helpers 冲突问题
  exportStatic: {}, // 启用静态导出，为每个路由生成独立的 HTML 文件
  base: '/global-search/', // 设置应用的基础路径
  publicPath: '/global-search/', // 设置静态资源的公共路径
  proxy: {
    '/api/v4': {
      target: 'https://gitlab.qizhidao.com/',
      changeOrigin: true,
    },
  },
  npmClient: 'pnpm',
});
