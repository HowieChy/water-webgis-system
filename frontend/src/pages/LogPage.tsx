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
    { title: "用户ID", dataIndex: "userId" },
    { title: "操作内容", dataIndex: "operation" },
    { title: "请求方法", dataIndex: "method", ellipsis: true },
    { title: "IP地址", dataIndex: "ipAddr" },
    {
      title: "操作时间",
      dataIndex: "createTime",
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <Card title="系统日志审计">
      <Form
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="operation">
          <Input prefix={<SearchOutlined />} placeholder="搜索操作内容" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            查询
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
