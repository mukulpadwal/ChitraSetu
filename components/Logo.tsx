import { LucideCamera } from "lucide-react";
import Link from "next/link";

function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href={"/"}
      className={`${className} flex flex-col sm:flex-row justify-center items-center gap-0 sm:gap-2`}
    >
      <LucideCamera size={30} />{" "}
      <span className="text-lg font-bold">SnapTrade</span>
    </Link>
  );
}
export default Logo;
