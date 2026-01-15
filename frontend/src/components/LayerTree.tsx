import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getCategories } from "../api/facility";

interface Props {
  onCheck: (checkedKeys: React.Key[]) => void;
}

// Configuration for the layer groups and items
const LAYER_GROUPS = [
  {
    title: "排水管网",
    items: [
      { name: "雨水管", icon: "map-ysj.png", type: "line", color: "#699BFF" },
      { name: "污水管", icon: "map-wsj.png", type: "line", color: "#FF9F2E" },
      { name: "合流管", icon: "map-hlj.png", type: "line", color: "#52C41A" },
      { name: "排放口", icon: "map-pfk.png" },
      { name: "雨水口", icon: "map-ysk.png" },
    ],
  },
  {
    title: "检查井",
    items: [
      { name: "雨水井", icon: "map-ysj.png" },
      { name: "污水井", icon: "map-wsj.png" },
      { name: "合流井", icon: "map-hlj.png" },
    ],
  },
  {
    title: "泵闸",
    items: [
      { name: "泵站", icon: "map-bz.png" },
      { name: "水闸", icon: "map-sz.png" },
      { name: "闸泵站", icon: "map-zbz.png" },
    ],
  },
  {
    title: "污水厂",
    items: [{ name: "污水处理厂", icon: "map-wsclc.png" }],
  },
  {
    title: "低洼地",
    items: [{ name: "低洼地区", icon: "map-dwdq.png" }],
  },
  {
    title: "排水户",
    items: [{ name: "排水户", icon: "map-psh.png" }],
  },
];

const LayerTree: React.FC<Props> = ({ onCheck }) => {
  const [activeItems, setActiveItems] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    // Fetch real categories to map names to IDs
    const fetchCategories = async () => {
      try {
        const res: any = await getCategories();
        if (Array.isArray(res)) {
          setCategories(res);
          // Default select all that exist in our config
          const allNames = LAYER_GROUPS.flatMap((g) =>
            g.items.map((i) => i.name)
          );
          // We want to activate items that match specific categories
          setActiveItems(new Set(allNames));

          // Initial check trigger
          // We need to map names to IDs for the parent component to filter
          // OR the parent could filter by name/alias.
          // Current MapContainer filters by ID (String(k)).
          // Let's find IDs for these names.
          const ids = res
            .filter((c: any) => allNames.includes(c.alias || c.name))
            .map((c: any) => String(c.id));
          onCheck(ids);
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  const toggleItem = (itemName: string) => {
    const newSet = new Set(activeItems);
    if (newSet.has(itemName)) {
      newSet.delete(itemName);
    } else {
      newSet.add(itemName);
    }
    setActiveItems(newSet);

    // Convert active names to IDs
    const activeNames = Array.from(newSet);
    const ids = categories
      .filter((c: any) => activeNames.includes(c.alias || c.name))
      .map((c: any) => String(c.id));
    onCheck(ids);
  };

  return (
    <div className="absolute top-4 left-4 z-10 w-[300px] overflow-hidden rounded-lg bg-[rgba(12,35,76,0.9)] text-white shadow-2xl backdrop-blur-sm border border-[#1e3a8a]">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-[#1e3a8a] bg-[rgba(24,144,255,0.1)] px-4 py-3">
        <span className="font-medium">设施图层</span>
      </div>

      {/* Content */}
      <div className="max-h-[600px] overflow-y-auto p-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {LAYER_GROUPS.map((group) => (
          <div key={group.title} className="mb-4">
            <div className="mb-2 px-2 text-base font-medium text-[#cce6ff] opacity-90">
              {group.title}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {group.items.map((item) => {
                const isActive = activeItems.has(item.name);
                return (
                  <div
                    key={item.name}
                    className={`
                      relative flex cursor-pointer flex-col items-center justify-center gap-1 rounded bg-[rgba(255,255,255,0.05)] py-2 transition-all
                      ${
                        isActive
                          ? "bg-[rgba(24,144,255,0.2)] shadow-[0_0_10px_rgba(24,144,255,0.3)]"
                          : "hover:bg-[rgba(255,255,255,0.1)]"
                      }
                    `}
                    onClick={() => toggleItem(item.name)}
                  >
                    {/* Active Indicator Line */}
                    {isActive && (
                      <div className="absolute bottom-0 h-[2px] w-4/5 rounded-full bg-[#1890ff] shadow-[0_0_8px_#1890ff]"></div>
                    )}

                    {/* Icon or Line representation */}
                    {item.type === "line" ? (
                      <div className="flex h-6 w-6 items-center justify-center">
                        <div
                          className="h-1 w-6 rounded-full shadow-sm"
                          style={{ backgroundColor: item.color }}
                        ></div>
                      </div>
                    ) : (
                      <div className="h-6 w-6">
                        <img
                          src={`/textures/gis/${item.icon}`}
                          alt={item.name}
                          className="h-full w-full object-contain drop-shadow-md"
                        />
                      </div>
                    )}

                    <span
                      className={`text-xs ${
                        isActive
                          ? "text-white font-medium shadow-black drop-shadow-sm"
                          : "text-gray-400"
                      }`}
                    >
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerTree;
