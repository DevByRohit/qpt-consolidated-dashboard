import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";
import Loader from "../alert-modal/Loader";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzwbyEVzFVowbjK0VAFcq3buB1vCLWty3inW_KrDoiy1LpLwnUvLwv5g54r6Q1219NGPQ/exec";

const EditCardModal = ({ isOpen, onClose, onSuccess, setAlert, card }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Prefill form
  useEffect(() => {
    if (card) {
      reset({
        image: card.image || "",
        title: card.title || "",
        link: card.url || "",
      });
    }
  }, [card, reset]);

  if (!isOpen || !card) return null;

  // 🔥 FINAL API CALL
  const handleFinalSubmit = async (data) => {
    try {
      // 🔥 CLOSE CONFIRM ALERT FIRST
      setAlert((prev) => ({ ...prev, open: false }));

      // small delay to allow UI update
      await new Promise((r) => setTimeout(r, 100));

      setIsSubmitting(true);

      const res = await fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({
          action: "update",
          id: card.id,
          title: data.title,
          link: data.link,
          image: data.image || "",
          module: card.module,
          type: card.type,
        }),
      });

      const result = await res.json();

      if (result.status === "success") {
        setAlert({
          open: true,
          title: "Success",
          message: "Card updated successfully ✅",
          type: "info",
        });

        onClose();
        onSuccess();
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      setAlert({
        open: true,
        title: "Error",
        message: err.message,
        type: "info",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🔥 HANDLE SUBMIT (CONFIRM FIRST)
  const submit = (data) => {
    if (isSubmitting) return;

    setAlert({
      open: true,
      title: "Confirm Update",
      message: "Are you sure you want to update this card?",
      type: "confirm",
      onConfirm: () => handleFinalSubmit(data),
    });
  };

  return (
    <>
      {/* 🔥 LOADER */}
      {isSubmitting && (
        <Loader
          message="Updating card..."
          subMessage="Please wait, saving changes"
        />
      )}

      {/* MODAL */}
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-999">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6 relative">
          {/* CLOSE BUTTON */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
          >
            <X />
          </button>

          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            Update Existing Card
          </h2>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(submit)}
            className={`space-y-3 ${
              isSubmitting ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            <div>
              <label className="text-[16px] font-medium">Image URL</label>
              <input
                {...register("image")}
                className="w-full mt-1 border-2 border-gray-500 focus:border-blue-500 focus:outline-none rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[16px] font-medium">
                Name of the Card
              </label>
              <input
                {...register("title")}
                className="w-full mt-1 border-2 border-gray-500 focus:border-blue-500 focus:outline-none rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-[16px] font-medium">Redirect URL</label>
              <input
                {...register("link")}
                className="w-full mt-1 border-2 border-gray-500 focus:border-blue-500 focus:outline-none rounded px-3 py-2"
              />
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 rounded cursor-pointer ${
                isSubmitting
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white"
              }`}
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCardModal;
