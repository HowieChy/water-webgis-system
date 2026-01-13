import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form, Input, Modal, message, Select } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getCategories, saveCategory, deleteCategory } from "../api/facility";
import mapYsj from "/textures/gis/map-ysj.png"; // 雨水井
import mapWsj from "/textures/gis/map-wsj.png"; // 污水井
import mapHlj from "/textures/gis/map-hlj.png"; // 合流井
import mapBz from "/textures/gis/map-bz.png"; // 泵站
import mapSz from "/textures/gis/map-sz.png"; // 水闸
import mapYsk from "/textures/gis/map-ysk.png"; // 雨水口
import mapPfk from "/textures/gis/map-pfk.png"; // 排放口
import mapWsclc from "/textures/gis/map-wsclc.png"; // 污水处理厂
import mapDwdq from "/textures/gis/map-dwdq.png"; // 低洼地区

// Icon mapping
const iconMap: Record<string, string> = {
  "map-ysj.png": mapYsj,
  "map-wsj.png": mapWsj,
  "map-hlj.png": mapHlj,
  "map-bz.png": mapBz,
  "map-sz.png": mapSz,
  "map-ysk.png": mapYsk,
  "map-pfk.png": mapPfk,
  "map-wsclc.png": mapWsclc,
  "map-dwdq.png": mapDwdq,
};

const iconOptions = [
  { label: "雨水井", value: "map-ysj.png", icon: mapYsj },
  { label: "污水井", value: "map-wsj.png", icon: mapWsj },
  { label: "合流井", value: "map-hlj.png", icon: mapHlj },
  { label: "泵站", value: "map-bz.png", icon: mapBz },
  { label: "水闸", value: "map-sz.png", icon: mapSz },
  { label: "雨水口", value: "map-ysk.png", icon: mapYsk },
  { label: "排放口", value: "map-pfk.png", icon: mapPfk },
  { label: "污水处理厂", value: "map-wsclc.png", icon: mapWsclc },
  { label: "低洼地区", value: "map-dwdq.png", icon: mapDwdq },
];

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

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "确认删除",
      content: "确定要删除该分类吗？如果该分类下有设施，可能会导致显示错误。",
      onOk: async () => {
        try {
          await deleteCategory(id);
          message.success("删除成功");
          fetchData();
        } catch (e) {
          console.error(e);
        }
      },
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        values.id = editingId;
      }
      await saveCategory(values);
      message.success("保存成功");
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "名称", dataIndex: "name" },
    { title: "中文别名", dataIndex: "alias" },
    {
      title: "图标",
      dataIndex: "icon",
      render: (icon: string) =>
        icon && iconMap[icon] ? (
          <img
            src={iconMap[icon]}
            alt="icon"
            style={{ width: 32, height: 32 }}
          />
        ) : null,
    },
    { title: "排序", dataIndex: "sortOrder" },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            删除
          </Button>
        </div>
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
          <Form.Item name="alias" label="中文别名" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="icon" label="图标">
            <Select placeholder="请选择图标" allowClear>
              {iconOptions.map((opt) => (
                <Select.Option key={opt.value} value={opt.value}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <img
                      src={opt.icon}
                      alt={opt.label}
                      style={{ width: 32, height: 32 }}
                    />
                    <span>{opt.label}</span>
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryPage;
