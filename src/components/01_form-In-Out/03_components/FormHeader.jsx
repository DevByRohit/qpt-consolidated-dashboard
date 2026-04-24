import { useEffect, useState } from "react";

const FormHeader = ({ register, user }) => {
  const [value, setValue] = useState("");
  useEffect(() => {
    setValue("submittedBy", user?.email || "");
  }, [user]);

  return (
    <div className="flex justify-between">
      <h1 className="text-2xl font-bold uppercase">Material In / Out System</h1>

      {/* Operation Type */}
      <div className="border-2 border-gray-400 py-1 pl-2 rounded flex items-center gap-2">
        <label className="block  text-xl font-medium">Transaction Type :</label>
        <select
          {...register("formType")}
          className="text-lg font-medium w-52 outline-none cursor-pointer"
        >
          <option className="text-lg font-medium" value="In">
            Material In
          </option>
          <option className="text-lg font-medium" value="Out">
            Material Out
          </option>
        </select>
      </div>

      {/* Submitted By */}
      {/* <div> */}
      {/* <label className="block mb-1 font-medium">Submitted By</label> */}
      <input
        type="hidden"
        {...register("submittedBy")}
        readOnly
        className="w-full border rounded px-3 py-2 bg-gray-100"
      />
      {/* </div> */}
    </div>
  );
};

export default FormHeader;
