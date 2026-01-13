import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { login } from "../api/auth";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: userLogin } = useUserStore();
  const [loading, setLoading] = useState(false);
  const [captchaUrl, setCaptchaUrl] = useState<string>(""); // 验证码图片 URL

  // 组件挂载时加载验证码
  useEffect(() => {
    console.log("refreshCaptcha");
    refreshCaptcha();
  }, []);

  // 刷新验证码:添加时间戳防止缓存
  const refreshCaptcha = () => {
    setCaptchaUrl(`/api/captcha/generate?t=${Date.now()}`);
  };

  // 处理登录表单提交
  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await login(values); // 调用登录 API
      userLogin(res.token, res.user); // 保存 Token 和用户信息
      message.success("登录成功");
      navigate("/"); // 跳转到首页
    } catch (error) {
      // 错误已在 request 拦截器中处理
      refreshCaptcha(); // 登录失败后刷新验证码
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0 bg-gray-100">
      <div className="relative h-full flex-col p-10 text-white lg:flex justify-between dark:border-r hidden bg-zinc-900">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{
            backgroundImage: "url('/assets/login_bg_placeholder.jpg')",
            backgroundColor: "#18181b",
          }}
        />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            className="mr-2 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
            />
          </svg>
          城市水务 WebGIS 系统
        </div>
        <div className="relative z-20 mt-auto w-full text-center">
          <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-[4rem] font-extrabold leading-none text-transparent">
            Smart Water
          </span>
          <br />
          <span className="bg-gradient-to-b from-white to-gray-400 bg-clip-text text-[2.5rem] font-extrabold leading-none text-transparent">
            Digital Twin & GIS
          </span>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">"智慧赋能水务，科技守护城市脉搏。"</p>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center justify-center p-4 lg:p-8 bg-white">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">账户登录</h1>
            <p className="text-sm text-gray-500">请输入您的账户密码与验证码</p>
          </div>

          <Form
            name="login"
            onFinish={onFinish}
            size="large"
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: "请输入用户名!" }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="用户名"
                className="rounded-md"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "请输入密码!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-gray-400" />}
                placeholder="密码"
                className="rounded-md"
              />
            </Form.Item>
            <div className="flex gap-2">
              <Form.Item
                name="code"
                rules={[{ required: true, message: "请输入验证码!" }]}
                className="flex-1 mb-6"
              >
                <Input
                  prefix={
                    <SafetyCertificateOutlined className="text-gray-400" />
                  }
                  placeholder="验证码"
                  className="rounded-md"
                />
              </Form.Item>
              <div
                className="h-10 w-32 cursor-pointer border rounded flex items-center justify-center overflow-hidden bg-gray-50 bg-cover"
                onClick={refreshCaptcha}
                title="点击刷新验证码"
              >
                {captchaUrl && (
                  <img
                    src={captchaUrl}
                    alt="验证码"
                    className="h-full w-full"
                  />
                )}
              </div>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={loading}
                className="w-full bg-black hover:bg-gray-800 border-none h-10 rounded-md"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <p className="px-8 text-center text-sm text-gray-500">
            登录即代表您已同意
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              服务条款
            </a>
            和
            <a
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              隐私政策
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
