import {
  getGitlabGroups,
  getGitlabProjects,
  searchCodeInProject,
} from '@/services/gitlab';
import pLimit from 'p-limit';
import { useCallback, useState } from 'react';

export interface CodeResult {
  file_path: string;
  codeLines: number;
  startline: number;
  data: string;
  project: any;
  path: string; // 文件在项目中的相对路径
  ref: string; // 文件所在的分支或标签
}

export interface GitlabModelState {
  keyword: string;
  token: string;
  branch: string; // 分支或标签
  isExact: boolean;
  selectGroups: string[];
  selectGroups1: string;
  includePattern: string; // 包含文件 glob 规则
  excludePattern: string; // 排除文件 glob 规则
  projectTotal: number;
  projectSearched: number;
  allGroups: any[];
  allProjects: any[];
  codeResult: CodeResult[];
  status: string;
  loading: boolean;
}

const useGitlabModel = () => {
  const [state, setState] = useState<GitlabModelState>({
    keyword: '',
    token: '',
    branch: 'release',
    isExact: false,
    projectTotal: 0,
    projectSearched: 0,
    selectGroups: [],
    selectGroups1: '',
    includePattern: '',
    excludePattern: '',
    allGroups: [],
    allProjects: [],
    codeResult: [],
    status: '',
    loading: false,
  });

  const updateState = useCallback((newState: Partial<GitlabModelState>) => {
    setState((prevState) => ({ ...prevState, ...newState }));
  }, []);

  const fetchAllGroups = useCallback(async (token: string) => {
    if (!token) return [];
    const cachedGroups = JSON.parse(
      localStorage.getItem('gitlabGroups') || '[]',
    );
    if (cachedGroups.length > 0) {
      updateState({ allGroups: cachedGroups });
      return cachedGroups;
    }
    const res = await getGitlabGroups(token);
    if (res) {
      localStorage.setItem('gitlabGroups', JSON.stringify(res));
      updateState({ allGroups: res });
      return res;
    }
    return [];
  }, []);

  const fetchAllProjects = useCallback(async (token: string, groups: any[]) => {
    if (!token || !groups || groups.length === 0) return;
    const cachedProjects = JSON.parse(
      localStorage.getItem('gitlabProjects') || '[]',
    );
    if (cachedProjects.length > 0) {
      updateState({ allProjects: cachedProjects });
      return;
    }
    const promises = groups.map((group) => getGitlabProjects(group.id, token));
    const results = await Promise.all(promises);
    const allProjects = results.flat(1);
    localStorage.setItem('gitlabProjects', JSON.stringify(allProjects));
    updateState({ allProjects });
  }, []);

  const search = useCallback(async () => {
    const {
      token,
      keyword,
      selectGroups,
      allProjects,
      projectSearched,
      isExact,
      selectGroups1,
      branch, // 获取 branch
    } = state;
    if (!token || !keyword) {
      updateState({ status: '请输入 Token 或关键词' });
      return;
    }
    updateState({ loading: true, status: '搜索中...', codeResult: [] });
    let projectsToSearch = allProjects;
    if (selectGroups.length > 0 || selectGroups1) {
      projectsToSearch = allProjects.filter((p) => {
        const bool = isExact
          ? selectGroups.includes(p.namespace.id)
          : p.namespace.full_path.includes(selectGroups1);
        return bool;
      });
    }
    if (projectsToSearch.length === 0) {
      updateState({
        loading: false,
        status: '无匹配项目',
      });
      return;
    }
    updateState({ projectTotal: projectsToSearch.length, projectSearched: 0 });
    const limit = pLimit(5);
    const tempNum = projectSearched;
    let allResults: CodeResult[] = [];
    const promises = projectsToSearch.map((project) =>
      limit(async () => {
        try {
          // 在 API 调用中传入 branch 作为 ref
          const res = await searchCodeInProject(
            project.id,
            keyword,
            token,
            branch,
          );
          if (res && res.length > 0) {
            const handledResult = res.map((code: any) => ({
              ...code,
              project,
              path: code.path, // 添加 path
              ref: code.ref, // 添加 ref
              codeLines: code.data.split(/\n/g).length - 1,
              file_path: `${project.path_with_namespace}/blob/${code.ref}/${code.path}`,
            }));
            allResults = allResults.concat(handledResult);
            updateState({ codeResult: [...allResults] });
          }
        } catch (error) {
          console.error(`Failed to search in project ${project.name}:`, error);
        }
        updateState({ projectSearched: tempNum + 1 });
        // eslint-disable-next-line no-promise-executor-return
        await new Promise((resolve) => setTimeout(resolve, 500));
      }),
    );
    await Promise.all(promises);
    updateState({ loading: false, status: `搜索完毕` });
  }, [state]);

  return {
    ...state,
    updateState,
    fetchAllGroups,
    fetchAllProjects,
    search,
  };
};

export default useGitlabModel;
