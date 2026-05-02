import { Trash2 } from "lucide-react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const MaterialRow = ({
  index,
  control,
  register,
  remove,
  masterData,
  skuOptions,
  nameOptions,
  setValue,
  fieldsLength,
  handleAddRow,
  trigger,
  errors,
  setAlertConfig,
  watch,
}) => {
  // BASE STYLE FOR SKU AND ITEM FIELD
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      backgroundColor: "transparent",
      borderWidth: "2px",
      borderColor: state.isFocused ? "#2563eb" : "#4b5563",
      boxShadow: "none",
      padding: "0px 8px",
      fontSize: "16px",
      fontWeight: "500",
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "6px 0px",
      fontSize: "16px",
      fontWeight: "500",
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
      fontSize: "16px",
      fontWeight: "500",
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "34px",
    }),

    // 🔥 NEW (for selected value text)
    singleValue: (base) => ({
      ...base,
      fontSize: "16px",
      fontWeight: "500",
    }),

    // 🔥 NEW (dropdown options)
    option: (base, state) => ({
      ...base,
      fontSize: "14px",
      fontWeight: state.isSelected ? "600" : "500",
      backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
      color: "#111827",
    }),

    // 🔥 NEW (placeholder)
    placeholder: (base) => ({
      ...base,
      fontSize: "16px",
      fontWeight: "500",
      color: "#9ca3af",
    }),

    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  // ✅ SKU CHANGE HANDLER
  const handleSkuChange = (selected, field) => {
    const value = selected ? selected.value : "";
    field.onChange(value);

    const match = masterData.find((m) => m.sku === value);

    if (match) {
      setValue(`items.${index}.name`, match.name);
      setValue(`items.${index}.unit`, match.unit);

      trigger(`items.${index}.sku`);
      trigger(`items.${index}.name`);
    }
  };

  // ✅ NAME CHANGE HANDLER
  const handleNameChange = (selected, field) => {
    const value = selected ? selected.value : "";
    field.onChange(value);

    const match = masterData.find((m) => m.name === value);

    if (match) {
      setValue(`items.${index}.sku`, match.sku);
      setValue(`items.${index}.unit`, match.unit);

      trigger(`items.${index}.sku`);
      trigger(`items.${index}.name`);
    }
  };

  // VALIDATION ON QUANTITY
  const validateQuantity = (value) => {
    if (!value) return "Qty required";

    const qty = Number(value);

    if (qty < 0) return "Min 1";

    const formType = watch("formType");
    const sku = watch(`items.${index}.sku`);

    if (formType === "Out" && sku) {
      const item = masterData.find((m) => m.sku === sku);

      if (item && qty > Number(item.stock)) {
        return `Available qty is ${item.stock} in stock`;
      }
    }

    return true;
  };

  return (
    <div className="grid grid-cols-[40px_0.6fr_1.4fr_80px_140px_0.7fr_50px] gap-3 items-center">
      {/* Index */}
      <div className="text-center text-lg font-medium">{index + 1}</div>

      {/* SKU */}
      <div className="w-full">
        <Controller
          control={control}
          name={`items.${index}.sku`}
          rules={{ required: "SKU is required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={skuOptions}
              placeholder="Select SKU"
              styles={selectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              onChange={(selected) => handleSkuChange(selected, field)}
              value={
                field.value ? { value: field.value, label: field.value } : null
              }
            />
          )}
        />
        {errors?.items?.[index]?.sku && (
          <p className="text-red-500 text-xs mt-1">
            {errors.items[index].sku.message}
          </p>
        )}
      </div>

      {/* NAME */}
      <div className="w-full">
        <Controller
          control={control}
          name={`items.${index}.name`}
          rules={{ required: "Item required" }}
          render={({ field }) => (
            <Select
              {...field}
              options={nameOptions}
              placeholder="Select Item"
              styles={selectStyles}
              menuPortalTarget={document.body}
              menuPosition="fixed"
              onChange={(selected) => handleNameChange(selected, field)}
              value={
                field.value ? { value: field.value, label: field.value } : null
              }
            />
          )}
        />
        {errors?.items?.[index]?.name && (
          <p className="text-red-500 text-xs mt-1">
            {errors.items[index].name.message}
          </p>
        )}
      </div>

      {/* UNIT */}
      <input
        type="hidden"
        {...register(`items.${index}.unit`)}
        readOnly
        placeholder="Unit"
        className="border-2 border-gray-600 focus:border-blue-600 focus:outline-none focus:ring-0 rounded px-2 py-1.5 text-[16px] font-medium"
      />

      {/* QTY */}
      <div>
        <input
          type="number"
          step="any"
          placeholder="Qty"
          {...register(`items.${index}.quantity`, {
            validate: validateQuantity,
          })}
          onInput={(e) => {
            if (e.target.value < 0) {
              e.target.value = "";
            }
          }}
          onChange={(e) => {
            // 🔥 Force validation re-run (important)
            register(`items.${index}.quantity`).onChange(e);
            trigger(`items.${index}.quantity`);
          }}
          className="border-2 border-gray-600 focus:border-blue-600 focus:outline-none focus:ring-0 rounded px-2 py-1.5 w-full text-[16px] font-medium"
        />

        {errors?.items?.[index]?.quantity && (
          <p className="text-red-500 text-xs mt-1">
            {errors.items[index].quantity.message}
          </p>
        )}
      </div>

      {/* DATE */}
      <div>
        <input
          type="date"
          {...register(`items.${index}.date`, {
            required: "Date required",
          })}
          className="border-2 border-gray-600 focus:border-blue-600 focus:outline-none focus:ring-0 rounded px-2 py-1.5 w-full text-[16px] font-medium"
        />
        {errors?.items?.[index]?.date && (
          <p className="text-red-500 text-xs mt-1">
            {errors.items[index].date.message}
          </p>
        )}
      </div>

      {/* REMARKS */}
      <input
        placeholder="Remarks"
        {...register(`items.${index}.remarks`)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && index === fieldsLength - 1) {
            e.preventDefault();
            handleAddRow();
          }
        }}
        className="border-2 border-gray-600 focus:border-blue-600 focus:outline-none focus:ring-0 rounded px-2 py-1.5 w-full text-[16px] font-medium"
      />

      {/* DELETE */}
      <div className="flex justify-center cursor-pointer">
        <button
          className="text-gray-900 hover:text-red-600 cursor-pointer font-medium"
          type="button"
          onClick={() => {
            if (index === 0) {
              setAlertConfig({
                isOpen: true,
                title: "Warning",
                message: "First row cannot be deleted",
              });
              return;
            }
            remove(index);
          }}
        >
          <Trash2 size={30} />
        </button>
      </div>
    </div>
  );
};

export default MaterialRow;
