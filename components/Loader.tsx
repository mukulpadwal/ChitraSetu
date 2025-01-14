import { Camera } from "lucide-react";

function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-4 bg-gray-100">
      <Camera className="animate-pulse" size={40} />
      <span className="text-lg font-semibold text-gray-700">
        Please wait...
      </span>
    </div>
  );
}

export default Loader;
