const AlertModal = ({
  isOpen,
  title = "Alert",
  message = "",
  type = "info",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-999">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold mb-2 text-gray-800">{title}</h2>

        {/* Message */}
        <p className="text-gray-600 mb-5">{message}</p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          {/* Cancel (only for confirm type) */}
          {type === "confirm" && (
            <button
              onClick={onCancel}
              className="px-4 py-1 border rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              Cancel
            </button>
          )}

          {/* Confirm / OK */}
          <button
            onClick={onConfirm}
            className="px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer"
          >
            {type === "confirm" ? "Confirm" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;
