import { Pagination, Spin, Empty, ConfigProvider } from "antd";
import { useContext, useEffect, useState } from "react";
import { HistoryPageContext } from "../../HistoryPage";
import request from "@/utils/request";
import dayjs from "dayjs";
import DataDetailModal from "./DataDetailModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const RightDataList = () => {
  const { searchParams, setSearchParams } = useContext(HistoryPageContext);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params: any = {
        current: searchParams.current || 1,
        size: searchParams.size || 9,
      };
      if (searchParams.categoryId) {
        params.categoryId = searchParams.categoryId;
      }
      if (searchParams.facilityId) {
        params.facilityId = searchParams.facilityId;
      }

      const res: any = await request.get("/monitor/page", { params });
      setData(res.records || []);
      setTotal(res.total || 0);
    } catch (error) {
      console.error("Failed to fetch monitoring data:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderDataCard = (item: any) => (
    <div
      key={item.id}
      onClick={() => {
        setCurrentRecord(item);
        setDetailVisible(true);
      }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg hover:shadow-blue-500/5"
    >
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h4 className="line-clamp-1 text-base font-bold text-slate-800 group-hover:text-blue-600">
            {item.facilityName || `设施 #${item.facilityId}`}
          </h4>
          <div className="flex items-center gap-2">
            {item.facilityCode && (
              <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs font-medium text-slate-500">
                {item.facilityCode}
              </span>
            )}
            <span className="text-xs text-slate-400">
              {item.collectTime
                ? dayjs(item.collectTime).format("YYYY-MM-DD HH:mm")
                : "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="mt-auto grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-3 transition-colors group-hover:bg-blue-50/30">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500">水位 (m)</span>
          <span className="font-mono text-xl font-bold text-slate-700">
            {item.waterLevel !== undefined && item.waterLevel !== null
              ? item.waterLevel.toFixed(2)
              : "-"}
          </span>
        </div>
        <div className="flex flex-col gap-1 border-l border-slate-200 pl-4 transition-colors group-hover:border-blue-100">
          <span className="text-xs text-slate-500">流量 (m³/s)</span>
          <span className="font-mono text-xl font-bold text-slate-700">
            {item.flowRate !== undefined && item.flowRate !== null
              ? item.flowRate.toFixed(2)
              : "-"}
          </span>
        </div>
      </div>

      {/* Decorative */}
      <div className="absolute top-0 right-0 h-16 w-16 -translate-y-8 translate-x-8 rounded-full bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  );

  return (
    <div className="flex size-full flex-col gap-4">
      <ScrollArea className="flex-1">
        {loading ? (
          <div className="flex size-full min-h-[400px] items-center justify-center">
            <Spin size="large" />
          </div>
        ) : (
          <>
            {data?.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 pr-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                {data.map(renderDataCard)}
              </div>
            ) : (
              <div className="flex size-full min-h-[400px] items-center justify-center rounded-xl bg-white border border-dashed border-slate-200">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description={
                    <span className="text-slate-400">暂无监测数据</span>
                  }
                />
              </div>
            )}
          </>
        )}
      </ScrollArea>

      <div className="flex items-center justify-end rounded-xl bg-white p-3 shadow-sm border border-slate-100">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1A70F9",
            },
          }}
        >
          <Pagination
            current={searchParams.current || 1}
            showTotal={(total) => (
              <span className="text-slate-500">{`共 ${total} 条数据`}</span>
            )}
            disabled={loading}
            pageSize={searchParams.size || 9}
            onChange={(page, pageSize) => {
              setSearchParams({
                ...searchParams,
                current: page,
                size: pageSize,
              });
            }}
            showSizeChanger={false}
            size="default" // Changed from small for better elegance
            total={total}
          />
        </ConfigProvider>
      </div>

      <DataDetailModal
        visible={detailVisible}
        onClose={() => setDetailVisible(false)}
        record={currentRecord}
      />
    </div>
  );
};

export default RightDataList;
