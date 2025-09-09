const routes: any[] = [
  // user
  {
    path: '/',
    component: '@/pages/index.tsx',
    icon: 'Home',
    name: '引导',
  },
  {
    path: '/search',
    component: '@/pages/search/index.tsx',
    icon: 'Search',
    name: '全局搜索',
  },
  {
    path: '/settings',
    component: '@/pages/Settings/index.tsx',
    icon: 'Setting',
    name: '系统配置',
  },
];

export default routes;
