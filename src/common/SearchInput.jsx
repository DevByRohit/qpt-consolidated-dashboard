import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="flex items-center border-2 border-gray-400 rounded-sm px-4 py-2 w-full max-w-md">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none flex-1 text-gray-800 placeholder-gray-500 font-medium"
      />
      <Search className="w-5 h-5 text-gray-700 ml-2 shrink-0" />
    </div>
  );
};

export default SearchInput;
