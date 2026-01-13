import React, { useState, useEffect } from "react";
import { Card, Form, DatePicker, Select, Button, Table, message } from "antd";
import ReactECharts from "echarts-for-react";
import { getHistory, getFacilities } from "../api/facility";
import { useSearchParams } from "react-router-dom";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const HistoryPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialFacilityId = searchParams.get("facilityId");

  const [facilities, setFacilities] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // Chart Option
  const [option, setOption] = useState({});

  useEffect(() => {
    getFacilities().then((res: any) => {
      setFacilities(res);
      if (initialFacilityId) {
        form.setFieldsValue({ facilityId: Number(initialFacilityId) });
        handleSearch({ facilityId: Number(initialFacilityId) });
      }
    });
  }, []);

  const handleSearch = async (values: any) => {
    if (!values.facilityId) {
      message.warning("Please select a facility");
      return;
    }
    setLoading(true);
    try {
      const params: any = {
        facilityId: values.facilityId,
      };
      if (values.timeRange) {
        params.startTime = values.timeRange[0].format("YYYY-MM-DD HH:mm:ss");
        params.endTime = values.timeRange[1].format("YYYY-MM-DD HH:mm:ss");
      } else {
        // Default last 7 days
        params.startTime = dayjs()
          .subtract(7, "day")
          .format("YYYY-MM-DD HH:mm:ss");
        params.endTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
      }

      const res: any = await getHistory(params);
      setData(res);
      renderChart(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = (data: any[]) => {
    const times = data.map((item) =>
      dayjs(item.collectTime).format("MM-DD HH:mm")
    );
    const waterLevels = data.map((item) => item.waterLevel);
    const flowRates = data.map((item) => item.flowRate);

    setOption({
      title: { text: "Monitoring Trend" },
      tooltip: { trigger: "axis" },
      legend: { data: ["Water Level (m)", "Flow Rate (m³/s)"] },
      xAxis: { type: "category", data: times },
      yAxis: [
        { type: "value", name: "Level (m)" },
        { type: "value", name: "Flow (m³/s)" },
      ],
      series: [
        {
          name: "Water Level (m)",
          type: "line",
          data: waterLevels,
          yAxisIndex: 0,
        },
        {
          name: "Flow Rate (m³/s)",
          type: "line",
          data: flowRates,
          yAxisIndex: 1,
        },
      ],
    });
  };

  const columns = [
    {
      title: "Time",
      dataIndex: "collectTime",
      render: (t: string) => dayjs(t).format("YYYY-MM-DD HH:mm:ss"),
    },
    { title: "Water Level (m)", dataIndex: "waterLevel" },
    { title: "Flow Rate (m³/s)", dataIndex: "flowRate" },
    {
      title: "Switch Status",
      dataIndex: "switchStatus",
      render: (v: number) => (v === 1 ? "Open" : "Closed"),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Historical Data Query">
        <Form layout="inline" form={form} onFinish={handleSearch}>
          <Form.Item name="facilityId" label="Facility">
            <Select style={{ width: 200 }} placeholder="Select Facility">
              {facilities.map((f) => (
                <Select.Option key={f.id} value={f.id}>
                  {f.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="timeRange" label="Time Range">
            <RangePicker showTime />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Search
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <div style={{ marginTop: 24 }}>
        <ReactECharts option={option} style={{ height: 400 }} />
      </div>

      <div style={{ marginTop: 24 }}>
        <Table
          dataSource={data}
          columns={columns}
          rowKey="id"
          loading={loading}
        />
      </div>
    </div>
  );
};

export default HistoryPage;
