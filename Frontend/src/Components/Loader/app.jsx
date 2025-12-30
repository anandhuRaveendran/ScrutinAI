import { Atom } from "react-loading-indicators";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <Atom
                color="#04d9ff"
                size="medium"
                text="Loading ..."
                textColor="#94a3b8"
            />
        </div>
    );
};

export default Loader;
