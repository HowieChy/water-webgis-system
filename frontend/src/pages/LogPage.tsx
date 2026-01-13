import React, { useState, useEffect } from "react";
import { Card, Table, Form, Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import request from "../utils/request";
import dayjs from "dayjs";

const LogPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchOp, setSearchOp] = useState("");

  const fetchData = async (
    current: number,
    size: number,
    operation?: string
  ) => {
    setLoading(true);
    try {
      const res: any = await request.get("/sys/log/list", {
        params: { current, size, operation },
      });
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
    fetchData(pag.current, pag.pageSize, searchOp);
  };

  const handleSearch = (values: any) => {
    setSearchOp(values.operation);
    fetchData(1, 10, values.operation);
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "User ID", dataIndex: "userId" },
    { title: "Operation", dataIndex: "operation" },
    { title: "Method", dataIndex: "method", ellipsis: true },
    { title: "IP Address", dataIndex: "ipAddr" },
    {
      title: "Time",
      dataIndex: "createTime",
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <Card title="System Log Audit">
      <Form
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="operation">
          <Input prefix={<SearchOutlined />} placeholder="Search operation" />
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

export default LogPage;
