import { ScrollArea } from "@/components/ui/scroll-area";
import { ConfigProvider, Skeleton, Tree, theme } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import { cn } from "@/lib/utils";
import { useContext, useEffect, useMemo } from "react";
import { HistoryPageContext } from "../../HistoryPage";

const LeftCategoryTree = ({
  data,
  loading,
}: {
  data: any;
  loading: boolean;
}) => {
  const { searchParams, setSearchParams } = useContext(HistoryPageContext);
  const { token } = theme.useToken();

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
      icon: (
        <span className="inline-flex size-4 items-center justify-center rounded-full bg-slate-100 text-[10px] text-slate-500 group-selected:bg-blue-100 group-selected:text-blue-600">
          A
        </span>
      ),
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
    <div className="flex h-full w-full flex-col gap-4 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="text-base font-semibold text-slate-800">设施分类</h3>
        <div className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
          {filteredData.length}
        </div>
      </div>

      {loading ? (
        <Skeleton active paragraph={{ rows: 6 }} title={false} />
      ) : (
        <ScrollArea className="flex-grow">
          <ConfigProvider
            theme={{
              components: {
                Tree: {
                  directoryNodeSelectedBg: "#eff6ff",
                  nodeSelectedBg: "#eff6ff",
                  nodeHoverBg: "#f8fafc",
                },
              },
            }}
          >
            <Tree
              blockNode
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
              titleRender={(node) => {
                const isSelected =
                  searchParams?.categoryId?.toString() === node.key ||
                  (searchParams?.categoryId === null && node.key === "all");

                return (
                  <div
                    className={cn(
                      "group flex items-center py-1.5 transition-colors",
                      isSelected
                        ? "text-blue-600 font-medium"
                        : "text-slate-600"
                    )}
                  >
                    <span className="text-sm">
                      {node.title as React.ReactNode}
                    </span>
                  </div>
                );
              }}
              className="[&_.ant-tree-node-content-wrapper]:px-2 [&_.ant-tree-node-content-wrapper]:rounded-md [&_.ant-tree-treenode]:py-1"
            />
          </ConfigProvider>
        </ScrollArea>
      )}
    </div>
  );
};

export default LeftCategoryTree;
