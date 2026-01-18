import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CommonLayout from "./layouts/common";
import Login from "./pages/Login";
import { useUserStore } from "./store/userStore";

import MapPage from "./pages/MapPage";
import HistoryPage from "./pages/HistoryPage";

// Placeholders for other pages
import UserPage from "./pages/UserPage";
import FacilityPage from "./pages/FacilityPage";
import CategoryPage from "./pages/CategoryPage";

import LogPage from "./pages/LogPage";

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const token = useUserStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Role guard component
const RoleRoute = ({ children }: { children: React.ReactElement }) => {
  const userInfo = useUserStore((state) => state.userInfo);
  // Assuming "ADMIN" is the role for administrators
  if (userInfo?.roleType !== "ADMIN") {
    return <Navigate to="/" replace />;
  }
  return children;
};

import { ConfigProvider } from "antd";
import zhCN from "antd/locale/zh_CN";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";

dayjs.locale("zh-cn");

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <CommonLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MapPage />} />
            <Route path="/monitor/history" element={<HistoryPage />} />

            {/* Admin only routes */}
            <Route
              path="/resource/facility"
              element={
                <RoleRoute>
                  <FacilityPage />
                </RoleRoute>
              }
            />
            <Route
              path="/resource/category"
              element={
                <RoleRoute>
                  <CategoryPage />
                </RoleRoute>
              }
            />
            <Route
              path="/system/user"
              element={
                <RoleRoute>
                  <UserPage />
                </RoleRoute>
              }
            />
            <Route
              path="/system/log"
              element={
                <RoleRoute>
                  <LogPage />
                </RoleRoute>
              }
            />

            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
