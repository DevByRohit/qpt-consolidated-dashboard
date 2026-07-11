import { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import JobCardMenu from "./JobCardMenu";
import {
  formatPrettyDate,
  formatTimeAgo,
} from "../../../components/01_form-In-Out/edit/dateFormat";

const JobCardCard = ({ jobCard, onStatusChange, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const onView = () => {
    // This first way to open link using on click method
    window.open(jobCard.pdf_url, "_blank", "noopener,noreferrer");

    // This second way to open link using on click method
    // const link = document.createElement("a");
    // link.href = jobCard.pdf_url;
    // link.target = "_blank";
    // link.rel = "noopener noreferrer";
    // link.click();
  };

  // Card Theme
  const cardStyle =
    jobCard.status === "COMPLETED"
      ? "bg-green-50 border-green-400"
      : jobCard.status === "CANCELLED"
        ? "bg-red-50 border-red-400"
        : "bg-amber-50 border-amber-400";

  // Status Badge
  const statusBadge =
    jobCard.status === "COMPLETED"
      ? "bg-green-100 text-green-700 border-green-300"
      : jobCard.status === "CANCELLED"
        ? "bg-red-100 text-red-700 border-red-300"
        : "bg-amber-100 text-amber-700 border-amber-300";

  return (
    <div
      className={`border-2 rounded-sm p-2 shadow-sm hover:shadow-md transition ${cardStyle}`}
    >
      <div className="relative">
        {/* Details */}
        <div className="relative">
          <p className="absolute bottom-0 right-0 text-xs text-slate-500 italic">
             {formatTimeAgo(jobCard.created_timestamp)}
          </p>

          <p className="font-semibold text-[12px] uppercase">
            Job Card No. :{" "}
            <span className="font-medium">{jobCard.job_card_no}</span>
          </p>

          <p className="font-semibold text-[12px] uppercase">
            Product Name :{" "}
            <span className="font-medium">{jobCard.product_name}</span>
          </p>

          <p className="font-semibold text-[12px] uppercase">
            Quantity :{" "}
            <span className="font-medium">
              {jobCard.planned_qty} {jobCard.unit}
            </span>
          </p>

          <p className="font-medium text-[12px] uppercase flex items-center gap-2">
            Status :
            <span
              className={`inline-flex items-center px-1 rounded text-[12px] font-semibold border ${statusBadge}`}
            >
              {jobCard.status}
            </span>
          </p>

          <p className="font-medium text-[12px] uppercase">
            Date :{" "}
            <span className="font-medium">
              {formatPrettyDate(jobCard.created_date)}
            </span>
          </p>

          <p className="font-medium text-[12px] uppercase">
            Created By :{" "}
            <span className="font-semibold">{jobCard.created_by}</span>
          </p>
        </div>

        {/* Menu Button */}
        <button
          onClick={handleMenuOpen}
          className="absolute top-0 right-0 hover:bg-slate-300 p-1 rounded transition cursor-pointer"
        >
          <EllipsisVertical size={22} />
        </button>

        {open && (
          <JobCardMenu
            anchorEl={anchorEl}
            onClose={handleMenuClose}
            onView={onView}
            onStatusChange={(status) =>
              onStatusChange(jobCard.job_card_no, status)
            }
            onDelete={() => onDelete(jobCard.job_card_no)}
          />
        )}
      </div>
    </div>
  );
};

export default JobCardCard;
