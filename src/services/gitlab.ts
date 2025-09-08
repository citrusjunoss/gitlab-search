import { request } from '@umijs/max';

// 注意：这里的 GitLab URL 应该配置在代理中，例如 /api/v4
const GITLAB_API_BASE = '/api/v4';

/**
 * 获取所有 GitLab 组
 * @param token GitLab Personal Access Token
 */
export async function getGitlabGroups(token: string) {
  return request(`${GITLAB_API_BASE}/groups`, {
    method: 'GET',
    headers: {
      'PRIVATE-TOKEN': token,
    },
    params: {
      per_page: 100, // 假设最多100个组
    },
  });
}

/**
 * 获取指定组下的项目
 * @param groupId 组 ID
 * @param token GitLab Personal Access Token
 */
export async function getGitlabProjects(groupId: number, token: string) {
  return request(`${GITLAB_API_BASE}/groups/${groupId}/projects`, {
    method: 'GET',
    headers: {
      'PRIVATE-TOKEN': token,
    },
    params: {
      per_page: 100, // 假设每个组最多100个项目
    },
  });
}

/**
 * 在指定项目中搜索代码
 * @param projectId 项目 ID
 * @param keyword 搜索关键词
 * @param token GitLab Personal Access Token
 * @param ref 分支或标签名
 */
export async function searchCodeInProject(
  projectId: number,
  keyword: string,
  token: string,
  ref?: string,
) {
  const params: any = {
    scope: 'blobs',
    search: keyword,
  };

  if (ref) {
    params.ref = ref;
  }

  return request(`${GITLAB_API_BASE}/projects/${projectId}/search`, {
    method: 'GET',
    headers: {
      'PRIVATE-TOKEN': token,
    },
    params,
  });
}
