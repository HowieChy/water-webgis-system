import axios from "axios";
import { message } from "antd";
import { useUserStore } from "../store/userStore";

// 创建 axios 实例,配置基础 URL 和超时时间
const request = axios.create({
  baseURL: "http://localhost:8080", // 后端服务器地址
  timeout: 10000, // 请求超时时间 10 秒
  withCredentials: true, // 允许携带 Cookie,用于 Session 验证码功能
});

// 请求拦截器:在发送请求前添加 JWT Token
request.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      // 如果存在 Token,添加到请求头
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器:统一处理响应和错误
request.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 如果响应码不是 200,显示错误消息
    if (res.code !== 200) {
      message.error(res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    }
    // 返回响应数据
    return res.data;
  },
  (error) => {
    // 处理 401 未授权错误
    if (error.response && error.response.status === 401) {
      message.error("Unauthorized, please login");
      useUserStore.getState().logout(); // 清除用户状态
      window.location.href = "/login"; // 跳转到登录页
    } else {
      message.error(error.message || "Network Error");
    }
    return Promise.reject(error);
  }
);

export default request;
