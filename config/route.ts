import { IConfigFromPlugins } from './../src/.umi-production/core/pluginConfig';
const routes: IConfigFromPlugins['routes'] = [
  // user
  {
    path: '/gitlab',
    component: '@/pages/gitlab',
    name: 'GitLab 全局搜索',
  },
];

export default routes;
