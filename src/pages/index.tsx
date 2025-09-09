import { ReactComponent as Logo } from '@/assets/logo.svg';
import { useModel } from '@umijs/max';
import { List, Typography } from 'antd';
import styles from './index.less';

const HomePage: React.FC = () => {
  const { name } = useModel('global');
  const data = [
    'Gitlab 全局搜索，支持 glob 过滤文件名, 群组模糊/精准筛选',
    '全局配置 Token, 接口并发限制，接口请求间隔等',
  ];

  return (
    <div>
      <div className={styles.container}>
        <Logo style={{ width: 100, height: 100 }} />
        <Typography.Title> 欢迎使用 {name}</Typography.Title>
        <List
          header={<div>目前支持</div>}
          bordered
          dataSource={data}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
      </div>
    </div>
  );
};

export default HomePage;
