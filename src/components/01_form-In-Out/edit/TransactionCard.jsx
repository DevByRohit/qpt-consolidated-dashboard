import { useState } from "react";
import { Edit, Trash2 } from "lucide-react";
import EditModal from "./EditModal";
import { formatPrettyDate } from "../edit/dateFormat";
import { IN_OUT_API } from "../../apiContainer";
import Loader from "../../../alert-modal/Loader";

const TransactionCard = ({ txn, onRefresh, setAlertConfig }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // DELETE HANDLER
  const handleDelete = () => {
    setAlertConfig({
      isOpen: true,
      title: "Heads up!",
      message: "Are you sure you want to delete this entry?",
      type: "confirm",
      onConfirm: handleFinalDelete,
    });
  };

  // DELETE FUNCTION
  const handleFinalDelete = async () => {
    if (isDeleting) return; // prevent multiple clicks

    try {
      setIsDeleting(true);

      const user = JSON.parse(localStorage.getItem("user"));

      const res = await fetch(IN_OUT_API, {
        method: "POST",
        body: JSON.stringify({
          action: "delete",
          transactionId: txn.transactionid,
          user: user?.email || "unknown",
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        setAlertConfig({
          isOpen: true,
          title: "Success",
          message: "Entry deleted successfully",
          type: "info",
        });

        onRefresh(true); // refresh list
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setAlertConfig({
        isOpen: true,
        title: "Error",
        message: err.message,
        type: "info",
      });
    } finally {
      setIsDeleting(false); // always reset
    }
  };

  return (
    <>
      <div className="relative group border rounded p-2 shadow-sm hover:shadow-lg transition duration-200 cursor-pointer">
        {/* CONTENT */}
        <div className="space-y-1 text-xs font-medium uppercase">
          <p>
            <b>SKU :</b> {txn.sku}
          </p>
          <p>
            <b>Item :</b> {txn.itemname}
          </p>
          <p>
            <b>Qty :</b> {txn.quantity}
          </p>
          <p>
            <b>Type :</b> {txn.transactiontype}
          </p>
          <p>
            <b>Date :</b> {formatPrettyDate(txn.formdate)}
          </p>
        </div>

        {/* FLOATING ACTION BUTTONS */}
        <div className="absolute bottom-2 right-2 flex gap-3 opacity-0 group-hover:opacity-100 transition duration-300">
          <button
            onClick={() => setOpenEdit(true)}
            className="p-1 rounded border shadow hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            <Edit size={18} />
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className={`p-1 rounded border shadow cursor-pointer ${isDeleting ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600 hover:text-white"}`}
          >
            {isDeleting ? "..." : <Trash2 size={18} />}
          </button>
        </div>
      </div>

      {isDeleting && (
        <Loader
          message="Deleting entry..."
          subMessage="Please wait, this may take a few seconds"
        />
      )}

      {openEdit && (
        <EditModal
          txn={txn}
          onClose={() => setOpenEdit(false)}
          onSuccess={onRefresh}
          setAlertConfig={setAlertConfig}
        />
      )}
    </>
  );
};

export default TransactionCard;
