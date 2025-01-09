const ActionButtons = ({ row, onEdit, onDelete }) => (
  <div className="flex gap-2">
    <button className="px-4 py-2 bg-primary text-white rounded hover:bg-hover-color" onClick={onEdit}>
      Edit
    </button>
    <button className="px-4 py-2 bg-destructive text-white rounded hover:bg-hover-color" onClick={onDelete}>
      Delete
    </button>
  </div>
);

export default ActionButtons;
