import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import CreateCardModal from "./CreateCardModal";
import logo from "../assets/qualitex_logo.png";
import AlertModal from "../alert-modal/AlertModal";

import {
  Search,
  PanelLeftClose,
  ChevronDown,
  Activity,
  Warehouse,
  Factory,
  Form,
  LayoutDashboard,
  PlusCircle,
} from "lucide-react";

const MENU_ITEMS = [
  { id: "fms", label: "Flow Monitoring (FMS)", icon: Activity, path: "/fms" },
  { id: "ims", label: "Inventory (IMS)", icon: Warehouse, path: "/ims" },
  { id: "pms", label: "Production (PMS)", icon: Factory, path: "/pms" },
  {
    id: "web-forms",
    label: "Web Based Form",
    icon: Form,
    path: "/forms",
  },
  {
    id: "dashboard",
    label: "Dashboards",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
];

function DashboardLayout() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  // use for navigate the route
  const navigate = useNavigate();

  // Implement search
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [alert, setAlert] = useState({
    open: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const location = useLocation();

  // ✅ Load user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Handle click out side
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("login");
    window.location.href = "/login";
  };

  return (
    <div className="max-h-screen  text-gray-800 font-sans antialiased flex items-center justify-center">
      <div
        className="flex h-screen w-full max-w-screen-2xl border-t border-gray-900 relative overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #dcefe7, #eef6f2)",
        }}
      >
        {/* Sidebar */}
        <aside
          className={`flex flex-col border-r border-gray-900 transition-all duration-300 ease-in-out z-20 ${isSidebarOpen ? "w-64" : "w-16"}`}
        >
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-3 border-b border-gray-900">
            <div
              className={`flex-1 overflow-hidden transition-all duration-300 ${
                isSidebarOpen ? "opacity-100 w-auto mr-2" : "opacity-0 w-0 mr-0"
              }`}
            >
              <div className="flex items-center justify-center font-medium whitespace-nowrap cursor-pointer">
                <img src={logo} alt="dashboard-logo" />
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center justify-center shrink-0 cursor-pointer"
              title={`${!isSidebarOpen ? "Open sidebar" : "Close sidebar"}`}
            >
              <PanelLeftClose
                strokeWidth={1.5}
                size={38}
                className={`transition-transform duration-300 ${
                  !isSidebarOpen ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          {/* Menu */}
          <nav className="flex-1 py-4 flex flex-col gap-1 px-2 overflow-y-auto overflow-visible">
            {MENU_ITEMS.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `group relative flex items-center px-3 py-3 rounded-sm transition-all duration-200 ${isActive ? "bg-gray-400 text-gray-950" : "hover:bg-gray-300 hover:text-gray-900 hover:translate-x-1"}`
                }
              >
                <item.icon size={24} className="shrink-0" />

                <span
                  className={`ml-3 overflow-hidden whitespace-nowrap font-medium transition-all duration-200 ${
                    isSidebarOpen ? "max-w-50 opacity-100" : "max-w-0 opacity-0"
                  }`}
                  title={`${item.label}`}
                >
                  {item.label}
                </span>
              </NavLink>
            ))}
          </nav>

          {/* Create button */}
          {location.pathname !== "/" && (
            <div className="border-t border-gray-900 p-2 mt-auto">
              <button
                onClick={() => setIsModalOpen(true)}
                className={`w-full flex items-center px-3 py-3 rounded-sm transition-all duration-200 hover:bg-gray-300 hover:text-gray-900 hover:translate-x-1 cursor-pointer`}
                title="Create card"
              >
                <PlusCircle size={24} className="shrink-0" />

                <span
                  className={`ml-3 whitespace-nowrap font-bold text-xl transition-all duration-200 ${
                    isSidebarOpen
                      ? "opacity-100"
                      : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Create
                </span>
              </button>
            </div>
          )}
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col relative min-w-0">
          {/* Navbar */}
          <header className="p-4 flex gap-4 items-start z-10">
            {/* updated search input*/}
            <div className="flex-1 flex items-center border-2 border-gray-400 rounded-sm px-4 py-2">
              <input
                type="text"
                placeholder="Search here..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none flex-1 text-gray-800 placeholder-gray-900 w-full font-medium"
              />
              <Search className="w-6 h-6 text-gray-900 mr-1 shrink-0 cursor-pointer" />
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 border-2 border-gray-400 rounded-sm px-4 py-2 font-medium hover:bg-gray-800 hover:text-gray-100 transition-colors cursor-pointer"
                title="User Profile"
              >
                <span>{user?.name || "User"}</span>
                <ChevronDown size={20} />
              </button>

              {isProfileOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-85 bg-white border-2 border-gray-300 rounded-lg p-5 z-50 shadow-lg"
                  style={{
                    background: "linear-gradient(90deg, #dcefe7, #eef6ff)",
                  }}
                >
                  {/* Header */}
                  <div className="text-sm text-gray-500 mb-3 tracking-wide">
                    Currently in
                  </div>

                  {/* User Information */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-14 h-14 rounded-full bg-gray-200 border border-gray-400 flex items-center justify-center text-xl font-semibold text-gray-700 shrink-0">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <div className="text-gray-900 truncate font-semibold">
                        {user?.name || "No Name"}
                      </div>
                      <div className="text-gray-700 truncate mt-0.5">
                        {user?.email || "No Email"}
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-300 my-3"></div>

                  {/* Role */}
                  <div className="text-sm text-gray-700 mb-4">
                    <span className="font-medium">Account Type:</span>{" "}
                    <span className="text-blue-600 font-semibold">
                      {user?.role || "User"}
                    </span>
                  </div>

                  {/* Logout */}
                  <button
                    onClick={() =>
                      setAlert({
                        open: true,
                        title: "Logout",
                        message: "Are you sure you want to logout?",
                        type: "confirm",
                        onConfirm: handleLogout,
                      })
                    }
                    className="w-full border-2 border-gray-300 text-gray-700 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-200 text-center font-semibold py-1 rounded-md cursor-pointer"
                    title="Logout"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 relative p-4 overflow-y-auto">
            {/* <Outlet /> */}
            <Outlet context={{ searchQuery: debouncedSearch }} />
          </div>

          {/* ✅ ADD MODAL HERE */}
          <CreateCardModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSuccess={() => window.location.reload()}
            setAlert={setAlert}
          />

          {/* Alert Model */}
          <AlertModal
            isOpen={alert.open}
            title={alert.title}
            message={alert.message}
            type={alert.type}
            onConfirm={() => {
              if (alert.onConfirm) alert.onConfirm();
              setAlert({ ...alert, open: false });
            }}
            onCancel={() => setAlert({ ...alert, open: false })}
          />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
