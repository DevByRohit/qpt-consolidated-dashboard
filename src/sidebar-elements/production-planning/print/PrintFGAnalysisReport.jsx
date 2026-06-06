import React from "react";

const PrintFGAnalysisReport = ({ planningResult, payload, products }) => {
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
            margin: 8mm;
          }

          @media print {
            body {
              margin: 0;
            }

            thead {
              display: table-header-group;
            }

            tr {
              page-break-inside: avoid;
            }
          }
        `}
      </style>

      <div className="bg-white text-black text-sm">
        {/* Report Header */}
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Full Kitting Report</h1>

          <div>
            <strong>Generated On :</strong> {new Date().toLocaleString()}
          </div>
        </div>

        {/* Planning Inputs */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Planning Inputs</h2>

          <table className="w-full border border-black">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black px-3 py-2 text-left">
                  FG Name
                </th>

                <th className="border border-black px-3 py-2 text-right">
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

        {/* FG Analysis */}
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Finished Goods Wise Analysis
          </h2>

          {planningResult?.fg_breakdown?.map((fg, index) => (
            <div key={fg.product_id}>
              {/* FG Header */}
              <div
                className="border-t border-l border-r p-3"
                style={{
                  pageBreakBefore: index === 0 ? "auto" : "always",
                }}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{fg.product_name}</h3>

                    <p className="text-xs text-gray-700">{fg.fg_code}</p>
                  </div>

                  <div>
                    {fg.can_produce ? (
                      <span className="font-semibold">
                        READY FOR PRODUCTION
                      </span>
                    ) : (
                      <span className="font-semibold">CANNOT PRODUCE</span>
                    )}
                  </div>
                </div>
              </div>

              {/* FG Summary */}
              <div className="flex justify-between items-center text-center border-t border-l border-r p-3">
                <div className="">
                  <div className="text-sm">Production Quantity</div>

                  <div className="font-semibold">{fg.production_qty}</div>
                </div>

                <div className="">
                  <div className="text-sm">Total Raw Materials</div>

                  <div className="font-semibold">{fg.total_materials}</div>
                </div>

                <div className="">
                  <div className="text-sm">Short Raw Materials</div>

                  <div className="font-semibold">{fg.short_items}</div>
                </div>

                <div className="">
                  <div className="text-sm">Total Production Cost</div>

                  <div className="font-semibold">
                    ₹ {fg.total_cost.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Material Table */}
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-black px-2 py-2 text-left">
                      Material Name
                    </th>

                    <th className="border border-black px-2 py-2 text-center">
                      Required
                    </th>

                    <th className="border border-black px-2 py-2 text-center">
                      Available
                    </th>

                    {/* <th className="border border-black px-2 py-2 text-center">
                      Remaining
                    </th> */}

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
                  {[...fg.materials]
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
                          {material.required_qty}
                        </td>

                        <td className="border border-black px-2 py-2 text-center">
                          {material.opening_stock}
                        </td>

                        {/* <td className="border border-black px-2 py-2 text-center">
                          {material.remaining_stock}
                        </td> */}

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
          ))}
        </div>
      </div>
    </>
  );
};

export default PrintFGAnalysisReport;
