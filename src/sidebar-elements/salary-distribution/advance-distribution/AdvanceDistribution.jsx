import { useEffect, useState } from "react";
import {
  getMasterOverview,
  getEmployeeOutstandingAdvance,
  createAdvance,
  createAdvanceRecovery,
} from "../services/payrollApi";
import Loader from "../../../alert-modal/Loader";

const AdvanceDistribution = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [employees, setEmployees] = useState([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  const [outstandingAdvance, setOutstandingAdvance] = useState(0);

  const [activeAction, setActiveAction] = useState("advance");

  const [amount, setAmount] = useState("");

  const [transactionDate, setTransactionDate] = useState(() => {
    const today = new Date();

    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0",
    )}-${String(today.getDate()).padStart(2, "0")}`;
  });

  const [remarks, setRemarks] = useState("");

  const [loadingEmployees, setLoadingEmployees] = useState(false);

  const [loadingOutstanding, setLoadingOutstanding] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  // =========================================================
  // LOAD EMPLOYEES
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadEmployees = async () => {
      try {
        setLoadingEmployees(true);
        setError("");

        const now = new Date();

        const month = `${now.getFullYear()}-${String(
          now.getMonth() + 1,
        ).padStart(2, "0")}`;

        const data = await getMasterOverview({
          month,
          firm: "ALL",
          status: "Active",
        });

        if (cancelled) return;

        setEmployees(data.employees || []);
      } catch (error) {
        if (cancelled) return;

        console.error("ADVANCE EMPLOYEE LOAD ERROR:", error);

        setError(error.message || "Unable to load employees.");
      } finally {
        if (!cancelled) {
          setLoadingEmployees(false);
        }
      }
    };

    loadEmployees();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // LOAD EMPLOYEE OUTSTANDING ADVANCE
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const loadOutstanding = async () => {
      if (!selectedEmployeeId) {
        setOutstandingAdvance(0);
        return;
      }

      try {
        setLoadingOutstanding(true);
        setError("");
        setSuccessMessage("");

        const data = await getEmployeeOutstandingAdvance(selectedEmployeeId);

        if (cancelled) return;

        setOutstandingAdvance(Number(data.data?.outstandingAmount || 0));
      } catch (error) {
        if (cancelled) return;

        console.error("ADVANCE OUTSTANDING LOAD ERROR:", error);

        setError(error.message || "Unable to load outstanding advance.");

        setOutstandingAdvance(0);
      } finally {
        if (!cancelled) {
          setLoadingOutstanding(false);
        }
      }
    };

    loadOutstanding();

    return () => {
      cancelled = true;
    };
  }, [selectedEmployeeId]);

  // =========================================================
  // EMPLOYEE CHANGE
  // =========================================================

  const handleEmployeeChange = (event) => {
    setSelectedEmployeeId(event.target.value);

    setAmount("");
    setRemarks("");
    setError("");
    setSuccessMessage("");
  };

  // =========================================================
  // ACTION CHANGE
  // =========================================================

  const handleActionChange = (action) => {
    setActiveAction(action);

    setAmount("");
    setRemarks("");
    setError("");
    setSuccessMessage("");
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    if (!selectedEmployeeId) {
      setError("Please select an employee.");
      return;
    }

    if (!transactionDate) {
      setError("Please select a date.");
      return;
    }

    const numericAmount = Number(amount);

    if (!numericAmount || numericAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    // -------------------------------------------------------
    // RECOVERY VALIDATION
    // -------------------------------------------------------

    if (activeAction === "recovery" && numericAmount > outstandingAdvance) {
      setError(
        `Recovery amount cannot exceed outstanding advance of ₹${outstandingAdvance.toLocaleString(
          "en-IN",
        )}.`,
      );

      return;
    }

    try {
      setSubmitting(true);

      // -----------------------------------------------------
      // GIVE ADVANCE
      // -----------------------------------------------------

      if (activeAction === "advance") {
        await createAdvance({
          employeeId: selectedEmployeeId,
          advanceDate: transactionDate,
          advanceAmount: numericAmount,
          remarks,
        });

        setSuccessMessage(
          `Advance of ₹${numericAmount.toLocaleString(
            "en-IN",
          )} recorded successfully.`,
        );
      }

      // -----------------------------------------------------
      // RECOVER ADVANCE
      // -----------------------------------------------------

      if (activeAction === "recovery") {
        await createAdvanceRecovery({
          employeeId: selectedEmployeeId,
          advanceDate: transactionDate,
          recoveryAmount: numericAmount,
          remarks,
        });

        setSuccessMessage(
          `Recovery of ₹${numericAmount.toLocaleString(
            "en-IN",
          )} recorded successfully.`,
        );
      }

      // -----------------------------------------------------
      // REFRESH OUTSTANDING
      // -----------------------------------------------------

      const updated = await getEmployeeOutstandingAdvance(selectedEmployeeId);

      setOutstandingAdvance(Number(updated.data?.outstandingAmount || 0));

      // Clear transaction fields
      setAmount("");
      setRemarks("");
    } catch (error) {
      console.error("ADVANCE TRANSACTION ERROR:", error);

      setError(error.message || "Unable to save advance transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // SELECTED EMPLOYEE
  // =========================================================

  const selectedEmployee = employees.find(
    (employee) => employee.employeeId === selectedEmployeeId,
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="space-y-4">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Advance Distribution
        </h1>

        <p className="mt-1 text-slate-500">
          Manage employee advance payments and recoveries.
        </p>
      </div>

      {/* =====================================================
          MAIN CARD
      ====================================================== */}

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* ACTION TABS */}
        <div className="border-b border-slate-200 p-4 flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleActionChange("advance")}
              className={`rounded px-4 py-2 text-sm font-medium transition cursor-pointer ${
                activeAction === "advance"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              Give Advance
            </button>

            <button
              type="button"
              onClick={() => handleActionChange("recovery")}
              className={`rounded px-4 py-2 text-sm font-medium transition cursor-pointer ${
                activeAction === "recovery"
                  ? "bg-slate-800 text-white"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              Recover Advance
            </button>
          </div>

          <div>
            {activeAction === "recovery" && outstandingAdvance > 0 && (
              <p className="text text-slate-700">
                Maximum recovery : ₹{outstandingAdvance.toLocaleString("en-IN")}
              </p>
            )}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          {/* Employee */}

          <div>
            <label className="mb-1 block text-lg font-medium text-slate-700">
              Employee
            </label>

            <select
              value={selectedEmployeeId}
              onChange={handleEmployeeChange}
              disabled={loadingEmployees || submitting}
              className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-700 font-medium outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
            >
              <option value="">
                {loadingEmployees ? "Loading employees..." : "Select Employee"}
              </option>

              {employees.map((employee) => (
                <option key={employee.employeeId} value={employee.employeeId}>
                  {employee.employeeName || employee.name} —{" "}
                  {employee.employeeId}
                </option>
              ))}
            </select>
          </div>

          {/* Employee information */}
          {selectedEmployee && (
            <div className="rounded border border-slate-200 bg-slate-50 px-4 py-2">
              <div className="grid gap-4 sm:grid-cols-3">
                {/* Element 1 */}
                <div>
                  <p className="text-slate-700 font-bold">Employee Name</p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedEmployee.employeeName || selectedEmployee.name}
                  </p>
                </div>

                {/* Element 2 */}
                <div>
                  <p className="text-slate-700 font-bold">Employee ID</p>

                  <p className="mt-1 text-sm font-medium text-slate-800">
                    {selectedEmployee.employeeId}
                  </p>
                </div>

                {/* Element 3 */}
                <div>
                  <p className="text-slate-700 font-bold">Current Outstanding Advance</p>

                  <p className="mt-1 text font-medium text-slate-800">
                    ₹ {outstandingAdvance.toLocaleString("en-IN")}
                  </p>

                  {loadingOutstanding && (
                    <span className="text-xs text-slate-500">Loading...</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Amount */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="mb-1 block text-lg font-medium text-slate-700">
                {activeAction === "advance"
                  ? "Advance Amount"
                  : "Recovery Amount"}
              </label>

              <input
                type="number"
                min="1"
                step="1"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={submitting}
                placeholder="Enter amount"
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-700 font-medium outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
              />

              {activeAction === "recovery" &&
                outstandingAdvance === 0 &&
                selectedEmployeeId && (
                  <p className="mt-1.5 text-xs text-amber-600">
                    This employee has no outstanding advance.
                  </p>
                )}
            </div>

            {/* Date */}

            <div>
              <label className="mb-1 block text-lg font-medium text-slate-700">
                Date
              </label>

              <input
                type="date"
                value={transactionDate}
                onChange={(event) => setTransactionDate(event.target.value)}
                disabled={submitting}
                className="w-full rounded border border-slate-300 px-3 py-2 text-slate-700 font-medium outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
              />
            </div>
          </div>

          {/* Remarks */}

          <div>
            <label className="mb-1 block text-lg font-medium text-slate-700">
              Remarks
            </label>

            <textarea
              rows={2}
              value={remarks}
              onChange={(event) => setRemarks(event.target.value)}
              disabled={submitting}
              placeholder="Optional remarks"
              className="w-full resize-none rounded border border-slate-300 px-3 py-2 text-slate-700 font-medium outline-none transition focus:border-slate-500 focus:ring-1 focus:ring-slate-500 disabled:bg-slate-100"
            />
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}

          {successMessage && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {successMessage}
            </div>
          )}

          {/* Submit */}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={
                submitting ||
                loadingEmployees ||
                !selectedEmployeeId ||
                (activeAction === "recovery" && outstandingAdvance <= 0)
              }
              className="rounded bg-slate-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? "Saving..."
                : activeAction === "advance"
                  ? "Give Advance"
                  : "Record Recovery"}
            </button>
          </div>
        </form>
      </div>

      {/* =====================================================
          GLOBAL LOADER
      ====================================================== */}

      {(loadingEmployees || submitting) && (
        <Loader
          message={
            submitting ? "Saving Advance Transaction" : "Loading Employees"
          }
          subMessage={
            submitting ? "Please wait..." : "Loading active employees..."
          }
        />
      )}
    </div>
  );
};

export default AdvanceDistribution;
