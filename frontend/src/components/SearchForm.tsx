import React from "react";
import { Form, Input, Button } from "antd";

interface SearchColumn {
  title: string;
  dataIndex: string;
  valueType?: "text" | "select";
  search?: boolean;
}

interface SearchFormProps {
  columns: SearchColumn[];
  onSearch: (values: any) => void;
  onReset: () => void;
}

/**
 * 通用搜索表单组件
 * 根据 columns 配置动态生成搜索表单
 */
const SearchForm: React.FC<SearchFormProps> = ({
  columns,
  onSearch,
  onReset,
}) => {
  const [form] = Form.useForm();

  // 过滤出需要搜索的字段
  const searchColumns = columns.filter((col) => col.search !== false);

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <Form form={form} layout="inline" onFinish={onSearch}>
        {searchColumns.map((col) => (
          <Form.Item key={col.dataIndex} name={col.dataIndex} label={col.title}>
            <Input
              placeholder={`请输入${col.title}`}
              allowClear
              className="w-48"
            />
          </Form.Item>
        ))}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleReset}>重置</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SearchForm;
