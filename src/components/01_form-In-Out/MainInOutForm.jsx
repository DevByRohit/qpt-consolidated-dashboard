import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

// internal components and modules
import { useMasterData } from "../01_form-In-Out/01_hooks/MasterDataContext";
import { getSkuOptions, getNameOptions } from "./02_utils/transformOptions";
import FormHeader from "./03_components/FormHeader";
import MaterialTable from "./03_components/MaterialTable";
import AlertModal from "../../alert-modal/AlertModal";
import { IN_OUT_API } from "../apiContainer";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const MainInOutForm = () => {
  const { masterData, loading, fetchMasterData } = useMasterData();
  const user = JSON.parse(localStorage.getItem("user"));

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ALERT STATE
  const [alertConfig, setAlertConfig] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      formType: "Out",
      items: [
        {
          sku: "",
          name: "",
          unit: "",
          date: getTodayDate(),
          quantity: "",
          remarks: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const skuOptions = getSkuOptions(masterData);
  const nameOptions = getNameOptions(masterData);

  const handleAddRow = () => {
    const lastRow = watch("items")[fields.length - 1];

    if (
      !lastRow?.sku &&
      !lastRow?.name &&
      !lastRow?.quantity &&
      !lastRow?.remarks
    ) {
      setAlertConfig({
        isOpen: true,
        title: "Warning",
        message: "Please fill current row before adding new one.",
        type: "info",
      });
      return;
    }

    append({
      sku: "",
      name: "",
      unit: "",
      date: getTodayDate(),
      quantity: "",
      remarks: "",
    });
  };

  const onSubmit = (data) => {
    setAlertConfig({
      isOpen: true,
      title: "Confirm Submission",
      message: "Are you sure you want to submit this entry?",
      type: "confirm",
      onConfirm: () => handleFinalSubmit(data),
    });
  };

  const handleFinalSubmit = async (data) => {
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 🔥 Close confirm modal
      setAlertConfig((prev) => ({ ...prev, isOpen: false }));

      const payload = {
        action: "create",
        formType: data.formType,
        submittedBy: user?.email || "unknown",
        items: data.items,
      };

      const res = await fetch(IN_OUT_API, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.status === "success") {
        setAlertConfig({
          isOpen: true,
          title: "Success",
          message: "Data submitted successfully",
          type: "info",
        });

        // Refresh stock after submit
        await fetchMasterData();

        // Reset form
        reset({
          formType: "Out",
          items: [
            {
              sku: "",
              name: "",
              unit: "",
              date: getTodayDate(),
              quantity: "",
              remarks: "",
            },
          ],
        });
      } else {
        throw new Error(result.message || "Submission failed");
      }
    } catch (err) {
      setAlertConfig({
        isOpen: true,
        title: "Error",
        message: err.message,
        type: "info",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-[86vh] flex flex-col gap-3 overflow-hidden"
      >
        <FormHeader register={register} user={user} />

        <MaterialTable
          fields={fields}
          control={control}
          register={register}
          remove={remove}
          masterData={masterData}
          skuOptions={skuOptions}
          nameOptions={nameOptions}
          setValue={setValue}
          handleAddRow={handleAddRow}
          trigger={trigger}
          errors={errors}
          setAlertConfig={setAlertConfig}
          watch={watch}
        />

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-4 py-1.5 font-medium border rounded hover:bg-gray-800 hover:text-white cursor-pointer"
          >
            Add Row
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-4 py-1.5 font-medium border rounded cursor-pointer ${
              isSubmitting
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "hover:bg-blue-600 hover:text-white"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>

      {/* 🔥 GLOBAL ALERT MODAL */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={() => {
          alertConfig.onConfirm?.(); // 🔥 execute confirm action
          setAlertConfig((prev) => ({ ...prev, isOpen: false }));
        }}
        onCancel={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default MainInOutForm;
