import { useModel } from '@umijs/max';
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Space,
  Spin,
  Statistic,
  Typography,
} from 'antd';
import React, { useEffect } from 'react';

const { Title } = Typography;

const SettingsPage: React.FC = () => {
  const [form] = Form.useForm();
  const {
    concurrencyLimit,
    requestDelay,
    token,
    updateState,
    gitlabUrl,
    allGroupsNumber,
    allProjectsNumber,
    fetchAllGroups,
    fetchAllProjectsRemote,
    fetchAllGroupsRemote,
    init,
  } = useModel('gitlabModel');

  useEffect(() => {
    form.setFieldsValue({
      concurrencyLimit,
      requestDelay,
      gitlabUrl,
      token, // Display current token, but it's managed by SearchConditionForm
    });
    fetchAllGroups();
  }, [concurrencyLimit, requestDelay, token, gitlabUrl]);

  const onFinish = (values: any) => {
    updateState({ ...values });
  };

  const onReset = () => {
    form.resetFields();
  };

  const handleUpdateGroup = async () => {
    await fetchAllGroupsRemote();
  };

  const handleUpdateProjects = async () => {
    await fetchAllProjectsRemote();
  };
  return (
    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
      <Spin spinning={!init}>
        <Divider>
          <Title level={3}>更新数据</Title>
        </Divider>
        <Row gutter={16} justify="center">
          <Col span={12}>
            <Statistic title="项目总数" value={allProjectsNumber} />
            <Button onClick={handleUpdateProjects} style={{ marginRight: 8 }}>
              更新
            </Button>
          </Col>
          <Col span={12}>
            <Statistic title="群组总数" value={allGroupsNumber} />
            <Button htmlType="button" onClick={handleUpdateGroup}>
              更新
            </Button>
          </Col>
        </Row>
        <Divider style={{ marginTop: 50 }}>
          <Title level={3}>系统配置</Title>
        </Divider>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ concurrencyLimit, requestDelay, token, gitlabUrl }}
        >
          <Form.Item
            label="GitLab 实例"
            name="gitlabUrl"
            rules={[{ required: true, message: '请输入gitlab url' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="GitLab Token"
            name="token"
            rules={[{ required: true, message: '请输入gitlab个人 token' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="接口并发限制" name="concurrencyLimit">
            <InputNumber min={1} max={20} />
          </Form.Item>
          <Form.Item label="接口请求延迟 (毫秒)" name="requestDelay">
            <InputNumber min={0} max={5000} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              保存
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Space>
  );
};

export default SettingsPage;
