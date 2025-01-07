const ActionButtons = ({ row, fetchData }) => {
  const handleEdit = async () => {
    try {
      // Add edit logic here
      console.log("Editing row:", row);
      fetchData();
    } catch (error) {
      console.error("Error editing row:", error);
    }
  };

  const handleDelete = async () => {
    try {
      // Add delete logic here
      console.log("Deleting row:", row);
      fetchData();
    } catch (error) {
      console.error("Error deleting row:", error);
    }
  };

  return (
    <div className="flex gap-2">
      <button className="text-blue-500" onClick={handleEdit}>
        Edit
      </button>
      <button className="text-red-500" onClick={handleDelete}>
        Delete
      </button>
    </div>
  );
};

export default ActionButtons;
    