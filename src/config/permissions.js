// controll roll permission based on user
export const ROLE_PERMISSIONS = {
  Developer: [
    "home",
    "ims",
    "pms",
    "fms",
    "dashboard",
    "web-forms",
    "payroll-operations",
  ],

  Admin: [
    "home",
    "ims",
    "pms",
    "fms",
    "dashboard",
    "web-forms",
    "payroll-operations",
  ],

  "Executive Assistant": [
    "home",
    "ims",
    "pms",
    "fms",
    "dashboard",
    "web-forms",
  ],

  "Process Coordinator": [
    "home",
    "ims",
    "pms",
    "fms",
    "dashboard",
    "web-forms",
  ],

  "Data Entry Operator": [
    "home",
    "ims",
    "pms",
    "fms",
    "dashboard",
    "web-forms",
  ],

  Accounts: [
    "home",
    "ims",
    "pms",
    "fms",
    "dashboard",
    "web-forms",
    "payroll-operations",
  ],

  "Customer Relation Manager": [
    "home",
    "ims",
    "pms",
    "fms",
    "dashboard",
    "web-forms",
  ],

  "Production Manager": ["home", "ims", "pms", "fms", "dashboard", "web-forms"],

  "Operation Manager": ["home", "ims", "pms", "fms", "dashboard", "web-forms"],

  "Store Incharge": ["home", "ims", "pms", "fms", "dashboard", "web-forms"],
};

// Globle search protection user based
export const MODULE_ID_MAP = {
  ims: "ims",
  pms: "pms",
  fms: "fms",
  dashboard: "dashboard",
  payroll: "payroll-operations",
};

// Route Protection
export const ROUTE_PERMISSIONS = {
  "/payroll": ["Accounts", "Admin", "Developer"],

  "/payroll/salary-dist": ["Accounts", "Admin", "Developer"],
};
