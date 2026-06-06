const PrintConsolidatedReport = ({ planningResult, payload, products }) => {
  const getProductName = (productId) => {
    const product = products.find((p) => p.product_id === productId);

    return product?.product_name || productId;
  };

  return (
    <>
      <style>
        {`
      @page {
        size: A4 portrait;
        margin: 8mm 8mm;
      }

      @media print {
        body {
          margin: 0;
        }
      }
    `}
      </style>
      <div className="bg-white text-black">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Full Kitting Report</h1>

          <div className="text-gray-800">
            <strong>Generated On :</strong> {new Date().toLocaleString()}
          </div>
        </div>

        {/* Planning Inputs */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-1">Planning Inputs</h2>

          <table className="w-full border border-black text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left">
                  FG Name
                </th>

                <th className="border border-black px-3 py-2 text-right w-40">
                  Qty
                </th>
              </tr>
            </thead>

            <tbody>
              {payload?.items?.map((item) => (
                <tr key={item.product_id}>
                  <td className="border border-black px-3 py-2">
                    {getProductName(item.product_id)}
                  </td>

                  <td className="border border-black px-3 py-2 text-right">
                    {item.qty}
                  </td>
                </tr>
              ))}

              <tr className="font-semibold">
                <td className="border border-black px-3 py-2">Markup %</td>

                <td className="border border-black px-3 py-2 text-right">
                  {payload?.markup_percent || 0}%
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-1">Summary</h2>

          <table className="w-full border border-black text-sm">
            <tbody>
              <tr>
                <td className="border border-black px-3 py-2 font-medium">
                  Total Materials
                </td>

                <td className="border border-black px-3 py-2 text-right">
                  {planningResult?.summary?.total_materials || 0}
                </td>
              </tr>

              <tr>
                <td className="border border-black px-3 py-2 font-medium">
                  Short Items
                </td>

                <td className="border border-black px-3 py-2 text-right">
                  {planningResult?.summary?.short_items || 0}
                </td>
              </tr>

              <tr>
                <td className="border border-black px-3 py-2 font-medium">
                  Production Cost
                </td>

                <td className="border border-black px-3 py-2 text-right">
                  ₹{" "}
                  {(
                    planningResult?.summary?.total_production_cost || 0
                  ).toLocaleString()}
                </td>
              </tr>

              <tr>
                <td className="border border-black px-3 py-2 font-medium">
                  Markup %
                </td>

                <td className="border border-black px-3 py-2 text-right">
                  {planningResult?.summary?.markup_percent || 0}%
                </td>
              </tr>

              <tr className="font-bold">
                <td className="border border-black px-3 py-2">
                  Minimum Selling Price
                </td>

                <td className="border border-black px-3 py-2 text-right">
                  ₹{" "}
                  {(
                    planningResult?.summary?.minimum_selling_price || 0
                  ).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Consolidated Materials */}
        <div>
          <h2 className="text-xl font-semibold  mb-1">
            Consolidated Material Planning
          </h2>

          <table className="w-full border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-2 py-2 text-left">
                  Material Name
                </th>

                <th className="border border-black px-2 py-2 text-center">
                  Unit
                </th>

                <th className="border border-black px-2 py-2 text-center">
                  Required
                </th>

                <th className="border border-black px-2 py-2 text-center">
                  Available
                </th>

                <th className="border border-black px-2 py-2 text-center">
                  Shortage
                </th>

                <th className="border border-black px-2 py-2 text-center">
                  Cost / Unit
                </th>

                <th className="border border-black px-2 py-2 text-center">
                  Total Cost
                </th>

                <th className="border border-black px-2 py-2 text-center">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {[...(planningResult?.materials || [])]
                .sort((a, b) => {
                  const priority = {
                    "OUT OF STOCK": 1,
                    SHORT: 2,
                    OK: 3,
                  };

                  return priority[a.status] - priority[b.status];
                })
                .map((material) => (
                  <tr key={material.raw_material_id}>
                    <td className="border border-black px-2 py-2">
                      {material.material_name}
                    </td>

                    <td className="border border-black px-2 py-2 text-center">
                      {material.unit}
                    </td>

                    <td className="border border-black px-2 py-2 text-center">
                      {material.required_qty}
                    </td>

                    <td className="border border-black px-2 py-2 text-center">
                      {material.available_qty}
                    </td>

                    <td className="border border-black px-2 py-2 text-center">
                      {material.shortage}
                    </td>

                    <td className="border border-black px-2 py-2 text-center">
                      ₹ {material.cost_per_unit}
                    </td>

                    <td className="border border-black px-2 py-2 text-center">
                      ₹ {material.total_cost.toLocaleString()}
                    </td>

                    <td className="border border-black px-2 py-2 text-center">
                      {material.status}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PrintConsolidatedReport;
