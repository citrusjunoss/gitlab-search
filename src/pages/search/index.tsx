import SearchConditionForm from '@/components/search-condition-form';
import { exportToExcel } from '@/utils/exportToExcel';
import { clearOldTokens } from '@/utils/storage'; // 导入 clearOldTokens
import {
  BarChartOutlined,
  DownloadOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import { useModel } from '@umijs/max';
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Layout,
  Modal, // 导入 Modal
  Pagination,
  Row,
  Spin,
  Table, // 导入 Table
  Typography,
} from 'antd';
import micromatch from 'micromatch';
import React, { useEffect, useMemo, useState } from 'react';
import './index.less';

const { Title, Text, Link } = Typography;

const GitlabSearchPage: React.FC = () => {
  const {
    keyword,
    token,
    branch,
    selectGroups,
    selectGroups1,
    allGroups,
    projectTotal,
    projectSearched,
    codeResult,
    status,
    loading,
    includePattern,
    excludePattern,
    updateState,
    fetchAllGroups,
    search,
    init,
    isExact = false,
  } = useModel('gitlabModel');

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedToken = localStorage.getItem('gitlab_token') || '';
    if (savedToken) {
      updateState({ token: savedToken });
    }
  }, []);

  // 当 token 变化时，清理旧的 token 缓存
  useEffect(() => {
    if (token) {
      clearOldTokens(token);
    }
  }, [token]);

  useEffect(() => {
    const init = async () => {
      if (token && allGroups.length === 0) {
        await fetchAllGroups();
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
        const includePatternsArray = includePattern
          .split(',')
          .map((p) => p.trim());
        results = results.filter((item) =>
          micromatch.isMatch(item.file_path, includePatternsArray),
        );
      }
      if (excludePattern) {
        const excludePatternsArray = excludePattern
          .split(',')
          .map((p) => p.trim());
        results = results.filter((item) => {
          const bool = !micromatch.isMatch(
            item.file_path,
            excludePatternsArray,
          );
          return bool;
        });
      }
    } catch (e) {
      console.error('Error applying glob filter:', e);
      updateState({ status: '搜索异常' });
    }
    return results;
  }, [codeResult, includePattern, excludePattern]);

  const statsData = useMemo(() => {
    const stats = new Map<
      number,
      {
        index: number;
        projectName: string;
        projectLink: string;
        files: string[];
      }
    >();
    filteredCodeResult.forEach((item) => {
      const project = item.project;
      if (!stats.has(project.id)) {
        stats.set(project.id, {
          index: stats.size + 1,
          projectName: project.name_with_namespace,
          projectLink: project.web_url,
          files: [],
        });
      }
      stats.get(project.id)!.files.push(item.file_path);
    });
    return Array.from(stats.values());
  }, [filteredCodeResult]);

  const paginatedCodeResult = filteredCodeResult.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const onFinish = (values: any) => {
    setCurrentPage(1);
    updateState(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onAnalyze = () => {
    setIsStatsModalVisible(true);
  };

  const statsColumns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 60 },
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    {
      title: '项目链接',
      dataIndex: 'projectLink',
      key: 'projectLink',
      render: (link: string) => (
        <Link href={link} target="_blank">
          {link}
        </Link>
      ),
    },
    {
      title: '文件列表',
      dataIndex: 'files',
      key: 'files',
      render: (files: string[]) => (
        <ul style={{ paddingLeft: '15px', margin: 0 }}>
          {files.map((file, i) => (
            <li key={i}>{file}</li>
          ))}
        </ul>
      ),
    },
  ];

  return (
    <Layout className="layout">
      <Spin spinning={!init}>
        <SearchConditionForm
          allGroups={allGroups}
          keyword={keyword}
          branch={branch}
          selectGroups={selectGroups}
          isExact={isExact}
          selectGroups1={selectGroups1}
          includePattern={includePattern}
          excludePattern={excludePattern}
          searchHandle={handleSearch}
          updateState={updateState}
        />
        <Divider style={{ borderColor: '#7cb305' }}>搜索结果</Divider>
        <Spin spinning={loading}>
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
                  <Input
                    placeholder="e.g., **/{node_modules,dist}/**"
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ marginRight: 20 }}
                    icon={<FilterOutlined />}
                  >
                    过滤
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={onReset}
                    style={{ marginRight: 20 }}
                  >
                    重置
                  </Button>
                  <Button
                    htmlType="button"
                    onClick={onAnalyze}
                    icon={<BarChartOutlined />}
                  >
                    统计
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          {paginatedCodeResult?.map((code, index) => {
            const fileLink = `${code.project.web_url}/-/blob/${code.ref}/${code.path}#L${code.startline}`;
            return (
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
                    <Link
                      href={fileLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <pre>{code.data}</pre>
                    </Link>
                  </Col>
                </Row>
              </Card>
            );
          })}

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
        </Spin>
      </Spin>
      <Modal
        title="搜索结果统计"
        open={isStatsModalVisible}
        onCancel={() => setIsStatsModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsStatsModalVisible(false)}>
            关闭
          </Button>,
          <Button
            key="export"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => exportToExcel(statsData)}
          >
            导出 Excel
          </Button>,
        ]}
        width="80%"
      >
        <Table
          columns={statsColumns}
          dataSource={statsData}
          rowKey="index"
          pagination={false}
          scroll={{ y: 500 }}
        />
      </Modal>
    </Layout>
  );
};

export default GitlabSearchPage;
