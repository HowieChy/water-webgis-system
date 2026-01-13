import React, { useState } from "react";
import { Form, Input, Button, Card, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/userStore";
import { login } from "../api/auth";
import "./Login.css"; // We will create this simple CSS

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: userLogin } = useUserStore();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res: any = await login(values);
      userLogin(res.token, res.user);
      message.success("Login Successful");
      navigate("/");
    } catch (error) {
      // Error handled by request interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card title="Urban Water WebGIS System" className="login-card">
        <Form name="login" onFinish={onFinish} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your Username!" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username (admin)" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password (any)"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
