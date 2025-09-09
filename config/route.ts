const routes: any[] = [
  // user
  {
    path: '/gitlab',
    component: '@/pages/gitlab_temp/index.tsx',
    icon: 'Gitlab',
    name: 'GitLab 全局搜索',
  },
  {
    path: '/settings',
    component: '@/pages/Settings/index.tsx',
    icon: 'Setting',
    name: '系统配置',
  },
];

export default routes;
