import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
      {/* Image Section */}
      <div className="flex justify-center items-center">
        <Camera size={300} />
      </div>

      {/* Text Section */}
      <div className="flex flex-col justify-center items-center gap-4">
        {/* Hero Section Heading */}
        <h1 className="text-5xl font-bold text-center">SnapTrade</h1>
        <h2 className="text-3xl font-medium text-center">
          Where Every Click Counts.
        </h2>

        {/* Description */}
        <p className="text-lg text-center text-muted-foreground max-w-xl">
          Welcome to SnapTrade – the ultimate marketplace for photographers,
          creators, and visual enthusiasts. Buy stunning images or sell your
          creativity with ease and confidence.
        </p>

        {/* Call-to-Actions */}
        <div className="flex gap-4">
          <Link href={"/login"}>
            <Button variant="default" className="px-6 py-3">
              Get Started
            </Button>
          </Link>
          <Link href={"/about"}>
            <Button variant="outline" className="px-6 py-3">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
