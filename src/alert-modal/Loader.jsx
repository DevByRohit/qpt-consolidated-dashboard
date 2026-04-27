const Loader = ({ message = "Processing...", subMessage }) => {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
      <div className="bg-white px-5 py-4 rounded-lg shadow-lg flex flex-col items-center gap-2 min-w-55">
        {/* Spinner */}
        <div className="w-7 h-7 border-2 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>

        {/* Main message */}
        <p className="text-lg font-medium text-gray-700">{message}</p>

        {/* Optional sub message */}
        {subMessage && (
          <p className="text-sm text-gray-600 text-center">{subMessage}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;
