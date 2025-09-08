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
  proxy: {
    '/api/v4': {
      target: 'https://gitlab.qizhidao.com/',
      changeOrigin: true,
    },
  },
  npmClient: 'pnpm',
});
