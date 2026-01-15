import React, { useState, useEffect, createContext } from "react";
import { ConfigProvider } from "antd";
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
      <div className="flex size-full flex-col p-4">
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
              size: 12,
              categoryId: null,
              facilityId: null,
            });
          }}
        />
        <div className="flex grow gap-4">
          <LeftCategoryTree data={categories} loading={loading} />
          <RightDataList />
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            DatePicker: {
              colorText: "#242A32",
            },
            Select: {
              colorText: "#242A32",
            },
          },
        }}
      />
    </HistoryPageContext.Provider>
  );
};

export default HistoryPage;
