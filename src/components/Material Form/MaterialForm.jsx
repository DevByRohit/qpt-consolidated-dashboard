import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

const MaterialForm = ({ setUser }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [formType, setFormType] = useState("Material Out");
  const [materials, setMaterials] = useState([
    { id: 1, sku: "", name: "", unit: "", date: "", quantity: "" },
  ]);

  const navigate = useNavigate();

  const handleAddRow = () => {
    setMaterials([
      ...materials,
      { id: Date.now(), sku: "", name: "", unit: "", date: "", quantity: "" },
    ]);
  };

  const handleRemoveRow = (id) => {
    setMaterials(materials.filter((item) => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setMaterials(
      materials.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  return (
    <div className="w-full h-screen border flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold  text-center shrink-0">
          Material In / Out System
        </h1>
      </div>

      <hr className="border border-gray-400" />

      {/* Form Details Section */}
      <div className="my-5 shrink-0">
        <h2 className="font-medium text-xl mb-4">Form Details</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Form Type</label>
            <select
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
              className="border border-[#334155] rounded-md px-3 py-2 outline-none focus:border-blue-500 appearance-none"
            >
              <option value="In">Material In</option>
              <option value="Out">Material Out</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Submitted By</label>
            <input
              type="text"
              value={user?.email || ""}
              readOnly
              className="border border-[#334155] rounded-md px-3 py-2 outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Material Details Section - Scrollable Wrapper */}
      <div className="flex flex-col flex-1 min-h-0">
        <h2 className="text-lg font-medium mb-4 shrink-0">Material Details</h2>

        <div className="flex flex-col flex-1 border border-[#1E293B] rounded-lg overflow-hidden">
          {/* Table Header */}

          {/* Table Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 styled-scrollbar">
            {materials.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-[40px_0.6fr_1fr_80px_160px_120px_50px] gap-4 items-center"
              >
                <div className="text-xl text-center font-medium rounded">
                  {index + 1}
                </div>
                <input
                  type="text"
                  value={item.sku}
                  onChange={(e) => handleChange(item.id, "sku", e.target.value)}
                  placeholder="Item SKU"
                  className="border-2 border-gray-400 rounded px-3 py-1.5 outline-none focus:border-blue-500 w-full"
                />
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) =>
                    handleChange(item.id, "name", e.target.value)
                  }
                  placeholder="Item Name"
                  className="border-2 border-gray-400 rounded px-3 py-1.5 outline-none focus:border-blue-500 w-full"
                />
                <input
                  type="text"
                  value={item.unit}
                  onChange={(e) =>
                    handleChange(item.id, "unit", e.target.value)
                  }
                  placeholder="Unit"
                  className="border-2 border-gray-400 rounded px-3 py-1.5 outline-none focus:border-blue-500 w-full"
                />
                <input
                  type="date"
                  value={item.date}
                  onChange={(e) =>
                    handleChange(item.id, "date", e.target.value)
                  }
                  className="border-2 border-gray-400 rounded px-3 py-1.5 outline-none focus:border-blue-500 w-full"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleChange(item.id, "quantity", e.target.value)
                  }
                  placeholder="Qty"
                  className="border-2 border-gray-400 rounded px-3 py-1.5 outline-none focus:border-blue-500 w-full"
                />
                <div className="flex justify-center">
                  <button
                    onClick={() => handleRemoveRow(item.id)}
                    className="hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove Row"
                  >
                    <Trash2 size={30} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex justify-end gap-4 shrink-0">
        <button
          onClick={handleAddRow}
          className="px-6 py-2 border border-[#334155] text-white rounded-md hover:bg-[#1E293B] transition-colors font-medium text-sm cursor-pointer"
        >
          Add
        </button>
        <button className="px-6 py-2 border border-[#334155] text-white rounded-md hover:bg-[#1E293B] transition-colors font-medium text-sm cursor-pointer">
          Submit
        </button>
      </div>
    </div>
  );
};

export default MaterialForm;
