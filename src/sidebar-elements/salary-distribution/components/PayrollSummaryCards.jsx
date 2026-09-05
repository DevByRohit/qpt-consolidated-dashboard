import React from "react";

const PayrollSummaryCards = ({ summary, loading }) => {
  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5 text-center">
      {/* =====================================================
          TOTAL EMPLOYEES
      ====================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-slate-800 font-medium">Total Employees</p>

        <p className="mt-1 text-2xl font-semibold text-slate-800">
          {loading ? "—" : formatNumber(summary.totalEmployees)}
        </p>
      </div>

      {/* =====================================================
          ACTIVE EMPLOYEES
      ====================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-slate-800 font-medium">Active Employees</p>

        <p className="mt-1 text-2xl font-semibold text-slate-800">
          {loading ? "—" : formatNumber(summary.activeEmployees)}
        </p>
      </div>

      {/* =====================================================
          DISMISSED EMPLOYEES
      ====================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-slate-800 font-medium">Dismissed Employees</p>

        <p className="mt-1 text-2xl font-semibold text-slate-800">
          {loading ? "—" : formatNumber(summary.dismissedEmployees)}
        </p>
      </div>

      {/* =====================================================
          AVERAGE FIXED SALARY
      ====================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-slate-800 font-medium">Average Fixed Salary</p>

        <p className="mt-1 text-2xl font-semibold text-slate-800">
          {loading ? "—" : formatCurrency(summary.averageFixedSalary)}
        </p>
      </div>

      {/* =====================================================
          TOTAL NET PAYABLE
      ====================================================== */}

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-slate-800 font-medium">Total Net Payable</p>

        <p className="mt-1 text-2xl font-semibold text-emerald-600">
          {loading ? "—" : formatCurrency(summary.totalNetPayable)}
        </p>
      </div>
    </div>
  );
};

export default PayrollSummaryCards;
