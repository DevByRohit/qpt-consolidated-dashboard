import { ExternalLink, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FormCard = ({ form }) => {
  const navigate = useNavigate();

  // Open web form
  const formOpen = () => {
    navigate(form.url);
  };

  // open edit window for ims entries
  const editOpen = () => {
    navigate(form.edit);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col p-2">
      {/* Image */}
      <div className="overflow-hidden rounded-md">
        <img
          src={form.image}
          alt={form.title}
          className="w-full h-40 object-fill cursor-pointer"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 mt-3 gap-3">
        <h3 className="uppercase font-medium text-lg text-gray-900 line-clamp-2">
          {form.title}
        </h3>

        <div className="flex items-center justify-between">
          {/* Open form button */}
          <button
            onClick={formOpen}
            className="mt-auto w-fit flex items-center justify-center gap-1 font-medium border border-gray-400 py-1 px-3 rounded hover:bg-gray-900 hover:text-white transition cursor-pointer"
          >
            <ExternalLink size={18} />
            Open
          </button>

          {/* Open edit window */}
          <button
            onClick={editOpen}
            className="mt-auto w-fit flex items-center justify-center gap-1 font-medium border border-gray-400 py-1 px-2 rounded hover:bg-green-700 hover:text-white transition cursor-pointer"
          >
            <Edit size={18} />
            Edit entry
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormCard;
