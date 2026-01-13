import { Outlet, useNavigate } from "react-router-dom";
import NewSidebar from "./new-sidebar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useUserStore } from "@/store/userStore";
import { Button } from "antd";

/**
 * 通用布局组件
 * 参考 drainage-ui 的布局结构
 */
export default function CommonLayout() {
  const navigate = useNavigate();
  const { userInfo, logout } = useUserStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex  h-screen flex-col overflow-x-hidden">
      <div className="grow">
        <div className="flex flex-row">
          {/* 侧边栏 */}
          <div className="flex-none">
            <NewSidebar />
          </div>

          {/* 主内容区 */}
          <main className="grow bg-[#F5FAFF] h-screen font-sans ">
            {/* Header 区域 */}
            <div className="flex-none h-[68px] bg-gradient-to-r from-white to-blue-50 border-b border-gray-200 px-6 flex items-center justify-between shadow-sm">
              <div className="text-xl font-semibold text-gray-800">
                {/* 城市水务 WebGIS 系统 */}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-gray-700">
                  欢迎, {userInfo?.realName || userInfo?.username || "用户"}
                </span>
                <Button type="link" onClick={handleLogout}>
                  退出登录
                </Button>
              </div>
            </div>

            {/* 内容滚动区 */}
            <ScrollArea className="h-[calc(100vh-68px)] p-4 [&>div>div]:h-full!">
              <Outlet />
              <ScrollBar orientation="vertical" />
            </ScrollArea>
          </main>
        </div>
      </div>
    </div>
  );
}
