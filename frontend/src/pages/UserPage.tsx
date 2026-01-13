import React, { useState, useEffect } from "react";
import { Card, Table, Button, Form, Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { getUsers } from "../api/user";

const UserPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState("");

  const fetchData = async (current: number, size: number, keyword?: string) => {
    setLoading(true);
    try {
      const res: any = await getUsers({ current, size, keyword });
      setData(res.records);
      setPagination({
        current: res.current,
        pageSize: res.size,
        total: res.total,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  const handleTableChange = (pag: any) => {
    fetchData(pag.current, pag.pageSize, searchKeyword);
  };

  const handleSearch = (values: any) => {
    setSearchKeyword(values.keyword);
    fetchData(1, 10, values.keyword);
  };

  const columns: any[] = [
    { title: "ID", dataIndex: "id" },
    { title: "Username", dataIndex: "username" },
    { title: "Real Name", dataIndex: "realName" },
    {
      title: "Role",
      dataIndex: "roleType",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "blue" : "green"}>{role}</Tag>
      ),
    },
    { title: "Contact", dataIndex: "contact" },
    {
      title: "Status",
      dataIndex: "status",
      render: (val: number) =>
        val === 1 ? (
          <Tag color="success">Enabled</Tag>
        ) : (
          <Tag color="error">Disabled</Tag>
        ),
    },
  ];

  return (
    <Card
      title="User Management"
      extra={<Button type="primary">Add User</Button>}
    >
      <Form
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="keyword">
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search username/name"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default UserPage;
