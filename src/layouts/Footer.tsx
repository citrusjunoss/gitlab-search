import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';

export const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} chengzila.com`}
    links={[
      {
        key: 'GitLab Tools',
        title: 'Chengzila',
        href: 'https://www.chengzila.com',
      },
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/citrusjunoss/gitlab-tools',
        blankTarget: true,
      },
    ]}
  />
);
