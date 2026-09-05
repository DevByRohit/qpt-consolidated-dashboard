import { useMemo, useState } from "react";
import MasterOverviewFilters from "./MasterOverviewFilters";
import PayrollSummaryCards from "./PayrollSummaryCards";
import WorkforceByFirm from "./WorkforceByFirm";
import TopOvertimeEarners from "./TopOvertimeEarners";
import LateAttendanceSummary from "./LateAttendanceSummary";
import NetPayableByFirm from "./NetPayableByFirm";

const MasterOverview = ({
  payrollMonth: controlledPayrollMonth,
  setPayrollMonth: controlledSetPayrollMonth,

  masterData = {
    employees: [],
    payroll: [],
  },

  loading = false,
  error = "",

  // =========================================================
  // PAYROLL GENERATION
  // =========================================================

  onGeneratePayroll,
  generatingPayroll = false,
}) => {
  // =========================================================
  // LOCAL FALLBACK MONTH
  // =========================================================

  const [internalPayrollMonth, setInternalPayrollMonth] = useState("2026-07");

  const payrollMonth = controlledPayrollMonth ?? internalPayrollMonth;

  const setPayrollMonth = controlledSetPayrollMonth ?? setInternalPayrollMonth;

  // =========================================================
  // LOCAL FILTERS
  // =========================================================

  const [firm, setFirm] = useState("ALL");

  const [employeeStatus, setEmployeeStatus] = useState("ALL");

  // =========================================================
  // FILTER EMPLOYEES
  // =========================================================

  const filteredEmployees = useMemo(() => {
    return masterData.employees.filter((employee) => {
      const matchesFirm = firm === "ALL" || employee.firm === firm;

      const matchesStatus =
        employeeStatus === "ALL" || employee.status === employeeStatus;

      return matchesFirm && matchesStatus;
    });
  }, [masterData.employees, firm, employeeStatus]);

  // =========================================================
  // FILTER PAYROLL
  // =========================================================

  const filteredPayroll = useMemo(() => {
    return masterData.payroll.filter((record) => {
      const matchesFirm = firm === "ALL" || record.firm === firm;

      const matchesStatus =
        employeeStatus === "ALL" || record.employeeStatus === employeeStatus;

      return matchesFirm && matchesStatus;
    });
  }, [masterData.payroll, firm, employeeStatus]);

  // =========================================================
  // SUMMARY
  // =========================================================

  const summary = useMemo(() => {
    const totalEmployees = filteredEmployees.length;

    const activeEmployees = filteredEmployees.filter(
      (employee) => employee.status === "Active",
    ).length;

    const dismissedEmployees = filteredEmployees.filter(
      (employee) => employee.status === "Dismissed",
    ).length;

    const totalFixedSalary = filteredEmployees.reduce(
      (total, employee) => total + Number(employee.monthlySalary || 0),
      0,
    );

    const averageFixedSalary =
      totalEmployees > 0 ? totalFixedSalary / totalEmployees : 0;

    const totalNetPayable = filteredPayroll.reduce(
      (total, record) => total + Number(record.netSalary || 0),
      0,
    );

    return {
      totalEmployees,
      activeEmployees,
      dismissedEmployees,
      averageFixedSalary,
      totalNetPayable,
    };
  }, [filteredEmployees, filteredPayroll]);

  // =========================================================
  // FORMATTERS
  // =========================================================

  const formatNumber = (value) => {
    return Number(value || 0).toLocaleString("en-IN");
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="w-full space-y-4">
      {/* =====================================================
          HEADING
      ====================================================== */}

      <div className="flex flex-col gap-4 border border-slate-200 bg-white p-4 rounded-xl sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">
            Master Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Company-wide payroll and workforce overview.
          </p>
        </div>

        {/* ===================================================
            GENERATE / REFRESH PAYROLL
        ==================================================== */}

        <button
          type="button"
          onClick={onGeneratePayroll}
          disabled={generatingPayroll || !payrollMonth}
          className=" inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          {generatingPayroll
            ? "Generating Payroll..."
            : "Generate / Refresh Payroll"}
        </button>
      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <MasterOverviewFilters
        payrollMonth={payrollMonth}
        setPayrollMonth={setPayrollMonth}
        firm={firm}
        setFirm={setFirm}
        employeeStatus={employeeStatus}
        setEmployeeStatus={setEmployeeStatus}
      />

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{error}</p>
        </div>
      )}

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}

      <PayrollSummaryCards summary={summary} loading={loading} />

      {/* =====================================================
          CHARTS
      ====================================================== */}

      {!loading && !error && (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <WorkforceByFirm employees={filteredEmployees} />

          <NetPayableByFirm payroll={filteredPayroll} />
        </div>
      )}

      {/* =====================================================
          LATE ATTENDANCE
      ====================================================== */}

      <LateAttendanceSummary payroll={filteredPayroll} />

      {/* =====================================================
          TOP OVERTIME
      ====================================================== */}

      <TopOvertimeEarners payroll={filteredPayroll} />
    </div>
  );
};

export default MasterOverview;
