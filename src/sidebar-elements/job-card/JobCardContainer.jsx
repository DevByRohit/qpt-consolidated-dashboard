import AlertModal from "../../alert-modal/AlertModal";
import Loader from "../../alert-modal/Loader";
import { useEffect, useState } from "react";
import {
  getJobCards,
  updateJobCardStatus,
  deleteJobCard,
} from "../production-planning/services/productionApi";
import JobCardCard from "./components/JobCardCard";
import { useOutletContext } from "react-router-dom";
import { useJobCardContext } from "./components/JobCardContext";

const JobCardContainer = () => {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const { jobCards, refreshJobCards } = useJobCardContext();

  const [loader, setLoader] = useState({
    open: false,
    message: "",
    subMessage: "",
  });

  const [alert, setAlert] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const handleStatusChange = (jobCardNo, status) => {
    setAlert({
      isOpen: true,
      title: "Update Job Card Status",
      message: `Are you sure you want to change the status to "${status}"?`,
      type: "confirm",

      onConfirm: async () => {
        try {
          setAlert((prev) => ({
            ...prev,
            isOpen: false,
          }));

          setLoader({
            open: true,
            message: "Updating Job Card Status",
            subMessage:
              "Please wait while the job card status is being updated...",
          });

          await updateJobCardStatus({
            action: "updateJobCardStatus",
            job_card_no: jobCardNo,
            status,
          });

          // Refresh Cards
          await refreshJobCards();

          // Success Popup
          setAlert({
            isOpen: true,
            title: "Success",
            message: "Job Card status updated successfully.",
            type: "info",
          });
        } catch (error) {
          setAlert({
            isOpen: true,
            title: "Error",
            message: error.message,
            type: "info",
          });
        } finally {
          setLoader({
            open: false,
            message: "",
            subMessage: "",
          });
        }
      },
    });
  };

  const handleDeleteJobCard = (jobCardNo) => {
    setAlert({
      isOpen: true,
      title: "Delete Job Card",
      message:
        "Are you sure you want to delete this Job Card? This action cannot be undone.",
      type: "confirm",

      onConfirm: async () => {
        try {
          // Close Confirmation
          setAlert((prev) => ({
            ...prev,
            isOpen: false,
          }));

          // Show Loader
          setLoader({
            open: true,
            message: "Deleting Job Card",
            subMessage: "Please wait while the job card is being deleted...",
          });

          // Delete API
          await deleteJobCard({
            job_card_no: jobCardNo,
          });

          // Refresh Cards
          await fetchJobCards();

          // Success Popup
          setAlert({
            isOpen: true,
            title: "Success",
            message: "Job Card deleted successfully.",
            type: "info",
          });
        } catch (error) {
          setAlert({
            isOpen: true,
            title: "Error",
            message: error.message,
            type: "info",
          });
        } finally {
          setLoader({
            open: false,
            message: "",
            subMessage: "",
          });
        }
      },
    });
  };

  // search implementation
  const { searchQuery } = useOutletContext();

  // const filteredJobCards = jobCards.filter((card) => {
  //   const query = searchQuery.trim().toLowerCase();

  //   // Show all cards when search is empty
  //   if (!query) return true;

  //   return (
  //     card.job_card_no?.toLowerCase().includes(query) ||
  //     card.product_name?.toLowerCase().includes(query) ||
  //     card.created_by?.toLowerCase().includes(query) ||
  //     card.status?.toLowerCase().includes(query)
  //   );
  // });

  const filteredJobCards = jobCards.filter((card) => {
    const query = searchQuery.trim().toLowerCase();

    // Search Match
    const matchesSearch =
      !query ||
      card.job_card_no?.toLowerCase().includes(query) ||
      card.product_name?.toLowerCase().includes(query) ||
      card.created_by?.toLowerCase().includes(query) ||
      card.status?.toLowerCase().includes(query);

    // Status Match
    const matchesStatus =
      statusFilter === "ALL" || card.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-3">
      {/* Loader UI */}
      {loader.open && (
        <Loader message={loader.message} subMessage={loader.subMessage} />
      )}

      <div className="sticky top-0 flex justify-between items-center">
        <h2 className="text-3xl font-bold uppercase text-slate-800">
          Job Card History
        </h2>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border-2 border-slate-400 rounded px-3 py-2 font-medium focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="IN PRODUCTION">In Production</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Total Records */}
          <div className="border-2 border-slate-400 px-3 py-2 rounded">
            <h3 className="font-medium">
              Total Job Cards : {filteredJobCards.length}
            </h3>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {filteredJobCards.length === 0 ? (
        <div className="col-span-3 border border-dashed border-slate-300 rounded-md py-12 text-center">
          <h3 className="text-3xl font-bold text-slate-700">
            No Job Cards Found
          </h3>

          <p className="text-lg text-slate-500 mt-1">
            No job cards match "<span className="font-bold">{searchQuery}</span>
            ".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3">
          {filteredJobCards.map((jobCard) => (
            <JobCardCard
              key={jobCard.job_card_no}
              jobCard={jobCard}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteJobCard}
            />
          ))}
        </div>
      )}

      <AlertModal
        isOpen={alert.isOpen}
        title={alert.title}
        message={alert.message}
        type={alert.type}
        onConfirm={() => {
          if (alert.onConfirm) {
            alert.onConfirm();
          } else {
            setAlert((prev) => ({
              ...prev,
              isOpen: false,
            }));
          }
        }}
        onCancel={() =>
          setAlert((prev) => ({
            ...prev,
            isOpen: false,
          }))
        }
      />
    </div>
  );
};

export default JobCardContainer;
