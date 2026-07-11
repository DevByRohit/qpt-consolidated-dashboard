import { Printer, Save } from "lucide-react";

const JobCardDocument = ({ jobCard, handlePrint, handleSave }) => {
  if (!jobCard) return null;

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
      }`}
      </style>

      <div className="">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-t-2 border-slate-600 px-1 py-2">
          <h1 className="text-2xl font-bold text-center uppercase">
            QUALITEX POWER TOOLS
          </h1>

          <h1 className="text-2xl font-bold text-center uppercase">Job Card</h1>
        </div>

        {/* Job Card Information */}
        <div className="py-3">
          <div className="grid grid-cols-2 gap-x-10 gap-y-1 text-[16px]">
            <div className="flex">
              <span className="w-40 font-bold">Job Card No.</span>
              <span>: {jobCard.job_card_no}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-bold">Date</span>
              <span>: {jobCard.date}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-bold">FG Name</span>
              <span>: {jobCard.product_name}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-bold">FG Code</span>
              <span>: {jobCard.fg_code}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-bold">Planned Qty</span>
              <span>
                : {jobCard.planned_qty} {jobCard.unit}
              </span>
            </div>

            <div className="flex">
              <span className="w-40 font-bold">Total Materials</span>
              <span>: {jobCard.total_materials}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-bold">Supervisor</span>
              <span>: {jobCard.supervisor_name}</span>
            </div>

            <div className="flex">
              <span className="w-40 font-bold">Storekeeper</span>
              <span>: {jobCard.storekeeper_name}</span>
            </div>
          </div>
        </div>

        {/* Raw Material Table */}
        <div className="">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-700">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-700 px-2 py-2 w-14">
                    S.No
                  </th>
                  <th className="border border-slate-700 px-2 py-2 text-left">
                    Material Name
                  </th>
                  <th className="border border-slate-700 px-2 py-2 w-20">
                    Unit
                  </th>
                  <th className="border border-slate-700 px-2 py-2 w-24">
                    Qty/Unit
                  </th>
                  <th className="border border-slate-700 px-2 py-2 w-28">
                    Required
                  </th>
                  <th className="border border-slate-700 px-2 py-2 w-28">
                    Issued
                  </th>
                  {/* <th className="border border-slate-700 px-2 py-2 w-28">
                    Balance
                  </th> */}
                </tr>
              </thead>

              <tbody>
                {jobCard.materials.map((item) => (
                  <tr key={item.raw_material_id}>
                    <td className="border border-slate-700 px-2 py-2 text-center">
                      {item.sno}
                    </td>

                    <td className="border border-slate-700 px-2 py-2">
                      {item.material_name}
                    </td>

                    <td className="border border-slate-700 px-2 py-2 text-center">
                      {item.unit}
                    </td>

                    <td className="border border-slate-700 px-2 py-2 text-center">
                      {item.qty_per_unit}
                    </td>

                    <td className="border border-slate-700 px-2 py-2 text-center">
                      {Number.isInteger(Number(item.required_qty))
                        ? Number(item.required_qty)
                        : Number(item.required_qty).toFixed(2)}
                    </td>

                    {/* Blank for Store */}
                    <td className="border border-slate-700 px-2 py-2 h-10"></td>

                    {/* Blank for Store */}
                    {/* <td className="border border-slate-700 px-2 py-2 h-10"></td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================= PAGE 2 ========================= */}
        <div className="break-before-page mt-4">
          {/* Production & Rejection Tracking */}
          <div className="mb-4">
            <h2 className="text-lg font-bold uppercase mb-1">
              Production & Rejection Tracking
            </h2>

            <table className="w-full table-fixed border-collapse border border-slate-600">
              <thead>
                <tr className="bg-slate-200">
                  <th className="border border-slate-700 py-2 px-2 w-34">
                    Date
                  </th>

                  <th className="border border-slate-700 py-2 px-2 w-28">
                    Produced Qty
                  </th>

                  <th className="border border-slate-700 py-2 px-2 w-28">
                    Rejected Qty
                  </th>

                  <th className="border border-slate-700 py-2 px-2 w-28">
                    Accepted Qty
                  </th>

                  <th className="border border-slate-700 py-2 px-2 w-full">
                    Reason for Rejection
                  </th>
                </tr>
              </thead>

              <tbody>
                {Array.from({ length: 10 }).map((_, index) => (
                  <tr key={index}>
                    <td className="border border-slate-700 h-8"></td>
                    <td className="border border-slate-700"></td>
                    <td className="border border-slate-700"></td>
                    <td className="border border-slate-700"></td>
                    <td className="border border-slate-700"></td>
                    {/* <td className="border border-slate-700"></td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div>
            <h2 className="text-lg font-bold uppercase mb-1">
              Production Summary
            </h2>

            <table className="w-full border-collapse border border-slate-700">
              <tbody>
                <tr>
                  <td className="border border-slate-700 px-3 py-1 font-semibold w-64">
                    Planned Quantity Qty
                  </td>

                  <td className="border border-slate-700 px-3 py-1">
                    {jobCard.planned_qty} {jobCard.unit}
                  </td>
                </tr>

                <tr>
                  <td className="border border-slate-700 px-3 py-1 font-semibold">
                    Total Produced Qty
                  </td>

                  <td className="border border-slate-700 px-3 py-1"></td>
                </tr>

                <tr>
                  <td className="border border-slate-700 px-3 py-1 font-semibold">
                    Total Rejected Qty
                  </td>

                  <td className="border border-slate-700 px-3 py-1"></td>
                </tr>

                <tr>
                  <td className="border border-slate-700 px-3 py-1 font-semibold">
                    Total Accepted Qty
                  </td>

                  <td className="border border-slate-700 px-3 py-1"></td>
                </tr>

                <tr>
                  <td className="border border-slate-700 px-3 py-1 font-semibold">
                    Completion Date
                  </td>

                  <td className="border border-slate-700 px-3 py-1"></td>
                </tr>

                <tr>
                  <td className="border border-slate-700 px-3 py-1 font-semibold">
                    Remark
                  </td>

                  <td className="border border-slate-700 px-3 py-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Signatures */}
          {/* <div className="grid grid-cols-3 gap-12 mt-16">
            <div className="text-center">
              <div className="border-t border-slate-700 pt-2 font-medium">
                Storekeeper
              </div>
            </div>

            <div className="text-center">
              <div className="border-t border-slate-700 pt-2 font-medium">
                Supervisor
              </div>
            </div>

            <div className="text-center">
              <div className="border-t border-slate-700 pt-2 font-medium">
                Production Manager
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default JobCardDocument;
