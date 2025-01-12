import { Camera } from "lucide-react";

function Loader() {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-2">
      <Camera className="animate-pulse" size={25} />
      Loading products...
    </div>
  );
}
export default Loader;
