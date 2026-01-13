import React, { useState, useEffect } from "react";
import { Button, Table, Tag, Modal, message, ConfigProvider } from "antd";
import { Plus, Trash2 } from "lucide-react";
import SearchForm from "../components/SearchForm";
import UserDialog from "./UserDialog";
import { getUsers, deleteUser, batchDeleteUsers } from "../api/user";

/**
 * 用户管理页面
 * 系统管理员可以管理所有用户账号
 */
const UserPage: React.FC = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchParams, setSearchParams] = useState({
    pageNum: 1,
    pageSize: 10,
    username: "",
    realName: "",
  });

  // 对话框状态
  const [dialogVisible, setDialogVisible] = useState(false);
  const [actionType, setActionType] = useState<"create" | "edit">("create");
  const [currentData, setCurrentData] = useState<any>(null);

  // 分页信息
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取用户列表
  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await getUsers(searchParams);
      setData(res.records || []);
      setPagination({
        current: res.current || 1,
        pageSize: res.size || 10,
        total: res.total || 0,
      });
    } catch (e) {
      console.error(e);
      message.error("获取用户列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  // 搜索表单配置
  const searchColumns = [
    {
      title: "用户名",
      dataIndex: "username",
      search: true,
    },
    {
      title: "真实姓名",
      dataIndex: "realName",
      search: true,
    },
  ];

  // 表格列配置
  const tableColumns: any[] = [
    {
      title: "序号",
      dataIndex: "index",
      width: 60,
      render: (_: any, __: any, index: number) =>
        (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "真实姓名",
      dataIndex: "realName",
    },
    {
      title: "角色",
      dataIndex: "roleType",
      render: (role: string) => (
        <Tag color={role === "ADMIN" ? "blue" : "green"}>
          {role === "ADMIN" ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "联系方式",
      dataIndex: "contact",
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (val: number) =>
        val === 1 ? (
          <Tag color="success">启用</Tag>
        ) : (
          <Tag color="error">禁用</Tag>
        ),
    },
    {
      title: "操作",
      dataIndex: "action",
      fixed: "right" as const,
      width: 180,
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
            修改
          </Button>
          <Button
            type="link"
            size="small"
            danger
            onClick={() => {
              Modal.confirm({
                title: "确认删除",
                content: `确定要删除用户 "${record.username}" 吗?`,
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

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams({
      ...searchParams,
      ...values,
      pageNum: 1,
    });
  };

  // 处理重置
  const handleReset = () => {
    setSearchParams({
      pageNum: 1,
      pageSize: 10,
      username: "",
      realName: "",
    });
  };

  // 处理删除
  const handleDelete = async (id: number) => {
    try {
      await deleteUser(id);
      message.success("删除成功");
      fetchData();
    } catch (error) {
      message.error("删除失败");
    }
  };

  // 处理批量删除
  const handleBatchDelete = () => {
    Modal.confirm({
      title: "确认删除",
      content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗?`,
      onOk: async () => {
        try {
          await batchDeleteUsers(selectedRowKeys as number[]);
          message.success("批量删除成功");
          setSelectedRowKeys([]);
          fetchData();
        } catch (error) {
          message.error("批量删除失败");
        }
      },
    });
  };

  return (
    <>
      {/* 搜索表单 */}
      <SearchForm
        columns={searchColumns}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      {/* 表格 */}
      <div className="mt-4 bg-white p-4 rounded-lg shadow-sm">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#0d6ce4",
            },
            components: {
              Button: {
                borderRadius: 2,
              },
            },
          }}
        >
          {/* 工具栏 */}
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
              添加
            </Button>
            <Button
              danger
              disabled={selectedRowKeys.length === 0}
              icon={<Trash2 className="size-4" />}
              onClick={handleBatchDelete}
            >
              删除
            </Button>
          </div>

          {/* 表格 */}
          <Table
            columns={tableColumns}
            dataSource={data}
            rowKey="id"
            loading={loading}
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys),
            }}
            pagination={{
              current: searchParams.pageNum,
              pageSize: searchParams.pageSize,
              total: pagination.total,
              showTotal: (total) => `共 ${total} 条`,
              onChange: (page, pageSize) =>
                setSearchParams({
                  ...searchParams,
                  pageNum: page,
                  pageSize: pageSize,
                }),
            }}
          />

          {/* 用户对话框 */}
          <UserDialog
            visible={dialogVisible}
            setVisible={setDialogVisible}
            actionType={actionType}
            currentData={currentData}
            onSuccess={fetchData}
          />
        </ConfigProvider>
      </div>
    </>
  );
};

export default UserPage;
