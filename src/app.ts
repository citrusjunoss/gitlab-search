import logoImg from '@/assets/logo.png';

// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<{
  name: string;
  avatar: string;
}> {
  return {
    name: 'QZD CI/CD',
    avatar: logoImg,
  };
}

export const layout = () => {
  return {
    logo: logoImg,
    menu: {
      locale: false,
    },
  };
};
