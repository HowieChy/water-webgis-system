import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Form,
  Input,
  Modal,
  message,
  InputNumber,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import request from "../utils/request";

// API calls for category (simplified here, should be in api/facility.ts)
const getCategories = () => request.get("/facility/category/list");
const saveCategory = (data: any) =>
  request.post("/facility/category/save", data);

const CategoryPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await getCategories();
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        values.id = editingId;
      }
      await saveCategory(values);
      message.success("Saved successfully");
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "名称", dataIndex: "name" },
    { title: "图标", dataIndex: "iconUrl" },
    { title: "排序", dataIndex: "sortOrder" },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="分类管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增分类
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={false}
      />
      <Modal
        title={editingId ? "编辑分类" : "新增分类"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="分类名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="iconUrl" label="图标URL">
            <Input />
          </Form.Item>
          <Form.Item name="sortOrder" label="排序">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryPage;
