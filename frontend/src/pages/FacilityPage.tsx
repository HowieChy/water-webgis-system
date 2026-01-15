import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  ConfigProvider,
  Tag,
  Modal,
  message,
  Pagination,
  Form,
  Input,
  Select,
} from "antd";
import { Plus } from "lucide-react";
import FacilityDialog from "./FacilityDialog";
import { getCategories, deleteFacility } from "../api/facility";
import request from "@/utils/request";

const FacilityPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<{ [key: string]: any }>({
    current: 1,
    size: 10,
    categoryId: null,
    keyword: null,
  });

  // Dialog state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [actionType, setActionType] = useState<"create" | "edit">("create");
  const [currentData, setCurrentData] = useState<any>(null);

  const [form] = Form.useForm();

  useEffect(() => {
    getCategories().then((res: any) => setCategories(res || []));
  }, []);

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {
        current: searchParams.current || 1,
        size: searchParams.size || 20,
      };
      if (searchParams.categoryId) {
        params.categoryId = searchParams.categoryId;
      }
      if (searchParams.keyword) {
        params.keyword = searchParams.keyword;
      }

      const res: any = await request.get("/facility/page", { params });
      setData(res.records || []);
      setTotal(res.total || 0);
    } catch (e) {
      console.error(e);
      message.error("获取设施列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteFacility(id);
      message.success("删除成功");
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = (values: any) => {
    setSearchParams({
      ...searchParams,
      current: 1,
      categoryId: values.categoryId || null,
      keyword: values.keyword || null,
    });
  };

  const handleReset = () => {
    form.resetFields();
    setSearchParams({
      current: 1,
      size: 20,
      categoryId: null,
      keyword: null,
    });
  };

  const columns = [
    { title: "名称", dataIndex: "name", width: 200 },
    { title: "编码", dataIndex: "code", width: 150 },
    { title: "地址", dataIndex: "address" },
    {
      title: "分类",
      dataIndex: "categoryId",
      width: 120,
      render: (id: number) => categories.find((c) => c.id === id)?.alias || id,
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      render: (status: string) => {
        let color = "success";
        let text = "正常";
        if (status === "Warning") {
          color = "warning";
          text = "告警";
        }
        if (status === "Error") {
          color = "error";
          text = "故障";
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      fixed: "right" as const,
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            type="link"
            size="small"
            onClick={() => {
              setCurrentData(record);
              setActionType("edit");
              setDialogVisible(true);
            }}
          >
            编辑
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: "确认删除",
                content: `确定要删除设施 "${record.name}" 吗?`,
                onOk: () => handleDelete(record.id),
              });
            }}
          >
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex h-full w-full flex-col">
      {/* Search Form */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <Form form={form} layout="inline" onFinish={handleSearch}>
          <Form.Item name="categoryId" label="设施分类">
            <Select
              placeholder="请选择分类"
              allowClear
              className="w-48"
              options={[
                { label: "全部分类", value: null },
                ...categories.map((cat) => ({
                  label: cat.alias,
                  value: cat.id,
                })),
              ]}
            />
          </Form.Item>
          <Form.Item name="keyword" label="名称">
            <Input placeholder="请输入名称" allowClear className="w-48" />
          </Form.Item>
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

      {/* Content */}
      <div className="flex flex-1 flex-col gap-4 rounded-[10px] bg-white p-5">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E2EBF6] pb-4">
          <div className="text-lg font-medium">设施管理</div>
          <ConfigProvider
            theme={{
              token: { colorPrimary: "#1A70F9" },
            }}
          >
            <Button
              type="primary"
              icon={<Plus className="size-4" />}
              onClick={() => {
                setActionType("create");
                setCurrentData(null);
                setDialogVisible(true);
              }}
            >
              新增设施
            </Button>
          </ConfigProvider>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ x: 1000 }}
          />
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#1A70F9",
              },
              components: {
                Pagination: {
                  itemActiveBg: "#F0F5FF",
                  borderRadius: 2,
                },
              },
            }}
          >
            {total > 0 && (
              <Pagination
                current={searchParams.current || 1}
                showTotal={(total) => (
                  <span className="text-sm text-[#1C2A32]">{`共${total}条`}</span>
                )}
                disabled={loading}
                pageSize={searchParams.size || 20}
                onChange={(page, pageSize) => {
                  setSearchParams({
                    ...searchParams,
                    current: page,
                    size: pageSize,
                  });
                }}
                showSizeChanger
                pageSizeOptions={["10", "20", "50", "100"]}
                size="small"
                total={total}
                className="[&_.ant-pagination-item-active]:border-none"
              />
            )}
          </ConfigProvider>
        </div>

        <FacilityDialog
          visible={dialogVisible}
          setVisible={setDialogVisible}
          actionType={actionType}
          currentData={currentData}
          onSuccess={fetchData}
        />
      </div>
    </div>
  );
};

export default FacilityPage;
