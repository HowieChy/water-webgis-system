import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfigProvider, Skeleton, Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useMemo, useState } from "react";
import { HistoryPageContext } from "../../HistoryPage";

const LeftCategoryTree = ({
  data,
  loading,
}: {
  data: any;
  loading: boolean;
}) => {
  const { searchParams, setSearchParams } = useContext(HistoryPageContext);

  // 只显示特定分类：泵站、雨水口、排放口、污水处理厂
  const allowedCategories = [
    "泵站",
    "雨水口",
    "排放口",
    "污水处理厂",
    "低洼地区",
    "水质监测",
  ];
  const filteredData = useMemo(() => {
    return data.filter((cat: any) => allowedCategories.includes(cat.alias));
  }, [data]);

  const treeData: TreeDataNode[] = useMemo(() => {
    const allNode: TreeDataNode = {
      title: "全部分类",
      key: "all",
    };

    const categoryNodes: TreeDataNode[] = filteredData.map((cat: any) => ({
      title: cat.alias,
      key: cat.id.toString(),
    }));

    return [allNode, ...categoryNodes];
  }, [filteredData]);

  // 初始化时设置第一个选项
  useEffect(() => {
    if (treeData?.length) {
      setSearchParams({
        ...searchParams,
        categoryId: null, // 默认显示全部
      });
    }
  }, [treeData]);

  // 选择分类
  const onSelect: TreeProps["onSelect"] = (selectedKeys: any[]) => {
    const key = selectedKeys[0];
    setSearchParams({
      ...searchParams,
      current: 1, // 重置到第一页
      categoryId: key === "all" ? null : Number(key),
    });
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Tree: {
            nodeSelectedBg: "#F0F5FF",
            nodeSelectedColor: "#1A70F9",
            directoryNodeSelectedColor: "#1A70F9",
            nodeHoverColor: "#1A70F9",
            colorText: "#4E5969",
          },
        },
      }}
    >
      <div className="flex h-full w-[280px] flex-col gap-3 rounded-[10px] bg-white p-5">
        <div className="flex items-center gap-1.5 border-b border-[#E2EBF6] pb-4">
          <div
            className={cn(
              "cursor-pointer rounded-[40px] bg-[#F3F8FE] px-4 py-1 text-sm text-[#1A70F9] transition-all duration-300"
            )}
          >
            <span className="select-none font-medium">设施分类</span>
          </div>
        </div>
        {loading ? (
          <Skeleton active />
        ) : (
          <ScrollArea className="max-h-[calc(100vh-348px)] flex-grow">
            <Tree
              onSelect={(selectedKeys, info) => {
                if (selectedKeys.length === 0) {
                  return;
                }
                onSelect(selectedKeys, info);
              }}
              treeData={treeData}
              selectedKeys={
                searchParams?.categoryId
                  ? [searchParams.categoryId.toString()]
                  : ["all"]
              }
              className={cn(
                "[&_.ant-tree-node-content-wrapper-normal]:flex-1 [&_.ant-tree-treenode-leaf]:flex [&_.ant-tree-treenode-leaf]:w-full [&_.ant-tree-treenode]:flex [&_.ant-tree-treenode]:w-full",
                "[&_.ant-tree-node-content-wrapper]:flex-1 [&_.ant-tree-node-selected]:rounded-[3px]"
              )}
            />
          </ScrollArea>
        )}
      </div>
    </ConfigProvider>
  );
};

export default LeftCategoryTree;
