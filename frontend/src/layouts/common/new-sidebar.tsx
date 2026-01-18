import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfigProvider, Menu } from "antd";
import type { MenuProps } from "antd";
import {
  DashboardOutlined,
  DatabaseOutlined,
  BarChartOutlined,
  AuditOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Droplets } from "lucide-react";

type MenuItem = Required<MenuProps>["items"][number];

/**
 * 扁平化菜单项
 */
const flattenMenuItems = (
  items: MenuItem[]
): Array<{ key: string; parentKey?: string }> => {
  const result: Array<{ key: string; parentKey?: string }> = [];

  items.forEach((item: any) => {
    if (item?.key) {
      result.push({ key: item.key });

      if (item.children && Array.isArray(item.children)) {
        item.children.forEach((child: any) => {
          if (child?.key) {
            result.push({ key: child.key, parentKey: item.key });
          }
        });
      }
    }
  });

  return result;
};

/**
 * 从路径中查找匹配的菜单项
 */
const findMatchingKey = (
  pathname: string,
  flatItems: Array<{ key: string; parentKey?: string }>
): string | null => {
  const segments = pathname.split("/").filter(Boolean);

  for (let i = segments.length - 1; i >= 0; i--) {
    const segment = segments[i];
    const exactMatch = flatItems.find((item) => item.key === segment);
    if (exactMatch) {
      return exactMatch.key;
    }
  }

  return null;
};

import { useUserStore } from "@/store/userStore";

// ... existing imports

export default function NewSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const userInfo = useUserStore((state) => state.userInfo);
  const isAdmin = userInfo?.roleType === "ADMIN";

  // 菜单配置
  const menuItems: MenuItem[] = useMemo(() => {
    const items: MenuItem[] = [
      {
        key: "dashboard",
        label: <Link to="/">一张图 (WebGIS)</Link>,
        icon: <DashboardOutlined />,
      },
      {
        key: "monitor",
        label: <Link to="/monitor/history">监测中心</Link>,
        icon: <BarChartOutlined />,
      },
    ];

    if (isAdmin) {
      items.push(
        {
          key: "resource-manage",
          label: "资源管理",
          icon: <DatabaseOutlined />,
          children: [
            {
              key: "facility",
              label: <Link to="/resource/facility">设施管理</Link>,
            },
            {
              key: "category",
              label: <Link to="/resource/category">分类管理</Link>,
            },
          ],
        },
        {
          key: "system-manage",
          label: "系统管理",
          icon: <AuditOutlined />,
          children: [
            {
              key: "user",
              label: <Link to="/system/user">用户管理</Link>,
            },
            {
              key: "log",
              label: <Link to="/system/log">日志审计</Link>,
            },
          ],
        }
      );
    }
    return items;
  }, [isAdmin]);

  // 计算当前选中的菜单项
  const selectedKey = useMemo(() => {
    const flatItems = flattenMenuItems(menuItems);
    const matchedKey = findMatchingKey(location.pathname, flatItems);
    return matchedKey || "";
  }, [location.pathname, menuItems]);

  // 初始化和更新 openKeys
  useEffect(() => {
    const flatItems = flattenMenuItems(menuItems);
    const matchedKey = findMatchingKey(location.pathname, flatItems);
    const newOpenKeys: string[] = [];

    if (matchedKey) {
      const matchedItem = flatItems.find((item) => item.key === matchedKey);
      if (matchedItem?.parentKey) {
        newOpenKeys.push(matchedItem.parentKey);
      }
    }

    setOpenKeys(newOpenKeys);
  }, [location.pathname, menuItems]);

  // 子菜单展开/收起处理
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // Logo 点击处理
  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1A70F9",
        },
        components: {
          Menu: {
            colorText: "#fff",
            itemSelectedBg: "#1a70f9",
            itemSelectedColor: "#fff",
            itemBorderRadius: 4,
            itemActiveBg: "#031d4073",
          },
        },
      }}
    >
      <div className="group flex h-screen w-[256px] flex-col bg-gradient-to-b from-[#001529] to-[#002140] text-white">
        {/* Header */}
        <div
          className="flex h-[68px] cursor-pointer items-center justify-center gap-2 transition-opacity hover:opacity-90 border-b border-gray-700"
          onClick={handleLogoClick}
        >
          <Droplets className="size-5 text-white" />
          <span className="font-semibold text-lg">城市水务 WebGIS</span>
        </div>

        {/* Menu */}
        <ScrollArea className="h-full w-full px-5 py-3">
          <Menu
            className="bg-transparent! [&_.ant-menu-item-only-child]:pl-[55px]! [&_.ant-menu-submenu-selected>.ant-menu-submenu-title]:text-white! w-[212px] select-none"
            selectedKeys={[selectedKey]}
            openKeys={openKeys}
            onOpenChange={handleOpenChange}
            mode="inline"
            items={menuItems}
          />
        </ScrollArea>
      </div>
    </ConfigProvider>
  );
}
