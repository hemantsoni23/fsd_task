const ActionButtons = ({ row, onEdit, onDelete }) => (
  <div className="flex gap-2">
    <button className="text-accent" onClick={onEdit}>
      Edit
    </button>
    <button className="text-destructive" onClick={onDelete}>
      Delete
    </button>
  </div>
);

export default ActionButtons;
