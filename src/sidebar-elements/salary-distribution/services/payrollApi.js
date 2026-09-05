const PAYROLL_API_URL =
  "https://script.google.com/macros/s/AKfycbyaDgJUzhNLMED3NRXTGo4-hHScz8FPp1uLhI18xPK3YDfwYLMT1281icvbcyOsN9eO/exec";

/**
 * Fetch Master Overview data.
 *
 * @param {Object} params
 * @param {string} params.month - YYYY-MM
 * @param {string} params.firm - ALL / QPT / APT / SPI
 * @param {string} params.status - ALL / Active / Dismissed
 */
export async function getMasterOverview({
  month,
  firm = "ALL",
  status = "ALL",
}) {
  if (!month) {
    throw new Error("Payroll month is required.");
  }

  const params = new URLSearchParams({
    action: "masterOverview",
    month,
    firm,
    status,
  });

  const response = await fetch(`${PAYROLL_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Payroll API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unable to load payroll data.");
  }

  return data;
}

/**
 * Fetch employee-level payroll data for a specific payroll month.
 *
 * This API will be used by Salary Distribution.
 *
 * @param {Object} params
 * @param {string} params.employeeId - Employee ID
 * @param {string} params.month - YYYY-MM
 */

export async function getEmployeePayrollDetail({ employeeId, month }) {
  if (!employeeId) {
    throw new Error("Employee ID is required.");
  }

  if (!month) {
    throw new Error("Payroll month is required.");
  }

  const params = new URLSearchParams({
    action: "employeePayrollDetail",
    employeeId: employeeId.trim(),
    month: month.trim(),
  });

  const url = `${PAYROLL_API_URL}?${params.toString()}`;

  console.log("EMPLOYEE PAYROLL REQUEST URL:", url);

  const response = await fetch(url);

  console.log(
    "EMPLOYEE PAYROLL RESPONSE:",
    response.status,
    response.statusText,
  );

  if (!response.ok) {
    throw new Error(`Employee payroll API request failed: ${response.status}`);
  }

  const data = await response.json();

  console.log("EMPLOYEE PAYROLL API:", data);

  if (!data.success) {
    throw new Error(data.error || "Unable to load employee payroll data.");
  }

  return data;
}

/**
 * Fetch employee attendance for a specific payroll month.
 *
 * @param {Object} params
 * @param {string} params.employeeId - Employee ID
 * @param {string} params.month - YYYY-MM
 */
export async function getEmployeeAttendance({ employeeId, month }) {
  if (!employeeId) {
    throw new Error("Employee ID is required.");
  }

  if (!month) {
    throw new Error("Payroll month is required.");
  }

  const params = new URLSearchParams({
    action: "employeeAttendance",
    employeeId,
    month,
  });

  const response = await fetch(`${PAYROLL_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(
      `Employee attendance API request failed: ${response.status}`,
    );
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unable to load employee attendance.");
  }

  return data;
}

/**
 * Approve payroll for an employee.
 *
 * @param {Object} params
 * @param {string} params.employeeId
 * @param {string} params.month - YYYY-MM
 */
export async function approvePayroll({ employeeId, month }) {
  if (!employeeId) {
    throw new Error("Employee ID is required.");
  }

  if (!month) {
    throw new Error("Payroll month is required.");
  }

  const params = new URLSearchParams({
    action: "approvePayroll",
    employeeId: employeeId.trim(),
    month: month.trim(),
  });

  const response = await fetch(`${PAYROLL_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Approve payroll request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unable to approve payroll.");
  }

  return data;
}

/**
 * Mark payroll as paid.
 *
 * @param {Object} params
 * @param {string} params.employeeId
 * @param {string} params.month - YYYY-MM
 */
export async function markPayrollAsPaid({ employeeId, month }) {
  if (!employeeId) {
    throw new Error("Employee ID is required.");
  }

  if (!month) {
    throw new Error("Payroll month is required.");
  }

  const params = new URLSearchParams({
    action: "markPayrollAsPaid",
    employeeId: employeeId.trim(),
    month: month.trim(),
  });

  const response = await fetch(`${PAYROLL_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Mark payroll as paid request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unable to mark payroll as paid.");
  }

  return data;
}

/**
 * Generate / refresh payroll for a month.
 */
export async function generatePayroll(month) {
  if (!month) {
    throw new Error("Payroll month is required.");
  }

  const params = new URLSearchParams({
    action: "generatePayroll",
    month,
  });

  const response = await fetch(`${PAYROLL_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Payroll generation request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unable to generate payroll.");
  }

  return data;
}

// =========================================================
// ADVANCE DISTRIBUTION
// =========================================================

/**
 * Create a new employee advance.
 *
 * This creates a DEBIT transaction in Advance_Register.
 */
export async function createAdvance({
  employeeId,
  advanceDate,
  advanceAmount,
  remarks = "",
}) {
  if (!employeeId) {
    throw new Error("Employee is required.");
  }

  if (!advanceDate) {
    throw new Error("Advance date is required.");
  }

  if (!advanceAmount || Number(advanceAmount) <= 0) {
    throw new Error("Valid advance amount is required.");
  }

  const params = new URLSearchParams({
    action: "createAdvance",
    employeeId,
    advanceDate,
    advanceAmount: String(advanceAmount),
    remarks,
  });

  const response = await fetch(`${PAYROLL_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Advance API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unable to create advance.");
  }

  return data;
}

/**
 * Create a new advance recovery.
 *
 * This creates a CREDIT transaction in Advance_Register.
 */
export async function createAdvanceRecovery({
  employeeId,
  advanceDate,
  recoveryAmount,
  remarks = "",
}) {
  if (!employeeId) {
    throw new Error("Employee is required.");
  }

  if (!advanceDate) {
    throw new Error("Recovery date is required.");
  }

  if (!recoveryAmount || Number(recoveryAmount) <= 0) {
    throw new Error("Valid recovery amount is required.");
  }

  const params = new URLSearchParams({
    action: "createAdvanceRecovery",
    employeeId,
    advanceDate,
    recoveryAmount: String(recoveryAmount),
    remarks,
  });

  const response = await fetch(`${PAYROLL_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Advance recovery API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unable to record advance recovery.");
  }

  return data;
}

/**
 * Get current outstanding advance for an employee.
 */
export async function getEmployeeOutstandingAdvance(employeeId) {
  if (!employeeId) {
    throw new Error("Employee ID is required.");
  }

  const params = new URLSearchParams({
    action: "employeeOutstandingAdvance",
    employeeId,
  });

  const response = await fetch(`${PAYROLL_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error(`Advance API request failed: ${response.status}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "Unable to load employee advance balance.");
  }

  return data;
}
