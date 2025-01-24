import { Button } from "@/components/ui/button";
import { Aperture, Camera, CircleArrowOutUpRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="flex justify-center items-center">
        <Aperture size={300} />
      </div>

      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-5xl font-bold text-center">ChitraSetu</h1>
        <h2 className="text-3xl font-medium text-center">
          Bridge the Gap Between Vision and Trade.
        </h2>

        <p className="text-lg text-center text-muted-foreground max-w-xl">
          Discover, showcase, and trade through stunning images. ChitraSetu
          connects buyers and sellers in an effortless, image-driven
          marketplace.
        </p>

        <div className="flex gap-4">
          <Link href={"/login"}>
            <Button
              variant="default"
              className="flex flex-row justify-center items-center"
              size="default"
            >
              <Camera />
              <span>Get Started</span>
            </Button>
          </Link>
          <Link href={"/about"}>
            <Button
              variant="outline"
              className="flex flex-row justify-center items-center"
              size="default"
            >
              <CircleArrowOutUpRight />
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
