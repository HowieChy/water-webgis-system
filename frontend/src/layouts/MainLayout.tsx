import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  DashboardOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  AuditOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useUserStore } from "../store/userStore";

const { Header, Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: "一张图 (WebGIS)",
    },
    {
      key: "/monitor/history",
      icon: <BarChartOutlined />,
      label: "监测中心",
    },
    {
      key: "resource-manage",
      icon: <DatabaseOutlined />,
      label: "资源管理",
      children: [
        { key: "/resource/facility", label: "设施管理" },
        { key: "/resource/category", label: "分类管理" },
      ],
    },
    {
      key: "system-manage",
      icon: <AuditOutlined />,
      label: "系统管理",
      children: [
        {
          key: "/system/user",
          icon: <TeamOutlined />,
          label: "用户管理",
        },
        { key: "/system/log", label: "日志审计" },
      ],
    },
  ];

  const onMenuClick = (e: any) => {
    navigate(e.key);
  };

  // Determine selected keys based on current path
  const selectedKeys = [location.pathname];
  const openKeys = ["resource-manage", "system-manage"];

  return (
    <Layout style={{ height: "100vh" }}>
      <Sider trigger={null} collapsible collapsed={collapsed} width={240}>
        <div
          className="logo"
          style={{
            height: 64,
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          {collapsed ? "WebGIS" : "城市水务 WebGIS 系统"}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultOpenKeys={openKeys}
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={onMenuClick}
        />
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}

          <div style={{ display: "flex", alignItems: "center" }}>
            <span style={{ marginRight: 16 }}>
              欢迎, {userInfo?.realName || userInfo?.username || "用户"}
            </span>
            <Button type="link" onClick={handleLogout}>
              退出登录
            </Button>
          </div>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#fff",
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
