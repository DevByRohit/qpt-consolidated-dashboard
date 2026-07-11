import { Controller, useForm } from "react-hook-form";
import { Printer, Save } from "lucide-react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const JobCardForm = ({ products, onGenerate, handleSave, handlePrint }) => {
  // Initialize the navigate function
  const navigate = useNavigate();

  // =========================
  // React Select Styles
  // =========================
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

    singleValue: (base) => ({
      ...base,
      fontSize: "16px",
      fontWeight: "500",
    }),

    option: (base, state) => ({
      ...base,
      fontSize: "16px",
      fontWeight: state.isSelected ? "600" : "500",
      backgroundColor: state.isFocused ? "#e5e7eb" : "#fff",
      color: "#111827",
    }),

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

  // =========================
  // Form
  // =========================
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      product_id: "",
      planned_qty: "",
      supervisor_name: "",
      storekeeper_name: "",
    },
  });

  // =========================
  // Dropdown Options
  // =========================

  const fgOptions = products.map((item) => ({
    value: item.product_id,
    label: `${item.product_name} (${item.fg_code})`,
  }));

  // =========================
  // Submit
  // =========================

  const onSubmit = (data) => {
    const payload = {
      action: "generateJobCard",
      product_id: data.product_id,
      planned_qty: Number(data.planned_qty),
      supervisor_name: data.supervisor_name.trim(),
      storekeeper_name: data.storekeeper_name.trim(),
    };

    onGenerate(payload);
  };

  return (
    <div className="space-y-4">
      {/* Heading */}
      <div className="flex items-center justify-between">
        {/* Title */}
        <h2 className="text-3xl font-bold uppercase text-slate-800">
          Job Card Planning
        </h2>

        <div className="flex gap-2">
          <button
            onClick={handlePrint}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700  font-medium cursor-pointer"
          >
            <Printer size={20} /> Print Job Card
          </button>

          <button
            onClick={handleSave}
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium cursor-pointer"
          >
            <Save size={20} /> Save Job Card
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1 */}
        <div className="grid grid-cols-12 gap-4">
          {/* Finished Goods */}
          <div className="col-span-8">
            <Controller
              control={control}
              name="product_id"
              rules={{
                required: true,
              }}
              render={({ field }) => (
                <Select
                  placeholder="Search finished goods..."
                  options={fgOptions}
                  styles={selectStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  value={
                    fgOptions.find((option) => option.value === field.value) ||
                    null
                  }
                  onChange={(selected) => field.onChange(selected?.value)}
                  isSearchable
                />
              )}
            />
          </div>

          {/* Planned Quantity */}
          <div className="col-span-4">
            <input
              type="number"
              min="1"
              placeholder="Planned Quantity"
              className="w-full border-2 border-slate-600 rounded-sm px-3 py-1.5 text-base font-medium outline-none focus:border-blue-600 transition-colors"
              {...register("planned_qty", {
                required: true,
                min: 1,
              })}
            />
          </div>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between">
          {/* Supervisor */}
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Supervisor Name"
              className="w-full border-2 border-slate-600 rounded-sm px-2 py-1.5 text-base font-medium outline-none focus:border-blue-600 transition-colors"
              {...register("supervisor_name", {
                required: true,
              })}
            />

            {/* Storekeeper */}
            <input
              type="text"
              placeholder="Storekeeper Name"
              className="w-full border-2 border-slate-600 rounded-sm px-2 py-1.5 text-base font-medium outline-none focus:border-blue-600 transition-colors"
              {...register("storekeeper_name", {
                required: true,
              })}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/pms/job-card/container")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-medium cursor-pointer"
            >
              View Job Cards
            </button>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition font-medium cursor-pointer"
            >
              Generate Job Card
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobCardForm;
