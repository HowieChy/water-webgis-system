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
    const op = values.operation;
    setSearchOp(op);
    fetchData(1, 10, op);
  };

  const columns = [
    { title: "日志ID", dataIndex: "id", width: 80, align: "center" as const },
    {
      title: "系统用户ID",
      dataIndex: "userId",
      width: 100,
      align: "center" as const,
    },
    { title: "操作类型", dataIndex: "operation" },
    {
      title: "操作方法名",
      dataIndex: "method",
      ellipsis: true,
      render: (text: string) => (
        <span className="text-gray-500 font-mono text-xs" title={text}>
          {text}
        </span>
      ),
    },
    { title: "请求IP地址", dataIndex: "ipAddr", width: 140 },
    {
      title: "记录生成时间",
      dataIndex: "createTime",
      width: 180,
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm:ss"),
    },
  ];

  return (
    <Card
      title="系统日志审计"
      className="shadow-sm"
      extra={
        <span className="text-gray-400 text-xs">
          共 {pagination.total} 条记录
        </span>
      }
    >
      <Form
        layout="inline"
        onFinish={handleSearch}
        style={{ marginBottom: 16 }}
      >
        <Form.Item name="operation" label="关键词">
          <Input
            prefix={<SearchOutlined className="text-gray-400" />}
            placeholder="搜索操作类型或方法名"
            allowClear
            style={{ width: 240 }}
          />
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
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        loading={loading}
        onChange={handleTableChange}
        size="middle"
        bordered
      />
    </Card>
  );
};

export default LogPage;
