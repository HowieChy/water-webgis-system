import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { createUser, updateUser } from "../api/user";

interface UserDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  actionType: "create" | "edit";
  currentData: any;
  onSuccess: () => void;
}

/**
 * 用户新增/编辑对话框
 */
const UserDialog: React.FC<UserDialogProps> = ({
  visible,
  setVisible,
  actionType,
  currentData,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  // 当对话框打开时,如果是编辑模式则填充表单
  useEffect(() => {
    if (visible && actionType === "edit" && currentData) {
      form.setFieldsValue({
        username: currentData.username,
        realName: currentData.realName,
        roleType: currentData.roleType,
        contact: currentData.contact,
        status: currentData.status,
      });
    } else if (visible && actionType === "create") {
      form.resetFields();
    }
  }, [visible, actionType, currentData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (actionType === "create") {
        await createUser(values);
      } else {
        await updateUser(currentData.id, values);
      }

      message.success(actionType === "create" ? "创建成功" : "更新成功");
      setVisible(false);
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Operation failed:", error);
      message.error(actionType === "create" ? "创建失败" : "更新失败");
    }
  };

  const handleCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  return (
    <Modal
      title={actionType === "create" ? "新增用户" : "编辑用户"}
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      width={600}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: "请输入用户名" },
            { min: 3, max: 50, message: "用户名长度为 3-50 个字符" },
          ]}
        >
          <Input
            placeholder="请输入用户名"
            disabled={actionType === "edit"} // 编辑时不允许修改用户名
          />
        </Form.Item>

        {actionType === "create" && (
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少 6 个字符" },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        <Form.Item
          label="真实姓名"
          name="realName"
          rules={[{ required: true, message: "请输入真实姓名" }]}
        >
          <Input placeholder="请输入真实姓名" />
        </Form.Item>

        <Form.Item
          label="角色"
          name="roleType"
          rules={[{ required: true, message: "请选择角色" }]}
        >
          <Select placeholder="请选择角色">
            <Select.Option value="ADMIN">管理员</Select.Option>
            <Select.Option value="USER">普通用户</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="联系方式" name="contact">
          <Input placeholder="请输入联系方式" />
        </Form.Item>

        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: "请选择状态" }]}
          initialValue={1}
        >
          <Select placeholder="请选择状态">
            <Select.Option value={1}>启用</Select.Option>
            <Select.Option value={0}>禁用</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserDialog;
