import { useEffect, useMemo, useState } from "react";
import {
  getEmployeePayrollDetail,
  approvePayroll,
  markPayrollAsPaid,
} from "../services/payrollApi";
import Loader from "../../../alert-modal/Loader";

const EmployeePayrollDetail = ({ employee, payrollMonth }) => {
  const [payrollData, setPayrollData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // these states controlling payment status
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");

  useEffect(() => {
    if (!employee?.employeeId || !payrollMonth) {
      setPayrollData(null);
      return;
    }

    let cancelled = false;

    const fetchPayrollDetail = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getEmployeePayrollDetail({
          employeeId: employee.employeeId,
          month: payrollMonth,
        });

        if (cancelled) return;

        setPayrollData(data);
      } catch (error) {
        if (cancelled) return;

        console.error("EMPLOYEE PAYROLL DETAIL ERROR:", error);

        setError(error.message || "Unable to load employee payroll details.");

        setPayrollData(null);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPayrollDetail();

    return () => {
      cancelled = true;
    };
  }, [employee?.employeeId, payrollMonth]);

  const handleApprovePayroll = async () => {
    if (!employee?.employeeId || !payrollMonth) return;

    try {
      setActionLoading(true);
      setActionError("");
      setActionSuccess("");

      const result = await approvePayroll({
        employeeId: employee.employeeId,
        month: payrollMonth,
      });

      setActionSuccess(result.message || "Payroll approved successfully.");

      // Refresh payroll detail so the status changes immediately.
      const updatedData = await getEmployeePayrollDetail({
        employeeId: employee.employeeId,
        month: payrollMonth,
      });

      setPayrollData(updatedData);
    } catch (error) {
      console.error("APPROVE PAYROLL ERROR:", error);
      setActionError(error.message || "Unable to approve payroll.");
    } finally {
      setActionLoading(false);
    }
  };

  // this function is handling the payment status
  const handleMarkAsPaid = async () => {
    if (!employee?.employeeId || !payrollMonth) return;

    try {
      setActionLoading(true);
      setActionError("");
      setActionSuccess("");

      const result = await markPayrollAsPaid({
        employeeId: employee.employeeId,
        month: payrollMonth,
      });

      setActionSuccess(
        `Salary marked as paid successfully. Payroll ID: ${result.payrollId}`,
      );

      // Refresh payroll detail so the status changes immediately.
      const updatedData = await getEmployeePayrollDetail({
        employeeId: employee.employeeId,
        month: payrollMonth,
      });

      setPayrollData(updatedData);
    } catch (error) {
      console.error("MARK PAYROLL PAID ERROR:", error);
      setActionError(error.message || "Unable to mark payroll as paid.");
    } finally {
      setActionLoading(false);
    }
  };

  const payroll = payrollData?.payroll;
  const employeeInfo = payrollData?.employee || employee;

  const formatNumber = (value, decimals = 2) => {
    const number = Number(value || 0);

    return number.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  const formatCurrency = (value) => {
    const number = Number(value || 0);

    return `₹${number.toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const initials = useMemo(() => {
    const name = employeeInfo?.employeeName || "Employee";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
  }, [employeeInfo?.employeeName]);

  const getStatusClasses = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";

      case "Approved":
        return "bg-blue-100 text-blue-700 border-blue-200";

      case "Draft":
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  if (!employee) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* =====================================================
          LOADING
      ====================================================== */}
      {loading && (
        <Loader
          message="Loading Payroll Details"
          subMessage="Preparing employee salary details..."
        />
      )}

      {/* =====================================================
          ERROR
      ====================================================== */}
      {error && !loading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="text-sm font-semibold text-red-700">
            Unable to load payroll
          </p>

          <p className="mt-1 text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* =====================================================
          PAYROLL DATA
      ====================================================== */}
      {!loading && !error && payroll && (
        <>
          {/* =================================================
              EMPLOYEE HEADER
          ================================================== */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
              {/* Employee */}
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-base font-bold text-slate-600">
                  {initials || "E"}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-slate-800">
                      {employeeInfo.employeeName}
                    </h2>

                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {employeeInfo.firm}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-slate-500">
                    {employeeInfo.employeeId}
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    {employeeInfo.designation}
                    {employeeInfo.department
                      ? ` • ${employeeInfo.department}`
                      : ""}
                  </p>
                </div>
              </div>

              {/* Net Salary */}
              <div className="md:text-right">
                <p className="text-xs font-medium text-slate-500">
                  Net Payable
                </p>

                <p className="mt-1 text-2xl font-bold text-emerald-600">
                  {formatCurrency(payroll.netSalary)}
                </p>

                <span
                  className={`mt-2 inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                    payroll.paymentStatus,
                  )}`}
                >
                  {payroll.paymentStatus || "Draft"}
                </span>
              </div>
            </div>

            {/* Month Information */}
            <div className="text-center grid grid-cols-1 border-t border-slate-200 bg-slate-50 sm:grid-cols-3">
              <InfoItem label="Payroll Month" value={payrollMonth} />

              <InfoItem
                label="Payroll Status"
                value={payroll.paymentStatus || "Draft"}
              />

              <InfoItem
                label="Generated On"
                value={formatDate(payroll.generatedOn)}
                border={false}
              />
            </div>
          </div>

          {/* =================================================
              ATTENDANCE SUMMARY
          ================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="Attendance Summary"
              description="Attendance values used for the selected payroll month."
            />

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <SummaryCard
                label="Present Days"
                value={formatNumber(payroll.presentDays, 0)}
                suffix="days"
              />

              <SummaryCard
                label="Overtime"
                value={formatNumber(payroll.otHours)}
                suffix="hrs"
                valueClass="text-emerald-600"
              />

              <SummaryCard
                label="Late Hours"
                value={formatNumber(payroll.lateHours)}
                suffix="hrs"
              />

              <SummaryCard
                label="Daily Wage"
                value={formatCurrency(payroll.dailyWage)}
                suffix="Rs."
              />
            </div>
          </div>

          {/* =================================================
              EARNINGS
          ================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="Earnings"
              description="Salary and additional earnings for this payroll."
            />

            <div className="divide-y divide-slate-100">
              <PayrollRow
                label="Base Salary"
                value={formatCurrency(payroll.baseSalary)}
              />

              <PayrollRow
                label="Present Salary"
                value={formatCurrency(payroll.presentSalary)}
              />

              <PayrollRow
                label="Paid Sunday"
                value={formatCurrency(payroll.paidSunday)}
              />

              <PayrollRow
                label="Sunday Working"
                value={formatCurrency(payroll.sundayWorking)}
              />

              <PayrollRow
                label="Overtime Amount"
                value={formatCurrency(payroll.otAmount)}
                valueClass="text-emerald-600"
              />

              <PayrollRow
                label="Holiday Payment"
                value={formatCurrency(payroll.holidayPayment)}
              />

              <PayrollRow
                label="Incentive"
                value={formatCurrency(payroll.incentive)}
                valueClass="text-emerald-600"
              />
            </div>
          </div>

          {/* =================================================
              DEDUCTIONS
          ================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="Deductions"
              description="Applicable deductions for this payroll."
            />

            <div className="divide-y divide-slate-100">
              <PayrollRow
                label="Late Deduction"
                value={formatCurrency(payroll.lateDeduction)}
                valueClass="text-red-600"
              />

              <PayrollRow
                label="Advance"
                value={formatCurrency(payroll.advance)}
                valueClass="text-red-600"
              />
            </div>
          </div>

          {/* =================================================
              RATE & CALCULATION DETAILS
          ================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              title="Calculation Details"
              description="Rates and values used by the payroll engine."
            />

            <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2">
              <PayrollRow
                label="Monthly Salary"
                value={formatCurrency(employeeInfo.monthlySalary)}
              />

              <PayrollRow
                label="Daily Wage"
                value={formatCurrency(payroll.dailyWage)}
              />

              <PayrollRow
                label="Hourly Rate"
                value={formatCurrency(payroll.hourlyRate)}
              />

              <PayrollRow
                label="Overtime Hours"
                value={`${formatNumber(payroll.otHours)} hrs`}
              />

              <PayrollRow
                label="Late Hours"
                value={`${formatNumber(payroll.lateHours)} hrs`}
              />

              <PayrollRow
                label="Present Days"
                value={`${formatNumber(payroll.presentDays, 0)} days`}
              />
            </div>
          </div>

          {/* =================================================
            NET SALARY
          ================================================== */}
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-emerald-800">
                  Final Net Salary
                </p>

                <p className="mt-1 text-xs text-emerald-700">
                  Final payable amount for {payrollMonth}.
                </p>
              </div>

              <p className="text-2xl font-bold text-emerald-700">
                {formatCurrency(payroll.netSalary)}
              </p>
            </div>
          </div>

          {/* =================================================
              PAYMENT
          ================================================== */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Salary Payment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Payment status for this employee's payroll.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    payroll.paymentStatus,
                  )}`}
                >
                  {payroll.paymentStatus || "Draft"}
                </span>

                {payroll.paymentStatus === "Draft" && (
                  <button
                    type="button"
                    onClick={handleApprovePayroll}
                    disabled={actionLoading}
                    className="cursor-pointer rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading ? "Approving..." : "Approve Payroll"}
                  </button>
                )}

                {payroll.paymentStatus === "Approved" && (
                  <button
                    type="button"
                    onClick={handleMarkAsPaid}
                    disabled={actionLoading}
                    className="cursor-pointer rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {actionLoading ? "Processing..." : "Mark as Paid"}
                  </button>
                )}

                {payroll.paymentStatus === "Paid" && (
                  <button
                    type="button"
                    disabled
                    className="cursor-pointer rounded-lg bg-emerald-100 px-4 py-2.5 text-sm font-semibold text-emerald-700"
                  >
                    Salary Paid
                  </button>
                )}
              </div>

              {actionError && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm font-medium text-red-700">
                    {actionError}
                  </p>
                </div>
              )}

              {actionSuccess && (
                <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
                  <p className="text-sm font-medium text-emerald-700">
                    {actionSuccess}
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

/* =========================================================
   SECTION HEADER
========================================================= */

const SectionHeader = ({ title, description }) => {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-slate-800">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
};

/* =========================================================
   INFO ITEM
========================================================= */

const InfoItem = ({ label, value, border = true }) => {
  return (
    <div
      className={`px-5 py-3 ${
        border ? "border-b border-slate-200 sm:border-b-0 sm:border-r" : ""
      }`}
    >
      <p className="text-sm text-slate-800">{label}</p>

      <p className="mt-1 text-sm font-semibold text-slate-700">{value}</p>
    </div>
  );
};

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({
  label,
  value,
  suffix = "",
  valueClass = "text-slate-800",
}) => {
  return (
    <div className="text-center rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="text font-medium text-slate-500">{label}</p>

      <div className="mt-2 flex items-center justify-center gap-1">
        <span className={`text-lg font-bold ${valueClass}`}>{value}</span>

        {suffix && (
          <span className="text-xs font-medium text-slate-400">{suffix}</span>
        )}
      </div>
    </div>
  );
};

/* =========================================================
  PAYROLL ROW
========================================================= */

const PayrollRow = ({ label, value, valueClass = "text-slate-800" }) => {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-sm text-slate-500">{label}</span>

      <span className={`text-sm font-semibold ${valueClass}`}>{value}</span>
    </div>
  );
};

export default EmployeePayrollDetail;
