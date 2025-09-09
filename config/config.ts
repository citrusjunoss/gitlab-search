import { defineConfig } from '@umijs/max';
import routes from './route';
export default defineConfig({
  antd: {},
  favicons: ['/assets/logo.svg'],
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'Gitlab Tool',
    menu: {}, // 启用菜单
  },
  routes,
  base: '/gitlab-tools/', // 设置应用的基础路径
  publicPath: '/gitlab-tools/', // 设置静态资源的公共路径
  esbuildMinifyIIFE: true, // 解决 esbuild helpers 冲突问题
  exportStatic: {}, // 启用静态导出，为每个路由生成独立的 HTML 文件
  npmClient: 'pnpm',
});
