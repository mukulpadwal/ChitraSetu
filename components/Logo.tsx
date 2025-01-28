"use client";

import { Aperture } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

function Logo({ className = "", size }: { className?: string; size?: number }) {
  const { data: session } = useSession();

  return (
    <Link
      href={`${session ? "/products" : "/"}`}
      className={`${className} flex flex-col sm:flex-row justify-center items-center gap-0 sm:gap-2`}
    >
      <Aperture size={size || 30} />
      <span className="text-lg font-bold">ChitraSetu</span>
    </Link>
  );
}
export default Logo;
