import React, { useState, useEffect, createContext } from "react";
import { ConfigProvider, theme as antTheme } from "antd";
import LeftCategoryTree from "./history/components/LeftCategoryTree";
import RightDataList from "./history/components/RightDataList";
import SearchForm from "../components/SearchForm";
import { getCategories } from "../api/facility";

export const HistoryPageContext = createContext<{
  searchParams: { [key: string]: any };
  setSearchParams: (params: { [key: string]: any }) => void;
}>({
  searchParams: {
    current: 1,
    size: 20,
    categoryId: null,
    facilityId: null,
  },
  setSearchParams: () => {},
});

const HistoryPage: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState<{ [key: string]: any }>({
    current: 1,
    size: 9,
    categoryId: null,
    facilityId: null,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res: any = await getCategories();
      setCategories(res || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <HistoryPageContext.Provider
      value={{
        searchParams,
        setSearchParams,
      }}
    >
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#1A70F9",
            colorText: "#242A32",
            borderRadius: 6,
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
          },
          components: {
            DatePicker: {
              colorText: "#242A32",
            },
            Select: {
              colorText: "#242A32",
            },
            Card: {
              boxShadowTertiary: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
            },
          },
        }}
      >
        <div className="flex size-full flex-col bg-[#F5F7FA] p-6 lg:p-8">
          <div className="flex flex-col gap-6 h-full">
            {/* Header / Search Area */}
            <div className="flex-none rounded-xl bg-white p-5 shadow-sm border border-slate-100">
              <SearchForm
                columns={[
                  {
                    title: "设施ID",
                    dataIndex: "facilityId",
                    search: true,
                    valueType: "text",
                  },
                ]}
                onSearch={(values) => {
                  setSearchParams({
                    ...searchParams,
                    ...values,
                    current: 1,
                  });
                }}
                onReset={() => {
                  setSearchParams({
                    current: 1,
                    size: 9, // Consistent with initial state
                    categoryId: null,
                    facilityId: null,
                  });
                }}
              />
            </div>

            {/* Content Area */}
            <div className="flex grow gap-6 overflow-hidden">
              <div className="w-[300px] shrink-0">
                <LeftCategoryTree data={categories} loading={loading} />
              </div>
              <div className="grow overflow-hidden">
                <RightDataList />
              </div>
            </div>
          </div>
        </div>
      </ConfigProvider>
    </HistoryPageContext.Provider>
  );
};

export default HistoryPage;
