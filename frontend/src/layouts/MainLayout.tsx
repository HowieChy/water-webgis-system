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
      label: "One Map (WebGIS)",
    },
    {
      key: "/monitor/history",
      icon: <BarChartOutlined />,
      label: "Monitoring Center",
    },
    {
      key: "resource-manage",
      icon: <DatabaseOutlined />,
      label: "Resource Management",
      children: [
        { key: "/resource/facility", label: "Facility Management" },
        { key: "/resource/category", label: "Category Management" },
      ],
    },
    {
      key: "system-manage",
      icon: <AuditOutlined />,
      label: "System Management",
      children: [
        {
          key: "/system/user",
          icon: <TeamOutlined />,
          label: "User Management",
        },
        { key: "/system/log", label: "Log Audit" },
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
          {collapsed ? "WebGIS" : "Water WebGIS System"}
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
              Welcome, {userInfo?.realName || userInfo?.username || "User"}
            </span>
            <Button type="link" onClick={handleLogout}>
              Logout
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
