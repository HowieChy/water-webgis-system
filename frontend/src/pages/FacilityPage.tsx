import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form, Input, Select, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { getFacilities, getCategories, saveFacility } from "../api/facility";

const FacilityPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchFacilities();
    getCategories().then((res: any) => setCategories(res));
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res: any = await getFacilities();
      setData(res);
    } catch (e) {
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
    // geomJson is string, need to handle coordinate input if needed.
    // For simplicity, we assume simple lat/lon or ignore geometry editing in this form or use text.
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        values.id = editingId;
      }

      // Construct simple Point GeoJSON if lat/lon provided (Optional)
      // For now, let's skip complex geom editing in Table, assume it's set via Map or default.
      // Or allow manual GeoJSON string Input.

      await saveFacility(values);
      message.success("Saved successfully");
      setIsModalOpen(false);
      fetchFacilities();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    { title: "名称", dataIndex: "name" },
    { title: "编码", dataIndex: "code" },
    { title: "地址", dataIndex: "address" },
    { title: "状态", dataIndex: "status" },
    {
      title: "类型",
      dataIndex: "categoryId",
      render: (id: number) => categories.find((c) => c.id === id)?.name || id,
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          编辑
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="设施管理"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          新增设施
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingId ? "编辑设施" : "新增设施"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="编码" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="分类"
            rules={[{ required: true }]}
          >
            <Select>
              {categories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  {c.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="address" label="地址">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="状态">
            <Select>
              <Select.Option value="Normal">正常</Select.Option>
              <Select.Option value="Warning">告警</Select.Option>
              <Select.Option value="Error">故障</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="geomJson" label="GeoJSON (可选)">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default FacilityPage;
