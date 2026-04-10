import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const API_URL =
  "https://script.google.com/macros/s/AKfycbzwbyEVzFVowbjK0VAFcq3buB1vCLWty3inW_KrDoiy1LpLwnUvLwv5g54r6Q1219NGPQ/exec";

const EditCardModal = ({ isOpen, onClose, onSuccess, setAlert, card }) => {
  const { register, handleSubmit, reset } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Prefill
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

  const submit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
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

        setTimeout(() => {
          onClose();
          onSuccess();
        }, 1200);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-999">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black cursor-pointer"
        >
          <X />
        </button>

        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
          Update Existing Card
        </h2>

        <form onSubmit={handleSubmit(submit)} className="space-y-3">
          <div>
            <label className="text-[16px] font-medium">Image URL</label>
            <input
              {...register("image")}
              className="w-full mt-1 border-2 border-gray-500 focus:border-blue-500 focus:outline-none rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="text-[16px] font-medium">Name of the Card</label>
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

          <button className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
            {isSubmitting ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCardModal;
