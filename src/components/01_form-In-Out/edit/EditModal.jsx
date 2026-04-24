import { useState } from "react";
import { IN_OUT_API } from "../../apiContainer";

const EditModal = ({ txn, onClose, onSuccess, setAlertConfig }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    sku: txn.sku,
    itemName: txn.itemname,
    unit: txn.unit,
    quantity: txn.quantity,
    transactionType: txn.transactiontype,
    date: txn.formdate.split("T")[0],
    remarks: txn.remarks || "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // FINAL SUBMIT FUNCTION
  const handleFinalUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch(IN_OUT_API, {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          transactionId: txn.transactionid,
          user: user?.email || "unknown",
          updatedData: formData,
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        setAlertConfig({
          isOpen: true,
          title: "Success",
          message: "Entry updated successfully",
          type: "info",
        });

        onSuccess(true); // 🔥 force refresh
        onClose();
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
      setLoading(false);
    }
  };

  // 🔥 VALIDATION + CONFIRMATION
  const handleUpdate = () => {
    // ✅ VALIDATION
    if (
      !formData.sku ||
      !formData.itemName ||
      !formData.unit ||
      !formData.quantity ||
      !formData.transactionType ||
      !formData.date
    ) {
      setAlertConfig({
        isOpen: true,
        title: "Validation Error",
        message: "All fields are required",
        type: "info",
      });
      return;
    }

    if (Number(formData.quantity) <= 0) {
      setAlertConfig({
        isOpen: true,
        title: "Validation Error",
        message: "Quantity must be greater than 0",
        type: "info",
      });
      return;
    }

    // CONFIRMATION MODAL
    setAlertConfig({
      isOpen: true,
      title: "Confirm Update",
      message: "Are you sure you want to update this entry?",
      type: "confirm",
      onConfirm: handleFinalUpdate,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded w-120 space-y-3">
        <h2 className="text-lg font-semibold">Edit Entry</h2>

        <input
          value={formData.sku}
          onChange={(e) => handleChange("sku", e.target.value)}
          className="w-full px-2 py-1 border-2 border-gray-400 rounded font-medium text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="SKU"
        />

        <input
          value={formData.itemName}
          onChange={(e) => handleChange("itemName", e.target.value)}
          className="w-full px-2 py-1 border-2 border-gray-400 rounded font-medium text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Item Name"
        />

        <input
          value={formData.unit}
          onChange={(e) => handleChange("unit", e.target.value)}
          className="w-full px-2 py-1 border-2 border-gray-400 rounded font-medium text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Unit"
        />

        <input
          type="number"
          value={formData.quantity}
          onChange={(e) => handleChange("quantity", Math.abs(e.target.value))}
          className="w-full px-2 py-1 border-2 border-gray-400 rounded font-medium text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Qty"
        />

        <select
          value={formData.transactionType}
          onChange={(e) => handleChange("transactionType", e.target.value)}
          className="w-full px-2 py-1 border-2 border-gray-400 rounded font-medium text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="In">In</option>
          <option value="Out">Out</option>
        </select>

        <input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full px-2 py-1 border-2 border-gray-400 rounded font-medium text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        <input
          value={formData.remarks}
          onChange={(e) => handleChange("remarks", e.target.value)}
          className="w-full px-2 py-1 border-2 border-gray-400 rounded font-medium text-gray-800 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Remarks"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="border px-3 py-1 rounded cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="border px-3 py-1 rounded bg-blue-600 text-white cursor-pointer"
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
