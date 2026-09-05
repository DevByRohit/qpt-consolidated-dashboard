import { useMemo, useState } from "react";

const PayrollEmployeeList = ({
  payrollMonth,
  employees = [],
  payroll = [],
  loading = false,
  error = "",
  selectedEmployee,
  onSelectEmployee,
}) => {
  const [search, setSearch] = useState("");
  const [firm, setFirm] = useState("ALL");
  const [status, setStatus] = useState("ALL");

  const payrollMap = useMemo(() => {
    const map = {};

    payroll.forEach((item) => {
      map[item.employeeId] = item;
    });

    return map;
  }, [payroll]);

  const filteredEmployees = useMemo(() => {
    const query = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !query ||
        employee.employeeName?.toLowerCase().includes(query) ||
        employee.employeeId?.toLowerCase().includes(query);

      const matchesFirm = firm === "ALL" || employee.firm === firm;

      const matchesStatus = status === "ALL" || employee.status === status;

      return matchesSearch && matchesFirm && matchesStatus;
    });
  }, [employees, search, firm, status]);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN")}`;
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-300 p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-800">
              Employee Payroll
            </h2>

            <p className="mt-1 text-sm text-slate-800">
              Select an employee to review their monthly payroll.
            </p>
          </div>

          <div className="text-sm text-slate-800">
            {filteredEmployees.length} employees
          </div>
        </div>

        {/* Filters */}

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search employee..."
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
          />

          <select
            value={firm}
            onChange={(event) => setFirm(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="ALL">All Firms</option>
            <option value="QPT">QPT</option>
            <option value="APT">APT</option>
            <option value="SPI">SPI</option>
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
          >
            <option value="ALL">All Employees</option>
            <option value="Active">Active</option>
            <option value="Dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}

      {loading ? (
        <div className="p-8 text-center text-sm text-slate-500">
          Loading payroll employees...
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No employees found.
        </div>
      ) : (
        <div className="max-h-130 overflow-y-auto">
          {filteredEmployees.map((employee) => {
            const payrollRecord = payrollMap[employee.employeeId];

            const isSelected =
              selectedEmployee?.employeeId === employee.employeeId;

            return (
              <button
                key={employee.employeeId}
                type="button"
                onClick={() => onSelectEmployee(employee)}
                className={`flex w-full items-center gap-4 border-b border-slate-300 px-5 py-4 text-left transition last:border-b-0 cursor-pointer ${
                  isSelected ? "bg-emerald-50" : "hover:bg-slate-100"
                }`}
              >
                {/* Avatar */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                  {employee.employeeName?.charAt(0)?.toUpperCase() || "?"}
                </div>

                {/* Employee */}

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {employee.employeeName}
                    </p>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      {employee.firm}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    {employee.employeeId} • {employee.designation}
                  </p>
                </div>

                {/* Salary */}

                <div className="hidden text-right sm:block">
                  <p className="text-xs text-slate-500">Net Salary</p>

                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {payrollRecord
                      ? formatCurrency(payrollRecord.netSalary)
                      : "—"}
                  </p>
                </div>

                {/* Status */}

                <div className="shrink-0">
                  {payrollRecord ? (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        payrollRecord.payrollStatus === "Paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : payrollRecord.payrollStatus === "Approved"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {payrollRecord.payrollStatus}
                    </span>
                  ) : (
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-500">
                      Not Generated
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PayrollEmployeeList;
