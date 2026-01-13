import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import { useUserStore } from "./store/userStore";

import MapPage from "./pages/MapPage";
import HistoryPage from "./pages/HistoryPage";

// Placeholders for other pages
import UserPage from "./pages/UserPage";
import FacilityPage from "./pages/FacilityPage";
import CategoryPage from "./pages/CategoryPage";

import LogPage from "./pages/LogPage";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useUserStore((state) => state.token);
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MapPage />} />
          <Route path="/monitor/history" element={<HistoryPage />} />
          <Route path="/resource/facility" element={<FacilityPage />} />
          <Route path="/resource/category" element={<CategoryPage />} />
          <Route path="/system/user" element={<UserPage />} />
          <Route path="/system/log" element={<LogPage />} />
          <Route path="*" element={<div>404 Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
