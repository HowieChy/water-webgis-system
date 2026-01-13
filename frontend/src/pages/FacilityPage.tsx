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
    { title: "Name", dataIndex: "name" },
    { title: "Code", dataIndex: "code" },
    { title: "Address", dataIndex: "address" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Type",
      dataIndex: "categoryId",
      render: (id: number) => categories.find((c) => c.id === id)?.name || id,
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: any) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Card
      title="Facility Management"
      extra={
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Facility
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
        title={editingId ? "Edit Facility" : "Add Facility"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Category"
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
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="status" label="Status">
            <Select>
              <Select.Option value="Normal">Normal</Select.Option>
              <Select.Option value="Warning">Warning</Select.Option>
              <Select.Option value="Error">Error</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="geomJson" label="GeoJSON (Optional)">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default FacilityPage;
