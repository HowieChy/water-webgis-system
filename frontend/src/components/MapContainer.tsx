import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Style, Icon } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import { defaults as defaultControls } from "ol/control";
import Overlay from "ol/Overlay";
import FacilityPopup from "./FacilityPopup";
import LayerTree from "./LayerTree";
import { getFacilities, getCategories } from "../api/facility";
import { message, Radio } from "antd";

// Tianditu Token - Replace with your own key or use a public one
const TDT_TOKEN = "026750369f36c001c8d3ae9352e3857b"; // Free key for demo

const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [vectorLayer, setVectorLayer] =
    useState<VectorLayer<VectorSource> | null>(null);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [baseMapType, setBaseMapType] = useState<"vector" | "satellite">(
    "vector"
  );
  const [tiandituLayers, setTiandituLayers] = useState<{
    vec: TileLayer<XYZ>;
    cva: TileLayer<XYZ>;
    img: TileLayer<XYZ>;
    cia: TileLayer<XYZ>;
  } | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Tianditu Layers
    const vecLayer = new TileLayer({
      source: new XYZ({
        url: `http://t{0-7}.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TDT_TOKEN}`,
      }),
      visible: true,
    });

    const cvaLayer = new TileLayer({
      source: new XYZ({
        url: `http://t{0-7}.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TDT_TOKEN}`,
      }),
      visible: true,
    });

    const imgLayer = new TileLayer({
      source: new XYZ({
        url: `http://t{0-7}.tianditu.gov.cn/img_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=img&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TDT_TOKEN}`,
      }),
      visible: false,
    });

    const ciaLayer = new TileLayer({
      source: new XYZ({
        url: `http://t{0-7}.tianditu.gov.cn/cia_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cia&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=${TDT_TOKEN}`,
      }),
      visible: false,
    });

    const vSource = new VectorSource();
    const vLayer = new VectorLayer({
      source: vSource,
      // Style will be set dynamically usually, but here we can use a style function
      style: (feature) => {
        const props = feature.getProperties();
        const iconName = props.categoryIcon || "map-wsj.png"; // Default icon
        return new Style({
          image: new Icon({
            src: `/textures/gis/${iconName}`,
            scale: 0.4,
            anchor: [0.5, 1],
          }),
        });
      },
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [vecLayer, cvaLayer, imgLayer, ciaLayer, vLayer],
      view: new View({
        center: fromLonLat([121.716, 29.956]), // Zhenhai District
        zoom: 13,
      }),
      controls: defaultControls({ zoom: false }), // We can customize controls
    });

    // Create Tooltip Overlay
    const tooltipElement = document.getElementById("map-tooltip");
    let tooltipOverlay: Overlay | null = null;
    if (tooltipElement) {
      tooltipOverlay = new Overlay({
        element: tooltipElement,
        offset: [10, 0],
        positioning: "bottom-left",
        stopEvent: false, // Allow click through
      });
      initialMap.addOverlay(tooltipOverlay);
    }

    setMap(initialMap);
    setVectorLayer(vLayer);
    setTiandituLayers({
      vec: vecLayer,
      cva: cvaLayer,
      img: imgLayer,
      cia: ciaLayer,
    });

    // Click interaction
    initialMap.on("singleclick", (evt) => {
      const feature = initialMap.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature
      );
      if (feature) {
        const props = feature.getProperties();
        setSelectedFeature(props);
      } else {
        setSelectedFeature(null);
      }
    });

    // Hover interaction for Tooltip
    initialMap.on("pointermove", (evt) => {
      if (evt.dragging) {
        if (tooltipOverlay) tooltipOverlay.setPosition(undefined);
        return;
      }

      const pixel = initialMap.getEventPixel(evt.originalEvent);
      const feature = initialMap.forEachFeatureAtPixel(
        pixel,
        (feature) => feature
      );

      const element = tooltipOverlay?.getElement();
      const targetElement = initialMap.getTargetElement();

      if (feature && element) {
        const props = feature.getProperties();
        const name = props.name || "未知设施";

        element.style.display = "block";
        element.innerHTML = name;
        tooltipOverlay?.setPosition(evt.coordinate);

        // Change cursor
        if (targetElement) targetElement.style.cursor = "pointer";
      } else {
        if (element) element.style.display = "none";
        if (tooltipOverlay) tooltipOverlay.setPosition(undefined);
        if (targetElement) targetElement.style.cursor = "";
      }
    });

    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  // Fetch Categories first to create a map of ID -> Icon
  useEffect(() => {
    getCategories().then((res: any) => {
      if (res) {
        setCategories(res);
      }
    });
  }, []);

  // Load Facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        if (!categories.length) return; // Wait for categories

        const data: any = await getFacilities();

        const features: Feature[] = [];

        data.forEach((item: any) => {
          if (item.geomJson) {
            const geometry = new GeoJSON().readGeometry(
              JSON.parse(item.geomJson),
              {
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857",
              }
            );

            const feature = new Feature(geometry);

            // Find category to get alias/icon
            const cat = categories.find((c) => c.id === item.categoryId);
            const extraProps = {
              categoryName: cat?.alias || cat?.name || "未知",
              categoryIcon: cat?.icon,
            };

            feature.setProperties({ ...item, ...extraProps });
            features.push(feature);
          }
        });

        setAllFeatures(features);
        if (vectorLayer) {
          const source = vectorLayer.getSource();
          source?.clear();
          source?.addFeatures(features);
        }
      } catch (e) {
        console.error(e);
        message.error("加载设施数据失败");
      }
    };

    if (map && vectorLayer && categories.length > 0) {
      fetchFacilities();
    }
  }, [map, vectorLayer, categories]);

  // Handle Base Map Switch
  const changeBaseMap = (type: "vector" | "satellite") => {
    if (!tiandituLayers) return;
    setBaseMapType(type);

    const { vec, cva, img, cia } = tiandituLayers;
    if (type === "vector") {
      vec.setVisible(true);
      cva.setVisible(true);
      img.setVisible(false);
      cia.setVisible(false);
    } else {
      vec.setVisible(false);
      cva.setVisible(false);
      img.setVisible(true);
      cia.setVisible(true);
    }
  };

  const handleLayerCheck = (checkedKeys: React.Key[]) => {
    if (!vectorLayer) return;

    const source = vectorLayer.getSource();
    if (!source) return;

    source.clear();

    const activeIds = checkedKeys.map((k) => String(k));

    const filtered = allFeatures.filter((f) => {
      const catId = f.get("categoryId");
      // Check if "all" is selected or specific category
      return activeIds.includes(String(catId)) || activeIds.includes("all");
    });

    source.addFeatures(filtered);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      {/* Layer Switcher Control */}
      <div className="absolute right-4 bottom-8 z-10 rounded-md bg-white p-2 shadow-md">
        <Radio.Group
          value={baseMapType}
          onChange={(e) => changeBaseMap(e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="vector">标准地图</Radio.Button>
          <Radio.Button value="satellite">卫星地图</Radio.Button>
        </Radio.Group>
      </div>

      <LayerTree onCheck={handleLayerCheck} />

      {/* Tooltip Element */}
      <div
        id="map-tooltip"
        className="pointer-events-none absolute z-50 rounded bg-[rgba(0,0,0,0.8)] px-2 py-1 text-xs text-white shadow-md transition-opacity duration-200"
        style={{ display: "none" }}
      ></div>

      <FacilityPopup
        feature={selectedFeature}
        visible={!!selectedFeature}
        onClose={() => {
          setSelectedFeature(null);
        }}
      />
    </div>
  );
};

export default MapContainer;
