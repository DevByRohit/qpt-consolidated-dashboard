import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMasterOverview, generatePayroll } from "./services/payrollApi";
import MasterOverview from "./components/MasterOverview";
import PayrollEmployeeList from "./payroll-distribution/PayrollEmployeeList";
import EmployeePayrollDetail from "./payroll-distribution/EmployeePayrollDetail";
import EmployeeAttendanceCalendar from "./payroll-distribution/EmployeeAttendanceCalendar";
import Loader from "../../alert-modal/Loader";

const SalaryDistribution = () => {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();

    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0",
    )}`;
  });

  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [activeView, setActiveView] = useState("overview");

  // =========================================================
  // MASTER OVERVIEW DATA
  // =========================================================

  const [masterData, setMasterData] = useState({
    employees: [],
    payroll: [],
  });

  const [masterLoading, setMasterLoading] = useState(false);
  const [masterError, setMasterError] = useState("");

  // =========================================================
  // FETCH MASTER DATA
  // =========================================================

  const loadMasterData = async (month = selectedMonth) => {
    if (!month) return;

    try {
      setMasterLoading(true);
      setMasterError("");

      console.log("FETCHING MASTER PAYROLL DATA:", month);

      const data = await getMasterOverview({
        month,
        firm: "ALL",
        status: "ALL",
      });

      console.log("MASTER OVERVIEW API:", data);

      setMasterData({
        employees: data.employees || [],
        payroll: data.payroll || [],
      });
    } catch (error) {
      console.error("MASTER PAYROLL API ERROR:", error);

      setMasterError(error.message || "Unable to load payroll overview.");

      setMasterData({
        employees: [],
        payroll: [],
      });
    } finally {
      setMasterLoading(false);
    }
  };

  // =========================================================
  // INITIAL MASTER DATA LOAD
  // =========================================================

  useEffect(() => {
    loadMasterData();
  }, []);

  // =========================================================
  // GENERATE / REFRESH PAYROLL
  // =========================================================

  const [generatingPayroll, setGeneratingPayroll] = useState(false);

  const handleGeneratePayroll = async () => {
    if (!selectedMonth) {
      setMasterError("Please select a payroll month.");
      return;
    }

    try {
      setGeneratingPayroll(true);
      setMasterError("");

      console.log("GENERATING PAYROLL:", selectedMonth);

      // -------------------------------------------------------
      // Generate latest payroll
      // -------------------------------------------------------

      const result = await generatePayroll(selectedMonth);

      console.log("PAYROLL GENERATION RESULT:", result);

      // -------------------------------------------------------
      // Fetch freshly generated payroll
      // -------------------------------------------------------

      await loadMasterData(selectedMonth);
    } catch (error) {
      console.error("PAYROLL GENERATION ERROR:", error);

      setMasterError(error.message || "Unable to generate payroll.");
    } finally {
      setGeneratingPayroll(false);
    }
  };

  // =========================================================
  // MONTH CHANGE
  // =========================================================

  const handleMonthChange = (month) => {
    setSelectedMonth(month);
    setSelectedEmployee(null);
  };

  // =========================================================
  // EMPLOYEE SELECTION
  // =========================================================

  const handleSelectEmployee = (employee) => {
    setSelectedEmployee(employee);
    setActiveView("employee");
  };

  // =========================================================
  // BACK TO SALARY DISTRIBUTION
  // =========================================================

  const handleBackToDistribution = () => {
    setActiveView("distribution");
  };

  // =========================================================
  // VIEW CHANGE
  // =========================================================

  const handleViewChange = (view) => {
    setActiveView(view);

    if (view === "overview" || view === "distribution") {
      setSelectedEmployee(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          PAGE NAVIGATION
      ====================================================== */}

      <div className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {/* Master Overview */}

          <button
            type="button"
            onClick={() => handleViewChange("overview")}
            className={`rounded px-4 py-2 text-sm font-medium transition cursor-pointer ${
              activeView === "overview"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Master Overview
          </button>

          {/* Salary Distribution */}

          <button
            type="button"
            onClick={() => handleViewChange("distribution")}
            className={`rounded px-4 py-2 text-sm font-medium transition cursor-pointer ${
              activeView === "distribution"
                ? "bg-slate-800 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            Salary Distribution
          </button>

          {/* Employee Details */}

          {selectedEmployee && (
            <button
              type="button"
              onClick={() => handleViewChange("employee")}
              className={`rounded px-4 py-2 text-sm font-medium transition cursor-pointer ${
                activeView === "employee"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Employee Details
            </button>
          )}

          {/* Attendance Calendar */}

          {selectedEmployee && (
            <button
              type="button"
              onClick={() => handleViewChange("attendance")}
              className={`rounded px-4 py-2 text-sm font-medium transition cursor-pointer ${
                activeView === "attendance"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Attendance Calendar
            </button>
          )}
        </div>
      </div>

      {/* =====================================================
          MASTER OVERVIEW
      ====================================================== */}

      {activeView === "overview" && (
        <MasterOverview
          payrollMonth={selectedMonth}
          setPayrollMonth={handleMonthChange}
          masterData={masterData}
          loading={masterLoading}
          error={masterError}
          onGeneratePayroll={handleGeneratePayroll}
          generatingPayroll={generatingPayroll}
        />
      )}

      {/* =====================================================
          SALARY DISTRIBUTION
      ====================================================== */}

      {activeView === "distribution" && (
        <div className="space-y-6">
          {/* Header */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Salary Distribution
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Review employee payroll and process monthly salary payments.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate("/payroll/advance-dist")}
              className="inline-flex items-center justify-center rounded bg-slate-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 cursor-pointer"
            >
              Advance Distribution
            </button>
          </div>

          {/* Payroll Month */}

          {/* <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="max-w-xs">
              <label className="mb-2 block text-sm font-medium text-slate-700">
                Payroll Month
              </label>

              <input
                type="month"
                value={selectedMonth}
                onChange={(event) => {
                  handleMonthChange(event.target.value);
                }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div> */}

          {/* Employee List */}

          <PayrollEmployeeList
            payrollMonth={selectedMonth}
            employees={masterData.employees}
            payroll={masterData.payroll}
            loading={masterLoading}
            error={masterError}
            selectedEmployee={selectedEmployee}
            onSelectEmployee={handleSelectEmployee}
          />
        </div>
      )}

      {/* =====================================================
        EMPLOYEE DETAILS
      ====================================================== */}

      {activeView === "employee" && selectedEmployee && (
        <div className="space-y-4">
          {/* <button
            type="button"
            onClick={handleBackToDistribution}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 cursor-pointer"
          >
            
              <ArrowLeft />{" "}
            
            <span>Back to Salary Distribution</span>
          </button> */}

          <EmployeePayrollDetail
            employee={selectedEmployee}
            payrollMonth={selectedMonth}
          />
        </div>
      )}

      {/* =====================================================
          ATTENDANCE CALENDAR
      ====================================================== */}

      {activeView === "attendance" && selectedEmployee && (
        <div className="space-y-4">
          {/* <button
            type="button"
            onClick={handleBackToDistribution}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <ArrowLeft />
            <span>Back to Salary Distribution</span>
          </button> */}

          <EmployeeAttendanceCalendar
            employeeId={selectedEmployee.employeeId}
            payrollMonth={selectedMonth}
          />
        </div>
      )}

      {/* =====================================================
          GLOBAL MASTER DATA LOADER
      ====================================================== */}

      {masterLoading && (
        <Loader
          message="Loading Payroll Data"
          subMessage={`Loading payroll data for ${selectedMonth}`}
        />
      )}
    </div>
  );
};

export default SalaryDistribution;
