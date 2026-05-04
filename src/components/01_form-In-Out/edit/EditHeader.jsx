const EditHeader = ({
  selectedDate,
  setSelectedDate,
  onRefresh,
  transactions,
}) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "Admin" || user?.role === "Developer";

  return (
    <div className="sticky top-0 flex justify-between items-center">
      <h1 className="text-2xl font-bold uppercase">Edit In/Out Transactions</h1>

      <div className="flex items-center gap-3">
        {isAdmin && (
          <input
            type="date"
            value={selectedDate.toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(new Date(e.target.value))}
            className="border px-2 py-1 rounded cursor-pointer font-medium"
          />
        )}

        <button
          onClick={onRefresh}
          className="border px-3 py-1 rounded hover:bg-gray-800 hover:text-white font-medium cursor-pointer"
        >
          Refresh
        </button>

        <div className="border px-2 py-1 rounded">
          <h3 className="font-medium">Total Entry : {transactions.length}</h3>
        </div>
      </div>
    </div>
  );
};

export default EditHeader;
