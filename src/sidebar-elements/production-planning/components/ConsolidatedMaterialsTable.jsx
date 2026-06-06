const getStatusStyle = (status) => {
  switch (status) {
    case "OK":
      return "bg-green-100 text-green-700";

    case "SHORT":
      return "bg-yellow-100 text-yellow-700";

    case "OUT OF STOCK":
      return "bg-red-100 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
};

const ConsolidatedMaterialsTable = ({ materials }) => {
  // Status Counts
  const outOfStockCount = materials.filter(
    (item) => item.status === "OUT OF STOCK",
  ).length;

  const shortCount = materials.filter((item) => item.status === "SHORT").length;

  const okCount = materials.filter((item) => item.status === "OK").length;

  // Sort Materials
  const sortedMaterials = [...materials].sort((a, b) => {
    const priority = {
      "OUT OF STOCK": 1,
      SHORT: 2,
      OK: 3,
    };

    return priority[a.status] - priority[b.status];
  });

  return (
    <div className="bg-white border rounded-lg mt-4 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-4 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">
            Consolidated Material Planning
          </h2>

          <p className="text-sm text-gray-500">
            Combined material requirement for all selected FG products
          </p>
        </div>

        {/* Status Summary */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            Out Of Stock : {outOfStockCount}
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            Short : {shortCount}
          </span>

          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            OK : {okCount}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-4 py-3">Material Name</th>

              <th className="text-center px-4 py-3">Unit</th>

              <th className="text-center px-4 py-3">Required</th>

              <th className="text-center px-4 py-3">Available</th>

              <th className="text-center px-4 py-3">Shortage</th>

              <th className="text-center px-4 py-3">Cost / Unit</th>

              <th className="text-center px-4 py-3">Total Cost</th>

              <th className="text-center px-4 py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {sortedMaterials.map((item) => (
              <tr
                key={item.raw_material_id}
                className={`border-t hover:bg-gray-50 ${
                  item.status === "OUT OF STOCK"
                    ? "bg-red-50"
                    : item.status === "SHORT"
                      ? "bg-yellow-50"
                      : ""
                }`}
              >
                <td className="px-4 py-3 font-medium">{item.material_name}</td>

                <td className="px-4 py-3 text-center">{item.unit}</td>

                <td className="px-4 py-3 text-center font-medium">
                  {item.required_qty}
                </td>

                <td className="px-4 py-3 text-center">{item.available_qty}</td>

                <td className="px-4 py-3 text-center font-medium">
                  {item.shortage}
                </td>

                <td className="px-4 py-3 text-center">
                  ₹ {item.cost_per_unit}
                </td>

                <td className="px-4 py-3 text-center font-medium">
                  ₹ {item.total_cost.toLocaleString()}
                </td>

                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(
                      item.status,
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsolidatedMaterialsTable;
