import { Controller, useFieldArray, useForm } from "react-hook-form";
import Select from "react-select";
import { Trash2, Printer, Plus } from "lucide-react";

const PlanningForm = ({
  products,
  onGenerate,
  handlePrintConsolidated,
  handlePrintFGAnalysis,
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

    // NEW (for selected value text)
    singleValue: (base) => ({
      ...base,
      fontSize: "16px",
      fontWeight: "500",
    }),

    // (dropdown options)
    option: (base, state) => ({
      ...base,
      fontSize: "16px",
      fontWeight: state.isSelected ? "600" : "500",
      backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
      color: "#111827",
    }),

    // (placeholder)
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

  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      markup_percent: "",
      items: [
        {
          product_id: "",
          qty: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Convert API data into react-select options
  const fgOptions = products.map((item) => ({
    value: item.product_id,
    label: `${item.product_name} (${item.fg_code})`,
  }));

  const onSubmit = (data) => {
    const payload = {
      action: "generateKitting",
      markup_percent: Number(data.markup_percent),
      items: data.items.map((item) => ({
        product_id: item.product_id,
        qty: Number(item.qty),
      })),
    };

    onGenerate(payload);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {/* Title */}
        <h2 className="text-3xl font-bold uppercase text-slate-800">
          Production Planning
        </h2>

        <div className="flex gap-2">
          <button
            onClick={handlePrintConsolidated}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700  font-medium cursor-pointer"
          >
            <Printer size={20} /> Consolidated Report
          </button>

          <button
            onClick={handlePrintFGAnalysis}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium cursor-pointer"
          >
            <Printer size={20} /> FG Analysis
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Dynamic Rows */}
        <div className="max-h-34.5 overflow-y-auto space-y-2">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-12 gap-4 items-center"
            >
              {/* Serial Number */}
              {/* Row Number */}
              <div className="col-span-1 flex justify-center">
                <div className="w-full h-10 rounded-sm flex items-center justify-center text-xl font-bold border-2 border-slate-600">
                  {index + 1}
                </div>
              </div>

              {/* FG Dropdown */}
              <div className="col-span-7">
                <Controller
                  control={control}
                  name={`items.${index}.product_id`}
                  rules={{
                    required: true,
                  }}
                  render={({ field }) => (
                    <Select
                      placeholder="Search finished goods to generate full kitting report..."
                      options={fgOptions}
                      styles={selectStyles}
                      menuPortalTarget={document.body}
                      menuPosition="fixed"
                      value={
                        fgOptions.find(
                          (option) => option.value === field.value,
                        ) || null
                      }
                      onChange={(selected) => field.onChange(selected?.value)}
                      isSearchable
                    />
                  )}
                />
              </div>

              {/* Quantity */}
              <div className="col-span-3">
                <input
                  type="number"
                  min="1"
                  placeholder="Required production quantity"
                  className="w-full border-2 border-slate-600 rounded-sm px-3 py-1.5 text-base font-medium outline-none focus:border-blue-600 transition-colors"
                  {...register(`items.${index}.qty`, {
                    required: true,
                    min: 1,
                  })}
                />
              </div>

              {/* Remove */}
              <div className="col-span-1 flex justify-center">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-600 transition cursor-pointer"
                  >
                    <Trash2 size={36} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-between">
          {/* Left Side Input Field*/}
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="0"
              placeholder="Markup In %"
              className="w-35 border-2 border-slate-600 rounded-md px-2 py-1 text-lg font-bold outline-none focus:border-blue-600 transition-colors"
              {...register("markup_percent")}
            />
          </div>

          {/* Right Side Buttons*/}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                append({
                  product_id: "",
                  qty: "",
                })
              }
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition font-medium cursor-pointer"
            >
              <Plus size={22} /> Add Product
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition font-medium cursor-pointer"
            >
              Generate Full Kitting
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlanningForm;
