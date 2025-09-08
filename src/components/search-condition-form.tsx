import { GitlabModelState } from '@/models/gitlabModel';
import { InfoCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';
import React, { useEffect } from 'react';

interface Props {
  allGroups: Array<any>;
  keyword: string;
  selectGroups: Array<string>;
  token: string;
  includePattern: string;
  excludePattern: string;
  selectGroups1: string;
  isExact: boolean;
  searchHandle: (p: any) => void;
  updateState: (state: Partial<GitlabModelState>) => void;
}

const SearchConditionForm: React.FunctionComponent<Props> = ({
  allGroups,
  keyword,
  selectGroups,
  selectGroups1,
  token,
  isExact,
  searchHandle,
  updateState,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      keyword,
      selectGroups,
      token,
    });
  }, [keyword, selectGroups, selectGroups1, token]);

  const onFinish = (values: any) => {
    searchHandle(values);
  };

  const onReset = () => {
    form.resetFields();
    updateState({
      keyword: '',
      token: '',
      selectGroups: [],
      includePattern: '',
      excludePattern: '',
    });
  };

  const onValuesChange = (changedValues: any) => {
    if (changedValues.token !== undefined) {
      localStorage.setItem('gitlab_token', changedValues.token);
    }
    updateState(changedValues);
  };

  const onChange = (checked: boolean) => {
    updateState({ isExact: checked });
  };

  return (
    <Form
      colon={false}
      name="searchOptions"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      form={form}
      labelAlign="left"
    >
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            name="keyword"
            label="关键字"
            rules={[{ required: true, message: '请输入搜索关键字' }]}
          >
            <Input placeholder="请输入搜索关键字" allowClear />
          </Form.Item>
        </Col>

        <Col span={8}>
          <Form.Item
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            name="token"
            label="Token"
            rules={[{ required: true, message: '请输入access token' }]}
            tooltip={{
              title: '可在gitlab中生成access token',
              icon: <InfoCircleOutlined />,
            }}
          >
            <Input placeholder="请输入access token" allowClear />
          </Form.Item>
        </Col>

        <Col span={8}>
          {isExact ? (
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="selectGroups"
              label="Group"
            >
              <Select
                showSearch
                mode="multiple"
                allowClear
                placeholder="请选择系统group，不选默认全局"
                filterOption={(input, option) =>
                  (option?.children as any)
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {allGroups.length &&
                  allGroups.map((group) => (
                    <Select.Option key={group.id} value={group.id}>
                      {group.full_path}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          ) : (
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="selectGroups1"
              label="Group"
            >
              <Input placeholder="请输入搜索关键字" allowClear />
            </Form.Item>
          )}
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 20 }}
              icon={<SearchOutlined />}
            >
              搜索
            </Button>
            <Button htmlType="button" onClick={onReset}>
              重置
            </Button>
            <Switch
              checkedChildren="精确群组"
              unCheckedChildren="模糊群组"
              style={{ marginLeft: 20 }}
              checked={isExact}
              onChange={onChange}
            />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchConditionForm;
