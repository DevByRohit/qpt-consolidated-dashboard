import React, { useMemo } from "react";

const LateAttendanceSummary = ({ payroll = [] }) => {
  // =========================================================
  // BUILD FIRM-WISE LATE ATTENDANCE DATA
  // =========================================================

  const data = useMemo(() => {
    const firmSummary = {};

    payroll.forEach((record) => {
      const firm = record.firm || "UNKNOWN";

      if (!firmSummary[firm]) {
        firmSummary[firm] = {
          firm,
          lateHours: 0,
          lateDeduction: 0,
        };
      }

      firmSummary[firm].lateHours += Number(record.lateHours || 0);

      firmSummary[firm].lateDeduction += Number(record.lateDeduction || 0);
    });

    return Object.values(firmSummary).sort((a, b) => b.lateHours - a.lateHours);
  }, [payroll]);

  // =========================================================
  // MAXIMUM VALUES
  // =========================================================

  const maxLateHours =
    data.length > 0 ? Math.max(...data.map((item) => item.lateHours)) : 0;

  const maxLateDeduction =
    data.length > 0 ? Math.max(...data.map((item) => item.lateDeduction)) : 0;

  // =========================================================
  // TOTALS
  // =========================================================

  const totalLateHours = data.reduce(
    (total, item) => total + item.lateHours,
    0,
  );

  const totalLateDeduction = data.reduce(
    (total, item) => total + item.lateDeduction,
    0,
  );

  // =========================================================
  // FORMATTERS
  // =========================================================

  const formatHours = (value) => {
    return Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    });
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
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
          Late Attendance Summary
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Late hours and resulting salary deductions by firm.
        </p>
      </div>

      {data.length > 0 ? (
        <>
          {/* =================================================
              LATE HOURS
          ================================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Late Hours
              </p>

              <p className="text-sm font-semibold text-slate-700">
                {formatHours(totalLateHours)} hrs
              </p>
            </div>

            <div className="space-y-4">
              {data.map((item) => {
                const width =
                  maxLateHours > 0 ? (item.lateHours / maxLateHours) * 100 : 0;

                return (
                  <div key={item.firm}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.firm}
                      </span>

                      <span className="text-sm font-semibold text-slate-700">
                        {formatHours(item.lateHours)} hrs
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all duration-500"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* =================================================
              SEPARATOR
          ================================================== */}

          <div className="my-6 border-t border-slate-100" />

          {/* =================================================
              LATE DEDUCTION
          ================================================== */}

          <div>
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Salary Deduction
              </p>

              <p className="text-sm font-semibold text-red-600">
                {formatCurrency(totalLateDeduction)}
              </p>
            </div>

            <div className="space-y-4">
              {data.map((item) => {
                const width =
                  maxLateDeduction > 0
                    ? (item.lateDeduction / maxLateDeduction) * 100
                    : 0;

                return (
                  <div key={item.firm}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        {item.firm}
                      </span>

                      <span className="text-sm font-semibold text-red-600">
                        {formatCurrency(item.lateDeduction)}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-red-400 transition-all duration-500"
                        style={{
                          width: `${width}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <div className="py-10 text-center">
          <p className="text-sm text-slate-500">
            No late attendance data available.
          </p>
        </div>
      )}

      {/* =====================================================
          FOOTER
      ====================================================== */}

      {data.length > 0 && (
        <div className="mt-6 border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">Total Late Deduction</span>

            <span className="text-base font-semibold text-red-600">
              {formatCurrency(totalLateDeduction)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LateAttendanceSummary;
