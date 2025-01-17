import { Aperture } from "lucide-react";

function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-4 bg-gradient-to-r from-gray-100 to-white">
      <Aperture className="animate-pulse text-gray-800" size={40} />
      <span className="text-lg font-semibold text-gray-800">
        Please wait...
      </span>
    </div>
  );
}

export default Loader;
