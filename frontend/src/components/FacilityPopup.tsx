import React, { useEffect, useState } from "react";
import {
  Modal,
  Descriptions,
  ConfigProvider,
  DatePicker,
  Select,
  Spin,
  Empty,
} from "antd";
import { X } from "lucide-react";
import ReactECharts from "echarts-for-react";
import dayjs from "dayjs";
import request from "@/utils/request";

const { RangePicker } = DatePicker;

interface FacilityPopupProps {
  feature: any;
  visible?: boolean;
  onClose: () => void;
}

const FacilityPopup: React.FC<FacilityPopupProps> = ({
  feature,
  visible,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [realtimeData, setRealtimeData] = useState<any>(null); // State for latest data
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);
  const [selectedMetric, setSelectedMetric] = useState("waterLevel");

  useEffect(() => {
    if (visible && feature?.id) {
      // Fetch latest data (Page 1, Size 1) for realtime display
      fetchRealtimeData();
      // Fetch history data for chart
      fetchHistoryData();
    }
  }, [visible, feature, dateRange]);

  const fetchRealtimeData = async () => {
    if (!feature?.id) return;
    try {
      // Use paging API to get the latest record
      const res: any = await request.get("/monitor/page", {
        params: {
          current: 1,
          size: 1,
          facilityId: feature.id,
        },
      });
      if (res && res.records && res.records.length > 0) {
        setRealtimeData(res.records[0]);
      } else {
        setRealtimeData(null);
      }
    } catch (e) {
      console.error("Failed to fetch realtime data", e);
    }
  };

  const fetchHistoryData = async () => {
    if (!feature?.id) return;

    setLoading(true);
    try {
      const res: any = await request.get("/monitor/history", {
        params: {
          facilityId: feature.id,
          startTime: dateRange[0].format("YYYY-MM-DD HH:mm:ss"),
          endTime: dateRange[1].format("YYYY-MM-DD HH:mm:ss"),
        },
      });
      setHistoryData(res || []);
    } catch (error) {
      console.error("Failed to fetch history data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getChartOption = () => {
    const metricConfig: any = {
      waterLevel: { name: "水位", unit: "m", color: "#1A70F9" },
      flowRate: { name: "流量", unit: "m³/s", color: "#18CA71" },
    };

    const config = metricConfig[selectedMetric];
    const data = historyData
      .map((item) => ({
        time: dayjs(item.collectTime).format("MM-DD HH:mm"),
        value: item[selectedMetric],
      }))
      .reverse();

    return {
      backgroundColor: "transparent",
      title: {
        text: `${config.name}趋势`,
        left: "center",
        textStyle: {
          color: "#fff",
          fontSize: 14,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(12, 35, 76, 0.9)",
        borderColor: "#1e3a8a",
        textStyle: { color: "#fff" },
        formatter: (params: any) => {
          const point = params[0];
          return `${point.name}<br/>${config.name}: ${point.value} ${config.unit}`;
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        top: "15%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: data.map((d) => d.time),
        axisLabel: {
          color: "#8daac7",
          rotate: 45,
          fontSize: 10,
        },
      },
      yAxis: {
        type: "value",
        name: `${config.name} (${config.unit})`,
        nameTextStyle: {
          color: "#8daac7",
          fontSize: 12,
        },
        axisLabel: { color: "#8daac7" },
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
      series: [
        {
          name: config.name,
          type: "line",
          smooth: true,
          symbol: "circle",
          symbolSize: 6,
          itemStyle: {
            color: config.color,
          },
          lineStyle: {
            width: 2,
            color: config.color,
          },
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${config.color}40` },
                { offset: 1, color: `${config.color}10` },
              ],
            },
          },
          data: data.map((d) => d.value),
        },
      ],
    };
  };

  if (!feature) return null;

  return (
    <ConfigProvider
      theme={{
        token: {
          colorTextPlaceholder: "rgba(255,255,255,0.4)",
          colorBorder: "#1e3a8a",
        },
        components: {
          Modal: {
            contentBg: "rgba(12, 35, 76, 0.95)",
            headerBg: "transparent",
            titleColor: "#fff",
            colorIcon: "#fff",
            colorIconHover: "#40a9ff",
          },
          Descriptions: {
            labelBg: "transparent",
            contentColor: "#fff",
            titleColor: "#fff",
            colorText: "#b0c4de",
          },
          Select: {
            selectorBg: "rgba(24,144,255,0.1)",
            colorText: "#fff",
            colorBorder: "#1e3a8a",
            optionSelectedBg: "rgba(24,144,255,0.2)",
            optionActiveBg: "rgba(24,144,255,0.1)",
          },
          DatePicker: {
            cellActiveWithRangeBg: "rgba(24,144,255,0.2)",
            cellRangeBorderColor: "rgba(24,144,255,0.2)",
            colorBgContainer: "rgba(24,144,255,0.1)",
            colorText: "#fff",
            colorTextHeading: "#fff",
          },
          Spin: {
            colorWhite: "#1890ff",
          },
        },
      }}
    >
      <Modal
        title={
          <div className="flex items-center gap-2 text-lg font-bold text-white tracking-wider">
            <div className="h-4 w-1 bg-[#1890ff]"></div>
            {feature.name || "-"}
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={900}
        closeIcon={<X className="text-white" />}
        centered
        maskStyle={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        className="facility-detail-modal"
      >
        <style>
          {`
            .facility-detail-modal .ant-modal-content {
                border: 1px solid #1e3a8a;
                box-shadow: 0 0 30px rgba(24, 144, 255, 0.2);
                border-radius: 8px;
            }
            .ant-picker {
                background: rgba(24,144,255,0.1) !important;
                border: 1px solid #1e3a8a !important;
                color: #fff !important;
            }
            .ant-picker .ant-picker-input > input {
                color: #fff !important;
            }
            .ant-picker .ant-picker-separator {
                color: #fff !important;
            }
            .ant-picker .ant-picker-suffix {
                color: rgba(255, 255, 255, 0.5) !important;
            }
            .ant-select-selector {
                background: rgba(24,144,255,0.1) !important;
                border: 1px solid #1e3a8a !important;
                color: #fff !important;
            }
            .ant-select-arrow {
                color: rgba(255, 255, 255, 0.5) !important;
            }
            .ant-empty-description {
                color: rgba(255, 255, 255, 0.5) !important;
            }
            `}
        </style>

        <div className="relative p-2">
          {/* 实时数据 (混合展示静态属性和动态监测) */}
          <div className="mb-6">
            <div className="flex mb-4 border-b border-[#1e3a8a]/50">
              <div className="px-6 py-2 bg-[#1890ff]/20 border border-[#1890ff] text-[#1890ff] font-medium text-sm">
                实时数据
              </div>
            </div>

            <Descriptions
              column={3}
              size="middle"
              labelStyle={{ color: "#8daac7" }}
              contentStyle={{ color: "#fff", fontSize: "14px" }}
            >
              <Descriptions.Item label="资产编号">
                {feature.code || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="资产类型">
                {feature.categoryName || "-"}
              </Descriptions.Item>
              <Descriptions.Item label="详细地址">
                {feature.address || "-"}
              </Descriptions.Item>

              {/* 动态监测数据 */}
              <Descriptions.Item label="当前水位">
                <span className="text-[#1A70F9] font-bold text-lg">
                  {realtimeData ? realtimeData.waterLevel?.toFixed(2) : "-"}
                </span>{" "}
                <span className="text-xs text-[#8daac7]">m</span>
              </Descriptions.Item>
              <Descriptions.Item label="当前流量">
                <span className="text-[#18CA71] font-bold text-lg">
                  {realtimeData ? realtimeData.flowRate?.toFixed(2) : "-"}
                </span>{" "}
                <span className="text-xs text-[#8daac7]">m³/s</span>
              </Descriptions.Item>
              <Descriptions.Item label="采集时间">
                {realtimeData?.collectTime
                  ? dayjs(realtimeData.collectTime).format("MM-DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
            </Descriptions>
          </div>

          {/* 历史监测数据 */}
          <div>
            <div className="flex mb-4 items-center justify-between border-b border-[#1e3a8a]/50 pb-2">
              <div className="px-6 py-2 bg-[#1890ff]/20 border border-[#1890ff] text-[#1890ff] font-medium text-sm">
                历史趋势
              </div>
              <div className="flex items-center gap-3">
                <RangePicker
                  value={dateRange}
                  onChange={(dates: any) => dates && setDateRange(dates)}
                  format="YYYY-MM-DD"
                  size="small"
                />
                <Select
                  value={selectedMetric}
                  onChange={setSelectedMetric}
                  size="small"
                  style={{ width: 120 }}
                  options={[
                    { label: "水位", value: "waterLevel" },
                    { label: "流量", value: "flowRate" },
                  ]}
                  popupClassName="bg-[#0c234c]"
                />
              </div>
            </div>

            <div className="rounded-lg border border-[#1e3a8a] bg-[rgba(255,255,255,0.02)] p-4 min-h-[300px]">
              {loading ? (
                <div className="flex h-[300px] items-center justify-center">
                  <Spin />
                </div>
              ) : historyData.length > 0 ? (
                <ReactECharts
                  option={getChartOption()}
                  style={{ height: "300px" }}
                  notMerge={true}
                />
              ) : (
                <div className="flex h-[300px] items-center justify-center">
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="暂无图表数据"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Map background effect */}
          <div
            className="absolute inset-0 -z-10 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(0deg, transparent 24%, rgba(24, 144, 255, .3) 25%, rgba(24, 144, 255, .3) 26%, transparent 27%, transparent 74%, rgba(24, 144, 255, .3) 75%, rgba(24, 144, 255, .3) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(24, 144, 255, .3) 25%, rgba(24, 144, 255, .3) 26%, transparent 27%, transparent 74%, rgba(24, 144, 255, .3) 75%, rgba(24, 144, 255, .3) 76%, transparent 77%, transparent)",
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </Modal>
    </ConfigProvider>
  );
};

export default FacilityPopup;
