import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { fromLonLat } from "ol/proj";
import { Feature } from "ol";
import { Style, Circle, Fill, Stroke } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import FacilityPopup from "./FacilityPopup";
import LayerTree from "./LayerTree";
import { getFacilities } from "../api/facility";
import { message } from "antd";

const MapContainer: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<Map | null>(null);
  const [vectorLayer, setVectorLayer] =
    useState<VectorLayer<VectorSource> | null>(null);
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<[number, number] | null>(
    null
  );

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    const osmLayer = new TileLayer({
      source: new OSM(),
    });

    const vSource = new VectorSource();
    const vLayer = new VectorLayer({
      source: vSource,
      style: new Style({
        image: new Circle({
          radius: 6,
          fill: new Fill({ color: "#1890ff" }),
          stroke: new Stroke({ color: "white", width: 2 }),
        }),
      }),
    });

    const initialMap = new Map({
      target: mapRef.current,
      layers: [osmLayer, vLayer],
      view: new View({
        center: fromLonLat([120.15, 30.28]),
        zoom: 12,
      }),
    });

    setMap(initialMap);
    setVectorLayer(vLayer);

    initialMap.on("singleclick", (evt) => {
      const feature = initialMap.forEachFeatureAtPixel(
        evt.pixel,
        (feature) => feature
      );
      if (feature) {
        const props = feature.getProperties();
        // Filter out geometry or internal OpenLayers props if needed
        setSelectedFeature(props);
        setPopupPosition(evt.coordinate as [number, number]);
      } else {
        setSelectedFeature(null);
        setPopupPosition(null);
      }
    });

    return () => {
      initialMap.setTarget(undefined);
    };
  }, []);

  // Load Facilities
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const data: any = await getFacilities();

        const features: Feature[] = [];

        data.forEach((item: any) => {
          if (item.geomJson) {
            // Parse GeoJSON
            const geometry = new GeoJSON().readGeometry(
              JSON.parse(item.geomJson),
              {
                dataProjection: "EPSG:4326",
                featureProjection: "EPSG:3857",
              }
            );

            const feature = new Feature(geometry);
            feature.setProperties(item);
            features.push(feature);
          }
        });

        setAllFeatures(features);
        // Initially show all
        if (vectorLayer) {
          vectorLayer.getSource()?.addFeatures(features);
        }
      } catch (e) {
        console.error(e);
        message.error("Failed to load facilities");
      }
    };

    if (map && vectorLayer) {
      fetchFacilities();
    }
  }, [map, vectorLayer]);

  const handleLayerCheck = (checkedKeys: React.Key[]) => {
    if (!vectorLayer) return;

    const source = vectorLayer.getSource();
    if (!source) return;

    source.clear();

    // Filter features
    // keys are category IDs (numbers) or strings depending on Tree component
    // Our IDs are likely numbers, Tree keys might be strings/numbers.
    const activeIds = checkedKeys.map((k) => String(k));

    const filtered = allFeatures.filter((f) => {
      const catId = f.get("categoryId");
      return activeIds.includes(String(catId));
    });

    source.addFeatures(filtered);
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />

      <LayerTree onCheck={handleLayerCheck} />

      {selectedFeature && popupPosition && map && (
        <FacilityPopup
          feature={selectedFeature}
          position={popupPosition}
          map={map}
          onClose={() => {
            setSelectedFeature(null);
            setPopupPosition(null);
          }}
        />
      )}
    </div>
  );
};

export default MapContainer;
