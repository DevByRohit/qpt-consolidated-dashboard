import React from "react";

const MasterOverviewFilters = ({
  payrollMonth,
  setPayrollMonth,
  firm,
  setFirm,
  employeeStatus,
  setEmployeeStatus,
}) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* =================================================
            PAYROLL MONTH
        ================================================== */}

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Payroll Month
          </label>

          <input
            type="month"
            value={payrollMonth}
            onChange={(event) => setPayrollMonth(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          />
        </div>

        {/* =================================================
            FIRM
        ================================================== */}

        <div>
          <label className="mb-2 block font-medium text-slate-700">Firm</label>

          <select
            value={firm}
            onChange={(event) => setFirm(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="ALL">All Firms</option>

            <option value="QPT">QPT</option>

            <option value="APT">APT</option>

            <option value="SPI">SPI</option>
          </select>
        </div>

        {/* =================================================
            EMPLOYEE STATUS
        ================================================== */}

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Employee Status
          </label>

          <select
            value={employeeStatus}
            onChange={(event) => setEmployeeStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="ALL">All Employees</option>
            <option value="Active">Active</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default MasterOverviewFilters;
