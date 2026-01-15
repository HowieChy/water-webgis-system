import { Modal, DatePicker, Select, Spin, Empty } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import ReactECharts from "echarts-for-react";
import request from "@/utils/request";

const { RangePicker } = DatePicker;

interface DataDetailModalProps {
  visible: boolean;
  onClose: () => void;
  record: any;
}

const DataDetailModal = ({
  visible,
  onClose,
  record,
}: DataDetailModalProps) => {
  const [loading, setLoading] = useState(false);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs]>([
    dayjs().subtract(7, "day"),
    dayjs(),
  ]);
  const [selectedMetric, setSelectedMetric] = useState("waterLevel");

  useEffect(() => {
    if (visible && record?.facilityId) {
      fetchHistoryData();
    }
  }, [visible, record, dateRange]);

  const fetchHistoryData = async () => {
    if (!record?.facilityId) return;

    setLoading(true);
    try {
      const res: any = await request.get("/monitor/history", {
        params: {
          facilityId: record.facilityId,
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
      title: {
        text: `${config.name}趋势`,
        left: "center",
        textStyle: {
          fontSize: 14,
          fontWeight: "normal",
        },
      },
      tooltip: {
        trigger: "axis",
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
          rotate: 45,
          fontSize: 10,
        },
      },
      yAxis: {
        type: "value",
        name: `${config.name} (${config.unit})`,
        nameTextStyle: {
          fontSize: 12,
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

  if (!record) return null;

  return (
    <Modal
      title={`${record.facilityName || "设施"} - 监测数据详情`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      style={{ top: 20 }}
    >
      {/* 当前实时数据 */}
      <div className="mb-6">
        <div className="mb-3 text-base font-medium text-[#1C2A32]">
          当前实时数据
        </div>
        <div className="grid grid-cols-4 gap-4 rounded-lg bg-[#F7F8FA] p-4">
          <div className="flex flex-col">
            <span className="text-xs text-[#86909C]">设施编码</span>
            <span className="mt-1 text-base font-medium text-[#1C2A32]">
              {record.facilityCode || "-"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#86909C]">水位 (m)</span>
            <span className="mt-1 text-base font-medium text-[#1A70F9]">
              {record.waterLevel?.toFixed(2) || "-"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#86909C]">流量 (m³/s)</span>
            <span className="mt-1 text-base font-medium text-[#18CA71]">
              {record.flowRate?.toFixed(2) || "-"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#86909C]">开关状态</span>
            <span className="mt-1 text-base font-medium text-[#1C2A32]">
              {record.switchStatus === 1 ? "开启" : "关闭"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#86909C]">采集时间</span>
            <span className="mt-1 text-sm text-[#4E5969]">
              {record.collectTime
                ? dayjs(record.collectTime).format("YYYY-MM-DD HH:mm:ss")
                : "-"}
            </span>
          </div>
          {record.remark && (
            <div className="col-span-3 flex flex-col">
              <span className="text-xs text-[#86909C]">备注</span>
              <span className="mt-1 text-sm text-[#4E5969]">
                {record.remark}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 历史图表数据 */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <div className="text-base font-medium text-[#1C2A32]">
            历史图表数据
          </div>
          <div className="flex items-center gap-3">
            <RangePicker
              value={dateRange}
              onChange={(dates: any) => {
                if (dates) {
                  setDateRange(dates);
                }
              }}
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
            />
          </div>
        </div>

        <div className="rounded-lg border border-[#E2EBF6] bg-white p-4">
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
              <Empty description="暂无图表数据" />
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DataDetailModal;
