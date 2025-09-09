import { defineConfig } from '@umijs/max';
import routes from './route';
export default defineConfig({
  antd: {},
  favicons: ['/assets/fav.ico'],
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: 'QZD CI/CD',
    menu: {}, // 启用菜单
  },
  routes,
  esbuildMinifyIIFE: true, // 解决 esbuild helpers 冲突问题
  exportStatic: {}, // 启用静态导出，为每个路由生成独立的 HTML 文件
  base: '/global-search/', // 设置应用的基础路径
  publicPath: '/global-search/', // 设置静态资源的公共路径
  npmClient: 'pnpm',
});
