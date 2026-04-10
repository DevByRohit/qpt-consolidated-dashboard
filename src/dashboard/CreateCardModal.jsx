import { useState } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import { useLocation } from "react-router-dom";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzwbyEVzFVowbjK0VAFcq3buB1vCLWty3inW_KrDoiy1LpLwnUvLwv5g54r6Q1219NGPQ/exec";

const CreateCardModal = ({ isOpen, onClose, onSuccess, setAlert }) => {
  const { register, handleSubmit, reset } = useForm();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();

  if (!isOpen) return null;

  // ✅ detect module from route
  const getModule = () => {
    if (location.pathname.includes("fms")) return "fms";
    if (location.pathname.includes("ims")) return "ims";
    if (location.pathname.includes("pms")) return "pms";
    if (location.pathname.includes("dashboard")) return "dashboard";
    return "";
  };

  const confirmCreate = (data) => {
    setAlert({
      open: true,
      title: "Create Card",
      message: "Are you sure you want to create this card?",
      type: "confirm",
      onConfirm: () => submitCard(data),
    });
  };

  const submitCard = async (data) => {
    if (isSubmitting) return; // ✅ prevent double click

    setIsSubmitting(true); // ✅ disable button

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "add",
          title: data.title,
          link: data.link,
          image: data.image || "",
          module: getModule(),
          type: user?.role === "Developer" ? "internal" : "external",
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        setAlert({
          open: true,
          title: "Success",
          message: "Card created successfully ✅",
          type: "info",
        });

        setTimeout(() => {
          reset();
          onClose();
          onSuccess();
        }, 3000);
      }
    } catch (err) {
      setAlert({
        open: true,
        title: "Error",
        message: "Error creating card",
        type: "info",
      });
    } finally {
      setIsSubmitting(false); // ✅ always re-enable
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-999">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Create New Card
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(confirmCreate)} className="space-y-3">
          {/* Image */}
          <div>
            <label className="text-[16px] font-medium">
              Image URL (optional)
            </label>
            <input
              {...register("image")}
              placeholder="https://example.com/image.png"
              className="w-full mt-1 border-2 border-gray-500 focus:border-blue-500 focus:outline-none rounded px-3 py-2"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-[16px] font-medium">
              Name of the Card *
            </label>
            <input
              {...register("title", { required: true })}
              placeholder="Card title"
              className="w-full mt-1 border-2 border-gray-500 focus:border-blue-500 focus:outline-none rounded px-3 py-2"
            />
          </div>

          {/* Link */}
          <div>
            <label className="text-[16px] font-medium">Redirect URL *</label>
            <input
              {...register("link", { required: true })}
              placeholder="https://example.com or /fms/page"
              className="w-full mt-1 border-2 border-gray-500 focus:border-blue-500 focus:outline-none rounded px-3 py-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 border rounded bg-gray-100 hover:bg-gray-200 font-medium cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded text-white cursor-pointer ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCardModal;
