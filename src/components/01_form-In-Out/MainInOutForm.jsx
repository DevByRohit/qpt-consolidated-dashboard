import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import useMasterData from "./01_hooks/useMasterData";
import { getSkuOptions, getNameOptions } from "./02_utils/transformOptions";

import FormHeader from "./03_components/FormHeader";
import MaterialTable from "./03_components/MaterialTable";
import AlertModal from "../../alert-modal/AlertModal";

const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

const MainInOutForm = () => {
  const { masterData } = useMasterData();
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔥 ALERT STATE
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
    console.log("Form Data:", data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full h-[86vh] flex flex-col overflow-hidden"
      >
        <h1 className="text-2xl font-semibold mb-4">
          Material In / Out System
        </h1>

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

        <div className="flex justify-end gap-4 mt-3">
          <button
            type="button"
            onClick={handleAddRow}
            className="px-4 py-1.5 font-medium border rounded hover:bg-gray-800 hover:text-white cursor-pointer"
          >
            Add Row
          </button>

          <button
            type="submit"
            className="px-4 py-1.5 font-medium border rounded hover:bg-blue-600 hover:text-white cursor-pointer"
          >
            Submit
          </button>
        </div>
      </form>

      {/* 🔥 GLOBAL ALERT MODAL */}
      <AlertModal
        isOpen={alertConfig.isOpen}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onConfirm={() => setAlertConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default MainInOutForm;
