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

  return (
    <div className="flex flex-1 flex-col gap-4 rounded-[10px] bg-white p-5">
      <div className="flex h-[50px] w-full items-start justify-between border-b border-[#E2EBF6]">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "cursor-pointer rounded-[40px] bg-[#F3F8FE] px-4 py-1 text-sm text-[#1A70F9] transition-all duration-300"
            )}
          >
            <span className="select-none font-medium text-[#1A70F9]">
              监测数据台账
            </span>
          </div>
        </div>
      </div>

      <ScrollArea className="max-h-[calc(100vh-356px)] grow">
        {loading ? (
          <div className="flex size-full min-h-52 items-center justify-center">
            <Spin />
          </div>
        ) : (
          <>
            {data?.length > 0 ? (
              <ul className="grid size-full grid-cols-3 gap-4">
                {data?.map((item: any) => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setCurrentRecord(item);
                      setDetailVisible(true);
                    }}
                    className="flex h-[180px] cursor-pointer flex-col gap-4 rounded-[5px] border border-[#F2F3F5] p-5 transition-all duration-100 ease-linear hover:border-[#86909C]/30 hover:shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-base font-medium text-[#1C2A32]">
                          {item.facilityName || `设施 #${item.facilityId}`}
                        </div>
                        <div className="text-xs text-[#86909C]">
                          {item.facilityCode && (
                            <span className="mr-2">{item.facilityCode}</span>
                          )}
                          {item.collectTime
                            ? dayjs(item.collectTime).format("YYYY-MM-DD HH:mm")
                            : "-"}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 rounded-[5px] bg-[#F1F3F8]/50 p-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col">
                          <span className="text-xs text-[#86909C]">
                            水位 (m)
                          </span>
                          <span className="text-lg font-medium text-[#4E5969]">
                            {item.waterLevel?.toFixed(2) || "-"}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-[#86909C]">
                            流量 (m³/s)
                          </span>
                          <span className="text-lg font-medium text-[#4E5969]">
                            {item.flowRate?.toFixed(2) || "-"}
                          </span>
                        </div>
                        {/* <div className="flex flex-col">
                          <span className="text-xs text-[#86909C]">
                            开关状态
                          </span>
                          <span className="text-lg font-medium text-[#4E5969]">
                            {item.switchStatus === 1 ? "开启" : "关闭"}
                          </span>
                        </div> */}
                        {/* {item.remark && (
                          <div className="col-span-2 flex flex-col">
                            <span className="text-xs text-[#86909C]">备注</span>
                            <span className="truncate text-sm text-[#4E5969]">
                              {item.remark}
                            </span>
                          </div>
                        )} */}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无数据"
              />
            )}
          </>
        )}
      </ScrollArea>

      <div className="flex items-center justify-end">
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1A70F9",
            },
            components: {
              Pagination: {
                itemActiveBg: "#F0F5FF",
                borderRadius: 2,
              },
            },
          }}
        >
          {total > (searchParams.size || 9) && (
            <Pagination
              current={searchParams.current || 1}
              showTotal={(total) => (
                <span className="text-sm text-[#1C2A32]">{`共${total}条`}</span>
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
              size="small"
              total={total}
              className="[&_.ant-pagination-item-active]:border-none"
            />
          )}
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
