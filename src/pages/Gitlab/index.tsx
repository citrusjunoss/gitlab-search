import SearchConditionForm from '@/components/search-condition-form';
import { useModel } from '@umijs/max';
import {
  Card,
  Col,
  Form,
  Input,
  Layout,
  Pagination,
  Row,
  Spin,
  Typography,
} from 'antd';
import micromatch from 'micromatch';
import React, { useEffect, useMemo, useState } from 'react';
import './index.less';

const { Title, Text } = Typography;

const GitlabSearchPage: React.FC = () => {
  const {
    keyword,
    token,
    selectGroups,
    selectGroups1,
    allGroups,
    allProjects,
    projectTotal,
    projectSearched,
    codeResult,
    status,
    loading,
    includePattern,
    excludePattern,
    updateState,
    fetchAllGroups,
    fetchAllProjects,
    search,
    isExact = false,
  } = useModel('gitlabModel');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedToken = localStorage.getItem('gitlab_token') || '';
    if (savedToken) {
      updateState({ token: savedToken });
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (token && allGroups.length === 0) {
        const groups = await fetchAllGroups(token);
        if (groups.length > 0 && allProjects.length === 0) {
          await fetchAllProjects(token, groups);
        }
      }
    };
    init();
  }, [token]);

  const handleSearch = async (values: any) => {
    setCurrentPage(1);
    await updateState(values);
    setTimeout(search, 0);
  };

  const handlePaginationChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const filteredCodeResult = useMemo(() => {
    let results = codeResult;
    try {
      if (includePattern) {
        results = results.filter((item) =>
          micromatch.isMatch(item.file_path, includePattern),
        );
      }
      if (excludePattern) {
        results = results.filter(
          (item) => !micromatch.isMatch(item.file_path, excludePattern),
        );
      }
    } catch (e) {
      console.error('Error applying glob filter:', e);
      updateState({ status: '搜索异常' });
    }
    return results;
  }, [codeResult, includePattern, excludePattern]);

  const paginatedCodeResult = filteredCodeResult.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const onFinish = (values: any) => {
    setCurrentPage(1);
    updateState(values);
  };

  return (
    <Layout className="layout">
      <SearchConditionForm
        allGroups={allGroups}
        keyword={keyword}
        selectGroups={selectGroups}
        token={token}
        isExact={isExact}
        selectGroups1={selectGroups1}
        includePattern={includePattern}
        excludePattern={excludePattern}
        searchHandle={handleSearch}
        updateState={updateState}
      />
      <Title level={4}>
        <Text type="secondary">{status}</Text> <Text> 匹配项目进度：</Text>
        <Text type="secondary">
          {projectSearched}/{projectTotal}
        </Text>{' '}
        <Text> 搜索结果：</Text>
        <Text type="secondary">
          {filteredCodeResult.length}/ {codeResult.length}
        </Text>
      </Title>
      <Form
        colon={false}
        name="filterOptions"
        onFinish={onFinish}
        form={form}
        labelAlign="left"
      >
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="includePattern"
              label="包含文件 (Glob)"
              tooltip={{ title: 'e.g., src/**/*.js' }}
            >
              <Input placeholder="e.g., src/**/*.js" allowClear />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="excludePattern"
              label="排除文件 (Glob)"
              tooltip={{ title: 'e.g., **/{node_modules,dist}/**' }}
            >
              <Input placeholder="e.g., **/{node_modules,dist}/**" allowClear />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Spin spinning={loading}>
        {paginatedCodeResult?.map((code, index) => (
          <Card
            type="inner"
            title={code.file_path}
            className="content-code"
            key={`${code.file_path}-${index}`}
          >
            <Row wrap={false}>
              <Col flex="40px" className="content-code__line-number-border">
                {[...Array(code.codeLines)].map((_, line) => (
                  <div
                    className="content-code__line-number-border__number"
                    key={line}
                  >{`${line + code.startline}`}</div>
                ))}
              </Col>
              <Col
                flex="auto"
                className="content-code__line-number-border__code"
              >
                <pre>{code.data}</pre>
              </Col>
            </Row>
          </Card>
        ))}
      </Spin>

      {filteredCodeResult.length > pageSize && (
        <Pagination
          showQuickJumper
          showSizeChanger
          current={currentPage}
          total={filteredCodeResult.length}
          pageSize={pageSize}
          onChange={handlePaginationChange}
        />
      )}
    </Layout>
  );
};

export default GitlabSearchPage;
