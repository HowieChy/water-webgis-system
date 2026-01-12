import React, { useEffect, useRef, useState } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import Overlay from 'ol/Overlay';
import request from '../utils/request';
import { Card, Select, Button, Drawer } from 'antd';

const Dashboard = () => {
    const mapElement = useRef();
    const mapRef = useRef();
    const popupRef = useRef();
    const [popupContent, setPopupContent] = useState(null);
    const [facilities, setFacilities] = useState([]);
    const [selectedFacility, setSelectedFacility] = useState(null);

    useEffect(() => {
        // 1. Initialize Map
        const map = new Map({
            target: mapElement.current,
            layers: [
                new TileLayer({
                    source: new XYZ({
                        url: 'https://t0.tianditu.gov.cn/vec_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=YOUR_TIANDITU_KEY_HERE'
                        // Note: User needs to provide Tianditu Key or use OSM for demo
                    })
                }),
                new TileLayer({
                    source: new XYZ({
                        url: 'https://t0.tianditu.gov.cn/cva_w/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=cva&STYLE=default&TILEMATRIXSET=w&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=YOUR_TIANDITU_KEY_HERE'
                    })
                })
            ],
            view: new View({
                center: fromLonLat([116.40, 39.90]), // Default Center (Beijing)
                zoom: 12
            })
        });
        mapRef.current = map;

        // 2. Load Facilities
        loadFacilities(map);

        // 3. Popup Overlay
        const overlay = new Overlay({
            element: popupRef.current,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
        });
        map.addOverlay(overlay);

        // 4. Click Interaction
        map.on('singleclick', function (evt) {
            const feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
                return feature;
            });
            if (feature) {
                const coordinates = feature.getGeometry().getCoordinates();
                const facility = feature.getProperties();
                setPopupContent(facility);
                overlay.setPosition(coordinates);
                setSelectedFacility(facility);
            } else {
                overlay.setPosition(undefined);
                setPopupContent(null);
            }
        });

        return () => map.setTarget(null);
    }, []);

    const loadFacilities = async (map) => {
        try {
            const data = await request.get('/facility/list');
            if (data && data.length > 0) {
                // Convert custom list to GeoJSON FeatureCollection
                const features = data.map(item => {
                    // Parse GeoJSON string if present, or create point from lat/lon if we had that.
                    // Our backend returns 'geom' as GeoJSON string.
                    if (item.geom) {
                        const geometry = JSON.parse(item.geom);
                        return {
                            type: 'Feature',
                            geometry: geometry,
                            properties: item
                        };
                    }
                    return null;
                }).filter(f => f !== null);

                const geoJsonObject = {
                    type: 'FeatureCollection',
                    features: features
                };

                const vectorSource = new VectorSource({
                    features: new GeoJSON().readFeatures(geoJsonObject, {
                        featureProjection: 'EPSG:3857' // Convert from WGS84 to Web Mercator
                    }),
                });

                const vectorLayer = new VectorLayer({
                    source: vectorSource,
                    style: new Style({
                        image: new CircleStyle({
                            radius: 6,
                            fill: new Fill({ color: 'red' }),
                            stroke: new Stroke({
                                color: 'white',
                                width: 2,
                            }),
                        }),
                    }),
                });

                map.addLayer(vectorLayer);
                // map.getView().fit(vectorSource.getExtent());
            }
        } catch (e) {
            console.error("Failed to load facilities", e);
        }
    };

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <div ref={mapElement} style={{ width: '100%', height: '80vh' }}></div>

            <div ref={popupRef} style={{ background: 'white', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '200px' }}>
                {popupContent && (
                    <div>
                        <h4>{popupContent.name}</h4>
                        <p>Code: {popupContent.code}</p>
                        <p>Status: {popupContent.status}</p>
                        <Button type="link" onClick={() => console.log("View Details", popupContent)}>Details</Button>
                    </div>
                )}
            </div>

            <Card style={{ position: 'absolute', top: 10, right: 10, width: 300 }} title="Layers">
                <p>Layer Control (Mock)</p>
            </Card>

            {/* Detail Panel */}
            <Drawer title="Facility Detail" placement="right" onClose={() => setSelectedFacility(null)} open={!!selectedFacility}>
                {selectedFacility && (
                    <div>
                        <p>ID: {selectedFacility.id}</p>
                        <p>Name: {selectedFacility.name}</p>
                        <p>Address: {selectedFacility.address}</p>
                        {/* Monitor Data Chart would go here */}
                    </div>
                )}
            </Drawer>

        </div>
    );
};

export default Dashboard;
