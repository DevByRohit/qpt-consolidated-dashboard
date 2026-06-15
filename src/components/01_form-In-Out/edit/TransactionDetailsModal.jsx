import { X } from "lucide-react";
import { formatPrettyDate, formatTimestamp } from "../edit/dateFormat";

const TransactionDetailsModal = ({ txn, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-5 py-3 border-b-2 border-gray-400">
          <h2 className="text-xl font-bold uppercase">Transaction Details</h2>

          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-200 cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 grid grid-cols-2 gap-4 text-sm">
          {/* <InfoRow label="Transaction ID" value={txn.transactionid} /> */}

          <InfoRow label="Sku Code" value={txn.sku} />

          <InfoRow label="Item Name" value={txn.itemname} />

          <InfoRow label="Quantity" value={txn.quantity} />

          <InfoRow label="Unit" value={txn.unit} />

          <InfoRow label="Transaction Type" value={txn.transactiontype} />

          <InfoRow label="Date" value={formatPrettyDate(txn.formdate)} />

          <InfoRow label="Submitted By" value={txn.submittedby} />

          <InfoRow label="Timestamp" value={formatTimestamp(txn.timestamp)} />
        </div>

        {/* REMARKS */}
        <div className="px-5">
          <label className="text-lg font-semibold block">Remarks</label>

          <div className="border border-gray-400 rounded p-3 bg-gray-50 min-h-20">
            {txn.remarks || "No Remarks"}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-2 px-5 py-4">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded bg-gray-700 text-white hover:bg-gray-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }) => {
  return (
    <div>
      <p className="text-lg font-medium">{label}</p>

      <p className="text-sm font-semibold wrap-break-word">{value || "-"}</p>
    </div>
  );
};

export default TransactionDetailsModal;
