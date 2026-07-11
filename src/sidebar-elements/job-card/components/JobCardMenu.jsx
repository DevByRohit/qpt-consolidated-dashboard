import { useEffect, useRef } from "react";
import { Eye, CircleDot, Trash2 } from "lucide-react";

const STATUS = [
  {
    label: "IN PRODUCTION",
    value: "IN PRODUCTION",
    color: "text-amber-500",
  },
  {
    label: "COMPLETED",
    value: "COMPLETED",
    color: "text-green-600",
  },
  {
    label: "CANCELLED",
    value: "CANCELLED",
    color: "text-red-600",
  },
];

const JobCardMenu = ({
  anchorEl,
  onClose,
  onView,
  onStatusChange,
  onDelete,
}) => {
  const menuRef = useRef(null);

  if (!anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed w-50 bg-white px-2 py-2 border-2 border-slate-300 rounded-lg shadow-lg z-9999"
      style={{
        top: rect.bottom - 95,
        left: rect.right - 195,
      }}
    >
      {/* View */}
      <button
        onClick={() => {
          onView();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2 py-1 hover:bg-slate-300 transition text-left cursor-pointer rounded-full"
      >
        <Eye size={18} />
        View Job Card
      </button>

      {STATUS.map((status) => (
        <button
          key={status.value}
          onClick={() => {
            onStatusChange(status.value);
            onClose();
          }}
          className="w-full flex items-center gap-2 px-2 py-1 hover:bg-slate-300 transition text-left cursor-pointer rounded-full"
        >
          <CircleDot size={16} className={status.color} />
          <span className={status.color}>{status.label}</span>
        </button>
      ))}

      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="w-full flex items-center gap-2 px-2 py-1 hover:bg-red-200 text-red-600 transition text-left cursor-pointer rounded-full"
      >
        <Trash2 size={18} />
        Delete Job Card
      </button>
    </div>
  );
};

export default JobCardMenu;
