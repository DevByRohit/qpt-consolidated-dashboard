import React, { useMemo } from "react";

const WorkforceByFirm = ({ employees = [] }) => {
  // =========================================================
  // BUILD FIRM-WISE WORKFORCE DATA
  // =========================================================

  /*
    employees comes from MasterOverview's filteredEmployees.

    Therefore this component automatically respects:

    Firm filter
    Employee Status filter
  */

  const data = useMemo(() => {
    const firmCounts = {};

    employees.forEach((employee) => {
      const firm = employee.firm || "UNKNOWN";

      if (!firmCounts[firm]) {
        firmCounts[firm] = 0;
      }

      firmCounts[firm] += 1;
    });

    return Object.entries(firmCounts)
      .map(([firm, employees]) => ({
        firm,
        employees,
      }))
      .sort((a, b) => b.employees - a.employees);
  }, [employees]);

  // =========================================================
  // MAXIMUM VALUE
  // =========================================================

  const maxEmployees =
    data.length > 0 ? Math.max(...data.map((item) => item.employees)) : 0;

  // =========================================================
  // TOTAL WORKFORCE
  // =========================================================

  const totalWorkforce = employees.length;

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6">
        <h2 className="text-base font-semibold text-slate-800">
          Workforce by Firm
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Employee distribution across company firms.
        </p>
      </div>

      {/* =====================================================
          FIRMS
      ====================================================== */}

      {data.length > 0 ? (
        <div className="space-y-6">
          {data.map((item) => {
            const width =
              maxEmployees > 0 ? (item.employees / maxEmployees) * 100 : 0;

            return (
              <div key={item.firm}>
                {/* Firm + Employee Count */}

                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-700">
                    {item.firm}
                  </span>

                  <span className="text-sm font-semibold text-slate-700">
                    {item.employees}
                  </span>
                </div>

                {/* Progress Bar */}

                <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{
                      width: `${width}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-slate-500">No employee data available.</p>
        </div>
      )}

      {/* =====================================================
          TOTAL
      ====================================================== */}

      <div className="mt-6 border-t border-slate-100 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Total Workforce</span>

          <span className="text-lg font-semibold text-slate-800">
            {totalWorkforce.toLocaleString("en-IN")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WorkforceByFirm;
