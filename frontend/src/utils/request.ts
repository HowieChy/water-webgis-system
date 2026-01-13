import axios from "axios";
import { message } from "antd";
import { useUserStore } from "../store/userStore";

const request = axios.create({
  baseURL: "http://localhost:8080", // Backend URL
  timeout: 10000,
});

request.interceptors.request.use(
  (config) => {
    const token = useUserStore.getState().token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      message.error(res.message || "Error");
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      message.error("Unauthorized, please login");
      useUserStore.getState().logout();
      window.location.href = "/login";
    } else {
      message.error(error.message || "Network Error");
    }
    return Promise.reject(error);
  }
);

export default request;
