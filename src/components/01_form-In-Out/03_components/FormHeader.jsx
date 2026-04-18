const FormHeader = ({ register, user }) => {
  return (
    <div className="grid grid-cols-2 gap-6 mb-6">
      {/* Operation Type */}
      <div>
        <label className="block mb-1 font-medium">Operation Type</label>
        <select
          {...register("formType")}
          className="w-full border rounded px-3 py-2"
        >
          <option value="In">Material In</option>
          <option value="Out">Material Out</option>
        </select>
      </div>

      {/* Submitted By */}
      <div>
        <label className="block mb-1 font-medium">Submitted By</label>
        <input
          type="text"
          value={user?.email || ""}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-100"
        />
      </div>
    </div>
  );
};

export default FormHeader;
