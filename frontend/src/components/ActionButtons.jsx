const ActionButtons = ({ row, onEdit, onDelete }) => (
  <div className="flex gap-2">
    <button className="text-blue-500" onClick={onEdit}>
      Edit
    </button>
    <button className="text-red-500" onClick={onDelete}>
      Delete
    </button>
  </div>
);

export default ActionButtons;
