import React, { useEffect, useState } from "react";
import { Tree, Card } from "antd";
import { getCategories } from "../api/facility";

interface Props {
  onCheck: (checkedKeys: React.Key[]) => void;
}

const LayerTree: React.FC<Props> = ({ onCheck }) => {
  const [treeData, setTreeData] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res: any = await getCategories();
        // Map to tree data
        const nodes = res.map((cat: any) => ({
          title: cat.name,
          key: cat.id,
          isLeaf: true,
        }));
        setTreeData([
          {
            title: "Facilities",
            key: "all",
            children: nodes,
          },
        ]);
        // Default check all
        setCheckedKeys(["all", ...nodes.map((n: any) => n.key)]);
        onCheck(nodes.map((n: any) => n.key));
      } catch (e) {
        console.error(e);
      }
    };
    fetchCategories();
  }, []);

  const handleCheck = (checked: any) => {
    // If checked is object (checked, halfChecked), take checked
    const keys = Array.isArray(checked) ? checked : checked.checked;
    setCheckedKeys(keys);

    // Filter out 'all' key and pass only category IDs
    const categoryIds = keys.filter((k: any) => k !== "all");
    onCheck(categoryIds);
  };

  return (
    <Card
      title="Layer Control"
      size="small"
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 1000,
        width: 200,
        opacity: 0.9,
      }}
    >
      <Tree
        checkable
        defaultExpandAll
        treeData={treeData}
        checkedKeys={checkedKeys}
        onCheck={handleCheck}
      />
    </Card>
  );
};

export default LayerTree;
