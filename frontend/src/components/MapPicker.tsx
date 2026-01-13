import React, { useEffect, useRef, useState } from "react";
import { message, Modal } from "antd";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Style, Icon } from "ol/style";

// 天地图 Key (建议替换为自己的 Key)
const TK = "026750369f36c001c8d3ae9352e3857b";

interface MapPickerProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (lng: number, lat: number) => void;
  initialValue?: { lng: number; lat: number };
}

/**
 * 地图选点组件 (OpenLayers + Tianditu)
 */
const MapPicker: React.FC<MapPickerProps> = ({
  visible,
  onCancel,
  onOk,
  initialValue,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource | null>(null);

  const [selectedCoord, setSelectedCoord] = useState<{
    lng: number;
    lat: number;
  } | null>(initialValue || null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        initMap();
      }, 100);
    } else {
      destroyMap();
    }

    return () => {
      destroyMap();
    };
  }, [visible]);

  // 更新 Marker 和选中状态
  useEffect(() => {
    if (visible && initialValue) {
      setSelectedCoord(initialValue);
      updateMarker([initialValue.lng, initialValue.lat]);
      if (mapRef.current) {
        mapRef.current
          .getView()
          .setCenter(fromLonLat([initialValue.lng, initialValue.lat]));
      }
    } else if (visible && !initialValue) {
      setSelectedCoord(null);
      if (vectorSourceRef.current) {
        vectorSourceRef.current.clear();
      }
    }
  }, [initialValue, visible]);

  const initMap = () => {
    if (mapRef.current) return;

    // 天地图底图
    const vecLayer = new TileLayer({
      source: new XYZ({
        url: `http://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TK}`,
      }),
    });

    // 天地图注记
    const cvaLayer = new TileLayer({
      source: new XYZ({
        url: `http://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TK}`,
      }),
    });

    // 矢量层 (用于显示 Marker)
    const vectorSource = new VectorSource();
    vectorSourceRef.current = vectorSource;
    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1], //底部中心
          src: "https://webapi.amap.com/theme/v1.3/markers/n/mark_bs.png", // 使用高德的图标或者本地图标
          scale: 1,
        }),
      }),
    });

    const map = new Map({
      target: mapContainerRef.current!,
      layers: [vecLayer, cvaLayer, vectorLayer],
      view: new View({
        center: fromLonLat([121.55, 29.88]), // 默认中心点: 宁波
        zoom: 12,
        minZoom: 1,
        maxZoom: 18,
      }),
    });

    mapRef.current = map;

    // 如果有初始值,初始化 Marker
    if (initialValue) {
      updateMarker([initialValue.lng, initialValue.lat]);
      map.getView().setCenter(fromLonLat([initialValue.lng, initialValue.lat]));
    }

    // 点击事件
    map.on("click", (e) => {
      const coord = toLonLat(e.coordinate);
      const lng = coord[0];
      const lat = coord[1];

      setSelectedCoord({ lng, lat });
      updateMarker([lng, lat]);
    });
  };

  const updateMarker = (coord: [number, number]) => {
    if (!vectorSourceRef.current) return;

    vectorSourceRef.current.clear();
    const feature = new Feature({
      geometry: new Point(fromLonLat(coord)),
    });
    vectorSourceRef.current.addFeature(feature);
  };

  const destroyMap = () => {
    if (mapRef.current) {
      mapRef.current.setTarget(undefined);
      mapRef.current = null;
    }
  };

  const handleOk = () => {
    if (selectedCoord) {
      onOk(selectedCoord.lng, selectedCoord.lat);
    } else {
      message.warning("请先在地图上选择一个点");
    }
  };

  return (
    <Modal
      title="地图选点 (天地图)"
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      width={800}
      styles={{ body: { padding: 0 } }}
      zIndex={1001}
      destroyOnClose
    >
      <div style={{ position: "relative", height: "500px", width: "100%" }}>
        <div
          ref={mapContainerRef}
          style={{ width: "100%", height: "100%" }}
        ></div>
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 50, // 避开缩放控件
            background: "white",
            padding: "5px 10px",
            borderRadius: "4px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            zIndex: 100,
          }}
        >
          {selectedCoord
            ? `已选坐标: ${selectedCoord.lng.toFixed(
                6
              )}, ${selectedCoord.lat.toFixed(6)}`
            : "请在地图上点击选择位置"}
        </div>
      </div>
    </Modal>
  );
};

export default MapPicker;
