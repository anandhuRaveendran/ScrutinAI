import { FaSearch } from "react-icons/fa";

const SearchComponent = () => {
    return (
        <div className="flex items-center gap-4">
            <FaSearch className="text-white text-xl" />
            <input
                className="bg-white/5 placeholder:text-slate-300 rounded-lg px-4 py-2 w-[420px] outline-none"
                placeholder="Search audits, contracts..."
            />
        </div>
    );
}
export default SearchComponent;