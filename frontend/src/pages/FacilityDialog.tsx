import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, message, Button, Row, Col } from "antd";
import { EnvironmentOutlined } from "@ant-design/icons";
import { createFacility, updateFacility, getCategories } from "../api/facility";
import MapPicker from "../components/MapPicker";

interface FacilityDialogProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  actionType: "create" | "edit";
  currentData: any;
  onSuccess: () => void;
}

const FacilityDialog: React.FC<FacilityDialogProps> = ({
  visible,
  setVisible,
  actionType,
  currentData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<any[]>([]);
  const [mapPickerVisible, setMapPickerVisible] = useState(false);

  useEffect(() => {
    // 加载分类数据
    getCategories().then((res: any) => setCategories(res || []));
  }, []);

  useEffect(() => {
    if (visible) {
      if (actionType === "edit" && currentData) {
        // 解析 GeoJSON 获取经纬度 (假设是 Point 类型)
        let lng = undefined;
        let lat = undefined;
        try {
          if (currentData.geomJson) {
            const geoJson = JSON.parse(currentData.geomJson);
            if (geoJson.type === "Point" && geoJson.coordinates) {
              lng = geoJson.coordinates[0];
              lat = geoJson.coordinates[1];
            }
          }
        } catch (e) {
          console.error("GeoJSON parse error", e);
        }

        form.setFieldsValue({
          ...currentData,
          coords:
            lng !== undefined && lat !== undefined
              ? `${lng}, ${lat}`
              : undefined,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, actionType, currentData, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // 将经纬度转换为 GeoJSON
      if (values.coords) {
        const [lng, lat] = values.coords
          .split(",")
          .map((v: string) => Number(v.trim()));
        if (!isNaN(lng) && !isNaN(lat)) {
          const point = {
            type: "Point",
            coordinates: [lng, lat],
          };
          values.geomJson = JSON.stringify(point);
        }
      }

      // 清理临时字段
      const { coords, ...submitData } = values;
      // 确保 geomJson 存在
      submitData.geomJson = values.geomJson;

      if (actionType === "create") {
        await createFacility(submitData);
      } else {
        await updateFacility(currentData.id, submitData);
      }

      message.success(actionType === "create" ? "创建成功" : "更新成功");
      setVisible(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      // message.error 由请求拦截器统一处理,或者在这里处理
    }
  };

  const onMapPicked = (lng: number, lat: number) => {
    form.setFieldsValue({
      coords: `${lng.toFixed(6)}, ${lat.toFixed(6)}`,
    });
    setMapPickerVisible(false);
  };

  return (
    <>
      <Modal
        title={actionType === "create" ? "新增设施" : "编辑设施"}
        open={visible}
        onOk={handleOk}
        onCancel={() => setVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="name" label="名称" rules={[{ required: true }]}>
                <Input placeholder="请输入设施名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="code" label="编码" rules={[{ required: true }]}>
                <Input
                  placeholder="请输入唯一编码"
                  disabled={actionType === "edit"}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="categoryId"
                label="分类"
                rules={[{ required: true, message: "请选择分类" }]}
              >
                <Select placeholder="请选择分类">
                  {categories.map((c) => (
                    <Select.Option key={c.id} value={c.id}>
                      {c.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="状态" initialValue="Normal">
                <Select>
                  <Select.Option value="Normal">正常</Select.Option>
                  <Select.Option value="Warning">告警</Select.Option>
                  <Select.Option value="Error">故障</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="address" label="地址">
            <Input placeholder="请输入地址" />
          </Form.Item>

          {/* 坐标选择区域 */}

          <Row gutter={16} align="middle">
            <Col span={20}>
              <Form.Item name="coords" label="经纬度">
                <Input placeholder="请选择点或输入 (格式: 经度, 纬度)" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Button
                type="primary"
                ghost
                icon={<EnvironmentOutlined />}
                onClick={() => setMapPickerVisible(true)}
                className="mt-1"
                style={{ width: "100%" }}
              >
                选点
              </Button>
            </Col>
          </Row>

          {/* 隐藏的 GeoJSON 字段,用于兼容 */}
          <Form.Item name="geomJson" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* 地图选点组件 */}
      <MapPicker
        visible={mapPickerVisible}
        onCancel={() => setMapPickerVisible(false)}
        onOk={onMapPicked}
        initialValue={(() => {
          const coords = form.getFieldValue("coords");
          if (coords) {
            const [lng, lat] = coords
              .split(",")
              .map((v: string) => Number(v.trim()));
            if (!isNaN(lng) && !isNaN(lat)) {
              return { lng, lat };
            }
          }
          return undefined;
        })()}
      />
    </>
  );
};

export default FacilityDialog;
