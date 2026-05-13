import { useEffect, useState } from "react";
import ActionItemCard from "../../molecules/ActionItemCard/ActionItemCard";
import { getAllActionItems } from "../../../api/ActionItemApi";

const ActionItemList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    const data = await getAllActionItems();
    setItems(data);
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item: any) => (
        <ActionItemCard
          key={item.id}
          item={item}
          onDelete={() => {}}
          onEdit={() => {}}
        />
      ))}
    </div>
  );
};

export default ActionItemList;