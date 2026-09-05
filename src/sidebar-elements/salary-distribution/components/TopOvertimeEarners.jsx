import React, { useMemo } from "react";

const TopOvertimeEarners = ({ payroll = [] }) => {
  // =========================================================
  // PREPARE TOP 10 OVERTIME EMPLOYEES
  // =========================================================

  const data = useMemo(() => {
    return payroll
      .map((record) => ({
        employeeId: record.employeeId,
        name: record.employeeName,
        firm: record.firm,
        otHours: Number(record.otHours || 0),
      }))
      .filter((employee) => employee.otHours > 0)
      .sort((a, b) => b.otHours - a.otHours)
      .slice(0, 10);
  }, [payroll]);

  // =========================================================
  // MAX OT HOURS
  // =========================================================

  const maxOtHours =
    data.length > 0 ? Math.max(...data.map((item) => item.otHours)) : 0;

  // =========================================================
  // FORMAT HOURS
  // =========================================================

  const formatHours = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

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
          Top 10 Overtime Earners
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Employees with the highest overtime hours.
        </p>
      </div>

      {/* =====================================================
          BAR CHART
      ====================================================== */}

      {data.length > 0 ? (
        <div className="space-y-4">
          {data.map((employee, index) => {
            const width =
              maxOtHours > 0 ? (employee.otHours / maxOtHours) * 100 : 0;

            return (
              <div key={employee.employeeId}>
                {/* Employee Information */}

                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-2">
                    {/* Rank */}

                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      {index + 1}
                    </span>

                    {/* Name + Firm */}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-slate-800">
                        {employee.name}
                      </p>

                      <p className="text-xs text-slate-500">{employee.firm}</p>
                    </div>
                  </div>

                  {/* OT Hours */}

                  <span className="shrink-0 text-sm font-semibold text-emerald-600">
                    {formatHours(employee.otHours)} hrs
                  </span>
                </div>

                {/* Horizontal Bar */}

                <div className="ml-8 h-3 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-500"
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
        <div className="py-10 text-center">
          <p className="text-sm text-slate-500">No overtime data available.</p>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ====================================================== */}

      {data.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Highest OT</span>

            <span className="text-sm font-semibold text-slate-800">
              {formatHours(maxOtHours)} hrs
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopOvertimeEarners;
