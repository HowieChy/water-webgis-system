import React, { useState, useEffect } from "react";
import { Table, Button, ConfigProvider, Tag, Modal, message } from "antd";
import { Plus, Trash2 } from "lucide-react";
import SearchForm from "../components/SearchForm";
import FacilityDialog from "./FacilityDialog";
import { getFacilities, getCategories, deleteFacility } from "../api/facility";

const FacilityPage: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Dialog state
  const [dialogVisible, setDialogVisible] = useState(false);
  const [actionType, setActionType] = useState<"create" | "edit">("create");
  const [currentData, setCurrentData] = useState<any>(null);

  useEffect(() => {
    fetchData();
    getCategories().then((res: any) => setCategories(res || []));
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await getFacilities();
      setData(res || []);
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

  const columns = [
    { title: "名称", dataIndex: "name" },
    { title: "编码", dataIndex: "code" },
    { title: "地址", dataIndex: "address" },
    {
      title: "分类",
      dataIndex: "categoryId",
      render: (id: number) => categories.find((c) => c.id === id)?.alias || id,
    },
    {
      title: "状态",
      dataIndex: "status",
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

  // 简单的搜索配置 (目前后端API还没改分页搜索,这里做个 UI 占位,实际搜索可能需要前端过滤或后端升级)
  const searchColumns = [
    { title: "名称", dataIndex: "name", search: true },
    { title: "编码", dataIndex: "code", search: true },
  ];

  return (
    <div className="flex h-full w-full flex-col">
      <SearchForm
        columns={searchColumns}
        onSearch={() => message.info("搜索功能待后端接口升级")}
        onReset={() => fetchData()}
      />

      <div className="mt-4">
        <ConfigProvider
          theme={{
            token: { colorPrimary: "#0d6ce4" },
            components: { Button: { borderRadius: 2 } },
          }}
        >
          <div className="mb-4 flex gap-4">
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
            {/* 批量删除预留 */}
            {/* <Button danger icon={<Trash2 className="size-4" />}>删除</Button> */}
          </div>

          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            loading={loading}
          />

          <FacilityDialog
            visible={dialogVisible}
            setVisible={setDialogVisible}
            actionType={actionType}
            currentData={currentData}
            onSuccess={fetchData}
          />
        </ConfigProvider>
      </div>
    </div>
  );
};

export default FacilityPage;
