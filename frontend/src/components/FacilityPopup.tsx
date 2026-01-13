import React, { useEffect, useRef } from "react";
import Overlay from "ol/Overlay";
import Map from "ol/Map";
import { Card, Descriptions, Button } from "antd";
import { CloseOutlined, LineChartOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

interface Props {
  feature: any;
  position: [number, number];
  map: Map | null;
  onClose: () => void;
}

const FacilityPopup: React.FC<Props> = ({
  feature,
  position,
  map,
  onClose,
}) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<Overlay | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!map || !popupRef.current) return;

    overlayRef.current = new Overlay({
      element: popupRef.current,
      autoPan: {
        animation: {
          duration: 250,
        },
      },
    });

    map.addOverlay(overlayRef.current);
    overlayRef.current.setPosition(position);

    return () => {
      if (map && overlayRef.current) {
        map.removeOverlay(overlayRef.current);
      }
    };
  }, [map, position]);

  const handleViewHistory = () => {
    navigate(`/monitor/history?facilityId=${feature.id}`);
  };

  return (
    <div
      ref={popupRef}
      style={{
        position: "absolute",
        backgroundColor: "white",
        padding: 0,
        borderRadius: 4,
        minWidth: 250,
      }}
    >
      <Card
        size="small"
        title={feature.name}
        extra={<CloseOutlined onClick={onClose} />}
        actions={[
          <Button
            type="link"
            icon={<LineChartOutlined />}
            onClick={handleViewHistory}
          >
            查看历史
          </Button>,
        ]}
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label="编码">{feature.code}</Descriptions.Item>
          <Descriptions.Item label="地址">{feature.address}</Descriptions.Item>
          <Descriptions.Item label="状态">{feature.status}</Descriptions.Item>
          <Descriptions.Item label="分类ID">
            {feature.category_id}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default FacilityPopup;
