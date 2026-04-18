import { Edit, Trash2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DEFAULT_IMAGE =
  "https://static1.anpoimages.com/wordpress/wp-content/uploads/2023/10/how-to-create-a-gantt-chart-in-google-sheets-logo.jpg";

const CardItem = ({
  card,
  user,
  onEdit,
  onDelete,
  fallbackImage = DEFAULT_IMAGE,
}) => {
  const navigate = useNavigate();

  const handleOpen = () => {
    if (!card.url) return;

    if (card.url.startsWith("/")) {
      navigate(card.url);
    } else {
      window.open(card.url, "_blank");
    }
  };

  const isPrivileged = user?.role === "Developer" || user?.role === "Admin";

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-md overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 ease-out hover:-translate-y-1 cursor-pointer flex flex-col p-2">
      {/* Image */}
      <div className="overflow-hidden rounded-md">
        <img
          src={card.image || fallbackImage}
          alt={card.title}
          className="w-full h-40 object-fill transition-transform duration-900 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex gap-4 flex-col flex-1 mt-3">
        <h3 className="cursor-auto uppercase font-medium text-lg text-gray-900 leading-snug line-clamp-2">
          {card.title}
        </h3>

        {/* Actions */}
        <div className="mt-auto">
          {isPrivileged ? (
            // ✅ Admin / Developer View
            <div className="flex justify-between items-center">
              {/* Open */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                className="flex items-center gap-2 text-sm font-medium border border-gray-400 px-2.5 py-1 rounded hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"
              >
                <ExternalLink size={16} />
                Open
              </button>

              {/* Edit + Delete */}
              <div className="flex gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit && onEdit(card);
                  }}
                  className="flex items-center border border-gray-400 px-3 py-1.5 rounded hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-300 cursor-pointer"
                >
                  <Edit size={16} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete && onDelete(card);
                  }}
                  className="flex items-center border border-gray-400 px-3 py-1.5 rounded hover:bg-red-600 hover:text-white hover:border-red-600 transition-all duration-300 cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ) : (
            // ✅ Normal User View (Full Width Button)
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="w-full flex items-center justify-center gap-2 text-lg font-medium border border-gray-400 py-0.5 rounded hover:bg-gray-900 hover:text-white transition-all duration-300 cursor-pointer"
            >
              <ExternalLink size={18} />
              Open
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardItem;
