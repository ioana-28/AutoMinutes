interface Props {
  item: any;
  onDelete: () => void;
  onEdit: () => void;
}

const ActionItemCard = ({ item, onDelete, onEdit }: Props) => {
  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="flex justify-between">
        <h3>{item.description}</h3>
        <span>{item.deadline}</span>
      </div>

      <p>{item.assignee}</p>

      <div className="flex gap-2 mt-3">
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  );
};

export default ActionItemCard;