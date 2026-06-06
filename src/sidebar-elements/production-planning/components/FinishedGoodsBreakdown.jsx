import { useState } from "react";

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

const FinishedGoodsBreakdown = ({ fgBreakdown }) => {
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (productId) => {
    setExpandedCard(expandedCard === productId ? null : productId);
  };

  // Sort FG Cards
  const sortedFGs = [...fgBreakdown].sort((a, b) => {
    const getPriority = (fg) => {
      if (!fg.can_produce) return 1;
      if (fg.short_items > 0) return 2;
      return 3;
    };

    return getPriority(a) - getPriority(b);
  });

  return (
    <div className="mt-4">
      <div className="bg-white border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b">
          <h2 className="text-lg font-bold">Finish Goods Wise Analysis</h2>

          <p className=" text-gray-600">
            Product-wise material planning and shortage analysis
          </p>
        </div>

        <div className="p-4 space-y-4">
          {sortedFGs.map((fg) => (
            <div
              key={fg.product_id}
              className={`rounded-lg overflow-hidden border-2 ${
                !fg.can_produce
                  ? "border-red-300"
                  : fg.short_items > 0
                    ? "border-yellow-300"
                    : "border-green-300"
              }`}
            >
              {/* Header */}
              <div
                className={`p-4 ${
                  !fg.can_produce
                    ? "bg-red-50"
                    : fg.short_items > 0
                      ? "bg-yellow-50"
                      : "bg-green-50"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{fg.product_name}</h3>

                    <p className="text-sm text-gray-500">{fg.fg_code}</p>
                  </div>

                  <div className="text-right">
                    {fg.can_produce ? (
                      <span className="px-3 py-1 rounded-full font-medium bg-green-100 text-green-700">
                        Ready For Production
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full font-medium bg-red-100 text-red-700">
                        Cannot Produce
                      </span>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="flex items-center justify-between mt-2 text-center">
                  <div>
                    <p className="text-lg text-gray-600 font-medium">
                      Production Quantity
                    </p>
                    <p className="font-medium">{fg.production_qty}</p>
                  </div>

                  <div>
                    <p className="text-lg text-gray-600 font-medium">
                      Total Raw Materials
                    </p>
                    <p className="font-medium">{fg.total_materials}</p>
                  </div>

                  <div>
                    <p className="text-lg text-gray-600 font-medium">
                      Short Raw Materials
                    </p>
                    <p className="font-medium">{fg.short_items}</p>
                  </div>

                  <div className="">
                    <p className="text-lg text-gray-600 font-medium">
                      Total Production Cost
                    </p>
                    <p className="font-medium">
                      ₹ {fg.total_cost.toLocaleString()}
                    </p>
                  </div>

                  {/* View Details Button */}
                  <button
                    onClick={() => toggleCard(fg.product_id)}
                    className="px-2 py-1.5 border-2 border-gray-500 rounded-md font-medium cursor-pointer hover:bg-white transition"
                  >
                    Detailed View Analysis
                  </button>
                </div>
              </div>

              {/* Details */}
              {expandedCard === fg.product_id && (
                <div className="overflow-auto">
                  <table className="w-full text-sm border-t">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="text-left px-4 py-3">Material Name</th>

                        <th className="text-center px-4 py-3">Required</th>

                        <th className="text-center px-4 py-3">Opening</th>

                        <th className="text-center px-4 py-3">Remaining</th>

                        <th className="text-center px-4 py-3">Shortage</th>

                        <th className="text-center px-4 py-3">Cost / Unit</th>

                        <th className="text-center px-4 py-3">Total Cost</th>

                        <th className="text-center px-4 py-3">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[...fg.materials]
                        .sort((a, b) => {
                          const getStatusPriority = (status) => {
                            switch (status) {
                              case "OUT OF STOCK":
                                return 1;
                              case "SHORT":
                                return 2;
                              case "OK":
                                return 3;
                              default:
                                return 4;
                            }
                          };

                          return (
                            getStatusPriority(a.status) -
                            getStatusPriority(b.status)
                          );
                        })
                        .map((material) => (
                          <tr
                            key={material.raw_material_id}
                            className={`border-t hover:bg-gray-50 ${
                              material.status === "OUT OF STOCK"
                                ? "bg-red-50"
                                : material.status === "SHORT"
                                  ? "bg-yellow-50"
                                  : ""
                            }`}
                          >
                            <td className="px-4 py-3 font-medium">
                              {material.material_name}
                            </td>

                            <td className="px-4 py-3 text-center font-medium">
                              {material.required_qty}
                            </td>

                            <td className="px-4 py-3 text-center font-medium">
                              {material.opening_stock}
                            </td>

                            <td className="px-4 py-3 text-center font-medium">
                              {material.remaining_stock}
                            </td>

                            <td className="px-4 py-3 text-center font-medium">
                              {material.shortage}
                            </td>

                            <td className="px-4 py-3 text-center font-medium">
                              ₹ {material.cost_per_unit}
                            </td>

                            <td className="px-4 py-3 text-center font-medium">
                              ₹ {material.total_cost.toLocaleString()}
                            </td>

                            <td className="px-4 py-3 text-center">
                              <span
                                className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(
                                  material.status,
                                )}`}
                              >
                                {material.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinishedGoodsBreakdown;
